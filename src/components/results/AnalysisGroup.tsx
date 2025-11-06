import { useState } from 'react';
import type { SymbolRun } from '../../types/backend';
import type { YahooQuoteSummary, YahooNewsItem } from '../../types/yahoo';
import { TimeframePanel } from './TimeframePanel';

interface AnalysisGroupProps {
  run: SymbolRun;
  quoteSummary?: YahooQuoteSummary;
  symbolNews?: YahooNewsItem[];
  indiaNews?: YahooNewsItem[];
  globalNews?: YahooNewsItem[];
  isFirstTicker?: boolean;
  totalTickers?: number;
}

export function AnalysisGroup({ run, symbolNews = [], indiaNews = [], globalNews = [], isFirstTicker = false, totalTickers = 1 }: AnalysisGroupProps) {
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

  const formatChange = (change?: string | null) => {
    if (!change || typeof change !== 'string') return 'N/A';
    
    // Parse the change string (e.g., "2.46%" or "-1.13%")
    const numericValue = parseFloat(change.replace('%', ''));
    if (isNaN(numericValue)) return 'N/A';
    
    const isPositive = numericValue >= 0;
    const sign = isPositive ? '+' : '';
    const color = isPositive ? 'text-green' : 'text-red';
    
    return (
      <span className={color}>
        {sign}{change}
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
    <div className="space-y-6">
      {/* Stock Header Card */}
      <div
        className={`bg-card rounded-[16px] px-6 py-5 shadow-[0_0_20px_0_rgba(0,0,0,0.07)] ${showCollapsible ? 'cursor-pointer hover:shadow-[0_0_25px_0_rgba(0,0,0,0.12)]' : ''} transition-shadow`}
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

            {/* Company Name Link */}
            <div className="w-1/2">
              {run.long_name ? (
                <a 
                  href={`https://finance.yahoo.com/quote/${encodeURIComponent(run.symbol)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue hover:underline"
                >
                  {run.long_name}
                </a>
              ) : (
                <a 
                  href={`https://finance.yahoo.com/quote/${encodeURIComponent(run.symbol)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue hover:underline"
                >
                  {run.symbol}
                </a>
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
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-text-primary">
              {run.currency === 'INR'
                ? `₹ ${formatPrice(run.price)}`
                : run.currency === 'USD' ? `$ ${formatPrice(run.price)}` : `${run.currency || ''} ${formatPrice(run.price)}`
              }
            </div>
            <div className="text-sm mt-1">
              {formatChange(run.change)}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="animate-fadeIn space-y-6">
          {/* Timeframe Selector Card (if multiple timeframes) */}
          {run.results.length > 1 && (
            <div className="bg-card rounded-[16px] px-6 py-4 shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted font-medium">Timeframe:</span>
                <div className="flex gap-2">
                  {run.results.map((result, index) => (
                    <button
                      key={result.timeframe}
                      onClick={() => setSelectedTimeframeIndex(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedTimeframeIndex === index
                          ? 'bg-blue text-white shadow-[0_0_15px_0_rgba(0,0,0,0.15)]'
                          : 'bg-card-hover text-text-secondary hover:bg-card-hover/70 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]'
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
          {run.results[selectedTimeframeIndex] && (
            <TimeframePanel
              currency={run.currency}
              result={run.results[selectedTimeframeIndex]}
              symbolNews={symbolNews}
              indiaNews={indiaNews}
              globalNews={globalNews}
              currentPrice={run.price}
            />
          )}
        </div>
      )}
    </div>
  );
}
