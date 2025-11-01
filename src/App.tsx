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
  const [selectedTimeframes, setSelectedTimeframes] = useState<Timeframe[]>(['15m', '1D']);
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
    mutationFn: postTickersData,
    onSuccess: async (data) => {
      setAnalysisData(data);
      setError(null);

      // Enrich with backend combined quote + news for each symbol
      const enrichment: typeof enrichmentData = {};
      
      await Promise.all(
        data.runs.map(async (run) => {
          try {
            const newsAndQuote = await getTickerNews(run.symbol, 5);

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

            enrichment[run.symbol] = {
              summary,
              news: yahooNewsItems,
            };
          } catch (err) {
            console.error(`Failed to enrich data for ${run.symbol}:`, err);
            enrichment[run.symbol] = {};
          }
        })
      );

      setEnrichmentData(enrichment);
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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Loading overlay */}
      {analyzeMutation.isPending && <LoadingView />}

      {/* Header */}
      <header className="bg-linear-to-r from-blue-900 to-purple-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Brok</h1>
          <p className="text-gray-300 mt-1">AI-Powered Stock Analysis Dashboard</p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and selection section */}
        {!analysisData && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Stocks to Analyze</h2>
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
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <h3 className="font-semibold text-red-300 mb-1">Analysis Failed</h3>
                  <p className="text-sm text-red-400">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-blue-400 font-semibold mb-1">📊 Technical Analysis</div>
                <p className="text-gray-400">Get signals, indicators, and risk management insights</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-1">🤖 AI Trade Decisions</div>
                <p className="text-gray-400">Receive AI-powered trade recommendations with rationale</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-green-400 font-semibold mb-1">📰 News & Sentiment</div>
                <p className="text-gray-400">Stay updated with latest headlines and market drivers</p>
              </div>
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
                <p className="text-gray-400 text-sm mt-1">
                  Generated at {new Date(analysisData.requested_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setAnalysisData(null);
                  setEnrichmentData({});
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
              >
                ← New Analysis
              </button>
            </div>

            {/* Analysis groups */}
            <div className="space-y-6">
              {analysisData.runs.map((run) => (
                <AnalysisGroup
                  key={run.symbol}
                  run={run}
                  quoteSummary={enrichmentData[run.symbol]?.summary}
                  yahooNews={enrichmentData[run.symbol]?.news}
                />
              ))}
            </div>

            {/* Summary meta */}
            {analysisData.meta && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-500">
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
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Powered by Yahoo Finance API and FastAPI Backend</p>
          <p className="mt-1">Built with Vite + React + TypeScript + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
