import type { Timeframe } from '../types/backend';

interface TimeframePickerProps {
  selectedTimeframes: Timeframe[];
  onToggleTimeframe: (timeframe: Timeframe) => void;
}

const TIMEFRAMES: { value: Timeframe; label: string; description: string }[] = [
  { value: '5m', label: '5m', description: '5 minutes' },
  { value: '15m', label: '15m', description: '15 minutes' },
  { value: '1D', label: '1D', description: '1 day' },
];

export function TimeframePicker({ selectedTimeframes, onToggleTimeframe }: TimeframePickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">
        Select Timeframes <span className="text-text-disabled">(at least one required)</span>
      </label>
      <div className="flex gap-3">
        {TIMEFRAMES.map((timeframe) => {
          const isSelected = selectedTimeframes.includes(timeframe.value);
          const isDisabled = selectedTimeframes.length === 1 && isSelected;

          return (
            <button
              key={timeframe.value}
              onClick={() => onToggleTimeframe(timeframe.value)}
              disabled={isDisabled}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'bg-blue border-blue text-white'
                  : 'bg-card border-border text-text-secondary hover:border-border-light'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-semibold">{timeframe.label}</div>
              <div className="text-xs opacity-80">{timeframe.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

