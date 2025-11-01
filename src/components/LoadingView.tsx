import Lottie from 'lottie-react';
import tradeAnalysisAnimation from '../assets/trade-analysis.json';

export function LoadingView() {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Lottie animation */}
        <div className="relative w-64 h-64 mx-auto">
          <Lottie
            animationData={tradeAnalysisAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">Analyzing Market Data</h2>
          <p className="text-text-muted">Fetching technical indicators, news, and generating insights...</p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Progress steps */}
        <div className="mt-8 space-y-2 text-sm text-text-disabled">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-green rounded-full"></div>
            <span>Fetching market data</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-green rounded-full"></div>
            <span>Calculating technical indicators</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow rounded-full animate-pulse"></div>
            <span>Generating AI insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}

