import { useState, useEffect } from 'react';
// import Lottie from 'lottie-react';
// import tradeAnalysisAnimation from '../assets/trade-analysis.json';
import { 
  faFaceSmile,
  faFaceTired,
  faFaceSurprise,
  faFaceSmileWink,
  faFaceSadTear,
  faFaceRollingEyes,
  faFaceLaughSquint,
  faFaceMeh,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DebateMessage {
  agent: string;
  role: string;
  message: string | ((progress: number, duration: number) => string);
  emoji: IconDefinition;
  color: string;
}

interface LoadingViewProps {
  tickerCount?: number;
  timeframeCount?: number;
}

const DEBATE_MESSAGES: DebateMessage[] = [
  // Opening statements
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "PE ratio is screaming overvaluation. I wish someone valued my job as much.", emoji: faFaceTired, color: 'text-blue' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: "My model disagrees. Also, it has feelings now. It's upset.", emoji: faFaceSmileWink, color: 'text-purple' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Guys... elections next month. Or was it last month? Time is a construct.", emoji: faFaceSurprise, color: 'text-highlight' },
  { agent: 'Risk AI', role: 'Risk Management', message: "Someone please include stop-loss in this conversation, or I'll lose my job.", emoji: faFaceRollingEyes, color: 'text-red' },
  
  // Technical analysis
  { agent: 'Quant AI', role: 'Quantitative Models', message: (p) => p > 30 ? "Still calculating. My GPU is literally sweating." : "RSI at 72. We're in overbought territory, folks.", emoji: faFaceMeh, color: 'text-purple' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "Earnings growth is 35% YoY. But who's counting. (I am. I'm always counting.)", emoji: faFaceSmile, color: 'text-blue' },
  { agent: 'Risk AI', role: 'Risk Management', message: "Great. Now calculate the downside risk before celebrating. I'll wait.", emoji: faFaceSadTear, color: 'text-red' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: (_p, d) => d > 60 ? "This is taking longer than the Fed's last meeting. Just saying..." : "Fed meeting in 2 weeks. Just saying...", emoji: faFaceMeh, color: 'text-highlight' },
  
  // Market conditions
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Social media buzz down 40%. Turns out nobody cares. Shocking.", emoji: faFaceSurprise, color: 'text-highlight' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: (p) => p > 50 ? "MACD crossover detected. This is taking forever. Both are true." : "MACD crossover detected. This is textbook bullish.", emoji: faFaceLaughSquint, color: 'text-purple' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "Cash flow is king. And this company has plenty. Unlike my patience.", emoji: faFaceSmileWink, color: 'text-blue' },
  { agent: 'Risk AI', role: 'Risk Management', message: "Beta is 1.8. This moves FAST. Unlike this analysis, apparently.", emoji: faFaceTired, color: 'text-red' },
  
  // Risk assessment
  { agent: 'Risk AI', role: 'Risk Management', message: (_p, d) => d > 90 ? "Volatility index spiking. Also, I've aged 3 years waiting for this." : "Volatility index spiking. Everyone buckle up.", emoji: faFaceSurprise, color: 'text-red' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "Book value is solid. There's a floor here. Emotionally, I'm through it.", emoji: faFaceSmile, color: 'text-blue' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Sector rotation happening. Tech money flowing to value. Or to coffee. Hard to tell.", emoji: faFaceSmileWink, color: 'text-highlight' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: (p) => p > 60 ? "My neural network says 'buy'. It also says 'please end this meeting'." : "My neural network says 'buy'. It's rarely wrong... lately.", emoji: faFaceRollingEyes, color: 'text-purple' },
  
  // Final arguments
  { agent: 'Quant AI', role: 'Quantitative Models', message: (_p, d) => d > 120 ? "Bollinger Bands tightening. Unlike this debate, which is infinite." : "Bollinger Bands are tightening. Big move incoming.", emoji: faFaceSurprise, color: 'text-purple' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Institutional ownership up 12%. Smart money is moving. Faster than us.", emoji: faFaceSmile, color: 'text-highlight' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "Dividend yield is attractive. That's real money. Which I could be earning right now.", emoji: faFaceSmileWink, color: 'text-blue' },
  { agent: 'Risk AI', role: 'Risk Management', message: (p) => p > 70 ? "Max drawdown potential: 23%. My sanity drawdown: 97%." : "Max drawdown potential: 23%. Can you handle that?", emoji: faFaceMeh, color: 'text-red' },
  
  // Consensus building
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: (_p, d) => d > 150 ? "Fine, the technicals look decent. Can we wrap this up? I have 47 other stocks to analyze." : "Okay, I'll admit the technicals look decent...", emoji: faFaceMeh, color: 'text-blue' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: "And yes, fundamentals provide some safety net. Groundbreaking stuff.", emoji: faFaceSmile, color: 'text-purple' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: (p) => p > 80 ? "Market timing is tricky. So is finishing this analysis, apparently." : "Market timing is tricky, but conditions are... interesting.", emoji: faFaceSmileWink, color: 'text-highlight' },
  { agent: 'Risk AI', role: 'Risk Management', message: (_p, d) => d > 180 ? "With proper position sizing, this could work. Unlike our time management." : "With proper position sizing, this could work.", emoji: faFaceSmile, color: 'text-red' }
];

export function LoadingView({ tickerCount = 1, timeframeCount = 1 }: LoadingViewProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(() => 
    Math.floor(Math.random() * DEBATE_MESSAGES.length)
  );
  const [progress, setProgress] = useState(0);

  // Calculate expected duration: tickerCount * timeframeCount * 20 seconds
  const expectedDuration = tickerCount * timeframeCount * 20;

  useEffect(() => {
    const startTime = Date.now();

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        // Pick a random index different from the current one
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * DEBATE_MESSAGES.length);
        } while (newIndex === prev && DEBATE_MESSAGES.length > 1);
        return newIndex;
      });
    }, 3500); // Change message every 3.5 seconds

    // Update progress based on actual elapsed time vs expected duration
    const progressInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
      
      // Calculate progress percentage (cap at 95% until actually complete)
      const calculatedProgress = Math.min((elapsed / expectedDuration) * 100, 95);
      setProgress(calculatedProgress);
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [expectedDuration]);

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Lottie animation
        <div className="relative w-64 h-64 mx-auto">
          <Lottie
            animationData={tradeAnalysisAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div> */}

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold shimmer">AI analysis in progress</h2>
        </div>

        {/* Scrolling debate messages - similar to progress steps */}
        <div className="mt-8 relative h-20 overflow-hidden max-w-2xl mx-auto px-4">
          <div 
            className="flex flex-col transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${currentMessageIndex * 5}rem)` }}
          >
            {DEBATE_MESSAGES.map((msg, index) => {
              const messageText = typeof msg.message === 'function' 
                ? msg.message(progress, expectedDuration) 
                : msg.message;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center justify-center gap-3 h-20 transition-all duration-700 ${
                    index === currentMessageIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-30 scale-95'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={msg.emoji} 
                    className={`text-3xl ${msg.color}`}
                  />
                  <div className="text-left max-w-md">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-text-primary">{msg.agent}</span>
                      <span className="text-[10px] text-text-muted uppercase tracking-wide">{msg.role}</span>
                    </div>
                    <p className="text-text-secondary text-sm mt-0.5">{messageText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto px-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-muted">
              Loading
            </span>
            <span className="text-text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer {
          display: inline-block;
          background: linear-gradient(
            90deg,
            var(--color-text-primary) 10%,
            var(--color-text-muted) 45%,
            var(--color-text-muted) 55%,
            var(--color-text-primary) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

