# QuantScope — Week 5 Review

> **Week 5 Theme:** ML Alpha Prediction  
> **Status:** Completed  
> **Date:** 2026-07-28  

---

## 1. Summary of Completed Tasks

During Week 5, QuantScope built a leakage-controlled machine learning pipeline to predict 5-day forward stock returns using historical technical factors. The pipeline enforces strict temporal separation, date-disjoint splits with embargoes, versioned factor management, native model artifact persistence, and reusable backtesting accounting from Week 4.

Key achievements:
- **Causal Label Generation:** Implemented `ml/features/labels.py` generating `forward_return_5d` per symbol without cross-symbol leakage or target overlap.
- **Versioned Factor Dataset:** Implemented `ml/features/build_dataset.py` joining 6 factor parquet stores (`v1`), ensuring complete-case validation and missing row filtering.
- **Embargoed Temporal Split:** Implemented `ml/training/split.py` creating 60% Train / 20% Validation / 20% Test chronological splits with 5 trading dates purged at boundaries.
- **Model Training & Artifact Persistence:** Implemented `ml/training/train.py` and `ml/training/storage.py` training XGBoost and LightGBM regressors, persisting native model binaries, manifests, and Parquet predictions under deterministic SHA-256 model IDs.
- **Validation Selection & Evaluation:** Implemented `ml/training/evaluate.py` calculating RMSE, MAE, Spearman Rank IC, and Directional Accuracy. Selected LightGBM as champion based on validation RMSE.
- **ML Top-K Rank Strategy & Engine Integration:** Implemented `ml/strategies/ml_ranker.py` and `data_pipeline/jobs/run_ml_pipeline.py`, integrating prediction signals into the Week 4 cost-aware backtesting engine.
- **Read-Only Models API:** Implemented FastAPI routes in `backend/app/api/routes_models.py` offering `GET /api/v1/models`, `GET /api/v1/models/{model_id}`, and `GET /api/v1/models/{model_id}/predictions`.

---

## 2. Verification Evidence

### Test Suite Execution
```bash
/home/hulu/miniconda3/envs/quantscope/bin/pytest -q
```
**Output:**
```text
63 passed, 13 warnings in 3.80s
```

### ML Batch Pipeline Execution
```bash
/home/hulu/miniconda3/envs/quantscope/bin/python -m data_pipeline.jobs.run_ml_pipeline
```
**Output:**
```text
champion=lightgbm
backtest=data/artifacts/backtests/backtest_id=391e0735b5fd7dc5
```

### Artifact Manifest Summary

| Model ID | Family | Validation RMSE | Validation Rank IC | Test RMSE | Test Rank IC | Selected Champion |
|---|---|---|---|---|---|---|
| `8dbd23bf4929e497` | LightGBM | **0.040634** | **0.134766** | 0.037187 | 0.011645 | **Yes** |
| `4150bdf3bd8745d8` | XGBoost | 0.040856 | 0.120399 | 0.037122 | -0.000526 | No |

### Champion Model Backtest Artifact
- **Backtest ID:** `391e0735b5fd7dc5`
- **Strategy Name:** `ml_top_5_rank_v1`
- **Test Period:** 2025-10-29 to 2026-06-23 (162 trading days)
- **Total Return:** +11.87% (vs SPY +7.66%, Equal-Weight +6.25%)
- **Sharpe Ratio:** 0.9702 (vs SPY 0.9097, Equal-Weight 0.9658)
- **Daily Turnover:** 51.48% (with 5 bps commission + 5 bps slippage)

### API Endpoint Verification
```text
GET /api/v1/models -> 200 OK (returns list of 2 model manifests)
GET /api/v1/models/8dbd23bf4929e497 -> 200 OK (returns LightGBM model manifest)
GET /api/v1/models/8dbd23bf4929e497/predictions?split=test&limit=5 -> 200 OK (returns 5 test prediction records)
```

---

## 3. Self-Assessment Matrix

| Criterion | Target Requirement | Implemented Reality | Score (0-2) |
|---|---|---|:---:|
| **Labels** | Grouped causal label + tail test | `build_forward_return_labels` with `groupby("symbol")` and explicit 5-day tail NaN drop | 2 |
| **Dataset** | Six-factor versioned dataset + complete-case evidence | `build_feature_dataset` validates factor versions (`v1`), key uniqueness, drops incomplete rows | 2 |
| **Split** | Date-disjoint 60/20/20 with 5-day embargo | `split_dataset` purges 5 trading dates between Train/Val and Val/Test splits | 2 |
| **Models** | XGBoost + LightGBM same split, fixed params, validation selection | Deterministic training with fixed baseline hyperparams; champion selected on validation RMSE | 2 |
| **Artifacts/API** | Native models, manifests, prediction Parquet, read-only API | Stored native `model.txt`/`model.json`, `manifest.json`, Parquet predictions, FastAPI endpoints | 2 |
| **Backtest/docs** | Top-5 reuses Week 4 contracts + honest evidence/report | Reused Week 4 engine & cost accounting; produced `ml_report_week5.md` & `04_ml_alpha_prediction.ipynb` | 2 |

**Total Score: 12 / 12 (Ready for Week 6 Dashboard)**

---

## 4. Handoff to Week 6

Week 6 will consume the persisted read-only model artifacts and backtests through the FastAPI REST API:
- `GET /api/v1/models` and `GET /api/v1/models/{model_id}` will power the ML Lab UI.
- `GET /api/v1/models/{model_id}/predictions` will display out-of-sample prediction distributions and feature correlations.
- `GET /api/v1/backtests/{backtest_id}` will render equity curves and performance metrics comparing `ml_top_5_rank_v1` against rule-based baselines (`momentum_long_only_v1`, `rsi_mean_reversion_v1`).
