# Finance ML Checklist — Week 5

## Temporal integrity
- A feature row is keyed by `(date=t, symbol)`.
- `forward_return_5d` uses adjusted close at t and t+5 only as the target.
- Features never include a negative shift, future factor row, target, realized PnL, or post-t metadata.
- Rows with unavailable factor values or unavailable future label are excluded, not imputed with information from another date.

## Evaluation integrity
- Split dates are chronological and date-disjoint across train, validation and test.
- Five trading dates are purged between train/validation and validation/test because target horizon is five sessions.
- Model family and parameters are selected only from validation metrics.
- Test metrics are reported once after champion selection; test data never controls parameters, feature selection or threshold selection.

## Research integrity
- RMSE, rank IC and directional accuracy are descriptive metrics, not proof of economic value.
- ML ranking uses the existing Week 4 cost-aware engine and benchmarks.
- Fixed universe has survivorship bias; yfinance and adjusted-close execution assumptions remain limitations.
