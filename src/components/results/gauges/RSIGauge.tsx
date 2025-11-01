interface RSIGaugeProps {
  value: number;
  label?: string;
}

export function RSIGauge({ value, label = 'RSI' }: RSIGaugeProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));
  
  // Calculate rotation angle (-90 to 90 degrees for semicircle)
  const angle = -90 + (clampedValue / 100) * 180;
  
  // Determine color based on RSI zones
  const getColor = () => {
    if (clampedValue >= 70) return 'text-red'; // Overbought
    if (clampedValue <= 30) return 'text-green'; // Oversold
    return 'text-yellow'; // Neutral
  };

  const getZoneLabel = () => {
    if (clampedValue >= 70) return 'Overbought';
    if (clampedValue <= 30) return 'Oversold';
    return 'Neutral';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-text-muted mb-2 font-medium">{label}</div>
      
      {/* Semi-circular gauge */}
      <div className="relative w-32 h-16">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-card-hover"
          />
          
          {/* Colored zones */}
          {/* Oversold zone (0-30) - Green */}
          <path
            d="M 20 90 A 80 80 0 0 1 74 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-green/30"
          />
          
          {/* Overbought zone (70-100) - Red */}
          <path
            d="M 126 26 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-red/30"
          />
          
          {/* Value indicator line */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={getColor()}
            style={{
              transformOrigin: '100px 90px',
              transform: `rotate(${angle}deg)`,
            }}
          />
          
          {/* Center dot */}
          <circle cx="100" cy="90" r="6" fill="currentColor" className="text-text-primary" />
        </svg>
        
        {/* Zone markers */}
        <div className="absolute left-0 bottom-0 text-[10px] text-text-disabled">0</div>
        <div className="absolute left-[25%] bottom-0 text-[10px] text-green">30</div>
        <div className="absolute right-[25%] bottom-0 text-[10px] text-red">70</div>
        <div className="absolute right-0 bottom-0 text-[10px] text-text-disabled">100</div>
      </div>
      
      {/* Value display */}
      <div className="mt-2 text-center">
        <div className={`text-2xl font-bold ${getColor()}`}>
          {clampedValue.toFixed(1)}
        </div>
        <div className="text-xs text-text-muted mt-1">{getZoneLabel()}</div>
      </div>
    </div>
  );
}

