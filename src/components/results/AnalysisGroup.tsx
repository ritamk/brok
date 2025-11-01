import { useState } from 'react';
import type { SymbolRun } from '../../types/backend';
import type { YahooQuoteSummary, YahooNewsItem } from '../../types/yahoo';
import { TimeframePanel } from './TimeframePanel.tsx';

interface AnalysisGroupProps {
  run: SymbolRun;
  quoteSummary?: YahooQuoteSummary;
  yahooNews?: YahooNewsItem[];
}

export function AnalysisGroup({ run, quoteSummary, yahooNews = [] }: AnalysisGroupProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (run.error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-red-300 mb-2">{run.symbol}</h3>
        <p className="text-red-400">Error: {run.error}</p>
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
    const color = change >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span className={color}>
        {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Header with company info */}
      <div className="bg-linear-to-r from-gray-800 to-gray-900 px-6 py-5 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{run.symbol}</h2>
            {quoteSummary && (
              <p className="text-gray-400 mt-1">
                {quoteSummary.longName || quoteSummary.shortName || 'Company Name'}
              </p>
            )}
          </div>
          {quoteSummary && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-100">
                {quoteSummary.currency} {formatPrice(quoteSummary.regularMarketPrice)}
              </div>
              <div className="text-sm mt-1">
                {formatChange(quoteSummary.regularMarketChange, quoteSummary.regularMarketChangePercent)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeframe tabs */}
      <div className="flex border-b border-gray-800 bg-gray-900/50">
        {run.results.map((result, index) => (
          <button
            key={result.timeframe}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === index
                ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
            }`}
          >
            {result.timeframe}
          </button>
        ))}
      </div>

      {/* Active timeframe panel */}
      <div className="p-6">
        {run.results[activeTab] && (
          <TimeframePanel 
            result={run.results[activeTab]} 
            yahooNews={yahooNews}
          />
        )}
      </div>
    </div>
  );
}

