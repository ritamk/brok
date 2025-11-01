import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { searchTickers } from '../api/backend';
import type { YahooSearchResult } from '../types/yahoo';

interface TickerSearchProps {
  selectedTickers: YahooSearchResult[];
  onAddTicker: (ticker: YahooSearchResult) => void;
  onRemoveTicker: (symbol: string) => void;
}

export function TickerSearch({ selectedTickers, onAddTicker, onRemoveTicker }: TickerSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  // Search query
  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchTickers(debouncedQuery, 4),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const suggestions = data?.quotes?.filter(
    (quote) => !selectedTickers.some((t) => t.symbol === quote.symbol)
  ) || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectTicker(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectTicker = (ticker: YahooSearchResult) => {
    onAddTicker(ticker);
    setQuery('');
    setDebouncedQuery('');
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for stocks (e.g., Apollo Tyres, Infosys)..."
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue border-t-transparent rounded-full"></div>
          </div>
        )}

        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.symbol}
                onClick={() => handleSelectTicker(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-card-hover transition-colors ${
                  index === selectedIndex ? 'bg-card-hover' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-text-primary">{suggestion.symbol}</div>
                    <div className="text-sm text-text-muted">{suggestion.name}</div>
                  </div>
                  <div className="text-xs text-text-disabled">{suggestion.exchDisp}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected tickers chips */}
      {selectedTickers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTickers.map((ticker) => (
            <div
              key={ticker.symbol}
              className="flex items-center gap-2 px-3 py-1.5 border-[1.5px] border-blue/70 rounded-full text-sm"
            >
              <span className="font-semibold text-blue/90">{ticker.symbol}</span>
              <span className="text-text-muted max-w-[150px] truncate">{ticker.name}</span>
              <button
                onClick={() => onRemoveTicker(ticker.symbol)}
                className="ml-1 text-red/30 hover:text-red transition-color hover:scale-115 transition-scale"
                aria-label={`Remove ${ticker.symbol}`}
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

