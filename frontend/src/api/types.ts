export type MarketRow = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close: number;
};

export type MarketResponse = {
  symbol: string;
  count: number;
  data: MarketRow[];
};

export type SymbolsResponse = {
  symbols: string[];
  count: number;
};

export type FactorMetadata = {
  name: string;
  version: string;
  warmup_periods: number;
  parameters?: Record<string, any>;
};

export type FactorCatalogResponse = {
  factors: FactorMetadata[];
  count: number;
};

export type FactorValue = {
  date: string;
  symbol: string;
  factor_name: string;
  factor_value: number | null;
  factor_version: string;
  computed_at: string;
};

export type FactorResponse = {
  factor_name: string;
  factor_version: string;
  count: number;
  data: FactorValue[];
};
