import type { YahooNewsItem } from '../../types/yahoo';

interface NewsListProps {
  news: YahooNewsItem[];
  backendSummary?: string;
  keyDrivers?: string[];
}

export function NewsList({ news, backendSummary, keyDrivers }: NewsListProps) {
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

  return (
    <div className="space-y-4">
      {/* Backend AI Summary */}
      {backendSummary && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">AI News Summary</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{backendSummary}</p>
        </div>
      )}

      {/* Key Drivers */}
      {keyDrivers && keyDrivers.length > 0 && (
        <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-300 mb-2">Key Drivers</h4>
          <ul className="space-y-1">
            {keyDrivers.map((driver, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* News Headlines */}
      {news.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-300 mb-3">Latest Headlines</h4>
          <div className="space-y-3">
            {news.slice(0, 5).map((item) => (
              <a
                key={item.uuid}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <div className="flex gap-3">
                  {item.thumbnail?.resolutions?.[0]?.url && (
                    <img
                      src={item.thumbnail.resolutions[0].url}
                      alt=""
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-200 text-sm line-clamp-2 mb-1">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{item.publisher}</span>
                      <span>•</span>
                      <span>{formatDate(item.providerPublishTime)}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {!backendSummary && !keyDrivers && news.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-4">No news available</div>
      )}
    </div>
  );
}

