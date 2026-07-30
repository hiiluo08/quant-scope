from __future__ import annotations

import pandas as pd

from ml.factors.base import Factor
from ml.factors.momentum import MomentumFactor, LaggedReturnFactor
from ml.factors.technical import RSIFactor, SMARatioFactor
from ml.factors.volatility import VolatilityFactor
from ml.factors.volume import VolumeZScoreFactor
from ml.factors.macd import MACDFactor, MACDSignalFactor
from ml.factors.bollinger import BollingerWidthFactor
from ml.factors.storage import build_factor_frame

class FactorRegistry:
    def __init__(self) -> None:
        self._factors: dict[str, Factor] = {}
        
    def register(self, factor: Factor) -> None:
        if factor.name in self._factors:
            raise ValueError(f"Factor already registered: {factor.name}")
        self._factors[factor.name] = factor
        
    def get(self, name: str) -> Factor:
        try:
            return self._factors[name]
        except KeyError as exc:
            raise KeyError(f"Unknown factor: {name}") from exc
    
    def list_metadata(self) -> list[dict[str, object]]:
        return [self._factors[name].metadata() for name in sorted(self._factors)]
    
    def compute(self, name: str, df: pd.DataFrame) -> pd.DataFrame:
        return build_factor_frame(self.get(name), df)
    
    def compute_all(self, df: pd.DataFrame, names: list[str] | None = None) -> dict[str, pd.DataFrame]:
        selected = names or sorted(self._factors)
        return {name: self.compute(name, df) for name in selected}
    
def build_default_registry() -> FactorRegistry:
    registry = FactorRegistry()
    
    for factor in (
        MomentumFactor(20),
        MomentumFactor(60),
        VolatilityFactor(20),
        RSIFactor(14),
        SMARatioFactor(20, 50),
        VolumeZScoreFactor(20),
        MACDFactor(12, 26),
        MACDSignalFactor(12, 26, 9),
        BollingerWidthFactor(20),
        LaggedReturnFactor(1),
        LaggedReturnFactor(2),
        LaggedReturnFactor(3),
    ):
        registry.register(factor)
        
    return registry