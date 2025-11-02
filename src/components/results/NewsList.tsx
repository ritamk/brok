import type { YahooNewsItem } from '../../types/yahoo';

interface NewsListProps {
  symbolNews: YahooNewsItem[];
  indiaNews: YahooNewsItem[];
  globalNews: YahooNewsItem[];
  backendSummary?: string;
  keyDrivers?: string[];
  sentiment?: string;
  sentimentConfidence?: number;
}

export function NewsList({ symbolNews, indiaNews, globalNews, backendSummary, keyDrivers, sentiment, sentimentConfidence }: NewsListProps) {

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

  const renderNewsList = (items: YahooNewsItem[], maxItems: number = 8) => {
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {items.slice(0, maxItems).map((item) => (
          <a
            key={item.uuid}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-card rounded-lg p-3 shadow-[0_0_10px_0_rgba(0,0,0,0.05)] hover:shadow-[0_0_15px_0_rgba(0,0,0,0.1)] transition-shadow"
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
                </div>
              </div>
              <svg className="w-4 h-4 text-text-disabled shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const hasAnyNews = symbolNews.length > 0 || indiaNews.length > 0 || globalNews.length > 0;

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
        <div className="bg-blue-light/10 rounded-lg p-5 shadow-[0_0_15px_0_rgba(0,0,0,0.05)]">
          <h4 className="font-semibold text-blue-light mb-3 text-base">AI News Summary</h4>
          <p className="text-text-primary text-sm leading-relaxed">{backendSummary}</p>
        </div>
      )}

      {/* Key Drivers */}
      {keyDrivers && keyDrivers.length > 0 && (
        <div className="bg-green/10 rounded-lg p-5 shadow-[0_0_15px_0_rgba(0,0,0,0.05)]">
          <h4 className="font-semibold text-green mb-3 text-base">Key Drivers</h4>
          <ul className="space-y-2">
            {keyDrivers.map((driver, index) => (
              <li key={index} className="text-text-primary text-sm flex items-start gap-2">
                <span className="text-green mt-1">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* News Headlines */}
      {hasAnyNews && (
        <div className="space-y-4">
          {/* Symbol Headlines - Always visible */}
          {symbolNews.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-secondary mb-3">Latest Headlines</h4>
              {renderNewsList(symbolNews)}
            </div>
          )}

          {/* India Headlines - Collapsed */}
          {indiaNews.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer flex items-center justify-between py-2 px-3 bg-card-hover/50 rounded-lg hover:bg-card-hover transition-colors">
                <span className="font-semibold text-text-secondary text-sm">
                  India Market News ({indiaNews.length})
                </span>
                <svg
                  className="w-4 h-4 text-text-muted transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3">
                {renderNewsList(indiaNews)}
              </div>
            </details>
          )}

          {/* Global Headlines - Collapsed */}
          {globalNews.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer flex items-center justify-between py-2 px-3 bg-card-hover/50 rounded-lg hover:bg-card-hover transition-colors">
                <span className="font-semibold text-text-secondary text-sm">
                  Global Market News ({globalNews.length})
                </span>
                <svg
                  className="w-4 h-4 text-text-muted transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3">
                {renderNewsList(globalNews)}
              </div>
            </details>
          )}
        </div>
      )}

      {!backendSummary && !keyDrivers && !hasAnyNews && (
        <div className="text-text-disabled text-sm text-center py-4">No news available</div>
      )}
    </div>
  );
}

