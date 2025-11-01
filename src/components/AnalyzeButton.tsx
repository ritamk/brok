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
          ? 'bg-card-hover text-text-disabled cursor-not-allowed'
          : 'bg-linear-to-r from-blue to-purple hover:from-blue-dark hover:to-purple text-white shadow-lg hover:shadow-xl'
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

