import type { TimeframeResult } from '../../types/backend';
import type { YahooNewsItem } from '../../types/yahoo';
import { IndicatorTable } from './IndicatorTable';
import { NewsList } from './NewsList';

interface TimeframePanelProps {
  result: TimeframeResult;
  yahooNews: YahooNewsItem[];
}

export function TimeframePanel({ result, yahooNews }: TimeframePanelProps) {
  const { technical, trade, news, meta } = result;

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'buy':
        return 'bg-green text-white';
      case 'sell':
        return 'bg-red text-white';
      case 'hold':
        return 'bg-yellow text-white';
      default:
        return 'bg-card-hover text-white';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'bg-green';
    if (confidence >= 0.4) return 'bg-yellow';
    return 'bg-red';
  };

  return (
    <div className="space-y-6">
      {/* Technical Analysis Section */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Technical Analysis</h3>
        
        <div className="space-y-4">
          {/* Signal and Confidence */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-text-disabled mb-1">Signal</div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSignalColor(technical.signal)}`}>
                {technical.signal.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-text-disabled mb-1">Confidence: {(technical.confidence * 100).toFixed(0)}%</div>
              <div className="w-full bg-card-hover rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getConfidenceColor(technical.confidence)}`}
                  style={{ width: `${technical.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Rules Triggered */}
          {technical.rules_triggered && technical.rules_triggered.length > 0 && (
            <div>
              <div className="text-xs text-text-disabled mb-2">Rules Triggered</div>
              <div className="flex flex-wrap gap-2">
                {technical.rules_triggered.map((rule, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue/30 border border-blue rounded text-xs text-blue-light"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risk Management */}
          {technical.risk && (
            <div className="bg-card-hover/50 rounded p-3">
              <div className="text-xs text-text-disabled mb-2">Risk Management</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {technical.risk.stop_loss !== undefined && (
                  <div>
                    <div className="text-text-muted">Stop Loss</div>
                    <div className="font-semibold text-red-light">{technical.risk.stop_loss.toFixed(2)}</div>
                  </div>
                )}
                {technical.risk.take_profit !== undefined && (
                  <div>
                    <div className="text-text-muted">Take Profit</div>
                    <div className="font-semibold text-green-light">{technical.risk.take_profit.toFixed(2)}</div>
                  </div>
                )}
                {technical.risk.risk_reward_ratio !== undefined && (
                  <div>
                    <div className="text-text-muted">Risk/Reward</div>
                    <div className="font-semibold text-blue-light">1:{technical.risk.risk_reward_ratio.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Indicators Table */}
          <div>
            <div className="text-xs text-text-disabled mb-2">Technical Indicators</div>
            <IndicatorTable indicators={technical.indicators} />
          </div>
        </div>
      </div>

      {/* Trade Decision Section */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Trade Decision</h3>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs text-text-disabled mb-1">Decision</div>
            <div className="font-semibold text-text-primary">{trade.decision}</div>
          </div>

          <div>
            <div className="text-xs text-text-disabled mb-1">Confidence: {(trade.confidence * 100).toFixed(0)}%</div>
            <div className="w-full bg-card-hover rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getConfidenceColor(trade.confidence)}`}
                style={{ width: `${trade.confidence * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="text-xs text-text-disabled mb-1">Rationale</div>
            <p className="text-sm text-text-secondary leading-relaxed">{typeof trade.rationale === 'string' ? trade.rationale : JSON.stringify(trade.rationale)}</p>
          </div>

          {trade.risk_notes && (
            <div>
              <div className="text-xs text-text-disabled mb-1">Risk Notes</div>
              <p className="text-sm text-text-secondary leading-relaxed">{typeof trade.risk_notes === 'string' ? trade.risk_notes : JSON.stringify(trade.risk_notes)}</p>
            </div>
          )}

          {trade.alignment && (
            <div>
              <div className="text-xs text-text-disabled mb-1">Alignment</div>
              <p className="text-sm text-text-secondary leading-relaxed">{typeof trade.alignment === 'string' ? trade.alignment : JSON.stringify(trade.alignment)}</p>
            </div>
          )}
        </div>
      </div>

      {/* News Section */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">News & Sentiment</h3>
        <NewsList 
          news={yahooNews} 
          backendSummary={news.summary}
          keyDrivers={news.key_drivers}
        />
      </div>

      {/* Meta Information (Collapsible) */}
      {meta && (
        <details className="bg-card border border-border rounded-lg">
          <summary className="px-5 py-3 cursor-pointer text-sm text-text-muted hover:text-text-secondary">
            Meta Information
          </summary>
          <div className="px-5 pb-4 text-xs text-text-disabled space-y-1">
            {meta.model && <div>Model: {meta.model}</div>}
            {meta.tokens_used && <div>Tokens Used: {meta.tokens_used.toLocaleString()}</div>}
            {meta.processing_time_ms && <div>Processing Time: {meta.processing_time_ms}ms</div>}
            {meta.timestamp && <div>Timestamp: {new Date(meta.timestamp).toLocaleString()}</div>}
          </div>
        </details>
      )}
    </div>
  );
}
