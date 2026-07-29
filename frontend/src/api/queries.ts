import { getJson } from "./client";
import type {
  MarketResponse,
  SymbolsResponse,
  FactorCatalogResponse,
  FactorResponse,
} from "./types";

export const getSymbols = (signal?: AbortSignal) =>
  getJson<SymbolsResponse>("/market-data/symbols", signal);

export const getMarketData = (symbol: string, signal?: AbortSignal) =>
  getJson<MarketResponse>(`/market-data/${symbol}?limit=500`, signal);

export const getFactors = (signal?: AbortSignal) =>
  getJson<FactorCatalogResponse>("/factors", signal);

export const getFactorValues = (
  factorName: string,
  symbol: string,
  signal?: AbortSignal,
) =>
  getJson<FactorResponse>(
    `/factors/${encodeURIComponent(factorName)}?symbol=${encodeURIComponent(symbol)}&limit=500`,
    signal,
  );

export const getLatestFactorValues = (
  factorName: string,
  signal?: AbortSignal,
) =>
  getJson<FactorResponse>(
    `/factors/${encodeURIComponent(factorName)}/latest`,
    signal,
  );
