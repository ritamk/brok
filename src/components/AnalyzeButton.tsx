interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function AnalyzeButton({ onClick, disabled, isLoading }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
        disabled || isLoading
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          Analyzing...
        </span>
      ) : (
        'Analyze Stocks'
      )}
    </button>
  );
}

