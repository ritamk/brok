// Backend API types

export type Timeframe = '5m' | '15m' | '1D';

export interface TickersDataRequest {
  tickers: string[];
  timeframes: Timeframe[];
}

export interface TechnicalIndicators {
  rsi?: number;
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
  moving_averages?: {
    sma_20?: number;
    sma_50?: number;
    ema_12?: number;
    ema_26?: number;
  };
  bollinger_bands?: {
    upper: number;
    middle: number;
    lower: number;
  };
  atr?: number;
  adx?: number;
  stochastic?: {
    k: number;
    d: number;
  };
  volume?: number;
  [key: string]: unknown;
}

export interface TechnicalAnalysis {
  signal: 'buy' | 'sell' | 'hold' | 'neutral';
  confidence: number;
  rules_triggered: string[];
  indicators: TechnicalIndicators;
  risk?: {
    stop_loss?: number;
    take_profit?: number;
    risk_reward_ratio?: number;
  };
}

export interface TradeDecision {
  decision: string;
  confidence: number;
  rationale: string;
  risk_notes?: string;
  alignment?: {
    technical: string;
    news: string;
  };
}

export interface RiskAssessment {
  stop_loss?: number;
  take_profit?: number;
  risk_reward_ratio?: number;
  position_size?: string;
  notes?: string;
}

export interface NewsAnalysis {
  sentiment: string;
  summary: string;
  confidence?: number;
  drivers?: string[];
}

export interface NewsPayloadHeadline {
  title: string;
  url: string;
  source: string;
}

export interface NewsPayload {
  symbol: string;
  symbol_headlines: NewsPayloadHeadline[];
  india_headlines: NewsPayloadHeadline[];
  global_headlines: NewsPayloadHeadline[];
}

export interface MetaInfo {
  model?: string;
  tokens_used?: number;
  processing_time_ms?: number;
  timestamp?: string;
  summary?: {
    [key: string]: unknown;
  };
  usage?: {
    [agent: string]: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
}

export interface TimeframeResult {
  timeframe: Timeframe;
  technical: TechnicalAnalysis;
  trade: TradeDecision;
  risk: RiskAssessment;
  news: NewsAnalysis;
  meta?: MetaInfo;
}

export interface SymbolRun {
  symbol: string;
  long_name: string;
  price: number;
  change: string;
  results: TimeframeResult[];
  news_payload?: NewsPayload;
  error?: string;
}

export interface TickersDataResponse {
  requested_at: string;
  runs: SymbolRun[];
  meta?: {
    total_symbols: number;
    total_timeframes: number;
    total_processing_time_ms?: number;
  };
}

