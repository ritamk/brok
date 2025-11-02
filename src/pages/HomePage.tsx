import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { postTickersData, getTickerNews } from '../api/backend';
import type { YahooSearchResult, YahooQuoteSummary, YahooNewsItem } from '../types/yahoo';
import type { Timeframe } from '../types/backend';
import { TickerSearch } from '../components/TickerSearch';
import { TimeframePicker } from '../components/TimeframePicker';
import { AnalyzeButton } from '../components/AnalyzeButton';
import { LoadingView } from '../components/LoadingView';

export function HomePage() {
  const navigate = useNavigate();
  const [selectedTickers, setSelectedTickers] = useState<YahooSearchResult[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<Timeframe[]>(['1D']);
  const [error, setError] = useState<string | null>(null);

  // Mutation for analyzing tickers
  const analyzeMutation = useMutation({
    mutationFn: async (payload: Parameters<typeof postTickersData>[0]) => {
      // Start both calls simultaneously
      const [analysisData, ...newsResults] = await Promise.allSettled([
        postTickersData(payload),
        // Fetch news for all selected tickers in parallel
        ...payload.tickers.map((symbol) => getTickerNews(symbol, 5)),
      ]);

      // Handle analysis data result
      if (analysisData.status === 'rejected') {
        throw analysisData.reason;
      }

      const data = analysisData.value;

      // Process news results - map them back to their corresponding symbols
      const enrichment: {
        [symbol: string]: {
          summary?: YahooQuoteSummary;
          news?: YahooNewsItem[];
        };
      } = {};
      
      payload.tickers.forEach((symbol, index) => {
        const newsResult = newsResults[index];
        if (newsResult.status === 'fulfilled') {
          const newsAndQuote = newsResult.value;

          const summary: YahooQuoteSummary = {
            symbol: newsAndQuote.symbol,
            shortName: undefined,
            longName: undefined,
            regularMarketPrice: newsAndQuote.price,
            regularMarketChange: newsAndQuote.change,
            regularMarketChangePercent: newsAndQuote.change_percent,
            currency: newsAndQuote.currency,
          };

          const yahooNewsItems: YahooNewsItem[] = newsAndQuote.items.map((item, idx) => ({
            uuid: `${newsAndQuote.symbol}-${idx}-${item.url}`,
            title: item.headline,
            publisher: 'News',
            link: item.url,
            providerPublishTime: Math.floor(Date.now() / 1000),
            type: 'story',
          }));

          enrichment[symbol] = {
            summary,
            news: yahooNewsItems,
          };
        } else {
          console.error(`Failed to enrich data for ${symbol}:`, newsResult.reason);
          enrichment[symbol] = {};
        }
      });

      return { data, enrichment };
    },
    onSuccess: ({ data, enrichment }) => {
      // Navigate to results page with the data
      navigate('/results', { 
        state: { 
          analysisData: data, 
          enrichmentData: enrichment 
        } 
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      console.error('Analysis failed:', err);
    },
  });

  const handleAddTicker = (ticker: YahooSearchResult) => {
    if (!selectedTickers.some((t) => t.symbol === ticker.symbol)) {
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

  const handleRemoveTicker = (symbol: string) => {
    setSelectedTickers(selectedTickers.filter((t) => t.symbol !== symbol));
  };

  const handleToggleTimeframe = (timeframe: Timeframe) => {
    if (selectedTimeframes.includes(timeframe)) {
      // Don't allow removing the last timeframe
      if (selectedTimeframes.length > 1) {
        setSelectedTimeframes(selectedTimeframes.filter((t) => t !== timeframe));
      }
    } else {
      setSelectedTimeframes([...selectedTimeframes, timeframe]);
    }
  };

  const handleAnalyze = () => {
    if (selectedTickers.length === 0) return;
    
    const payload = {
      tickers: selectedTickers.map((t) => t.symbol),
      timeframes: selectedTimeframes,
    };

    analyzeMutation.mutate(payload);
  };

  const canAnalyze = selectedTickers.length > 0 && selectedTimeframes.length > 0;

  return (
    <>
      {/* Loading overlay */}
      {analyzeMutation.isPending && <LoadingView />}

      {/* Search and selection section */}
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-card rounded-[16px] py-6 px-10 space-y-6 shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Stocks to Analyze</h2>
            <TickerSearch
              selectedTickers={selectedTickers}
              onAddTicker={handleAddTicker}
              onRemoveTicker={handleRemoveTicker}
            />
          </div>

          <TimeframePicker
            selectedTimeframes={selectedTimeframes}
            onToggleTimeframe={handleToggleTimeframe}
          />

          <AnalyzeButton
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            isLoading={analyzeMutation.isPending}
          />

          {error && (
            <div className="bg-red/20 border border-red rounded-lg p-4">
              <h3 className="font-semibold text-red-light mb-1">Analysis Failed</h3>
              <p className="text-sm text-red-light">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-light hover:text-red-light/80 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

