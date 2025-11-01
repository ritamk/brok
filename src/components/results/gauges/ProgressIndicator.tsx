interface ProgressIndicatorProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
  contextLabel?: string;
}

export function ProgressIndicator({ 
  label, 
  value, 
  max = 100, 
  unit = '',
  thresholds = { low: 25, medium: 50, high: 75 },
  contextLabel
}: ProgressIndicatorProps) {
  // Calculate percentage
  const percentage = Math.min(100, (value / max) * 100);
  
  // Determine color based on thresholds
  const getColor = () => {
    if (value >= thresholds.high) return 'bg-red';
    if (value >= thresholds.medium) return 'bg-yellow';
    if (value >= thresholds.low) return 'bg-green';
    return 'bg-blue';
  };

  const getTextColor = () => {
    if (value >= thresholds.high) return 'text-red';
    if (value >= thresholds.medium) return 'text-yellow';
    if (value >= thresholds.low) return 'text-green';
    return 'text-blue';
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted font-medium">{label}</span>
        <span className={`text-sm font-bold font-mono ${getTextColor()}`}>
          {value.toFixed(2)}{unit}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-3 bg-card-hover rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all ${getColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {/* Context label */}
      {contextLabel && (
        <div className="text-xs text-text-disabled text-center mt-1">{contextLabel}</div>
      )}
      
      {/* Threshold markers */}
      <div className="flex justify-between text-[10px] text-text-disabled mt-1">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

