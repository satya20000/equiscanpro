
export type Timeframe = '1D' | '1W' | '1M' | '1Y' | '5Y';

export interface StockDataPoint {
  time: string;
  price: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  url: string;
}

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  marketCap: string;
  sector: string;
  volume: string;
  history: StockDataPoint[];
  description: string;
}

export interface MarketInsight {
  summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  keyDrivers: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}
