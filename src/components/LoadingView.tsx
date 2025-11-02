import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import tradeAnalysisAnimation from '../assets/trade-analysis.json';
import { faCoins, faArrowTrendUp, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PROGRESS_STEPS = [
  {text: 'Fetching market data', icon: faCoins },
  {text: 'Calculating technical indicators', icon: faArrowTrendUp },
  {text: 'Generating AI insights', icon: faWandMagicSparkles },
];

export function LoadingView() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % PROGRESS_STEPS.length);
    }, 2500); // Change step every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

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
          <h2 className="text-2xl font-bold shimmer">Analyzing Market Data</h2>
        </div>

        {/* Progress steps */}
        <div className="mt-8 relative h-6 overflow-hidden">
          <div 
            className="flex flex-col transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentStep * 1.5}rem)` }}
          >
            {PROGRESS_STEPS.map((step, index) => (
              <div 
                key={step.text}
                className={`flex items-center justify-center gap-2 text-sm h-6 transition-all duration-300 ${
                  index === currentStep 
                    ? 'text-text-primary font-medium' 
                    : 'text-text-disabled'
                }`}
              >
                <FontAwesomeIcon icon={step.icon} />
                <span>{step.text}</span>
              </div>
            ))}
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
            var(--color-text-primary) 0%,
            var(--color-text-primary) 40%,
            var(--color-text-primary) 50%,
            var(--color-blue-light) 55%,
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

