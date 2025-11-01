interface BollingerBandsVisualProps {
  upper: number;
  middle: number;
  lower: number;
  currentPrice?: number;
  bandPct?: number;
}

export function BollingerBandsVisual({ upper, middle, lower, currentPrice, bandPct }: BollingerBandsVisualProps) {
  // Use middle as current price if not provided
  const price = currentPrice ?? middle;
  
  // Calculate position percentage (0-100)
  const range = upper - lower;
  const position = range > 0 ? ((price - lower) / range) * 100 : 50;
  const clampedPosition = Math.max(0, Math.min(100, position));
  
  // Determine zone
  const getZone = () => {
    if (clampedPosition >= 80) return { label: 'Near Upper', color: 'text-red' };
    if (clampedPosition <= 20) return { label: 'Near Lower', color: 'text-green' };
    return { label: 'Middle Zone', color: 'text-yellow' };
  };

  const zone = getZone();

  return (
    <div className="flex flex-col">
      <div className="text-xs text-text-muted mb-3 font-medium">Bollinger Bands</div>
      
      {/* Visual representation */}
      <div className="relative bg-card-hover rounded-lg p-4 mb-3">
        {/* Upper band */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-disabled">Upper</span>
          <span className="text-xs font-mono text-red">{upper.toFixed(2)}</span>
        </div>
        <div className="h-1 bg-red/30 rounded-full mb-4"></div>
        
        {/* Middle band with price indicator */}
        <div className="relative mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-disabled">Middle</span>
            <span className="text-xs font-mono text-blue">{middle.toFixed(2)}</span>
          </div>
          <div className="h-1 bg-blue/30 rounded-full"></div>
          
          {/* Price position indicator */}
          <div 
            className="absolute top-0 w-1 h-full transform -translate-x-1/2"
            style={{ left: `${clampedPosition}%` }}
          >
            <div className="relative">
              <div className={`w-3 h-3 rounded-full border-2 border-white ${zone.color.replace('text-', 'bg-')}`}></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="text-[10px] font-mono text-text-primary bg-card px-1 rounded">
                  {price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lower band */}
        <div className="flex items-center justify-between mb-2 mt-8">
          <span className="text-xs text-text-disabled">Lower</span>
          <span className="text-xs font-mono text-green">{lower.toFixed(2)}</span>
        </div>
        <div className="h-1 bg-green/30 rounded-full"></div>
      </div>
      
      {/* Status */}
      <div className="text-center">
        <div className={`text-sm font-semibold ${zone.color}`}>{zone.label}</div>
        {bandPct !== undefined && (
          <div className="text-xs text-text-muted mt-1">
            Band %: {(bandPct * 100).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

