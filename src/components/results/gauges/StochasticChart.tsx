interface StochasticChartProps {
  k: number;
  d: number;
}

export function StochasticChart({ k, d }: StochasticChartProps) {
  // Clamp values between 0 and 100
  const clampedK = Math.max(0, Math.min(100, k));
  const clampedD = Math.max(0, Math.min(100, d));
  
  // Determine zone
  const getZone = () => {
    const avg = (clampedK + clampedD) / 2;
    if (avg >= 80) return { label: 'Overbought', color: 'text-red' };
    if (avg <= 20) return { label: 'Oversold', color: 'text-green' };
    return { label: 'Neutral', color: 'text-yellow' };
  };

  const zone = getZone();

  return (
    <div className="flex flex-col">
      <div className="text-xs text-text-muted mb-3 font-medium">Stochastic Oscillator</div>
      
      {/* Visual chart representation */}
      <div className="relative bg-card-hover rounded-lg p-4 mb-3" style={{ height: '140px' }}>
        {/* Overbought zone (80-100) */}
        <div className="absolute top-0 left-0 right-0 h-[20%] bg-red/10 border-b border-red/30"></div>
        <div className="absolute top-0 right-2 text-[10px] text-red">80</div>
        
        {/* Oversold zone (0-20) */}
        <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-green/10 border-t border-green/30"></div>
        <div className="absolute bottom-0 right-2 text-[10px] text-green">20</div>
        
        {/* Middle line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border"></div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[10px] text-text-disabled">50</div>
        
        {/* %K line indicator */}
        <div 
          className="absolute left-4 w-2 h-2 rounded-full bg-blue border-2 border-white"
          style={{ bottom: `${clampedK}%` }}
        ></div>
        <div 
          className="absolute left-4 transform -translate-x-1/2"
          style={{ bottom: `${clampedK}%`, marginBottom: '-20px' }}
        >
          <div className="text-[10px] font-mono text-blue whitespace-nowrap">
            %K: {clampedK.toFixed(1)}
          </div>
        </div>
        
        {/* %D line indicator */}
        <div 
          className="absolute right-4 w-2 h-2 rounded-full bg-purple border-2 border-white"
          style={{ bottom: `${clampedD}%` }}
        ></div>
        <div 
          className="absolute right-4 transform translate-x-1/2"
          style={{ bottom: `${clampedD}%`, marginBottom: '-20px' }}
        >
          <div className="text-[10px] font-mono text-purple whitespace-nowrap">
            %D: {clampedD.toFixed(1)}
          </div>
        </div>
        
        {/* Connecting line between K and D */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1="16"
            y1={`${100 - clampedK}%`}
            x2="calc(100% - 16px)"
            y2={`${100 - clampedD}%`}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2,2"
            className="text-border"
          />
        </svg>
      </div>
      
      {/* Legend and status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue"></div>
            <span className="text-xs text-text-secondary">%K</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple"></div>
            <span className="text-xs text-text-secondary">%D</span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`text-sm font-semibold ${zone.color}`}>{zone.label}</div>
      </div>
    </div>
  );
}

