from __future__ import annotations

import math

import pandas as pd

def _safe_ratio(numerator: float, denominator: float) -> float | None:
    if denominator == 0 or not math.isfinite(numerator) or not math.isfinite(denominator):
        return None
    value = numerator / denominator
    return value if math.isfinite(value) else None

def calculate_metrics(daily_results: pd.DataFrame, trading_days_per_year: int = 252) -> dict[str, float | int | None]:
    required = {"net_return", "turnover", "portfolio_exposure", "equity_curve"}
    missing = sorted(required - set(daily_results.columns))
    if missing:
        raise ValueError(f"daily_results is missing required columns: {', '.join(missing)}")
    if daily_results.empty:
        raise ValueError("daily_results must not be empty")
    
    returns = daily_results["net_return"].astype(float)
    equity = daily_results["equity_curve"].astype(float)
    total_return = float(equity.iloc[-1] / equity.iloc[0] * (1 + returns.iloc[0]) - 1)
    periods = len(returns)
    initial_equity = equity.iloc[0] / (1 + returns.iloc[0])
    cagr = float((equity.iloc[-1] / initial_equity) ** (trading_days_per_year / periods) - 1)
    annualized_volatility = float(returns.std(ddof=1) * math.sqrt(trading_days_per_year)) if periods > 1 else 0.0
    sharpe = _safe_ratio(float(returns.mean() * trading_days_per_year), annualized_volatility)
    drawdown = equity / equity.cummax() - 1.0
    max_drawdown = float(drawdown.min())
    calmar = _safe_ratio(cagr, abs(max_drawdown))
    active_returns = returns[daily_results["portfolio_exposure"] > 0]
    win_rate = float((active_returns > 0).mean()) if not active_returns.empty else None
    
    return {
        "total_return": total_return,
        "cagr": cagr,
        "annualized_volatility": annualized_volatility,
        "sharpe_ratio": sharpe,
        "max_drawdown": max_drawdown,
        "calmar_ratio": calmar,
        "win_rate": win_rate,
        "average_exposure": float(daily_results["portfolio_exposure"].mean()),
        "average_turnover": float(daily_results["turnover"].mean()),
        "trading_days": int(periods)
    }
    
def _benchmark_frame(frame: pd.DataFrame) -> pd.DataFrame:
    result = frame[["date", "return_1d"]].copy().sort_values("date").reset_index(drop=True)
    result["gross_return"] = result["return_1d"]
    result["turnover"] = 0.0
    result["transaction_cost"] = 0.0
    result["net_return"] = result["return_1d"]
    result["portfolio_exposure"] = 1.0
    result["equity_curve"] = (1.0 + result["net_return"]).cumprod()
    return result.drop(columns="return_1d")

def build_spy_benchmark(market_data: pd.DataFrame) -> pd.DataFrame:
    spy = market_data[market_data["symbol"] == "SPY"]
    if spy.empty:
        raise ValueError("SPY benchmark requires SPY market data")
    return _benchmark_frame(spy)

def build_equal_weight_benchmark(market_data: pd.DataFrame) -> pd.DataFrame:
    average_returns = market_data.groupby("date", as_index=False)["return_1d"].mean()
    return _benchmark_frame(average_returns)