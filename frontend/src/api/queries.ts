import { getJson } from "./client";
import type {
  MarketResponse,
  SymbolsResponse,
  FactorCatalogResponse,
  FactorResponse,
  BacktestDailyResponse,
  BacktestListResponse,
  BacktestMetadata,
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

export const getBacktests = (signal?: AbortSignal) =>
  getJson<BacktestListResponse>("/backtests", signal);

export const getBacktest = (backtestId: string, signal?: AbortSignal) =>
  getJson<BacktestMetadata>(
    `/backtests/${encodeURIComponent(backtestId)}`,
    signal,
  );

export const getBacktestDaily = (backtestId: string, signal?: AbortSignal) =>
  getJson<BacktestDailyResponse>(
    `/backtests/${encodeURIComponent(backtestId)}/daily?limit=5000`,
    signal,
  );

export const getModels = (signal?: AbortSignal) =>
  getJson<import("./types").ModelListResponse>("/models", signal);

export const getModel = (modelId: string, signal?: AbortSignal) =>
  getJson<import("./types").ModelManifest>(
    `/models/${encodeURIComponent(modelId)}`,
    signal,
  );

export const getPredictions = (
  modelId: string,
  split: import("./types").PredictionSplit,
  signal?: AbortSignal,
) =>
  getJson<import("./types").PredictionResponse>(
    `/models/${encodeURIComponent(modelId)}/predictions?split=${split}&limit=500`,
    signal,
  );
