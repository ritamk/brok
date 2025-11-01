interface MACDChartProps {
  macd: number;
  signal: number;
  histogram: number;
}

export function MACDChart({ macd, signal, histogram }: MACDChartProps) {
  // Determine if bullish or bearish
  const isBullish = histogram > 0;
  
  // Calculate max value for scaling
  const maxValue = Math.max(Math.abs(macd), Math.abs(signal), Math.abs(histogram)) * 1.2;
  
  // Scale values to percentage for display
  const scaleValue = (value: number) => {
    return (Math.abs(value) / maxValue) * 100;
  };

  return (
    <div className="flex flex-col">
      <div className="text-xs text-text-muted mb-3 font-medium">MACD</div>
      
      {/* Signal indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${isBullish ? 'bg-green' : 'bg-red'}`}></div>
        <span className={`text-sm font-semibold ${isBullish ? 'text-green' : 'text-red'}`}>
          {isBullish ? 'Bullish' : 'Bearish'}
        </span>
      </div>
      
      {/* Bar chart */}
      <div className="space-y-3">
        {/* MACD Line */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">MACD</span>
            <span className="text-xs font-mono text-text-primary">{macd.toFixed(2)}</span>
          </div>
          <div className="relative h-2 bg-card-hover rounded-full overflow-hidden">
            <div
              className={`absolute top-0 h-full rounded-full ${macd >= 0 ? 'bg-green left-1/2' : 'bg-red right-1/2'}`}
              style={{ width: `${scaleValue(macd)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Signal Line */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Signal</span>
            <span className="text-xs font-mono text-text-primary">{signal.toFixed(2)}</span>
          </div>
          <div className="relative h-2 bg-card-hover rounded-full overflow-hidden">
            <div
              className={`absolute top-0 h-full rounded-full ${signal >= 0 ? 'bg-blue left-1/2' : 'bg-blue-dark right-1/2'}`}
              style={{ width: `${scaleValue(signal)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Histogram */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Histogram</span>
            <span className="text-xs font-mono text-text-primary">{histogram.toFixed(2)}</span>
          </div>
          <div className="relative h-3 bg-card-hover rounded-full overflow-hidden">
            <div
              className={`absolute top-0 h-full rounded-full ${histogram >= 0 ? 'bg-green left-1/2' : 'bg-red right-1/2'}`}
              style={{ width: `${scaleValue(histogram)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Center line indicator */}
      <div className="relative mt-2">
        <div className="absolute left-1/2 top-0 w-px h-2 bg-border"></div>
        <div className="text-center text-[10px] text-text-disabled mt-2">0</div>
      </div>
    </div>
  );
}

