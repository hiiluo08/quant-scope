import pandas as pd
import pytest

from ml.backtesting.metrics import (
    build_equal_weight_benchmark,
    build_spy_benchmark,
    calculate_metrics,
)


def test_metrics_calculate_total_return_drawdown_and_no_non_finite_values():
    daily = pd.DataFrame(
        {
            "date": pd.date_range("2024-01-02", periods=3, freq="B"),
            "net_return": [0.10, -0.20, 0.125],
            "turnover": [1.0, 0.0, 0.5],
            "portfolio_exposure": [1.0, 1.0, 0.5],
            "equity_curve": [1.10, 0.88, 0.99],
        }
    )
    metrics = calculate_metrics(daily, trading_days_per_year=252)

    assert metrics["total_return"] == pytest.approx(-0.01)
    assert metrics["max_drawdown"] == pytest.approx(-0.20)
    assert metrics["average_turnover"] == pytest.approx(0.5)
    assert metrics["average_exposure"] == pytest.approx(5 / 6)
    assert all(value is None or pd.notna(value) for value in metrics.values())


def test_metrics_return_none_for_sharpe_and_calmar_when_undefined():
    daily = pd.DataFrame(
        {
            "date": pd.date_range("2024-01-02", periods=2, freq="B"),
            "net_return": [0.0, 0.0],
            "turnover": [0.0, 0.0],
            "portfolio_exposure": [0.0, 0.0],
            "equity_curve": [1.0, 1.0],
        }
    )
    metrics = calculate_metrics(daily)
    assert metrics["sharpe_ratio"] is None
    assert metrics["calmar_ratio"] is None
    assert metrics["cagr"] == 0.0


def test_spy_benchmark_uses_only_spy_returns(backtest_market_frame):
    benchmark = build_spy_benchmark(backtest_market_frame)
    assert benchmark["net_return"].tolist() == [0.0, 0.0, 0.0, 0.10, 0.0]


def test_equal_weight_benchmark_averages_symbols_each_date(backtest_market_frame):
    benchmark = build_equal_weight_benchmark(backtest_market_frame)
    assert benchmark.loc[1, "net_return"] == pytest.approx(0.005)