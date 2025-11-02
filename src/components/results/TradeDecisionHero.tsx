import type { TradeDecision, NewsAnalysis } from '../../types/backend';

interface TradeDecisionHeroProps {
  trade: TradeDecision;
  news: NewsAnalysis;
  technicalSignal: string;
}

export function TradeDecisionHero({ trade, news, technicalSignal }: TradeDecisionHeroProps) {
  const getDecisionColor = (decision: string) => {
    const normalized = decision.toUpperCase();
    if (normalized.includes('BUY')) return 'bg-green text-white';
    if (normalized.includes('SELL')) return 'bg-red text-white';
    if (normalized.includes('HOLD')) return 'bg-yellow text-white';
    return 'bg-card-hover text-text-primary';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'bg-green';
    if (confidence >= 0.4) return 'bg-yellow';
    return 'bg-red';
  };

  const getSentimentColor = (sentiment: string) => {
    const normalized = sentiment.toLowerCase();
    if (normalized.includes('bullish')) return 'text-green';
    if (normalized.includes('bearish')) return 'text-red';
    return 'text-yellow';
  };

  const getSignalIcon = (signal: string) => {
    const normalized = signal.toLowerCase();
    if (normalized.includes('buy')) return '↑';
    if (normalized.includes('sell')) return '↓';
    return '→';
  };

  // Check for conflict between technical and news
  const hasConflict = trade.alignment && (
    (trade.alignment.technical.toLowerCase().includes('sell') && trade.alignment.news.toLowerCase().includes('bullish')) ||
    (trade.alignment.technical.toLowerCase().includes('buy') && trade.alignment.news.toLowerCase().includes('bearish'))
  );

  return (
    <div className="bg-card rounded-[16px] p-8 shadow-[0_0_20px_0_rgba(0,0,0,0.07)]">
      {/* Decision Badge and Confidence */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="text-sm text-text-muted mb-2 font-medium">Trade Decision</div>
          <div className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${getDecisionColor(trade.decision)}`}>
            {trade.decision}
          </div>
        </div>
        
        {/* Circular Confidence Meter */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-card-hover"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - trade.confidence)}`}
                className={getConfidenceColor(trade.confidence)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-text-primary">
                {Math.round(trade.confidence * 100)}%
              </span>
            </div>
          </div>
          <div className="text-xs text-text-muted mt-2">Confidence</div>
        </div>
      </div>

      {/* Rationale */}
      <div className="mb-6">
        <div className="text-sm text-text-muted mb-2 font-medium">Rationale</div>
        <p className="text-text-secondary leading-relaxed">{trade.rationale}</p>
      </div>

      {/* Risk Notes */}
      {trade.risk_notes && (
        <div className="mb-6 bg-yellow/10 rounded-lg p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-2">
            <span className="text-yellow text-lg">⚠️</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-yellow mb-1">Risk Notes</div>
              <p className="text-sm text-text-secondary leading-relaxed">{trade.risk_notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alignment Section */}
      {trade.alignment && (
        <div>
          <div className="text-sm text-text-muted mb-3 font-medium">Signal Alignment</div>
          
          {/* Conflict/Agreement Badge */}
          {hasConflict && (
            <div className="mb-4 bg-yellow/15 rounded-lg px-4 py-2 inline-flex items-center gap-2 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
              <span className="text-yellow text-lg">⚡</span>
              <span className="text-sm font-semibold text-yellow">Conflicting Signals Detected</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Signal */}
            <div className="bg-card-hover/50 rounded-lg p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getSignalIcon(technicalSignal)}</span>
                <div>
                  <div className="text-xs text-text-disabled">Technical Analysis</div>
                  <div className="font-semibold text-text-primary">{technicalSignal.toUpperCase()}</div>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">
                {trade.alignment.technical}
              </p>
            </div>

            {/* News Sentiment */}
            <div className="bg-card-hover/50 rounded-lg p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📰</span>
                <div>
                  <div className="text-xs text-text-disabled">News Sentiment</div>
                  <div className={`font-semibold ${getSentimentColor(news.sentiment)}`}>
                    {news.sentiment.toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">
                {trade.alignment.news}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

