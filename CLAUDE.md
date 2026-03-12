# CLAUDE.md - What If You Invested

## What this is

A programmatic SEO site answering "What would $X invested in [company] in [year] be worth today?" 213 pages generated from Yahoo Finance data, each with an interactive calculator, growth chart vs S&P 500, and year-by-year returns table. No opinions, no stock picks - just math. Monetized through finance display ads and brokerage affiliate links. Dark-mode, data-forward design. Live URL: whatifyouinvested.com (Vercel).

## Tech stack

- **Framework:** Next.js 14 (App Router, `output: 'export'` static HTML)
- **Language:** JavaScript (no TypeScript)
- **Styling:** Tailwind CSS 3.4 (dark mode only, no light mode)
- **Charts:** Recharts
- **Fonts:** Outfit (display), DM Sans (body), JetBrains Mono (numbers) via next/font
- **Hosting:** Vercel (free tier, auto-deploys on push to main)
- **Database:** None. Static JSON in `public/data/`
- **Data pipeline:** Python 3 + yfinance, outputs JSON, runs locally or in CI

## File structure

```
whatifyouinvested/
├── CLAUDE.md                              # This file
├── package.json                           # Deps: next, react, recharts, tailwindcss
├── next.config.js                         # Static export, trailingSlash: true
├── tailwind.config.js                     # Custom colors, fonts, animations
├── app/
│   ├── layout.js                          # Root layout: nav, footer, font loading, metadata
│   ├── page.js                            # Homepage: hero, company grid, top performers, sectors
│   ├── globals.css                        # Base styles, scrollbar, glow effects, gradient borders
│   ├── lib/
│   │   └── data.js                        # Data loading + slug generation. All reads from JSON at build time.
│   ├── components/
│   │   ├── Calculator.js                  # 'use client'. Investment amount selector + hero number display.
│   │   ├── GrowthChart.js                 # 'use client'. Recharts line chart, company vs S&P 500.
│   │   ├── YearlyTable.js                 # 'use client'. Year-by-year breakdown with gain/loss coloring.
│   │   ├── RelatedLinks.js                # Internal links: other start years + same-sector companies.
│   │   ├── AffiliateCTA.js                # Brokerage affiliate box. One per page.
│   │   └── FAQSchema.js                   # JSON-LD structured data for featured snippets.
│   ├── what-if-you-invested-in/
│   │   └── [slug]/page.js                 # THE money page. Generates 213 static pages at build.
│   ├── about/page.js                      # What the site is and is not.
│   ├── methodology/page.js                # Data sources, calc method, limitations.
│   └── disclaimer/page.js                 # Not financial advice. Affiliate disclosure.
├── public/data/
│   ├── all_pages.json                     # 213 page records (~1 MB). Core data feed.
│   ├── company_index.json                 # 44 companies: ticker, sector, available start years.
│   └── sectors.json                       # Companies grouped by sector.
└── pipeline/
    └── pull_data.py                       # Python pipeline. Yahoo Finance → JSON.
```

## Data model

### Page record (`all_pages.json` - one per company-year combination)

```json
{
  "ticker": "TSLA",                    // Stock ticker. Unique with start_year.
  "company_name": "Tesla",             // Display name for headings, charts, URLs.
  "sector": "Technology",              // Enum: Technology|Consumer|Financial|Healthcare|Industrial|Index|Crypto
  "start_year": 2010,                  // Hypothetical investment start year.
  "start_price": 1.59,                 // Split-adjusted close, first trading day of Jan [start_year]. USD.
  "current_price": 392.56,             // Most recent split-adjusted close. USD.
  "price_date": "2026-03-01",          // Date of current_price. YYYY-MM-DD.
  "default_investment": 1000,          // Always 1000.
  "current_value": 247100.23,          // $1,000 at start → worth this today. USD.
  "total_return_pct": 24610.0,         // Total return. Can be negative.
  "annualized_return_pct": 40.4,       // CAGR. Can be negative.
  "years_held": 16.2,                  // Fractional years from start to now.
  "sp500_comparison": {
    "start_price": 80.57,              // SPY at same start date.
    "current_value": 8320.70,          // $1,000 in SPY → worth this. USD.
    "total_return_pct": 732.1,
    "annualized_return_pct": 13.9
  },
  "yearly_breakdown": [                // One entry per calendar year, start_year through present.
    { "year": 2010, "price": 1.59, "value": 1000.0, "annual_return_pct": 0.0, "cumulative_return_pct": 0.0 },
    { "year": 2011, "price": 1.61, "value": 1011.33, "annual_return_pct": 1.1, "cumulative_return_pct": 1.1 }
  ],
  "sp500_yearly_breakdown": [          // Same structure, SPY data. Used for chart overlay.
    { "year": 2010, "price": 80.57, "value": 1000.0, "annual_return_pct": 0.0, "cumulative_return_pct": 0.0 }
  ]
}
```

### Company index entry (`company_index.json`)

```json
{ "ticker": "AAPL", "name": "Apple", "sector": "Technology", "page_count": 6, "start_years": [2000, 2005, 2010, 2015, 2020, 2023] }
```

### Slug generation (`makeSlug()` in `app/lib/data.js`)

```
Apple + 2010         → apple-in-2010
Alphabet (Google)    → alphabet-google-in-2004
S&P 500 (SPY)        → sp-500-spy-in-2000
```

URL pattern: `/what-if-you-invested-in/{slug}/`

## How to add content

### Add a new company (most common task)

```bash
# 1. Edit pipeline/pull_data.py - add to COMPANIES dict:
"COST": {"name": "Costco", "sector": "Consumer", "ipo_year": 1985},

# 2. Run pipeline
python pipeline/pull_data.py

# 3. Copy output
cp pipeline/output/*.json public/data/

# 4. Verify build
npm run build

# 5. Deploy
git add . && git commit -m "Add Costco" && git push origin main
```

Each new ticker auto-generates 4-6 pages (IPO year if >= 1995, plus 2000/2005/2010/2015/2020/2023 as applicable).

### Add a new static page

```javascript
// 1. Create app/{page-name}/page.js
export const metadata = { title: 'Page Title', description: '...' };
export default function PageName() { return <div className="max-w-3xl mx-auto px-4 py-12">...</div>; }
// 2. Add nav link in app/layout.js if needed
```

### Refresh price data

```bash
python pipeline/pull_data.py && cp pipeline/output/*.json public/data/
git add public/data/ && git commit -m "Refresh prices March 2026" && git push
```

## Design system

### Fonts

| Role | Font | Class | Usage |
|------|------|-------|-------|
| Display | Outfit | `font-display` | Headings, nav, labels, section titles |
| Body | DM Sans | `font-body` | Paragraphs, descriptions |
| Mono | JetBrains Mono | `font-mono` | ALL numbers: prices, returns, %, table data |

### Colors (dark mode only, no light mode)

| Token | Hex | Class | Usage |
|-------|-----|-------|-------|
| Surface 900 | `#0a0a0f` | `bg-surface-900` | Page background |
| Surface 800 | `#12121a` | `bg-surface-800` | Cards, panels |
| Surface 700 | `#1a1a25` | `bg-surface-700` | Inputs, nested elements, hover |
| Surface 600 | `#22222f` | `bg-surface-600` | Active hover on nested |
| Gain | `#00dc82` | `text-gain` | Positive returns |
| Loss | `#ff4757` | `text-loss` | Negative returns |
| Accent | `#6366f1` | `text-accent` / `bg-accent` | Active buttons, S&P chart line |
| Muted | `#64748b` | `text-muted` | Labels, timestamps |
| Muted light | `#94a3b8` | `text-muted-light` | Body text, descriptions |

Borders: `border-white/5` everywhere.

### Layout

Homepage/grids: `max-w-6xl` (1152px). Company pages: `max-w-4xl` (896px). Text pages: `max-w-3xl` (768px). Padding: `px-4 sm:px-6`. Section gaps: `space-y-6`.

### Component patterns

```jsx
// Card
<div className="bg-surface-800 rounded-2xl border border-white/5 p-6">

// Section heading inside card
<h3 className="font-display font-semibold text-white">Title</h3>
<p className="text-xs text-muted mt-1">Subtitle</p>

// Return badge (positive / negative)
<span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-gain/10 text-gain">+4,374%</span>
<span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-loss/10 text-loss">-26.0%</span>

// Preset button (inactive / active)
<button className="px-3 py-1.5 rounded-lg text-sm font-mono bg-surface-700 text-muted-light hover:bg-surface-600">
<button className="px-3 py-1.5 rounded-lg text-sm font-mono bg-accent text-white">

// Table row
<tr className="border-b border-white/[0.03] table-row-hover">

// Hero number (the most important element on any company page)
<span className="font-mono font-bold text-hero-sm sm:text-hero text-gain hero-glow">$44,739</span>
```

## Writing rules

- **No em dashes.** Use periods, commas, or hyphens.
- **No en dashes for ranges.** Hyphens: `$5,000-$10,000`
- **No financial advice.** No stock picks, no predictions, no "you should invest in X."
- **Every page** includes: "Not financial advice. Past performance does not guarantee future results."
- **Dollar amounts** always have commas: `$44,739` not `$44739`
- **Positive returns** prefixed with `+`. Negative get natural minus.
- **Percentages:** one decimal under 10,000% (`+4,373.9%`), rounded above (`+24,610%`)
- **Use "since [year]"** not "from [year]" in headings.
- **Tone:** Confident, precise. Bloomberg terminal energy. Not playful.
- **Never hardcode** financial figures in templates. Everything from `all_pages.json`.
- **Words to avoid:** genuinely, honestly, straightforward, leverage, synergy, ecosystem

## Deployment

```bash
npm run dev            # Local: http://localhost:3000
npm run build          # Static export to out/
git push origin main   # Vercel auto-deploys in ~90s
```

- **Git:** github.com/[username]/whatifyouinvested
- **Hosting:** Vercel, auto-deploy from main
- **Domain:** whatifyouinvested.com (DNS via Vercel)
- **Analytics:** GA4 + Search Console (not yet configured)
- **Ads:** AdSense from launch, Mediavine at 50k sessions/month

## Current state

- **Version:** 1.0 (pre-launch)
- **Tickers:** 44 (34 stocks, 4 index funds, 4 recent IPOs, 2 crypto)
- **Pages:** 213 company-year combinations
- **Sectors:** 7 (Technology: 19, Consumer: 12, Financial: 5, Index: 4, Crypto: 2, Healthcare: 1, Industrial: 1)
- **Static pages:** Homepage, About, Methodology, Disclaimer
- **Data:** Price return only. No dividend reinvestment yet.
- **Missing:** Comparison pages, scenario pages, list pages, blog, sector hubs

## Roadmap

1. Deploy to Vercel, configure domain
2. Expand to 100 tickers / ~500 pages (Costco, Starbucks, Broadcom, Eli Lilly, etc.)
3. Comparison pages: `/apple-vs-microsoft-investment-returns/`
4. "What If" scenario pages: `/what-if/college-tuition-in-sp500/` (viral/shareable)
5. "Best Investments" list pages: `/best-investments-of-the-2010s/`
6. Sector hub pages: `/tech-stock-returns/`
7. Blog: 5-10 evergreen posts for topical authority
8. Dividend reinvestment toggle in calculator
9. GA4 + Search Console setup, AdSense integration
10. Expand to 250 tickers / ~1,200 pages
11. Automated monthly data refresh via GitHub Action
12. Dynamic OG images, XML sitemap generation

## Things NOT to do

- **No database.** Static JSON is the architecture. No Postgres, Supabase, Firebase.
- **No TypeScript.** Project is JavaScript throughout.
- **No CMS.** No Contentful, Sanity, or MDX.
- **No light mode.** Dark only. Deliberate.
- **No SSR.** `output: 'export'` = fully static. No API routes, no server actions.
- **No runtime data fetching.** Calculator uses multipliers from static data, not API calls.
- **No hardcoded financial numbers.** Every figure traces to `all_pages.json`.
- **No auth.** No user accounts. Public data tool.
- **No additional CSS frameworks.** No Bootstrap, Chakra, styled-components.
- **No font changes.** Outfit / DM Sans / JetBrains Mono are locked.
- **No em dashes.** Periods, commas, or hyphens.
- **Never remove the disclaimer.** Every company page needs it. Non-negotiable.
