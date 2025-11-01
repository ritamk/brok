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
        return 'bg-green-600 text-white';
      case 'sell':
        return 'bg-red-600 text-white';
      case 'hold':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'bg-green-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Technical Analysis Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Technical Analysis</h3>
        
        <div className="space-y-4">
          {/* Signal and Confidence */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Signal</div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSignalColor(technical.signal)}`}>
                {technical.signal.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Confidence: {(technical.confidence * 100).toFixed(0)}%</div>
              <div className="w-full bg-gray-800 rounded-full h-2">
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
              <div className="text-xs text-gray-500 mb-2">Rules Triggered</div>
              <div className="flex flex-wrap gap-2">
                {technical.rules_triggered.map((rule, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-900/30 border border-blue-800 rounded text-xs text-blue-300"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risk Management */}
          {technical.risk && (
            <div className="bg-gray-800/50 rounded p-3">
              <div className="text-xs text-gray-500 mb-2">Risk Management</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {technical.risk.stop_loss !== undefined && (
                  <div>
                    <div className="text-gray-400">Stop Loss</div>
                    <div className="font-semibold text-red-400">{technical.risk.stop_loss.toFixed(2)}</div>
                  </div>
                )}
                {technical.risk.take_profit !== undefined && (
                  <div>
                    <div className="text-gray-400">Take Profit</div>
                    <div className="font-semibold text-green-400">{technical.risk.take_profit.toFixed(2)}</div>
                  </div>
                )}
                {technical.risk.risk_reward_ratio !== undefined && (
                  <div>
                    <div className="text-gray-400">Risk/Reward</div>
                    <div className="font-semibold text-blue-400">1:{technical.risk.risk_reward_ratio.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Indicators Table */}
          <div>
            <div className="text-xs text-gray-500 mb-2">Technical Indicators</div>
            <IndicatorTable indicators={technical.indicators} />
          </div>
        </div>
      </div>

      {/* Trade Decision Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Trade Decision</h3>
        
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Decision</div>
            <div className="font-semibold text-gray-100">{trade.decision}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Confidence: {(trade.confidence * 100).toFixed(0)}%</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getConfidenceColor(trade.confidence)}`}
                style={{ width: `${trade.confidence * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Rationale</div>
            <p className="text-sm text-gray-300 leading-relaxed">{typeof trade.rationale === 'string' ? trade.rationale : JSON.stringify(trade.rationale)}</p>
          </div>

          {trade.risk_notes && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Risk Notes</div>
              <p className="text-sm text-gray-300 leading-relaxed">{typeof trade.risk_notes === 'string' ? trade.risk_notes : JSON.stringify(trade.risk_notes)}</p>
            </div>
          )}

          {trade.alignment && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Alignment</div>
              <p className="text-sm text-gray-300 leading-relaxed">{typeof trade.alignment === 'string' ? trade.alignment : JSON.stringify(trade.alignment)}</p>
            </div>
          )}
        </div>
      </div>

      {/* News Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">News & Sentiment</h3>
        <NewsList 
          news={yahooNews} 
          backendSummary={news.summary}
          keyDrivers={news.key_drivers}
        />
      </div>

      {/* Meta Information (Collapsible) */}
      {meta && (
        <details className="bg-gray-900 border border-gray-800 rounded-lg">
          <summary className="px-5 py-3 cursor-pointer text-sm text-gray-400 hover:text-gray-300">
            Meta Information
          </summary>
          <div className="px-5 pb-4 text-xs text-gray-500 space-y-1">
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
