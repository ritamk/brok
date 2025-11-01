// Backend API client

import type { TickersDataRequest, TickersDataResponse } from '../types/backend';
import type { YahooSearchResponse, YahooSearchResult } from '../types/yahoo';

// In dev, call backend directly; in prod, use configured base URL
const IS_DEV_ENV: boolean = import.meta.env.DEV;
const API_BASE: string = IS_DEV_ENV
  ? ''
  : (import.meta.env.VITE_BACKEND_URL as string) || '';

/**
 * Post tickers data request to backend
 */
export async function postTickersData(payload: TickersDataRequest): Promise<TickersDataResponse> {
  const url = `${API_BASE}/v1/tickers/data`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend API failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

/**
 * Search tickers using backend service
 */
export async function searchTickers(query: string, limit = 2): Promise<YahooSearchResponse> {
  if (!query.trim()) {
    return { quotes: [] };
  }

  const url = `${API_BASE}/v1/tickers/search?q=${encodeURIComponent(query)}&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend search failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: Array<{ ticker: string; name: string }> = await response.json();

  const quotes: YahooSearchResult[] = data.map((item) => ({
    symbol: item.ticker,
    name: item.name,
    // Optional fields may be unavailable from backend search
    exch: undefined as unknown as string,
    type: undefined as unknown as string,
    exchDisp: undefined as unknown as string,
    typeDisp: undefined as unknown as string,
  }));

  return { quotes };
}

/**
 * Get combined quote summary and news for a symbol
 */
export interface BackendTickerNewsResponse {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  currency: string;
  quote_url: string;
  items: Array<{ headline: string; url: string }>;
}

export async function getTickerNews(symbol: string, limit = 5): Promise<BackendTickerNewsResponse> {
  const url = `${API_BASE}/v1/tickers/news?symbol=${encodeURIComponent(symbol)}&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend news failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

