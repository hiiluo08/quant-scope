# QuantScope Week 6 Review — Research Dashboard

## Source and Tools
- **Source revision:** `main`
- **Node version:** `v22.x`
- **Vite version:** `v8.1.5`
- **TypeScript version:** `v5.8.3`
- **Vitest version:** `v4.1.10`
- **Backend framework:** FastAPI + Uvicorn

---

## Commands and Exit Codes

| Command | Actual exit code | Result / Evidence |
|---|---:|---|
| `pytest -q` | `0` | All backend unit and integration tests passed |
| `cd frontend && npm run test` | `0` | **25/25 passed** across 6 test files (`useApi`, `MarketData`, `Factors`, `Backtests`, `MLLab`, `App`) |
| `cd frontend && npm run build` | `0` | `tsc -b && vite build` completed successfully without errors |

---

## API Evidence & Verification

| Endpoint | HTTP status | Count/ID/Version/Rows | NaN/Infinity Check |
|---|---:|---|---|
| `GET /health` | `200` | `status: ok` | Clean |
| `GET /api/v1/market-data/symbols` | `200` | 30 symbols (`SPY`, `AAPL`, ...) | Clean |
| `GET /api/v1/factors` | `200` | 6 factors (`momentum_20d`, `volatility_20d`, ...) | Clean |
| `GET /api/v1/backtests` | `200` | Backtest catalog records (`bt-demo-001`) | Clean |
| `GET /api/v1/models` | `200` | ML Manifest records (`model-demo-001`) | Clean |

---

## Browser Verification & UX Audits

- **Visited Routes:** `/`, `/market-data`, `/factors`, `/backtests`, `/ml`.
- **Route Redirection:** Unknown routes (e.g. `/not-a-route`) redirect cleanly to `/`.
- **Active Navigation:** NavLink automatically sets `aria-current="page"` for active tab.
- **Selector Behavior:** Filter updates immediately trigger new async fetches; previous stale data is cleared during loading.
- **Accessibility:** Visible labels associated with form controls, accessible table captions and header scopes (`th scope="col"`), high contrast text.
- **Responsive Viewport (375px):** Flexible navigation links, wrap-around controls, horizontal scrolling container for data tables (`overflow-x: auto`).
- **Network Traffic:** 100% `GET`-only requests to configured `VITE_API_BASE_URL`. Zero POST/PUT/DELETE mutations or compute requests.

---

## Limitations & Disclaimer

1. **Read-Only Scope:** Dashboard is strictly a read-only research artifact viewer. No compute, factor extraction, or ML model training occurs in the browser.
2. **Timing Model:** PnL and position execution model signal at $t$ and execution at $t+1$ with modeled 5 bps transaction cost and 5 bps slippage.
3. **No Investment Advice:** Historical backtest returns and out-of-sample ML predictions do not constitute investment advice or guarantees of future alpha.

---

## Week 7 Handoff Inputs

- **Frontend Static Build:** `frontend/dist/` ready for S3 / CloudFront deployment.
- **Backend API Server:** FastAPI application ready for Docker containerization on Serverless (Lambda/ECS).
- **Environment Contract:** Public variable `VITE_API_BASE_URL` configurable at build time.
