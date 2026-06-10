# QuantScope â€” Week 1 Detailed Plan

> Source roadmap: [QUANTSCOPE_8_WEEK_PLAN.md](QUANTSCOPE_8_WEEK_PLAN.md)  
> Week 1 theme: **Quant foundations + project setup**  
> Main goal: hiá»ƒu dá»¯ liá»‡u thá»‹ trÆ°á»ng cÆ¡ báº£n, hiá»ƒu tÆ° duy factor/backtest á»Ÿ má»©c Ä‘á»§ Ä‘á»ƒ code, vÃ  dá»±ng ná»n mÃ³ng repository cho QuantScope.

---

## 0. Má»¥c tiÃªu cá»§a Week 1

Week 1 khÃ´ng nháº±m xÃ¢y feature lá»›n. Tuáº§n nÃ y nháº±m táº¡o **ná»n mÃ³ng Ä‘Ãºng** Ä‘á»ƒ cÃ¡c tuáº§n sau khÃ´ng bá»‹ rá»‘i.

Sau Week 1, báº¡n cáº§n Ä‘áº¡t Ä‘Æ°á»£c 5 káº¿t quáº£:

1. CÃ³ repo QuantScope vá»›i cáº¥u trÃºc rÃµ rÃ ng.
2. CÃ³ mÃ´i trÆ°á»ng Python cháº¡y Ä‘Æ°á»£c notebook vÃ  script cÆ¡ báº£n.
3. Hiá»ƒu cÃ¡c khÃ¡i niá»‡m Quant tá»‘i thiá»ƒu: OHLCV, adjusted close, return, log return, factor, signal, alpha, label, backtest.
4. Táº£i thá»­ Ä‘Æ°á»£c dá»¯ liá»‡u thá»‹ trÆ°á»ng cho má»™t sá»‘ ticker máº«u.
5. CÃ³ tÃ i liá»‡u ban Ä‘áº§u: project scope, data schema draft, quant notes.

---

## 1. Definition of Done cho Week 1

Week 1 Ä‘Æ°á»£c xem lÃ  hoÃ n thÃ nh khi cÃ³ Ä‘á»§ cÃ¡c file/tÃ i liá»‡u sau:

```text
quant-scope/
â”œâ”€â”€ README.md
â”œâ”€â”€ pyproject.toml hoáº·c requirements.txt
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ QUANTSCOPE_8_WEEK_PLAN.md
â”‚   â”œâ”€â”€ QUANTSCOPE_WEEK_1_DETAILED_PLAN.md
â”‚   â”œâ”€â”€ project_scope.md
â”‚   â”œâ”€â”€ quant_notes_week1.md
â”‚   â””â”€â”€ data_schema.md
â”œâ”€â”€ notebooks/
â”‚   â””â”€â”€ 01_market_data_basics.ipynb
â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ raw/          # ignored by git
â”‚   â””â”€â”€ processed/    # ignored by git
â”œâ”€â”€ data_pipeline/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ backend/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ ml/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ frontend/
â”‚   â””â”€â”€ README.md
â””â”€â”€ scripts/
    â””â”€â”€ README.md
```

Checklist cuá»‘i tuáº§n:

- [ ] Má»Ÿ repo trÃªn VS Code tháº¥y cáº¥u trÃºc thÆ° má»¥c rÃµ rÃ ng.
- [ ] CÃ i Ä‘Æ°á»£c Python dependencies.
- [ ] Cháº¡y Ä‘Æ°á»£c notebook `01_market_data_basics.ipynb`.
- [ ] Notebook táº£i Ä‘Æ°á»£c dá»¯ liá»‡u máº«u 5 tickers.
- [ ] Notebook tÃ­nh Ä‘Æ°á»£c simple return vÃ  log return.
- [ ] CÃ³ biá»ƒu Ä‘á»“ giÃ¡ Ä‘Æ¡n giáº£n cho Ã­t nháº¥t 1 ticker.
- [ ] CÃ³ docs giáº£i thÃ­ch project scope.
- [ ] CÃ³ docs giáº£i thÃ­ch data schema draft.
- [ ] CÃ³ docs ghi láº¡i kiáº¿n thá»©c Quant Ä‘Ã£ há»c.
- [ ] KhÃ´ng commit data lá»›n, API key, file `.env`, notebook output quÃ¡ náº·ng.

---

## 2. Giáº£ Ä‘á»‹nh thá»i gian

Káº¿ hoáº¡ch nÃ y giáº£ Ä‘á»‹nh báº¡n há»c/lÃ m **2â€“4 giá» má»—i ngÃ y** trong 7 ngÃ y.

Náº¿u báº¡n báº­n, Æ°u tiÃªn cÃ¡c ngÃ y cÃ³ nhÃ£n **Core**:

- Day 1: Repo + scope.
- Day 2: Market data basics.
- Day 3: Factor/signal/alpha/label.
- Day 5: Táº£i dá»¯ liá»‡u máº«u.

CÃ¡c ngÃ y cÃ²n láº¡i giÃºp dá»± Ã¡n sáº¡ch vÃ  chuyÃªn nghiá»‡p hÆ¡n.

---

## 3. Lá»‹ch tá»•ng quan Week 1

| NgÃ y | Chá»§ Ä‘á» | Loáº¡i | Output chÃ­nh |
|---|---|---|---|
| Day 1 | Project scope + repo skeleton | Core | README draft, folder structure, project scope |
| Day 2 | OHLCV, adjusted close, returns | Core | Quant notes + notebook skeleton |
| Day 3 | Factor, alpha, signal, label | Core | Factor taxonomy + target label notes |
| Day 4 | Python env + Docker/dev tooling | Support | Dependencies, `.env.example`, dev scripts |
| Day 5 | Download sample market data | Core | Notebook táº£i dá»¯ liá»‡u 5 tickers |
| Day 6 | Data schema design | Support | `docs/data_schema.md` |
| Day 7 | Review + GitHub cleanup | Support | Week 1 review, README updated, commit summary |

---

# Day 1 â€” Core: Project scope + repository skeleton

## Má»¥c tiÃªu

Biáº¿n Ã½ tÆ°á»Ÿng QuantScope thÃ nh má»™t repo cÃ³ Ä‘á»‹nh hÆ°á»›ng rÃµ rÃ ng. NgÃ y nÃ y khÃ´ng cáº§n code phá»©c táº¡p. Má»¥c tiÃªu lÃ  trÃ¡nh scope creep ngay tá»« Ä‘áº§u.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**3 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 45 phÃºt | Viáº¿t láº¡i problem statement vÃ  MVP scope |
| Block 2 | 60 phÃºt | Táº¡o cáº¥u trÃºc thÆ° má»¥c repo |
| Block 3 | 45 phÃºt | Viáº¿t README draft |
| Block 4 | 30 phÃºt | Viáº¿t checklist vÃ  commit plan |

## Nhiá»‡m vá»¥ chi tiáº¿t

### 1. Viáº¿t problem statement

Táº¡o file:

```text
docs/project_scope.md
```

Ná»™i dung nÃªn tráº£ lá»i 6 cÃ¢u há»i:

1. QuantScope lÃ  gÃ¬?
2. NgÆ°á»i dÃ¹ng má»¥c tiÃªu lÃ  ai?
3. Dá»± Ã¡n giáº£i quyáº¿t váº¥n Ä‘á» gÃ¬?
4. MVP gá»“m nhá»¯ng gÃ¬?
5. Dá»± Ã¡n khÃ´ng lÃ m gÃ¬ trong 8 tuáº§n?
6. ThÃ nh cÃ´ng Ä‘Æ°á»£c Ä‘o báº±ng tiÃªu chÃ­ nÃ o?

Gá»£i Ã½ ná»™i dung:

```markdown
# QuantScope Project Scope

QuantScope is an AI-powered quant research platform for learning quantitative trading through a practical software project.

## Target user

The target user is a beginner quant learner with programming and machine learning background.

## MVP

- Market data ingestion
- Factor computation
- Rule-based backtesting
- ML alpha prediction
- Dashboard
- Low-cost AWS deployment

## Non-goals

- Real-money trading
- High-frequency trading
- Paid market data integration
- Complex deep learning models
```

### 2. Táº¡o cáº¥u trÃºc thÆ° má»¥c ban Ä‘áº§u

Táº¡o cÃ¡c thÆ° má»¥c:

```text
backend/
frontend/
ml/
data_pipeline/
infra/
docs/
notebooks/
scripts/
tests/
data/raw/
data/processed/
```

Náº¿u chÆ°a code gÃ¬, má»—i thÆ° má»¥c chÃ­nh nÃªn cÃ³ `README.md` ngáº¯n Ä‘á»ƒ giáº£i thÃ­ch vai trÃ².

VÃ­ dá»¥ `ml/README.md`:

```markdown
# ML

This directory contains factor computation, feature engineering, backtesting, model training, and inference code.
```

### 3. Viáº¿t README draft

Táº¡o hoáº·c cáº­p nháº­t:

```text
README.md
```

README Week 1 chÆ°a cáº§n hoÃ n háº£o. NÃ³ cáº§n cÃ³:

```markdown
# QuantScope

AI-Powered Quant Research Platform.

## Goal

Build a practical quant research platform to learn market data processing, factor research, backtesting, ML alpha prediction, and low-cost AWS deployment.

## Planned features

- Market data ingestion
- Factor engine
- Backtesting engine
- ML alpha prediction
- React dashboard
- AWS deployment with S3, Lambda, EC2

## Tech stack

- Python
- FastAPI
- pandas / NumPy
- XGBoost or LightGBM
- React
- AWS S3 / Lambda / EC2

## Project status

Week 1: Quant foundations and repository setup.
```

### 4. Táº¡o `.gitignore`

Báº¯t buá»™c ignore:

```gitignore
# Python
__pycache__/
*.py[cod]
.venv/
venv/
.env
.env.*
!.env.example

# Jupyter
.ipynb_checkpoints/

# Data
/data/raw/
/data/processed/
*.parquet
*.csv
*.sqlite
*.db

# Node / frontend
node_modules/
dist/
build/

# OS / IDE
.DS_Store
.vscode/
```

### 5. Táº¡o `.env.example`

```env
APP_ENV=development
AWS_REGION=us-east-1
S3_BUCKET_NAME=quantscope-dev-bucket
DATABASE_URL=sqlite:///./quantscope.db
```

KhÃ´ng bao giá» commit `.env` tháº­t.

## Deliverables Day 1

- [x] `README.md`
- [x] `docs/project_scope.md`
- [x] `.gitignore`
- [x] `.env.example`
- [x] Folder skeleton
- [ ] README ngáº¯n trong cÃ¡c folder chÃ­nh

## TiÃªu chÃ­ hoÃ n thÃ nh Day 1

Báº¡n cÃ³ thá»ƒ giáº£i thÃ­ch dá»± Ã¡n trong 60 giÃ¢y:

> QuantScope lÃ  má»™t ná»n táº£ng nghiÃªn cá»©u Quant giÃºp táº£i dá»¯ liá»‡u thá»‹ trÆ°á»ng, táº¡o factor, backtest chiáº¿n lÆ°á»£c, train ML model dá»± Ä‘oÃ¡n alpha vÃ  deploy lÃªn AWS chi phÃ­ tháº¥p.

## Commit gá»£i Ã½

```bash
git add README.md .gitignore .env.example docs/project_scope.md backend/README.md frontend/README.md ml/README.md data_pipeline/README.md infra/README.md scripts/README.md
git commit -m "chore: initialize quant-scope project structure"
```

Náº¿u repo chÆ°a dÃ¹ng git, bá» qua commit vÃ  chá»‰ ghi láº¡i trong `docs/week1_review.md`.

---

# Day 2 â€” Core: Market data basics

## Má»¥c tiÃªu

Hiá»ƒu dá»¯ liá»‡u OHLCV vÃ  return. ÄÃ¢y lÃ  ná»n táº£ng cho má»i factor, backtest vÃ  ML model sau nÃ y.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**3 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 45 phÃºt | Há»c OHLCV vÃ  adjusted close |
| Block 2 | 45 phÃºt | Há»c simple return vÃ  log return |
| Block 3 | 60 phÃºt | Táº¡o notebook skeleton |
| Block 4 | 30 phÃºt | Ghi quant notes |

## Kiáº¿n thá»©c cáº§n há»c

### OHLCV

| Field | Ã nghÄ©a | VÃ¬ sao quan trá»ng |
|---|---|---|
| Open | GiÃ¡ má»Ÿ cá»­a | DÃ¹ng Ä‘á»ƒ mÃ´ phá»ng entry náº¿u trade Ä‘áº§u ngÃ y |
| High | GiÃ¡ cao nháº¥t trong ngÃ y | DÃ¹ng cho range, volatility, risk |
| Low | GiÃ¡ tháº¥p nháº¥t trong ngÃ y | DÃ¹ng cho drawdown intraday hoáº·c risk |
| Close | GiÃ¡ Ä‘Ã³ng cá»­a | Dá»¯ liá»‡u phá»• biáº¿n nháº¥t Ä‘á»ƒ tÃ­nh return |
| Adjusted Close | GiÃ¡ Ä‘Ã£ Ä‘iá»u chá»‰nh split/dividend | NÃªn dÃ¹ng cho long-term return |
| Volume | Khá»‘i lÆ°á»£ng giao dá»‹ch | DÃ¹ng cho liquidity/attention factor |

### Simple return

```text
return_t = price_t / price_{t-1} - 1
```

VÃ­ dá»¥:

```text
price yesterday = 100
price today = 105
return = 105 / 100 - 1 = 0.05 = 5%
```

### Log return

```text
log_return_t = log(price_t / price_{t-1})
```

Log return há»¯u Ã­ch vÃ¬ dá»… cá»™ng dá»“n theo thá»i gian, nhÆ°ng trong MVP báº¡n cÃ³ thá»ƒ dÃ¹ng simple return cho dá»… hiá»ƒu.

## Nhiá»‡m vá»¥ chi tiáº¿t

### 1. Táº¡o notebook

Táº¡o file:

```text
notebooks/01_market_data_basics.ipynb
```

Notebook nÃªn cÃ³ cÃ¡c section:

```markdown
# 01 Market Data Basics

## Goal

Understand OHLCV data, adjusted close, simple returns, and log returns.

## Concepts

- OHLCV
- Adjusted close
- Simple return
- Log return
- Missing data

## Experiments

- Load sample price data
- Compute returns
- Plot close price
- Plot return distribution
```

### 2. Viáº¿t pseudo-code trÆ°á»›c

Trong notebook, viáº¿t pseudo-code trÆ°á»›c khi cháº¡y data tháº­t:

```python
# Given a price series:
# 1. Sort by date
# 2. Compute simple return with pct_change()
# 3. Compute log return with np.log(price / price.shift(1))
# 4. Check missing values
# 5. Plot close price and returns
```

### 3. Táº¡o file notes

Táº¡o file:

```text
docs/quant_notes_week1.md
```

Ná»™i dung Day 2:

```markdown
# Quant Notes â€” Week 1

## OHLCV

OHLCV stands for Open, High, Low, Close, Volume.

## Adjusted Close

Adjusted close should be preferred for long-term return calculation because it accounts for stock splits and dividends.

## Return

Return measures percentage change in price.

## Log Return

Log return uses the natural log of price ratio. It is useful for additive time-series calculations.
```

## Deliverables Day 2

- [ ] `notebooks/01_market_data_basics.ipynb`
- [ ] `docs/quant_notes_week1.md`
- [ ] Notebook cÃ³ section rÃµ rÃ ng dÃ¹ chÆ°a táº£i data tháº­t
- [ ] Báº¡n tá»± tÃ­nh Ä‘Æ°á»£c return báº±ng tay cho 2 giÃ¡ báº¥t ká»³

## TiÃªu chÃ­ hoÃ n thÃ nh Day 2

Báº¡n cáº§n tráº£ lá»i Ä‘Æ°á»£c:

1. VÃ¬ sao adjusted close thÆ°á»ng tá»‘t hÆ¡n close cho backtest dÃ i háº¡n?
2. Return khÃ¡c price nhÆ° tháº¿ nÃ o?
3. VÃ¬ sao khÃ´ng Ä‘Æ°á»£c tÃ­nh return náº¿u dá»¯ liá»‡u chÆ°a sort theo date?
4. Missing data cÃ³ thá»ƒ lÃ m sai backtest nhÆ° tháº¿ nÃ o?

## Commit gá»£i Ã½

```bash
git add notebooks/01_market_data_basics.ipynb docs/quant_notes_week1.md
git commit -m "notebook: add market data basics outline"
```

---

# Day 3 â€” Core: Factor, alpha, signal, label

## Má»¥c tiÃªu

Hiá»ƒu cÃ¡c khÃ¡i niá»‡m sáº½ xuáº¥t hiá»‡n xuyÃªn suá»‘t dá»± Ã¡n: factor, alpha, signal, label. ÄÃ¢y lÃ  Ä‘iá»ƒm ná»‘i giá»¯a Quant vÃ  Machine Learning.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**3 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 45 phÃºt | Há»c factor vÃ  alpha |
| Block 2 | 45 phÃºt | Há»c signal vÃ  position |
| Block 3 | 45 phÃºt | Há»c ML label trong finance |
| Block 4 | 45 phÃºt | Viáº¿t taxonomy vÃ  vÃ­ dá»¥ |

## KhÃ¡i niá»‡m cáº§n náº¯m

### Factor

Factor lÃ  má»™t biáº¿n Ä‘á»‹nh lÆ°á»£ng Ä‘Æ°á»£c tÃ­nh tá»« dá»¯ liá»‡u thá»‹ trÆ°á»ng hoáº·c dá»¯ liá»‡u khÃ¡c, dÃ¹ng Ä‘á»ƒ giáº£i thÃ­ch hoáº·c dá»± Ä‘oÃ¡n return/risk.

VÃ­ dá»¥:

```text
momentum_20d = close_today / close_20_days_ago - 1
```

Náº¿u `momentum_20d` cao, ta giáº£ Ä‘á»‹nh tÃ i sáº£n Ä‘ang cÃ³ xu hÆ°á»›ng tÄƒng.

### Alpha

Alpha lÃ  pháº§n lá»£i nhuáº­n vÆ°á»£t trá»™i so vá»›i benchmark hoáº·c so vá»›i rá»§i ro Ä‘Ã£ nháº­n.

Trong dá»± Ã¡n nÃ y, hiá»ƒu Ä‘Æ¡n giáº£n:

```text
alpha = tÃ­n hiá»‡u cÃ³ thá»ƒ giÃºp strategy tá»‘t hÆ¡n benchmark
```

KhÃ´ng cáº§n há»c mÃ´ hÃ¬nh CAPM sÃ¢u trong Week 1.

### Signal

Signal lÃ  quyáº¿t Ä‘á»‹nh Ä‘Æ°á»£c sinh ra tá»« factor.

VÃ­ dá»¥:

```text
if momentum_20d > 0:
    signal = 1  # long
else:
    signal = 0  # no position
```

### Position

Position lÃ  tráº¡ng thÃ¡i giao dá»‹ch thá»±c táº¿ sau khi dÃ¹ng signal.

Quy táº¯c quan trá»ng:

```text
factor ngÃ y t -> signal ngÃ y t -> position Ã¡p dá»¥ng tá»« ngÃ y t+1
```

Náº¿u khÃ´ng shift sang ngÃ y tiáº¿p theo, báº¡n dá»… bá»‹ look-ahead bias.

### Label

Label lÃ  target cho ML model.

VÃ­ dá»¥:

```text
forward_return_5d = close_{t+5} / close_t - 1
```

Model sáº½ há»c:

```text
features at day t -> predict forward_return_5d
```

## Nhiá»‡m vá»¥ chi tiáº¿t

### 1. Cáº­p nháº­t `docs/quant_notes_week1.md`

ThÃªm section:

```markdown
## Factor

A factor is a numerical signal computed from market data or alternative data.

Examples:
- 20-day momentum
- 20-day volatility
- RSI
- Moving average ratio
- Volume z-score

## Signal

A signal converts factor values into trading intent.

## Label

A label is the future outcome that an ML model tries to predict.
```

### 2. Táº¡o factor taxonomy

ThÃªm báº£ng:

| Factor type | VÃ­ dá»¥ | Input | Má»¥c Ä‘Ã­ch |
|---|---|---|---|
| Momentum | 20d return | close/adjusted close | Báº¯t xu hÆ°á»›ng |
| Volatility | rolling std | returns | Äo rá»§i ro |
| Mean reversion | RSI | close | TÃ¬m tráº¡ng thÃ¡i quÃ¡ mua/quÃ¡ bÃ¡n |
| Volume | volume z-score | volume | Äo attention/liquidity |
| Trend | SMA ratio | close | Äo xu hÆ°á»›ng ngáº¯n/dÃ i háº¡n |

### 3. Viáº¿t vÃ­ dá»¥ factor -> signal -> position

Trong notes:

```text
Example:

Day t:
- close = 105
- close 20 days ago = 100
- momentum_20d = 5%
- signal_t = 1 because momentum_20d > 0

Day t+1:
- apply position = 1
- compute PnL using return_{t+1}
```

### 4. Táº¡o sÆ¡ Ä‘á»“ tÆ° duy Ä‘Æ¡n giáº£n

```text
Market Data
    |
    v
Factor
    |
    v
Signal
    |
    v
Position
    |
    v
PnL / Backtest Metrics
```

ML flow:

```text
Market Data
    |
    v
Factors / Features at t
    |
    v
ML Model
    |
    v
Predict future return
    |
    v
Ranking / Trading Signal
```

## Deliverables Day 3

- [ ] `docs/quant_notes_week1.md` cÃ³ factor taxonomy
- [ ] CÃ³ vÃ­ dá»¥ factor -> signal -> position
- [ ] CÃ³ Ä‘á»‹nh nghÄ©a label cho ML
- [ ] Báº¡n phÃ¢n biá»‡t Ä‘Æ°á»£c factor vÃ  label

## TiÃªu chÃ­ hoÃ n thÃ nh Day 3

Báº¡n cáº§n tráº£ lá»i Ä‘Æ°á»£c:

1. Factor khÃ¡c signal nhÆ° tháº¿ nÃ o?
2. Signal khÃ¡c position nhÆ° tháº¿ nÃ o?
3. Label trong ML finance lÃ  gÃ¬?
4. VÃ¬ sao factor ngÃ y `t` khÃ´ng Ä‘Æ°á»£c dÃ¹ng Ä‘á»ƒ trade chÃ­nh ngÃ y `t` náº¿u dÃ¹ng close price ngÃ y `t`?

## Commit gá»£i Ã½

```bash
git add docs/quant_notes_week1.md
git commit -m "docs: add factor signal and label notes"
```

---

# Day 4 â€” Support: Python environment + dev tooling

## Má»¥c tiÃªu

Dá»±ng mÃ´i trÆ°á»ng dev Ä‘á»§ á»•n Ä‘á»ƒ cÃ¡c tuáº§n sau code nhanh. KhÃ´ng over-engineer. Chá»‰ cáº§n Python stack cháº¡y notebook vÃ  data analysis tá»‘t.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**2â€“3 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 45 phÃºt | Chá»n dependency manager |
| Block 2 | 45 phÃºt | Táº¡o dependencies file |
| Block 3 | 45 phÃºt | Táº¡o scripts hÆ°á»›ng dáº«n cháº¡y |
| Block 4 | 30 phÃºt | Kiá»ƒm tra mÃ´i trÆ°á»ng |

## Khuyáº¿n nghá»‹ tooling

Chá»n má»™t trong hai cÃ¡ch:

### Option A: `requirements.txt`, dá»… nháº¥t

PhÃ¹ há»£p náº¿u báº¡n muá»‘n Ä‘Æ¡n giáº£n.

```text
pandas
numpy
matplotlib
seaborn
jupyter
notebook
ipykernel
yfinance
pyarrow
fastapi
uvicorn[standard]
pydantic
python-dotenv
boto3
scikit-learn
xgboost
pytest
```

### Option B: `pyproject.toml`, chuyÃªn nghiá»‡p hÆ¡n

PhÃ¹ há»£p náº¿u báº¡n quen package management hiá»‡n Ä‘áº¡i.

Week 1 cÃ³ thá»ƒ dÃ¹ng `requirements.txt` trÆ°á»›c. Khi dá»± Ã¡n á»•n hÆ¡n, chuyá»ƒn sang `pyproject.toml` sau cÅ©ng Ä‘Æ°á»£c.

## Nhiá»‡m vá»¥ chi tiáº¿t

### 1. Táº¡o `requirements.txt`

Táº¡o file:

```text
requirements.txt
```

Ná»™i dung khuyáº¿n nghá»‹ Week 1:

```txt
pandas>=2.2
numpy>=1.26
matplotlib>=3.8
seaborn>=0.13
jupyter>=1.0
notebook>=7.0
ipykernel>=6.29
yfinance>=0.2
pyarrow>=15.0
python-dotenv>=1.0
pytest>=8.0
```

ChÆ°a cáº§n cÃ i háº¿t FastAPI/XGBoost á»Ÿ Week 1 náº¿u muá»‘n nháº¹. NhÆ°ng cÃ³ thá»ƒ thÃªm trÆ°á»›c náº¿u mÃ¡y á»•n.

### 2. Táº¡o hÆ°á»›ng dáº«n setup trong README

ThÃªm vÃ o `README.md`:

```markdown
## Local setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m ipykernel install --user --name alphaforge
jupyter notebook
```
```

TrÃªn Windows PowerShell, activate báº±ng:

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Táº¡o `scripts/README.md`

```markdown
# Scripts

This directory will contain helper scripts for local development, data sync, and deployment.

Planned scripts:

- run_backend.ps1
- run_frontend.ps1
- sync_s3.ps1
```

### 4. Optional: Docker note

Week 1 chÆ°a cáº§n Dockerfile hoÃ n chá»‰nh. Chá»‰ cáº§n note:

```text
Docker will be added when FastAPI backend is ready.
```

LÃ½ do: náº¿u viáº¿t Docker quÃ¡ sá»›m, báº¡n sáº½ máº¥t thá»i gian debug environment thay vÃ¬ há»c Quant.

## Deliverables Day 4

- [ ] `requirements.txt`
- [ ] README cÃ³ local setup instructions
- [ ] `scripts/README.md`
- [ ] Python virtual environment cháº¡y Ä‘Æ°á»£c
- [ ] Jupyter kernel `alphaforge` hoáº¡t Ä‘á»™ng

## TiÃªu chÃ­ hoÃ n thÃ nh Day 4

Cháº¡y Ä‘Æ°á»£c:

```bash
python -c "import pandas, numpy, yfinance; print('ok')"
```

Káº¿t quáº£ mong Ä‘á»£i:

```text
ok
```

## Commit gá»£i Ã½

```bash
git add requirements.txt README.md scripts/README.md
git commit -m "chore: add python development setup"
```

---

# Day 5 â€” Core: Download sample market data

## Má»¥c tiÃªu

Táº£i dá»¯ liá»‡u tháº­t tá»« nguá»“n miá»…n phÃ­ vÃ  tÃ­nh return cÆ¡ báº£n. ÄÃ¢y lÃ  ngÃ y Ä‘áº§u tiÃªn báº¡n tháº¥y QuantScope xá»­ lÃ½ dá»¯ liá»‡u thá»‹ trÆ°á»ng tháº­t.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**3 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 30 phÃºt | Chá»n ticker sample |
| Block 2 | 60 phÃºt | Táº£i data báº±ng yfinance |
| Block 3 | 60 phÃºt | TÃ­nh return vÃ  plot |
| Block 4 | 30 phÃºt | LÆ°u sample data local vÃ  ghi nháº­n váº¥n Ä‘á» |

## Tickers khuyáº¿n nghá»‹

DÃ¹ng 5 ticker Ä‘áº¡i diá»‡n, dá»… hiá»ƒu:

| Ticker | Loáº¡i | LÃ½ do chá»n |
|---|---|---|
| SPY | ETF | Benchmark thá»‹ trÆ°á»ng Má»¹ |
| QQQ | ETF | Nasdaq/tech-heavy benchmark |
| AAPL | Stock | Large-cap tech |
| MSFT | Stock | Large-cap tech |
| TSLA | Stock | Volatility cao, dá»… quan sÃ¡t |

Náº¿u yfinance lá»—i, thay báº±ng:

```text
SPY, QQQ, DIA, IWM, GLD
```

## Notebook tasks

Trong `notebooks/01_market_data_basics.ipynb`, thÃªm code theo flow:

### 1. Imports

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf
```

### 2. Download data

```python
tickers = ["SPY", "QQQ", "AAPL", "MSFT", "TSLA"]
start_date = "2018-01-01"
end_date = "2025-12-31"

data = yf.download(tickers, start=start_date, end=end_date, auto_adjust=False)
```

### 3. Inspect data

```python
data.head()
data.tail()
data.info()
```

Kiá»ƒm tra:

- CÃ³ bao nhiÃªu rows?
- Columns lÃ  MultiIndex hay flat?
- CÃ³ missing values khÃ´ng?

### 4. Extract adjusted close

```python
adj_close = data["Adj Close"]
adj_close.head()
```

### 5. Compute returns

```python
simple_returns = adj_close.pct_change()
log_returns = np.log(adj_close / adj_close.shift(1))
```

### 6. Plot price

```python
adj_close["SPY"].plot(figsize=(12, 5), title="SPY Adjusted Close")
plt.show()
```

### 7. Plot returns distribution

```python
simple_returns["SPY"].dropna().hist(bins=50, figsize=(10, 4))
plt.title("SPY Daily Return Distribution")
plt.show()
```

### 8. Save sample data

```python
raw_path = "../data/raw/week1_sample_prices.parquet"
adj_close.to_parquet(raw_path)
```

LÆ°u Ã½: file parquet trong `data/raw/` pháº£i Ä‘Æ°á»£c `.gitignore`, khÃ´ng commit.

## Ghi chÃº cáº§n viáº¿t trong notebook

Sau khi cháº¡y, ghi markdown answers:

1. Dá»¯ liá»‡u cÃ³ missing values khÃ´ng?
2. Ticker nÃ o biáº¿n Ä‘á»™ng máº¡nh nháº¥t theo daily return std?
3. SPY vÃ  QQQ cÃ³ pattern giá»‘ng nhau khÃ´ng?
4. VÃ¬ sao TSLA return distribution rá»™ng hÆ¡n SPY?

## Mini-analysis cáº§n cÃ³

TÃ­nh volatility Ä‘Æ¡n giáº£n:

```python
daily_vol = simple_returns.std()
annualized_vol = daily_vol * np.sqrt(252)
annualized_vol.sort_values(ascending=False)
```

TÃ­nh cumulative return:

```python
cumulative_returns = (1 + simple_returns.fillna(0)).cumprod() - 1
cumulative_returns.plot(figsize=(12, 5), title="Cumulative Returns")
plt.show()
```

## Deliverables Day 5

- [ ] Notebook táº£i data 5 tickers thÃ nh cÃ´ng
- [ ] TÃ­nh simple return
- [ ] TÃ­nh log return
- [ ] Plot adjusted close
- [ ] Plot return distribution
- [ ] TÃ­nh annualized volatility
- [ ] Plot cumulative returns
- [ ] LÆ°u sample parquet local, khÃ´ng commit data

## TiÃªu chÃ­ hoÃ n thÃ nh Day 5

Báº¡n cáº§n giáº£i thÃ­ch Ä‘Æ°á»£c:

1. Ticker nÃ o cÃ³ volatility cao nháº¥t trong sample?
2. Return distribution cÃ³ centered quanh 0 khÃ´ng?
3. Cumulative return cho tháº¥y Ä‘iá»u gÃ¬?
4. Data source miá»…n phÃ­ cÃ³ rá»§i ro gÃ¬?

## Commit gá»£i Ã½

```bash
git add notebooks/01_market_data_basics.ipynb
git commit -m "notebook: download sample market data and compute returns"
```

KhÃ´ng commit:

```text
data/raw/week1_sample_prices.parquet
```

---

# Day 6 â€” Support: Data schema design

## Má»¥c tiÃªu

Thiáº¿t káº¿ schema dá»¯ liá»‡u trÆ°á»›c khi viáº¿t data pipeline á»Ÿ Week 2. Náº¿u schema rÃµ tá»« Ä‘áº§u, Week 2 sáº½ dá»… hÆ¡n nhiá»u.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**2 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 30 phÃºt | XÃ¡c Ä‘á»‹nh raw schema |
| Block 2 | 30 phÃºt | XÃ¡c Ä‘á»‹nh processed schema |
| Block 3 | 30 phÃºt | XÃ¡c Ä‘á»‹nh factor/result schema draft |
| Block 4 | 30 phÃºt | Viáº¿t naming convention |

## File cáº§n táº¡o

```text
docs/data_schema.md
```

## Ná»™i dung Ä‘á» xuáº¥t

### 1. Data storage philosophy

```markdown
# Data Schema

QuantScope stores market data in three layers:

1. Raw data: original downloaded OHLCV data.
2. Processed data: normalized schema used by factors and backtests.
3. Research artifacts: factors, labels, model predictions, backtest results.
```

### 2. Raw OHLCV schema

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Trading date, format YYYY-MM-DD |
| symbol | string | SPY | Uppercase ticker |
| open | float | 584.23 | Raw open price |
| high | float | 586.10 | Raw high price |
| low | float | 580.50 | Raw low price |
| close | float | 582.90 | Raw close price |
| adjusted_close | float | 582.90 | Adjusted for split/dividend if available |
| volume | integer | 52300000 | Daily volume |
| source | string | yfinance | Data provider |
| ingested_at | datetime | 2026-06-10T10:30:00Z | UTC ingestion time |

### 3. Processed OHLCV schema

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Trading date |
| symbol | string | SPY | Uppercase ticker |
| adjusted_close | float | 582.90 | Main price for returns |
| volume | integer | 52300000 | Daily volume |
| return_1d | float | 0.0123 | Simple daily return |
| log_return_1d | float | 0.0122 | Log daily return |
| is_valid | boolean | true | Data quality flag |

### 4. Factor schema draft

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Factor date |
| symbol | string | SPY | Ticker |
| factor_name | string | momentum_20d | Factor identifier |
| factor_value | float | 0.052 | Raw factor value |
| factor_version | string | v1 | Version for reproducibility |
| computed_at | datetime | 2026-06-10T12:00:00Z | UTC computation time |

### 5. Label schema draft

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Feature date |
| symbol | string | SPY | Ticker |
| label_name | string | forward_return_5d | Label identifier |
| label_value | float | 0.018 | Future return |
| horizon_days | integer | 5 | Prediction horizon |

### 6. File layout draft

```text
data/
â”œâ”€â”€ raw/
â”‚   â””â”€â”€ source=yfinance/
â”‚       â””â”€â”€ prices_YYYYMMDD.parquet
â”œâ”€â”€ processed/
â”‚   â””â”€â”€ ohlcv_daily.parquet
â”œâ”€â”€ factors/
â”‚   â””â”€â”€ factor_name=momentum_20d/
â”‚       â””â”€â”€ values.parquet
â””â”€â”€ artifacts/
    â”œâ”€â”€ models/
    â””â”€â”€ backtests/
```

### 7. Date/time convention

```markdown
## Date and time conventions

- Trading dates use `YYYY-MM-DD`.
- Timestamps use UTC ISO 8601, for example `2026-06-10T12:00:00Z`.
- The project avoids timezone-aware intraday data in MVP.
```

## Deliverables Day 6

- [ ] `docs/data_schema.md`
- [ ] Raw OHLCV schema
- [ ] Processed OHLCV schema
- [ ] Factor schema draft
- [ ] Label schema draft
- [ ] File layout convention
- [ ] Date/time convention

## TiÃªu chÃ­ hoÃ n thÃ nh Day 6

Báº¡n cáº§n tráº£ lá»i Ä‘Æ°á»£c:

1. Raw data khÃ¡c processed data nhÆ° tháº¿ nÃ o?
2. VÃ¬ sao cáº§n `source` vÃ  `ingested_at`?
3. VÃ¬ sao factor cáº§n `factor_version`?
4. VÃ¬ sao date format pháº£i thá»‘ng nháº¥t?

## Commit gá»£i Ã½

```bash
git add docs/data_schema.md
git commit -m "docs: add market data schema draft"
```

---

# Day 7 â€” Support: Weekly review + GitHub cleanup

## Má»¥c tiÃªu

Chá»‘t Week 1 thÃ nh má»™t milestone cÃ³ thá»ƒ nhÃ¬n tháº¥y trÃªn GitHub. ÄÃ¢y lÃ  ngÃ y biáº¿n cÃ´ng viá»‡c rá»i ráº¡c thÃ nh portfolio evidence.

## Thá»i lÆ°á»£ng Ä‘á» xuáº¥t

**2 giá»**

| Block | Thá»i lÆ°á»£ng | Viá»‡c lÃ m |
|---|---:|---|
| Block 1 | 30 phÃºt | Review checklist Week 1 |
| Block 2 | 30 phÃºt | Cleanup README/docs |
| Block 3 | 30 phÃºt | Kiá»ƒm tra git/data/secrets |
| Block 4 | 30 phÃºt | Viáº¿t Week 1 summary |

## Nhiá»‡m vá»¥ chi tiáº¿t

### 1. Táº¡o Week 1 review file

Táº¡o file:

```text
docs/week1_review.md
```

Ná»™i dung:

```markdown
# Week 1 Review

## Completed

- Initialized project structure
- Defined QuantScope MVP scope
- Learned OHLCV and return basics
- Created market data basics notebook
- Downloaded sample market data
- Designed initial data schema

## Key lessons

- Adjusted close is preferred for long-term return calculations.
- Signals must be shifted before backtesting to avoid look-ahead bias.
- Data schema matters before building data pipelines.

## Problems encountered

- [Write any yfinance/data/environment issues]

## Next week focus

Week 2 will focus on data pipeline implementation:

- Market data downloader module
- Parquet normalization
- Local storage layout
- S3 upload/download utility
- FastAPI market data endpoints
```

### 2. Update README

README cáº§n cÃ³ Week 1 progress:

```markdown
## Progress

### Week 1 â€” Quant foundations + repo setup

Status: Completed / In progress

Deliverables:
- Project scope
- Market data basics notebook
- Quant notes
- Data schema draft
```

### 3. Kiá»ƒm tra khÃ´ng commit data/secrets

TrÆ°á»›c khi commit, kiá»ƒm tra:

```text
KhÃ´ng Ä‘Æ°á»£c commit:
- .env
- data/raw/*.parquet
- data/processed/*.parquet
- *.db
- AWS keys
- notebook output quÃ¡ lá»›n
```

### 4. Viáº¿t final Week 1 commit summary

Trong `docs/week1_review.md`, thÃªm:

```markdown
## Suggested GitHub milestone summary

Week 1 completed the foundation for QuantScope:

- Defined the project scope and MVP boundaries.
- Created a clean repository structure for backend, frontend, ML, data pipeline, infra, docs, and notebooks.
- Studied market data basics: OHLCV, adjusted close, simple return, log return.
- Created the first research notebook using sample market data.
- Drafted the initial data schema for raw, processed, factor, and label data.
```

## Deliverables Day 7

- [ ] `docs/week1_review.md`
- [ ] README updated
- [ ] Git status clean or changes clearly staged
- [ ] No secrets/data committed
- [ ] Week 2 tasks are clear

## TiÃªu chÃ­ hoÃ n thÃ nh Day 7

Báº¡n cÃ³ thá»ƒ má»Ÿ GitHub repo vÃ  ngÆ°á»i xem tháº¥y:

1. Dá»± Ã¡n nÃ y lÃ m gÃ¬.
2. Tuáº§n 1 Ä‘Ã£ hoÃ n thÃ nh gÃ¬.
3. Notebook Ä‘áº§u tiÃªn há»c vá» market data.
4. Docs cÃ³ scope vÃ  schema rÃµ rÃ ng.
5. KhÃ´ng cÃ³ file rÃ¡c hoáº·c data lá»›n.

## Commit gá»£i Ã½

```bash
git add README.md docs/week1_review.md
git commit -m "docs: complete week 1 foundation review"
```

---

# 4. Week 1 learning checklist

## Quant checklist

- [ ] TÃ´i hiá»ƒu OHLCV lÃ  gÃ¬.
- [ ] TÃ´i hiá»ƒu adjusted close dÃ¹ng Ä‘á»ƒ lÃ m gÃ¬.
- [ ] TÃ´i tÃ­nh Ä‘Æ°á»£c simple return báº±ng tay.
- [ ] TÃ´i tÃ­nh Ä‘Æ°á»£c log return báº±ng cÃ´ng thá»©c.
- [ ] TÃ´i hiá»ƒu factor lÃ  gÃ¬.
- [ ] TÃ´i hiá»ƒu signal lÃ  gÃ¬.
- [ ] TÃ´i hiá»ƒu position lÃ  gÃ¬.
- [ ] TÃ´i hiá»ƒu label lÃ  gÃ¬ trong ML finance.
- [ ] TÃ´i hiá»ƒu look-ahead bias á»Ÿ má»©c cÆ¡ báº£n.
- [ ] TÃ´i biáº¿t vÃ¬ sao pháº£i shift signal khi backtest.

## Coding checklist

- [ ] TÃ´i táº¡o Ä‘Æ°á»£c virtual environment.
- [ ] TÃ´i cÃ i Ä‘Æ°á»£c dependencies tá»« `requirements.txt`.
- [ ] TÃ´i cháº¡y Ä‘Æ°á»£c Jupyter Notebook.
- [ ] TÃ´i táº£i Ä‘Æ°á»£c dá»¯ liá»‡u báº±ng yfinance.
- [ ] TÃ´i tÃ­nh Ä‘Æ°á»£c returns báº±ng pandas.
- [ ] TÃ´i váº½ Ä‘Æ°á»£c price chart.
- [ ] TÃ´i váº½ Ä‘Æ°á»£c return distribution.
- [ ] TÃ´i lÆ°u Ä‘Æ°á»£c parquet local.
- [ ] TÃ´i biáº¿t data local khÃ´ng nÃªn commit.

## Documentation checklist

- [x] `README.md` cÃ³ mÃ´ táº£ dá»± Ã¡n.
- [x] `docs/project_scope.md` cÃ³ MVP vÃ  non-goals.
- [ ] `docs/quant_notes_week1.md` cÃ³ notes Quant cÆ¡ báº£n.
- [ ] `docs/data_schema.md` cÃ³ schema draft.
- [ ] `docs/week1_review.md` cÃ³ tá»•ng káº¿t tuáº§n.

---

# 5. Week 1 GitHub milestone

## Milestone title

```text
Week 1 â€” Quant Foundations and Repository Setup
```

## Milestone description

```markdown
This milestone establishes the foundation for QuantScope. It defines the project scope, initializes the repository structure, introduces basic quantitative finance concepts, creates the first market data notebook, and drafts the initial data schema.
```

## Issues/tasks nÃªn táº¡o trÃªn GitHub

1. `Initialize repository structure`
2. `Write project scope and MVP definition`
3. `Create market data basics notebook`
4. `Document OHLCV and return concepts`
5. `Download sample market data`
6. `Draft initial data schema`
7. `Write Week 1 review`

## Commit sequence khuyáº¿n nghá»‹

```text
chore: initialize alphaforge project structure
docs: add project scope and mvp boundaries
notebook: add market data basics outline
docs: add factor signal and label notes
chore: add python development setup
notebook: download sample market data and compute returns
docs: add market data schema draft
docs: complete week 1 foundation review
```

---

# 6. Week 1 study guide

## TÃ i liá»‡u nÃªn Ä‘á»c/xem trong tuáº§n nÃ y

### Market data basics

- Investopedia: Stock market basics, OHLC, adjusted close.
- pandas docs: `pct_change`, missing values, time series basics.
- yfinance examples: download historical market data.

### Quant basics

- QuantStart: beginner articles on algorithmic trading and backtesting.
- Georgia Tech ML4T lectures: market data, indicators, portfolio basics.

### Python data tools

- pandas time series basics.
- matplotlib basic line chart and histogram.
- Jupyter Notebook workflow.

## KhÃ´ng há»c trong Week 1

Äá»«ng sa Ä‘Ã  vÃ o:

- Options/futures.
- CAPM/Fama-French quÃ¡ sÃ¢u.
- Deep Learning trading.
- Reinforcement Learning.
- Real-time trading infrastructure.
- AWS deployment.
- Portfolio optimization nÃ¢ng cao.

LÃ½ do: nhá»¯ng pháº§n nÃ y lÃ m báº¡n cháº­m mÃ  chÆ°a giÃºp build MVP tuáº§n 1.

---

# 7. Common mistakes trong Week 1

## Mistake 1: Muá»‘n há»c quÃ¡ nhiá»u Quant theory

Sai vÃ¬ báº¡n sáº½ máº¥t thá»i gian mÃ  chÆ°a code Ä‘Æ°á»£c gÃ¬.

CÃ¡ch Ä‘Ãºng:

```text
Há»c khÃ¡i niá»‡m -> viáº¿t notebook nhá» -> ghi láº¡i hiá»ƒu biáº¿t -> chuyá»ƒn sang task tiáº¿p theo
```

## Mistake 2: DÃ¹ng close thay vÃ¬ adjusted close mÃ  khÃ´ng biáº¿t khÃ¡c biá»‡t

Náº¿u cá»• phiáº¿u split/dividend, close cÃ³ thá»ƒ lÃ m return sai.

CÃ¡ch Ä‘Ãºng:

- DÃ¹ng adjusted close cho return dÃ i háº¡n.
- Ghi rÃµ source vÃ  assumption.

## Mistake 3: Commit data lá»›n

Data cÃ³ thá»ƒ lÃ m repo náº·ng vÃ  xáº¥u trÃªn GitHub.

CÃ¡ch Ä‘Ãºng:

- Ignore `data/raw/` vÃ  `data/processed/`.
- Chá»‰ commit code, docs, notebook cáº§n thiáº¿t.

## Mistake 4: Notebook quÃ¡ lá»™n xá»™n

Notebook lÃ  portfolio evidence. Náº¿u output lá»™n xá»™n, ngÆ°á»i xem khÃ³ hiá»ƒu báº¡n Ä‘Ã£ lÃ m gÃ¬.

CÃ¡ch Ä‘Ãºng:

- Má»—i notebook cÃ³ goal.
- Má»—i section cÃ³ title.
- Code cell ngáº¯n.
- CÃ³ markdown giáº£i thÃ­ch káº¿t quáº£.

## Mistake 5: Over-engineer Docker/AWS tá»« tuáº§n 1

Week 1 lÃ  foundation. Docker/AWS cÃ³ thá»ƒ Ä‘á»ƒ Week 7, hoáº·c chá»‰ note nháº¹.

CÃ¡ch Ä‘Ãºng:

- Æ¯u tiÃªn Python env cháº¡y Ä‘Æ°á»£c.
- AWS chá»‰ cáº§n biáº¿t sáº½ dÃ¹ng S3/Lambda/EC2 sau.

---

# 8. Expected final state after Week 1

Cuá»‘i Week 1, repo nÃªn nhÃ¬n nhÆ° sau:

```text
quant-trading-app/
â”œâ”€â”€ README.md
â”œâ”€â”€ requirements.txt
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ backend/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ frontend/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ ml/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ data_pipeline/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ infra/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ scripts/
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ notebooks/
â”‚   â””â”€â”€ 01_market_data_basics.ipynb
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ QUANTSCOPE_8_WEEK_PLAN.md
â”‚   â”œâ”€â”€ QUANTSCOPE_WEEK_1_DETAILED_PLAN.md
â”‚   â”œâ”€â”€ project_scope.md
â”‚   â”œâ”€â”€ quant_notes_week1.md
â”‚   â”œâ”€â”€ data_schema.md
â”‚   â””â”€â”€ week1_review.md
â”œâ”€â”€ tests/
â””â”€â”€ data/
    â”œâ”€â”€ raw/          # ignored
    â””â”€â”€ processed/    # ignored
```

---

# 9. Week 1 self-assessment

Cháº¥m Ä‘iá»ƒm cuá»‘i tuáº§n theo thang 0â€“2:

| TiÃªu chÃ­ | 0 Ä‘iá»ƒm | 1 Ä‘iá»ƒm | 2 Ä‘iá»ƒm | Äiá»ƒm |
|---|---|---|---|---:|
| Repo structure | ChÆ°a rÃµ | CÃ³ folder nhÆ°ng thiáº¿u docs | RÃµ rÃ ng, cÃ³ README |  |
| Quant basics | MÆ¡ há»“ | Hiá»ƒu má»™t pháº§n | Giáº£i thÃ­ch Ä‘Æ°á»£c báº±ng vÃ­ dá»¥ |  |
| Notebook | ChÆ°a cháº¡y | Cháº¡y má»™t pháº§n | Cháº¡y Ä‘á»§ data + returns + plots |  |
| Data schema | ChÆ°a cÃ³ | CÃ³ sÆ¡ bá»™ | CÃ³ raw/processed/factor/label schema |  |
| Git hygiene | CÃ³ file rÃ¡c | Táº¡m á»•n | KhÃ´ng secret/data lá»›n, commit rÃµ |  |
| Documentation | Thiáº¿u | CÃ³ nhÆ°ng rá»i ráº¡c | CÃ³ scope, notes, review |  |

Tá»•ng Ä‘iá»ƒm tá»‘i Ä‘a: 12.

ÄÃ¡nh giÃ¡:

- 10â€“12: Week 1 ráº¥t tá»‘t, sáºµn sÃ ng sang Week 2.
- 7â€“9: Äá»§ Ä‘á»ƒ sang Week 2, nhÆ°ng cáº§n cleanup nháº¹.
- 4â€“6: NÃªn dÃ nh thÃªm 1 ngÃ y hoÃ n thiá»‡n notebook/docs.
- 0â€“3: ChÆ°a nÃªn sang Week 2, cáº§n lÃ m láº¡i foundation.

---

# 10. Chuáº©n bá»‹ cho Week 2

Week 2 sáº½ báº¯t Ä‘áº§u data pipeline tháº­t. TrÆ°á»›c khi sang Week 2, Ä‘áº£m báº£o báº¡n Ä‘Ã£ cÃ³:

- [ ] Danh sÃ¡ch ticker sample.
- [ ] Notebook Ä‘Ã£ chá»©ng minh yfinance táº£i Ä‘Æ°á»£c data.
- [ ] Schema raw/processed rÃµ.
- [x] `.gitignore` báº£o vá»‡ data local.
- [ ] Python env cháº¡y Ä‘Æ°á»£c pandas/yfinance/pyarrow.

## Week 2 preview

CÃ¡c task Week 2:

1. Viáº¿t `data_pipeline/ingestion/download.py`.
2. Viáº¿t `data_pipeline/processing/normalize.py`.
3. Chuáº©n hÃ³a output Parquet.
4. Thiáº¿t káº¿ local storage layout.
5. Chuáº©n bá»‹ S3 upload/download utility.
6. Báº¯t Ä‘áº§u API market data cÆ¡ báº£n.

Náº¿u Week 1 lÃ m tá»‘t, Week 2 sáº½ lÃ  chuyá»ƒn notebook thÃ nh production-style code.

---

# 11. Final Week 1 checklist

## Must-have

- [ ] README draft
- [ ] Project scope
- [ ] Quant notes
- [ ] Market data notebook
- [ ] Sample data downloaded locally
- [ ] Data schema draft
- [x] `.gitignore`
- [x] `.env.example`
- [ ] Requirements file

## Nice-to-have

- [ ] Week 1 GitHub milestone created
- [ ] GitHub issues for Week 1 tasks
- [ ] Notebook screenshots in docs
- [ ] Short demo GIF or screenshot of notebook output
- [ ] Clean commit history

## Do not do yet

- [ ] Do not deploy AWS in Week 1
- [ ] Do not build full backend yet
- [ ] Do not build frontend yet
- [ ] Do not train ML model yet
- [ ] Do not optimize strategy parameters yet
- [ ] Do not use real money trading

---

# 12. Summary

Week 1 lÃ  tuáº§n xÃ¢y ná»n mÃ³ng. ThÃ nh cÃ´ng cá»§a tuáº§n nÃ y khÃ´ng Ä‘o báº±ng sá»‘ lÆ°á»£ng feature, mÃ  Ä‘o báº±ng viá»‡c báº¡n cÃ³ hiá»ƒu Ä‘Ãºng dá»¯ liá»‡u thá»‹ trÆ°á»ng vÃ  cÃ³ repo Ä‘á»§ sáº¡ch Ä‘á»ƒ phÃ¡t triá»ƒn tiáº¿p hay khÃ´ng.

Káº¿t quáº£ tá»‘t nháº¥t cuá»‘i tuáº§n:

```text
Báº¡n cÃ³ má»™t repo QuantScope rÃµ rÃ ng, má»™t notebook market data cháº¡y Ä‘Æ°á»£c, notes Quant cÆ¡ báº£n, data schema draft, vÃ  README Ä‘á»§ tá»‘t Ä‘á»ƒ ngÆ°á»i khÃ¡c hiá»ƒu dá»± Ã¡n.
```

Náº¿u Ä‘áº¡t Ä‘Æ°á»£c Ä‘iá»u Ä‘Ã³, báº¡n Ä‘Ã£ sáºµn sÃ ng bÆ°á»›c sang Week 2: **Data Pipeline**.


