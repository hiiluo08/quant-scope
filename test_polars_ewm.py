import polars as pl
import numpy as np

df = pl.DataFrame({"symbol": ["A"]*10, "price": np.arange(10, dtype=float)})
res = df.with_columns(
    ema=pl.col("price").ewm_mean(span=3, min_periods=3, ignore_nulls=True).over("symbol")
)
print(res)
