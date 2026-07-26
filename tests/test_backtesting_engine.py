import pandas as pd
import pytest

from ml.backtesting.base import BacktestConfig
from ml.backtesting.engine import run_backtest

def _config() -> BacktestConfig:
    return BacktestConfig(
        strategy_name="test_strategy",
        start_date="2024-01-02",
        end_date="2024-01-08",
        transaction_cost_bps=5.0,
        slippage_bps=5.0
    )
    
def test_engine_shifts_signal_before_earning_return(backtest_market_frame):
    signals = backtest_market_frame[["date", "symbol"]].copy()
    signals["signal"] = 0.0
    aaa_first_date = signals.loc[signals["symbol"] == "AAA", "date"].min()
    signals.loc[(signals["symbol"] == "AAA") & (signals["date"] == aaa_first_date), "signal"] = 1.0
    
    result = run_backtest(backtest_market_frame, signals, _config())
    
    first = result.iloc[0]
    second = result.iloc[1]
    
    assert first["gross_return"] == 0.0
    assert second["gross_return"] == pytest.approx(0.01)
    assert second["portfolio_exposure"] == pytest.approx(1.0)
    
def test_engine_equal_weights_active_symbols_and_charges_turnover(backtest_market_frame):
    signals = backtest_market_frame[["date", "symbol"]].copy()
    signals["signal"] = 1.0

    result = run_backtest(backtest_market_frame, signals, _config())

    # First date has no shifted exposure. On second date both symbols enter at 50% each.
    assert result.iloc[0]["portfolio_exposure"] == 0.0
    assert result.iloc[1]["portfolio_exposure"] == pytest.approx(1.0)
    assert result.iloc[1]["turnover"] == pytest.approx(1.0)
    assert result.iloc[1]["transaction_cost"] == pytest.approx(0.001)
    assert result.iloc[1]["gross_return"] == pytest.approx(0.005)
    assert result.iloc[1]["net_return"] == pytest.approx(0.004)


def test_engine_keeps_cash_when_every_shifted_signal_is_zero(backtest_market_frame):
    signals = backtest_market_frame[["date", "symbol"]].copy()
    signals["signal"] = 0.0

    result = run_backtest(backtest_market_frame, signals, _config())

    assert (result["portfolio_exposure"] == 0.0).all()
    assert (result["net_return"] == 0.0).all()
    assert (result["equity_curve"] == 1.0).all()


def test_engine_rejects_signal_dates_not_present_in_market(backtest_market_frame):
    signals = pd.DataFrame(
        {"date": [pd.Timestamp("2030-01-01")], "symbol": ["AAA"], "signal": [1.0]}
    )
    with pytest.raises(ValueError, match="no overlapping"):
        run_backtest(backtest_market_frame, signals, _config())