interface MovingAverageComparisonProps {
  sma_20?: number;
  sma_50?: number;
  ema_50?: number;
  currentPrice?: number;
}

export function MovingAverageComparison({ sma_20, sma_50, ema_50, currentPrice }: MovingAverageComparisonProps) {
  // Helper to check if value is a valid number
  const isValidNumber = (value: unknown): value is number => 
    typeof value === 'number' && !isNaN(value) && isFinite(value);

  // Collect all available MAs
  const mas: Array<{ label: string; value: number; color: string }> = [];
  
  if (isValidNumber(sma_20)) mas.push({ label: 'SMA 20', value: sma_20, color: 'bg-blue' });
  if (isValidNumber(sma_50)) mas.push({ label: 'SMA 50', value: sma_50, color: 'bg-purple' });
  if (isValidNumber(ema_50)) mas.push({ label: 'EMA 50', value: ema_50, color: 'bg-highlight' });
  
  if (mas.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="text-xs text-text-muted mb-2 font-medium">Moving Averages</div>
        <div className="text-xs text-text-disabled">No data available</div>
      </div>
    );
  }

  // Find min and max for scaling
  const allValues = mas.map(ma => ma.value);
  if (isValidNumber(currentPrice)) allValues.push(currentPrice);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue;
  
  // Scale value to percentage
  const scaleValue = (value: number) => {
    if (range === 0) return 50;
    return ((value - minValue) / range) * 100;
  };

  // Only show current price section if it's a valid number
  const showCurrentPrice = isValidNumber(currentPrice);

  return (
    <div className="flex flex-col">
      <div className="text-xs text-text-muted mb-3 font-medium">Moving Averages</div>
      
      <div className="space-y-3">
        {mas.map((ma, index) => {
          const percentage = scaleValue(ma.value);
          const isAbovePrice = showCurrentPrice && ma.value > currentPrice!;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">{ma.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-primary">{ma.value.toFixed(2)}</span>
                  {showCurrentPrice && (
                    <span className={`text-xs ${isAbovePrice ? 'text-red' : 'text-green'}`}>
                      {isAbovePrice ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-2 bg-card-hover rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${ma.color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        
        {/* Current price indicator */}
        {showCurrentPrice && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary font-semibold">Current Price</span>
              <span className="text-xs font-mono text-text-primary font-bold">{currentPrice!.toFixed(2)}</span>
            </div>
            <div className="relative h-2 bg-card-hover rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-text-primary"
                style={{ width: `${scaleValue(currentPrice!)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Summary */}
      {showCurrentPrice && mas.length > 0 && (
        <div className="mt-3 text-center">
          <div className="text-xs text-text-muted">
            {mas.filter(ma => ma.value < currentPrice!).length} of {mas.length} MAs below price
          </div>
        </div>
      )}
    </div>
  );
}

