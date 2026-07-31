from __future__ import annotations

from dataclasses import dataclass

import lightgbm as lgb
import pandas as pd
import xgboost as xgb

from ml.training.evaluate import TARGET_COLUMN, evaluate_predictions
from ml.training.split import TemporalSplit

@dataclass
class TrainedModel:
    family: str
    model: object
    validation_predictions: pd.DataFrame
    test_predictions: pd.DataFrame
    validation_metrics: dict[str, float | None]
    test_metrics: dict[str, float | None]
    parameters: dict[str, object]
    
def _prediction_frame(model: object, frame: pd.DataFrame, features: tuple[str, ...], split: str) -> pd.DataFrame:
    result = frame[["date", "symbol", TARGET_COLUMN]].copy()
    result["prediction"] = model.predict(frame.loc[:, features])
    result["split"] = split
    return result

def train_model_family(family: str, split: TemporalSplit, features: tuple[str, ...]) -> TrainedModel:
    train_valid = split.train.dropna(subset=[TARGET_COLUMN])
    val_valid = split.validation.dropna(subset=[TARGET_COLUMN])
    X_train, y_train = train_valid.loc[:, features], train_valid[TARGET_COLUMN]
    X_validation, y_validation = val_valid.loc[:, features], val_valid[TARGET_COLUMN]
    
    if family == "xgboost":
        parameters = {
            "n_estimators": 500, "max_depth": 3, "learning_rate": 0.02,
            "subsample": 0.8, "colsample_bytree": 0.8, "reg_lambda": 1.0,
            "random_state": 42, "n_jobs": 1, "tree_method": "hist", "device": "cuda",
            "objective": "reg:squarederror", "eval_metric": "rmse", "early_stopping_rounds": 25
        }
        model = xgb.XGBRegressor(**parameters)
        model.fit(X_train, y_train, eval_set=[(X_validation, y_validation)], verbose=False)
        
    elif family == "lightgbm":
        parameters = {
            "n_estimators": 500, "num_leaves": 15, "learning_rate": 0.02,
            "subsample": 0.8, "colsample_bytree": 0.8, "reg_lambda": 1.0,
            "random_state": 42, "n_jobs": 1, "objective": "regression", "device": "gpu"
        }
        model = lgb.LGBMRegressor(**parameters)
        model.fit(X_train, y_train, eval_set=[(X_validation, y_validation)], eval_metric="rmse",
                  callbacks=[lgb.early_stopping(stopping_rounds=25, verbose=False)])
        
    else:
        raise ValueError(f"Unknown model family: {family}")
    
    validation_predictions = _prediction_frame(model, split.validation, features, "validation")
    test_predictions = _prediction_frame(model, split.test, features, "test")
    return TrainedModel(
        family=family, model=model,
        validation_predictions=validation_predictions,
        test_predictions=test_predictions,
        validation_metrics=evaluate_predictions(validation_predictions),
        test_metrics=evaluate_predictions(test_predictions),
        parameters=parameters
    )
    
def train_baseline_models(split: TemporalSplit, feature_columns: tuple[str, ...]) -> dict[str, TrainedModel]:
    return {family: train_model_family(family, split, feature_columns) for family in ("xgboost", "lightgbm")}