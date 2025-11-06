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
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "This stock is expensive. Like, really expensive. I wish someone valued my job this much.", emoji: faFaceTired, color: 'text-blue' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: "My algorithm disagrees. Also, it has feelings now. It's upset.", emoji: faFaceSmileWink, color: 'text-purple' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Guys... elections next month. Or was it last month? Time is a construct.", emoji: faFaceSurprise, color: 'text-highlight' },
  { agent: 'Risk AI', role: 'Risk Management', message: "Can we talk about what happens if this goes wrong?", emoji: faFaceRollingEyes, color: 'text-red' },
  
  // Analysis phase
  { agent: 'Quant AI', role: 'Quantitative Models', message: (p) => p > 30 ? "Still calculating. My computer is literally sweating." : "The numbers look good. Like, really good. Trust me, I'm a robot.", emoji: faFaceMeh, color: 'text-purple' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "The company is making money. A lot of it. But who's counting? (I am. I'm always counting.)", emoji: faFaceSmile, color: 'text-blue' },
  { agent: 'Risk AI', role: 'Risk Management', message: "Great. Now let's talk about what could go wrong before celebrating. I'll wait.", emoji: faFaceSadTear, color: 'text-red' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: (_p, d) => d > 60 ? "This is taking longer than a government meeting. Just saying..." : "Michael Burry just shorted this, We are all about to get rich", emoji: faFaceMeh, color: 'text-highlight' },
  
  // Market conditions
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Social media buzz is down. Turns out nobody cares. Shocking.", emoji: faFaceSurprise, color: 'text-highlight' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: (p) => p > 50 ? "The trend looks good. This is taking forever. Both are true." : "The trend looks good. Like, really good.", emoji: faFaceLaughSquint, color: 'text-purple' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "The company has cash. Lots of it. Unlike my patience right now.", emoji: faFaceSmileWink, color: 'text-blue' },
  { agent: 'Risk AI', role: 'Risk Management', message: "This stock moves fast. Like, really fast. Unlike this analysis, apparently.", emoji: faFaceTired, color: 'text-red' },
  
  // Risk assessment
  { agent: 'Risk AI', role: 'Risk Management', message: (_p, d) => d > 90 ? "Things are getting wild out there. Also, I've aged 3 years waiting for this." : "Things are getting wild out there. Everyone buckle up.", emoji: faFaceSurprise, color: 'text-red' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "The company has solid foundations. There's a floor here. Emotionally, I'm through it.", emoji: faFaceSmile, color: 'text-blue' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Money is moving around. Tech money flowing to other stuff. Or to coffee. Hard to tell.", emoji: faFaceSmileWink, color: 'text-highlight' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: (p) => p > 60 ? "My brain says 'buy'. It also says 'please end this meeting'." : "My brain says 'buy'. It's rarely wrong... lately.", emoji: faFaceRollingEyes, color: 'text-purple' },
  
  // Final arguments
  { agent: 'Quant AI', role: 'Quantitative Models', message: (_p, d) => d > 120 ? "Something big is coming. Unlike this debate, which is infinite." : "Something big is coming. You can feel it.", emoji: faFaceSurprise, color: 'text-purple' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: "Big investors are buying. Smart money is moving. Faster than us.", emoji: faFaceSmile, color: 'text-highlight' },
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: "They pay dividends. That's real money. Which I could be earning right now.", emoji: faFaceSmileWink, color: 'text-blue' },
  { agent: 'Risk AI', role: 'Risk Management', message: (p) => p > 70 ? "Could drop 23% if things go bad. My sanity drop: 97%." : "Could drop 23% if things go bad. Can you handle that?", emoji: faFaceMeh, color: 'text-red' },
  
  // Consensus building
  { agent: 'Value Investor AI', role: 'Fundamental Analysis', message: (_p, d) => d > 150 ? "Fine, it looks decent. Can we wrap this up? I have 47 other stocks to analyze." : "Okay, I'll admit it looks decent...", emoji: faFaceMeh, color: 'text-blue' },
  { agent: 'Quant AI', role: 'Quantitative Models', message: "And yes, the basics are solid. Groundbreaking stuff.", emoji: faFaceSmile, color: 'text-purple' },
  { agent: 'Macro AI', role: 'Market Sentiment', message: (p) => p > 80 ? "Timing is tricky. So is finishing this analysis, apparently." : "Timing is tricky, but conditions are... interesting.", emoji: faFaceSmileWink, color: 'text-highlight' },
  { agent: 'Risk AI', role: 'Risk Management', message: (_p, d) => d > 180 ? "If you don't bet too much, this could work. Unlike our time management." : "If you don't bet too much, this could work.", emoji: faFaceSmile, color: 'text-red' }
];

/**
 * Shuffles debate messages while ensuring:
 * - No back-to-back messages from the same agent
 * - Random starting message each time
 */
function shuffleMessagesWithConstraints(messages: DebateMessage[]): DebateMessage[] {
  const shuffled = [...messages];
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isValid && attempts < maxAttempts) {
    attempts++;
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Check if valid: no consecutive messages from same agent
    isValid = true;
    for (let i = 0; i < shuffled.length - 1; i++) {
      if (shuffled[i].agent === shuffled[i + 1].agent) {
        isValid = false;
        break;
      }
    }
  }

  return shuffled;
}

export function LoadingView({ tickerCount = 1, timeframeCount = 1 }: LoadingViewProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shuffledMessages, setShuffledMessages] = useState<DebateMessage[]>([]);

  // Calculate expected duration: tickerCount * timeframeCount * 20 seconds
  const expectedDuration = tickerCount * timeframeCount * 20;

  // Initialize shuffled messages on mount
  useEffect(() => {
    setShuffledMessages(shuffleMessagesWithConstraints(DEBATE_MESSAGES));
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % (shuffledMessages.length || DEBATE_MESSAGES.length));
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
  }, [expectedDuration, shuffledMessages.length]);

  const messagesToDisplay = shuffledMessages.length > 0 ? shuffledMessages : DEBATE_MESSAGES;

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
            {messagesToDisplay.map((msg, index) => {
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

