// Yahoo Finance RapidAPI types

export interface YahooSearchResult {
  symbol: string;
  name: string;
  exch?: string;
  type?: string;
  exchDisp?: string;
  typeDisp?: string;
}

export interface YahooSearchResponse {
  quotes: YahooSearchResult[];
}

export interface YahooQuoteSummary {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  currency?: string;
}

export interface YahooNewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  type: string;
  thumbnail?: {
    resolutions: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
}

export interface YahooNewsResponse {
  news: YahooNewsItem[];
}

