import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { TickersDataResponse } from '../types/backend';
import type { YahooQuoteSummary, YahooNewsItem } from '../types/yahoo';
import { AnalysisGroup } from '../components/results/AnalysisGroup';

interface LocationState {
  analysisData: TickersDataResponse;
  enrichmentData: {
    [symbol: string]: {
      summary?: YahooQuoteSummary;
      symbolNews?: YahooNewsItem[];
      indiaNews?: YahooNewsItem[];
      globalNews?: YahooNewsItem[];
    };
  };
}

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  // Redirect to home if no data
  useEffect(() => {
    if (!state?.analysisData) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.analysisData) {
    return null;
  }

  const { analysisData, enrichmentData } = state;

  return (
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
          onClick={() => navigate('/')}
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
            symbolNews={enrichmentData[run.symbol]?.symbolNews}
            indiaNews={enrichmentData[run.symbol]?.indiaNews}
            globalNews={enrichmentData[run.symbol]?.globalNews}
            isFirstTicker={index === 0}
            totalTickers={analysisData.runs.length}
          />
        ))}
      </div>

      {/* Summary meta */}
      {analysisData.meta && (
        <div className="bg-card rounded-lg p-4 text-sm text-text-disabled shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
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
  );
}

