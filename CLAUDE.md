# CLAUDE.md - What If You Invested

## What this is

A programmatic SEO site that answers one question: "What would $X invested in [company] in [year] be worth today?" Every page is generated from real Yahoo Finance data, with an interactive calculator, a growth chart comparing the investment to the S&P 500, and a year-by-year returns table. There are no opinions, no stock picks, no predictions. Just math. The site is a data product that happens to have great SEO, targeting thousands of long-tail "what if I invested in" queries. Monetized through finance display ads (AdSense, then Mediavine at 50k sessions) and brokerage affiliate links. Live URL: TBD (domain: whatifyouinvested.com, deploying to Vercel).

## Tech stack

- **Framework:** Next.js 14 (App Router, static export)
- **Language:** JavaScript (no TypeScript)
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts
- **Fonts:** Google Fonts via next/font (Outfit, DM Sans, JetBrains Mono)
- **Hosting:** Vercel (static export, free tier)
- **Database:** None. All data lives in static JSON files in `public/data/`
- **Data pipeline:** Python 3 + yfinance (runs locally or in CI, outputs JSON)
- **Build output:** `output: 'export'` in next.config.js (fully static HTML)

## File structure

```
whatifyouinvested/
├── CLAUDE.md                                  # This file. Project context for Claude Code.
├── README.md                                  # Setup, deployment, and contribution docs
├── package.json                               # Dependencies: next, react, recharts, tailwindcss
├── next.config.js                             # Static export config (output: 'export', trailingSlash: true)
├── tailwind.config.js                         # Dark mode design system, custom colors, fonts, animations
├── postcss.config.js                          # Standard Tailwind PostCSS setup
├── .gitignore                                 # Excludes node_modules, .next, out, .env
│
├── app/
│   ├── layout.js                              # Root layout: nav, footer, font loading, metadata
│   ├── page.js                                # Homepage: hero, featured companies grid, top performers, sector browse
│   ├── globals.css                            # Base styles, scrollbar, glow effects, gradient borders, table hover
│   │
│   ├── lib/
│   │   └── data.js                            # All data loading functions. Reads JSON at build time. Caches in memory.
│   │
│   ├── components/
│   │   ├── Calculator.js                      # Interactive calculator (client component). Investment amount presets + custom input. Hero number display.
│   │   ├── GrowthChart.js                     # Recharts line chart (client component). Company line vs S&P 500 dashed line. Custom tooltip.
│   │   ├── YearlyTable.js                     # Year-by-year breakdown table (client component). Green/red return coloring.
│   │   ├── RelatedLinks.js                    # Internal linking: other start years for same company + same-sector companies.
│   │   ├── AffiliateCTA.js                    # Brokerage affiliate box. Fidelity, Schwab, Robinhood. One per page.
│   │   └── FAQSchema.js                       # JSON-LD structured data for Google featured snippets.
│   │
│   ├── what-if-you-invested-in/
│   │   └── [slug]/
│   │       └── page.js                        # Dynamic company page. THE money page. Generates 213 static pages at build time.
│   │
│   ├── about/
│   │   └── page.js                            # About page. What the site is, what it is not.
│   ├── methodology/
│   │   └── page.js                            # Methodology page. Data sources, calculation method, limitations.
│   └── disclaimer/
│       └── page.js                            # Legal disclaimer. Not financial advice. Affiliate disclosure.
│
├── public/
│   └── data/
│       ├── all_pages.json                     # All 213 page records (~1 MB). This is the core data feed.
│       ├── company_index.json                 # Master list of 44 companies with tickers, sectors, available start years.
│       └── sectors.json                       # Companies grouped by sector (Technology, Consumer, Financial, etc.)
│
└── pipeline/
    └── pull_data.py                           # Python data pipeline. Pulls prices from Yahoo Finance via yfinance, calculates returns, outputs JSON.
```

## Data model

### Page record (`all_pages.json`)

Each entry in `all_pages.json` represents one company-year combination and contains everything needed to render a full page.

```json
{
  "ticker": "TSLA",                    // Stock ticker symbol. Used as unique ID with start_year.
  "company_name": "Tesla",             // Display name. Used in headings, chart labels, URLs.
  "sector": "Technology",              // One of: Technology, Consumer, Financial, Healthcare, Industrial, Index, Crypto
  "start_year": 2010,                  // The hypothetical investment start year.
  "start_price": 1.59,                 // Split-adjusted closing price on first trading day of Jan [start_year]. USD.
  "current_price": 392.56,             // Most recent split-adjusted closing price at time of data refresh. USD.
  "price_date": "2026-03-01",          // Date of the most recent price. ISO format YYYY-MM-DD.
  "default_investment": 1000,          // Default dollar amount for calculations. Always 1000.
  "current_value": 247100.23,          // What $1,000 invested at start_price would be worth at current_price.
  "total_return_pct": 24610.0,         // Total percentage return. Can be negative.
  "annualized_return_pct": 40.4,       // CAGR (compound annual growth rate). Can be negative.
  "years_held": 16.2,                  // Fractional years from start_year to now.
  "sp500_comparison": {
    "start_price": 80.57,              // SPY price at same start date. USD.
    "current_value": 8320.70,          // What $1,000 in SPY would be worth. USD.
    "total_return_pct": 732.1,         // SPY total return for same period.
    "annualized_return_pct": 13.9      // SPY CAGR for same period.
  },
  "yearly_breakdown": [                // Array of objects, one per calendar year from start_year to present.
    {
      "year": 2010,                    // Calendar year.
      "price": 1.59,                   // Split-adjusted price on first trading day of Jan.
      "value": 1000.0,                 // Portfolio value based on shares purchased at start.
      "annual_return_pct": 0.0,        // Year-over-year return. 0.0 for the first year.
      "cumulative_return_pct": 0.0     // Total return since start. 0.0 for the first year.
    }
    // ... one entry per year through current year
  ],
  "sp500_yearly_breakdown": [          // Same structure as yearly_breakdown but for SPY. Used for chart overlay.
    {
      "year": 2010,
      "price": 80.57,
      "value": 1000.0,
      "annual_return_pct": 0.0,
      "cumulative_return_pct": 0.0
    }
  ]
}
```

### Company index entry (`company_index.json`)

```json
{
  "ticker": "AAPL",
  "name": "Apple",
  "sector": "Technology",
  "page_count": 6,                     // How many pages exist for this company.
  "start_years": [2000, 2005, 2010, 2015, 2020, 2023]  // Which start years have pages.
}
```

### Sectors (`sectors.json`)

A dictionary keyed by sector name. Each value is an array of company index entries.

Valid sector values: `Technology`, `Consumer`, `Financial`, `Healthcare`, `Industrial`, `Index`, `Crypto`

### URL slug generation

Slugs are generated by `makeSlug()` in `app/lib/data.js`:
- Lowercase the company name
- Strip parentheses
- Replace non-alphanumeric characters with hyphens
- Collapse multiple hyphens
- Append `-in-{year}`

Examples:
- Apple + 2010 = `apple-in-2010`
- Alphabet (Google) + 2004 = `alphabet-google-in-2004`
- S&P 500 (SPY) + 2000 = `sp-500-spy-in-2000`
- Bitcoin + 2014 = `bitcoin-in-2014`

URL pattern: `/what-if-you-invested-in/{slug}/`

## How to add content

### Adding a new company

1. Open `pipeline/pull_data.py`
2. Add the ticker to the `COMPANIES` dict:
   ```python
   "COST": {"name": "Costco", "sector": "Consumer", "ipo_year": 1985},
   ```
3. Run the pipeline:
   ```bash
   pip install yfinance  # if not already installed
   python pipeline/pull_data.py
   ```
4. Copy the output:
   ```bash
   cp pipeline/output/*.json public/data/
   ```
5. Verify the build:
   ```bash
   npm run build
   ```
6. Commit and push. Vercel auto-deploys.

The pipeline automatically determines which start years to generate (IPO year if >= 1995, plus 2000, 2005, 2010, 2015, 2020, 2023 as applicable). Each new ticker generates 4-6 pages.

### Adding a new static page

1. Create `app/{page-name}/page.js`
2. Export metadata for SEO:
   ```javascript
   export const metadata = {
     title: 'Page Title',
     description: 'Page description for search engines.',
   };
   ```
3. Export default function component.
4. Add navigation link in `app/layout.js` if needed.

### Refreshing price data

1. Run `python pipeline/pull_data.py`
2. Copy `pipeline/output/*.json` to `public/data/`
3. Commit and push.

All prices update. All 213+ pages regenerate at build time with the new numbers.

## Design system

### Fonts

| Role | Font | Tailwind class | Usage |
|------|------|----------------|-------|
| Display | Outfit | `font-display` | Headings, labels, nav, section titles |
| Body | DM Sans | `font-body` | Paragraph text, descriptions |
| Mono | JetBrains Mono | `font-mono` | All numbers, prices, returns, percentages, table data |

Fonts are loaded via `next/font/google` in `app/layout.js` and exposed as CSS variables `--font-display`, `--font-body`, `--font-mono`.

### Colors

This is a dark-mode-only site. No light mode.

| Name | Hex | Tailwind class | Usage |
|------|-----|----------------|-------|
| Surface 900 | `#0a0a0f` | `bg-surface-900` | Page background |
| Surface 800 | `#12121a` | `bg-surface-800` | Cards, panels, table backgrounds |
| Surface 700 | `#1a1a25` | `bg-surface-700` | Nested elements, input backgrounds, hover states |
| Surface 600 | `#22222f` | `bg-surface-600` | Active/hover on nested elements |
| Surface 500 | `#2a2a38` | `bg-surface-500` | Rarely used, deepest nested |
| Gain | `#00dc82` | `text-gain` | Positive returns, green numbers |
| Gain dim | `#00dc8233` | `bg-gain-dim` | Gain badge backgrounds |
| Loss | `#ff4757` | `text-loss` | Negative returns, red numbers |
| Loss dim | `#ff475733` | `bg-loss-dim` | Loss badge backgrounds |
| Accent | `#6366f1` | `text-accent`, `bg-accent` | Interactive elements, S&P 500 chart line, active buttons |
| Muted | `#64748b` | `text-muted` | Secondary text, labels, timestamps |
| Muted light | `#94a3b8` | `text-muted-light` | Body text, descriptions (primary readable text) |
| White | `#ffffff` | `text-white` | Headings, names, emphasized text |

Borders use `border-white/5` (5% white opacity) consistently everywhere.

### Layout

- Max content width: `max-w-6xl` (1152px) for homepage grids, `max-w-4xl` (896px) for company pages, `max-w-3xl` (768px) for text-heavy pages (about, methodology, disclaimer)
- Page padding: `px-4 sm:px-6`
- Card spacing: `space-y-6` between major sections on company pages
- Card border radius: `rounded-2xl` (16px) for major cards, `rounded-xl` (12px) for inner cards, `rounded-lg` (8px) for buttons and inputs
- Section padding inside cards: `p-6` or `px-6 py-4`

### Component patterns

**Cards:** `bg-surface-800 rounded-2xl border border-white/5` with optional `overflow-hidden` for tables. Cards with gradient borders use the `.gradient-border` CSS class.

**Section headings inside cards:** `font-display font-semibold text-white` for the title, `text-xs text-muted mt-1` for the subtitle.

**Buttons:** Preset buttons use `px-3 py-1.5 rounded-lg text-sm font-mono`. Active state: `bg-accent text-white`. Inactive: `bg-surface-700 text-muted-light hover:bg-surface-600`.

**Return badges:** `text-xs font-mono font-medium px-2 py-0.5 rounded`. Green: `bg-gain/10 text-gain`. Red: `bg-loss/10 text-loss`.

**Table rows:** `border-b border-white/[0.03] table-row-hover`. Last row gets `bg-surface-700/30`. Year column is `font-mono text-white font-medium`. Number columns are `font-mono text-muted-light`. Return columns use `text-gain` or `text-loss`.

**The hero number:** `font-mono font-bold text-hero-sm sm:text-hero text-gain hero-glow` for positive, `text-loss` for negative. This is the biggest, most important element on any company page.

## Writing rules

- No em dashes. Ever. Use periods, commas, or hyphens.
- No en dashes for ranges. Use hyphens: `$5,000-$10,000`.
- No stock picks. No "you should invest in X." No opinions on future performance.
- No predictions. The site shows what happened, not what will happen.
- Every page includes: "For informational and educational purposes only. Not financial advice. Past performance does not guarantee future results."
- Keep contextual text factual and brief. State what happened, not why.
- Do not use: genuinely, honestly, straightforward, leverage, synergy, ecosystem.
- Tone is confident and precise. Not playful, not flashy. Bloomberg terminal energy.
- All numbers must be sourced from the data pipeline. Never hardcode financial figures in page templates.
- Use "since [year]" not "from [year]" in headings and labels.
- Dollar amounts always include commas: `$44,739` not `$44739`.
- Percentages include one decimal for values under 10,000%: `+4,373.9%`. Round to nearest integer above that: `+24,610%`.
- Always prefix positive returns with `+`. Negative returns get a natural minus sign.

## Deployment

- **Git remote:** GitHub (repo to be created at github.com/[username]/whatifyouinvested)
- **Hosting:** Vercel. Auto-deploys on push to `main`.
- **Build command:** `npm run build` (produces static export in `out/` directory)
- **Domain:** whatifyouinvested.com (DNS configured through Vercel)
- **Analytics:** Not yet configured. Plan is Google Analytics 4 + Google Search Console.
- **Ads:** Google AdSense from launch. Mediavine at 50k monthly sessions.

### Deploy commands

```bash
# Local dev
npm run dev

# Production build (test before pushing)
npm run build

# Deploy (automatic on push to main)
git add .
git commit -m "description of change"
git push origin main
```

### Data refresh and deploy

```bash
python pipeline/pull_data.py
cp pipeline/output/*.json public/data/
npm run build                          # verify build succeeds
git add public/data/
git commit -m "Refresh price data [month year]"
git push origin main                   # triggers Vercel deploy
```

## Current state

- **Version:** 1.0 (pre-launch)
- **Tickers:** 44 (34 stocks, 4 index funds, 4 recent IPOs, 2 crypto)
- **Pages:** 213 company-year combination pages
- **Sectors:** 7 (Technology: 19, Consumer: 12, Financial: 5, Index: 4, Crypto: 2, Healthcare: 1, Industrial: 1)
- **Static pages:** Homepage, About, Methodology, Disclaimer
- **Data source:** Yahoo Finance via yfinance, last pulled March 2026
- **Calculations:** Price return only. No dividend reinvestment yet.
- **Missing page types:** Comparison pages, "What If" scenario pages, "Best Investments" list pages, blog posts, sector hub pages

## Roadmap

Priority order:

1. **Deploy to Vercel and configure domain** - Get the site live.
2. **Phase 2 tickers** - Expand to 100 tickers (~500 pages). Add Costco, Starbucks, Target, UnitedHealth, Eli Lilly, Broadcom, and more S&P 500 top holdings.
3. **Comparison pages** - `/apple-vs-microsoft-investment-returns/` side-by-side format. Template + first 20 matchups.
4. **"What If" scenario pages** - `/what-if/you-invested-your-college-tuition-in-the-sp500/` etc. Viral/shareable format for Reddit and social.
5. **"Best Investments" list pages** - `/best-investments-of-the-2010s/` ranking format. Link bait + internal traffic drivers.
6. **Sector hub pages** - `/tech-stock-returns/` hub pages linking to all companies in that sector.
7. **Blog posts** - 5-10 evergreen pieces for topical authority. "The Power of Compound Interest, Visualized" etc.
8. **Dividend reinvestment toggle** - Add with-dividends vs without-dividends calculation to the pipeline and calculator.
9. **Google Analytics 4 + Search Console** - Set up tracking and sitemap submission.
10. **AdSense integration** - Add ad placements to layout.
11. **Phase 3 tickers** - Expand to 250 tickers (~1,200 pages).
12. **Automated data refresh** - GitHub Action running `pull_data.py` monthly on a cron schedule.
13. **OG image generation** - Dynamic social share images with the hero number for each page.
14. **XML sitemap** - Auto-generated sitemap for Google Search Console. Submit in batches (50, then 100, then all).

## Things NOT to do

- **Do not add a database.** The entire data layer is static JSON. This is intentional. No Postgres, no Supabase, no Firebase. The site is a static export.
- **Do not add TypeScript.** The project is JavaScript. Keep it that way for consistency.
- **Do not add a CMS.** Content is either generated by the pipeline or hand-written in page components. No Contentful, no Sanity, no MDX.
- **Do not add a light mode.** This is a dark-mode-only site. The Bloomberg terminal aesthetic is a deliberate design decision.
- **Do not hardcode financial data in components.** Every number comes from `all_pages.json` via `app/lib/data.js`. If you need a number on a page, it must trace back to the pipeline output.
- **Do not give financial advice.** No stock picks, no buy/sell recommendations, no predictions about future performance. The site shows historical data only.
- **Do not use em dashes.** Use periods, commas, or hyphens.
- **Do not add server-side rendering.** The site uses `output: 'export'` for fully static HTML. Do not add API routes, server actions, or dynamic rendering.
- **Do not change the font stack.** Outfit (display), DM Sans (body), JetBrains Mono (numbers) are locked in.
- **Do not install a CSS framework besides Tailwind.** No Bootstrap, no Chakra, no styled-components.
- **Do not add authentication.** There are no user accounts. This is a public data tool.
- **Do not fetch data at runtime.** All data is baked in at build time. The calculator recalculates using multipliers from the static data, not API calls.
- **Do not remove or weaken the disclaimer.** Every company page must include the disclaimer footer. The methodology and disclaimer pages must exist. This is a finance site and legal coverage is non-negotiable.
