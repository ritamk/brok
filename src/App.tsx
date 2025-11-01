import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postTickersData, getTickerNews } from './api/backend';
import type { YahooSearchResult, YahooQuoteSummary, YahooNewsItem } from './types/yahoo';
import type { Timeframe, TickersDataResponse } from './types/backend';
import { TickerSearch } from './components/TickerSearch';
import { TimeframePicker } from './components/TimeframePicker';
import { AnalyzeButton } from './components/AnalyzeButton';
import { LoadingView } from './components/LoadingView';
import { AnalysisGroup } from './components/results/AnalysisGroup';

function App() {
  const [selectedTickers, setSelectedTickers] = useState<YahooSearchResult[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<Timeframe[]>(['1D']);
  const [analysisData, setAnalysisData] = useState<TickersDataResponse | null>(null);
  const [enrichmentData, setEnrichmentData] = useState<{
    [symbol: string]: {
      summary?: YahooQuoteSummary;
      news?: YahooNewsItem[];
    };
  }>({});
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
      const enrichment: typeof enrichmentData = {};
      
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
      setAnalysisData(data);
      setEnrichmentData(enrichment);
      setError(null);
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
    <div className="min-h-screen bg-main-dark text-text-primary flex flex-col">
      {/* Loading overlay */}
      {analyzeMutation.isPending && <LoadingView />}

      {/* Header */}
      <header>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold text-blue font-brand">
            brok
          </h1>
          {/* <p className="text-text-primary/90 mt-1"><span className="font-bold font-brand">brok</span> it till you make it</p> */}
          <p className="text-text-primary/90 mt-1">{'let\'s make money'}</p>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 container mx-auto px-4 py-8 ${!analysisData ? 'flex items-center justify-center' : ''}`}>
        {/* Search and selection section */}
        {!analysisData && (
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
        )}

        {/* Results section */}
        {analysisData && (
          <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <p className="text-text-muted text-sm mt-1">
                  Generated at {new Date(analysisData.requested_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setAnalysisData(null);
                  setEnrichmentData({});
                  setError(null);
                }}
                className="px-4 py-2 bg-card-hover hover:bg-card-hover/80 border border-border rounded-lg transition-colors"
              >
                ← New Analysis
              </button>
            </div>

            {/* Analysis groups */}
            <div className="space-y-6">
              {analysisData.runs.map((run, index) => (
                <AnalysisGroup
                  key={run.symbol}
                  run={run}
                  quoteSummary={enrichmentData[run.symbol]?.summary}
                  yahooNews={enrichmentData[run.symbol]?.news}
                  isFirstTicker={index === 0}
                  totalTickers={analysisData.runs.length}
                />
              ))}
            </div>

            {/* Summary meta */}
            {analysisData.meta && (
              <div className="bg-card border border-border rounded-lg p-4 text-sm text-text-disabled">
                <div className="flex gap-6">
                  <span>Symbols: {analysisData.meta.total_symbols}</span>
                  <span>Timeframes: {analysisData.meta.total_timeframes}</span>
                  {analysisData.meta.total_processing_time_ms && (
                    <span>Processing Time: {analysisData.meta.total_processing_time_ms}ms</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className=" mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-text-muted">
          <p>
            <span className="font-bold font-brand">
              brok
            </span>
            {' '} by Ritam
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
