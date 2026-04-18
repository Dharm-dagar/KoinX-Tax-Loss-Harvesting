# KoinX — Tax Loss Harvesting Tool

A responsive React application for simulating crypto tax-loss harvesting strategies. Built for the KoinX Frontend Intern Assignment.

---

## Screenshots

> Run `npm run dev` and navigate to `http://localhost:5173`

| Light Mode | Dark Mode |
|---|---|
| Pre + After Harvesting cards | Same UI with dark theme |
| Holdings table with filters | Checkbox selections updating gains |

---

## Tech Stack

- **React 18** with Hooks
- **Vite** — lightning-fast dev server & build
- **Context API** — ThemeContext + TaxContext for global state
- **CSS Custom Properties** — full light/dark theme support
- **Google Fonts** — DM Sans + Space Grotesk
- **Mock APIs** — simulated with `Promise` + `setTimeout` (no server needed)

---

## Setup Instructions

```bash
# 1. Clone / unzip the project
cd koinx-tax-harvesting

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:5173
```

### Production build

```bash
npm run build      # outputs to /dist
npm run preview    # preview the build locally
```

### Deploying to Vercel / Netlify

```bash
# Vercel (auto-detects Vite)
vercel

# Netlify drag-and-drop: build, then upload /dist folder
```

---

## Project Structure

```
src/
├── services/
│   └── api.js                  # Mock API — fetchHoldings() + fetchCapitalGains()
├── utils/
│   ├── formatters.js           # Currency/number formatters (INR, smart decimals)
│   └── calculations.js         # Core tax logic + sort/filter helpers
├── context/
│   ├── ThemeContext.jsx         # Dark/light mode state
│   └── TaxContext.jsx           # Selected holdings + computed gains
├── hooks/
│   ├── useCapitalGains.js       # Fires fetchCapitalGains on mount
│   └── useHoldings.js           # Fires fetchHoldings on mount
├── components/
│   ├── Header/
│   │   ├── Header.jsx           # Sticky header with logo + theme toggle
│   │   └── Header.css
│   ├── UI/
│   │   ├── DisclaimerAccordion.jsx   # Collapsible disclaimer panel
│   │   ├── DisclaimerAccordion.css
│   │   ├── SharedUI.jsx         # Loader, Skeleton, Tooltip, Checkbox, ErrorBox, Badge
│   │   └── SharedUI.css
│   ├── TaxCards/
│   │   ├── PreHarvestCard.jsx   # Left panel — static from Capital Gains API
│   │   ├── AfterHarvestCard.jsx # Right panel — updates on selection
│   │   └── TaxCards.css
│   └── Holdings/
│       ├── FilterBar.jsx        # Search + filter tabs + sort dropdown
│       ├── HoldingRow.jsx       # Individual table row with hover effects
│       ├── HoldingsTable.jsx    # Full table with pagination + select-all
│       └── Holdings.css
├── pages/
│   ├── TaxHarvesting.jsx        # Main page layout
│   └── TaxHarvesting.css
├── App.jsx                      # Root with providers
├── main.jsx                     # React DOM entry point
└── index.css                    # Global styles + CSS variables
```

---

## Features Implemented

### Core Functional Requirements
- [x] **Pre-Harvesting Card** — shows ST/LT profits, losses, net, realised gains from API
- [x] **After-Harvesting Card** — mirrors pre-harvesting, updates in real-time on selection
- [x] **Business logic**: gain > 0 → add to profits; gain < 0 → add to losses
- [x] **Savings message** — shown only when post-realised < pre-realised
- [x] **Holdings table** — all columns: Asset, Holdings + Avg Buy Price, Current Price, Total Value, ST Gain, LT Gain, Amount to Sell
- [x] **Checkbox per row** + **Select All** with indeterminate state
- [x] **View All** / Show Less pagination (8 rows default)

### UX & Polish
- [x] **Dark / Light mode toggle** — persisted to localStorage
- [x] **Responsive design** — mobile-friendly layout
- [x] **Loading states** — spinner + skeleton rows during API calls
- [x] **Error states** — error box with retry UX
- [x] **Search** — filter holdings by coin or name
- [x] **Filter tabs** — All / Gains Only / Losses Only
- [x] **Sort dropdown** — by name, ST gain, LT gain, total value
- [x] **Hover effects** — total value shows 5 decimal places on hover
- [x] **Hover on price/holdings** — tooltip with full precision
- [x] **Coin logo** — graceful fallback on image error
- [x] **Animated cards** — smooth fade-in on load
- [x] **Row animations** — subtle entrance animation
- [x] **Savings badge** — animated pop-in when savings appear

---

## Business Logic (Key Rules)

```
// For each SELECTED holding:
if (stcg.gain > 0)  → afterStcgProfits += stcg.gain
if (stcg.gain < 0)  → afterStcgLosses += Math.abs(stcg.gain)
if (ltcg.gain > 0)  → afterLtcgProfits += ltcg.gain
if (ltcg.gain < 0)  → afterLtcgLosses += Math.abs(ltcg.gain)

Net ST = profits - losses
Net LT = profits - losses
Effective Realised = Net ST + Net LT

Savings shown only if: postRealised < preRealised
Estimated savings = (preRealised - postRealised) × 30% tax rate
```

---

## Assumptions

1. Tax rate assumed at **30%** (India's flat crypto tax rate as of FY2022–23).
2. The Capital Gains API values are in **INR** (`₹`), consistent with KoinX's India-first product.
3. Holdings are sorted by **total current value (desc)** by default for relevance.
4. "Amount to Sell" = `totalHolding` of the asset when selected (as per assignment spec).
5. Mock API simulates **~800ms latency** to demonstrate loading states.
6. `ltcg.balance = 0` and `ltcg.gain = 0` for most assets is treated as "no long-term position".

---

## License

MIT — For KoinX assignment submission only.
