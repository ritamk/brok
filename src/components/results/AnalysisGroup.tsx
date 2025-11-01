import { useState } from 'react';
import type { SymbolRun } from '../../types/backend';
import type { YahooQuoteSummary, YahooNewsItem } from '../../types/yahoo';
import { TimeframePanel } from './TimeframePanel';

interface AnalysisGroupProps {
  run: SymbolRun;
  quoteSummary?: YahooQuoteSummary;
  yahooNews?: YahooNewsItem[];
  isFirstTicker?: boolean;
  totalTickers?: number;
}

export function AnalysisGroup({ run, quoteSummary, yahooNews = [], isFirstTicker = false, totalTickers = 1 }: AnalysisGroupProps) {
  const [isExpanded, setIsExpanded] = useState(isFirstTicker);
  const [selectedTimeframeIndex, setSelectedTimeframeIndex] = useState(0);

  if (run.error) {
    return (
      <div className="bg-red/20 border border-red rounded-[16px] p-5">
        <h3 className="text-lg font-semibold text-red-light mb-2">{run.symbol}</h3>
        <p className="text-red-light">Error: {run.error}</p>
      </div>
    );
  }

  const isFiniteNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value);

  const formatPrice = (price?: number | null) => {
    if (!isFiniteNumber(price)) return 'N/A';
    return price.toFixed(2);
  };

  const formatChange = (change?: number | null, changePercent?: number | null) => {
    if (!isFiniteNumber(change) || !isFiniteNumber(changePercent)) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green' : 'text-red';
    return (
      <span className={color}>
        {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  // Get the decision for the currently selected timeframe
  const currentResult = run.results[selectedTimeframeIndex];
  const currentDecision = currentResult?.trade?.decision || 'N/A';

  const getDecisionColor = (decision: string) => {
    const normalized = decision.toUpperCase();
    if (normalized.includes('BUY')) return 'bg-green text-white';
    if (normalized.includes('SELL')) return 'bg-red text-white';
    if (normalized.includes('HOLD')) return 'bg-yellow text-white';
    return 'bg-card-hover text-text-primary';
  };

  // Only show collapsible UI if there are multiple tickers
  const showCollapsible = totalTickers > 1;

  return (
    <div className="bg-card border-2 border-border rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header - Always visible, clickable when collapsible */}
      <div
        className={`px-6 py-5 border-b border-border ${showCollapsible ? 'cursor-pointer hover:bg-card-hover' : ''} transition-colors`}
        onClick={() => showCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Expand/Collapse Icon */}
            {showCollapsible && (
              <div className="text-text-muted">
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}

            {/* Symbol and Company Name */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary">{run.symbol}</h2>
              {quoteSummary && (
                <p className="text-text-muted text-sm mt-1">
                  {quoteSummary.longName || quoteSummary.shortName || 'Company Name'}
                </p>
              )}
            </div>

            {/* Decision Badge (when collapsed) */}
            {showCollapsible && !isExpanded && (
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${getDecisionColor(currentDecision)}`}>
                {currentDecision}
              </div>
            )}
          </div>

          {/* Price Info */}
          {quoteSummary && (
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-text-primary">
                {quoteSummary.currency} {formatPrice(quoteSummary.regularMarketPrice)}
              </div>
              <div className="text-sm mt-1">
                {formatChange(quoteSummary.regularMarketChange, quoteSummary.regularMarketChangePercent)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="animate-fadeIn">
          {/* Timeframe Selector (if multiple timeframes) */}
          {run.results.length > 1 && (
            <div className="px-6 py-4 bg-card-hover/30 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted font-medium">Timeframe:</span>
                <div className="flex gap-2">
                  {run.results.map((result, index) => (
                    <button
                      key={result.timeframe}
                      onClick={() => setSelectedTimeframeIndex(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedTimeframeIndex === index
                          ? 'bg-blue text-white shadow-md'
                          : 'bg-card border border-border text-text-secondary hover:bg-card-hover hover:border-blue/50'
                      }`}
                    >
                      {result.timeframe}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Timeframe Panel */}
          <div className="p-6">
            {run.results[selectedTimeframeIndex] && (
              <TimeframePanel
                result={run.results[selectedTimeframeIndex]}
                yahooNews={yahooNews}
                currentPrice={quoteSummary?.regularMarketPrice}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
