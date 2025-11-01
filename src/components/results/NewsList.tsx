import type { YahooNewsItem } from '../../types/yahoo';

interface NewsListProps {
  news: YahooNewsItem[];
  backendSummary?: string;
  keyDrivers?: string[];
  sentiment?: string;
  sentimentConfidence?: number;
}

export function NewsList({ news, backendSummary, keyDrivers, sentiment, sentimentConfidence }: NewsListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSentimentColor = (sent?: string) => {
    if (!sent) return { bg: 'bg-card-hover', text: 'text-text-primary', border: 'border-border' };
    const normalized = sent.toLowerCase();
    if (normalized.includes('bullish')) return { bg: 'bg-green', text: 'text-white', border: 'border-green' };
    if (normalized.includes('bearish')) return { bg: 'bg-red', text: 'text-white', border: 'border-red' };
    return { bg: 'bg-yellow', text: 'text-white', border: 'border-yellow' };
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-card-hover';
    if (confidence >= 0.7) return 'bg-green';
    if (confidence >= 0.4) return 'bg-yellow';
    return 'bg-red';
  };

  const sentimentColors = getSentimentColor(sentiment);

  return (
    <div className="space-y-4">
      {/* Sentiment Badge and Confidence */}
      {sentiment && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`px-6 py-3 rounded-full text-xl font-bold ${sentimentColors.bg} ${sentimentColors.text}`}>
              {sentiment.toUpperCase()}
            </div>
            {sentimentConfidence !== undefined && (
              <div className="flex flex-col">
                <div className="text-xs text-text-muted mb-1">Confidence</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-card-hover rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getConfidenceColor(sentimentConfidence)}`}
                      style={{ width: `${sentimentConfidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {Math.round(sentimentConfidence * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backend AI Summary */}
      {backendSummary && (
        <div className="bg-blue/20 border border-blue rounded-lg p-4">
          <h4 className="font-semibold text-blue-light mb-2">AI News Summary</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{backendSummary}</p>
        </div>
      )}

      {/* Key Drivers */}
      {keyDrivers && keyDrivers.length > 0 && (
        <div className="bg-purple/20 border border-purple rounded-lg p-4">
          <h4 className="font-semibold text-purple-light mb-2">Key Drivers</h4>
          <ul className="space-y-1">
            {keyDrivers.map((driver, index) => (
              <li key={index} className="text-text-secondary text-sm flex items-start gap-2">
                <span className="text-purple-light mt-1">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* News Headlines */}
      {news.length > 0 && (
        <div>
          <h4 className="font-semibold text-text-secondary mb-3">Latest Headlines</h4>
          <div className="space-y-3">
            {news.slice(0, 5).map((item) => (
              <a
                key={item.uuid}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card border border-border rounded-lg p-3 hover:border-border-light hover:bg-card-hover transition-colors"
              >
                <div className="flex gap-3">
                  {item.thumbnail?.resolutions?.[0]?.url && (
                    <img
                      src={item.thumbnail.resolutions[0].url}
                      alt=""
                      className="w-16 h-16 object-cover rounded shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-text-primary text-sm line-clamp-2 mb-1">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-text-disabled">
                      <span>{item.publisher}</span>
                      <span>•</span>
                      <span>{formatDate(item.providerPublishTime)}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-text-disabled shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {!backendSummary && !keyDrivers && news.length === 0 && (
        <div className="text-text-disabled text-sm text-center py-4">No news available</div>
      )}
    </div>
  );
}

