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
      <label className="block text-sm font-medium text-gray-300">
        Select Timeframes <span className="text-gray-500">(at least one required)</span>
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
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
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

