export type AssetType = 'stock' | 'crypto';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
  createdAt: string;
  lastUpdated: string;
}

export interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
}
