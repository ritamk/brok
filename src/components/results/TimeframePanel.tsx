import type { TimeframeResult } from '../../types/backend';
import type { YahooNewsItem } from '../../types/yahoo';
import { TradeDecisionHero } from './TradeDecisionHero';
import { IndicatorGauges } from './IndicatorGauges';
import { NewsList } from './NewsList';

interface TimeframePanelProps {
  result: TimeframeResult;
  symbolNews: YahooNewsItem[];
  indiaNews: YahooNewsItem[];
  globalNews: YahooNewsItem[];
  currentPrice?: number;
}

export function TimeframePanel({ result, symbolNews, indiaNews, globalNews, currentPrice }: TimeframePanelProps) {
  const { technical, trade, news, meta } = result;

  return (
    <div className="space-y-6">
      {/* Hero Section - Trade Decision Card */}
      <TradeDecisionHero
        trade={trade}
        news={news}
        technicalSignal={technical.signal}
      />

      {/* Technical Analysis Card */}
      <div className="bg-card rounded-[16px] p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Technical Analysis</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Signal:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                technical.signal.toLowerCase() === 'buy' ? 'bg-green text-white' :
                technical.signal.toLowerCase() === 'sell' ? 'bg-red text-white' :
                'bg-yellow text-white'
              }`}>
                {technical.signal.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Confidence:</span>
              <span className="text-sm font-semibold text-text-primary">
                {Math.round(technical.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Rules Triggered */}
        {technical.rules_triggered && technical.rules_triggered.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-text-muted mb-2 font-medium">Rules Triggered</div>
            <div className="flex flex-wrap gap-2">
              {technical.rules_triggered.map((rule, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue/10 rounded-full text-xs text-blue font-medium"
                >
                  {rule}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Risk Management */}
        {technical.risk && (
          <div className="mb-6 bg-card-hover/50 rounded-lg p-4">
            <div className="text-sm text-text-muted mb-3 font-medium">Risk Management</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {technical.risk.stop_loss !== undefined && (
                <div>
                  <div className="text-xs text-text-disabled mb-1">Stop Loss</div>
                  <div className="text-lg font-bold text-red">{technical.risk.stop_loss.toFixed(2)}</div>
                </div>
              )}
              {technical.risk.take_profit !== undefined && (
                <div>
                  <div className="text-xs text-text-disabled mb-1">Take Profit</div>
                  <div className="text-lg font-bold text-green">{technical.risk.take_profit.toFixed(2)}</div>
                </div>
              )}
              {technical.risk.risk_reward_ratio !== undefined && (
                <div>
                  <div className="text-xs text-text-disabled mb-1">Risk/Reward</div>
                  <div className="text-lg font-bold text-blue">1:{technical.risk.risk_reward_ratio.toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Indicators Gauges */}
        <div>
          <div className="text-sm text-text-muted mb-4 font-medium">Technical Indicators</div>
          <IndicatorGauges indicators={technical.indicators} currentPrice={currentPrice} />
        </div>
      </div>

      {/* News & Sentiment Card */}
      <div className="bg-card rounded-[16px] p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
        <h3 className="text-lg font-semibold text-text-primary mb-4">News & Sentiment</h3>
        <NewsList
          symbolNews={symbolNews}
          indiaNews={indiaNews}
          globalNews={globalNews}
          backendSummary={news.summary}
          keyDrivers={news.drivers}
          sentiment={news.sentiment}
          sentimentConfidence={news.confidence}
        />
      </div>

      {/* Meta Information Card (Collapsible) */}
      {meta && (
        <details className="bg-card rounded-[16px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
          <summary className="px-6 py-4 cursor-pointer text-sm text-text-muted hover:text-text-secondary hover:bg-card-hover transition-colors">
            Meta Information & Usage Stats
          </summary>
          <div className="px-6 pb-4 space-y-3 bg-card-hover/30">
            {/* Summary Stats */}
            {meta.summary && (
              <div>
                <div className="text-xs font-semibold text-text-secondary my-2">Summary</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {Object.entries(meta.summary).map(([key, value]) => (
                    <div key={key} className="bg-card rounded p-2 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
                      <div className="text-text-disabled capitalize">{key.replace(/_/g, ' ')}</div>
                      <div className="text-text-primary font-mono mt-1">
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Token Usage */}
            {meta.usage && (
              <div>
                <div className="text-xs font-semibold text-text-secondary mb-2">Token Usage</div>
                <div className="space-y-2">
                  {Object.entries(meta.usage).map(([agent, usage]: [string, { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }]) => (
                    <div key={agent} className="flex items-center justify-between text-xs bg-card rounded p-2 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
                      <span className="text-text-secondary capitalize">{agent}</span>
                      <span className="text-text-primary font-mono">
                        {usage.total_tokens?.toLocaleString() || 'N/A'} tokens
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Meta */}
            <div className="text-xs text-text-disabled space-y-1 pt-2">
              {meta.model && <div>Model: {meta.model}</div>}
              {meta.processing_time_ms && <div>Processing Time: {meta.processing_time_ms}ms</div>}
              {meta.timestamp && <div>Timestamp: {new Date(meta.timestamp).toLocaleString()}</div>}
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
