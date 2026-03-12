# What If You Invested

Historical stock return calculator. 213 pages across 44 companies. Dark-mode, data-forward design with interactive calculators and S&P 500 comparison charts.

## Quick start

```bash
# Install dependencies
npm install

# Run locally
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
```

## Project structure

```
whatifyouinvested/
├── app/
│   ├── layout.js                          # Root layout (nav, footer, fonts)
│   ├── page.js                            # Homepage
│   ├── globals.css                        # Global styles
│   ├── components/
│   │   ├── Calculator.js                  # Interactive investment calculator
│   │   ├── GrowthChart.js                 # Line chart (Recharts)
│   │   ├── YearlyTable.js                 # Year-by-year breakdown table
│   │   ├── RelatedLinks.js                # Internal linking component
│   │   ├── AffiliateCTA.js                # Brokerage affiliate box
│   │   └── FAQSchema.js                   # Structured data for Google
│   ├── lib/
│   │   └── data.js                        # Data loading utilities
│   ├── what-if-you-invested-in/
│   │   └── [slug]/
│   │       └── page.js                    # Company investment pages (213 pages)
│   ├── methodology/
│   │   └── page.js
│   ├── about/
│   │   └── page.js
│   └── disclaimer/
│       └── page.js
├── public/
│   └── data/
│       ├── all_pages.json                 # All 213 page records (1 MB)
│       ├── company_index.json             # Company master list
│       └── sectors.json                   # Sector groupings
├── pipeline/
│   └── pull_data.py                       # Data refresh script (Python)
├── package.json
├── next.config.js                         # Static export config
├── tailwind.config.js                     # Dark mode design system
└── postcss.config.js
```

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/whatifyouinvested.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import the whatifyouinvested repository
4. Framework preset: Next.js (auto-detected)
5. Click "Deploy"

That's it. Vercel will build and deploy the site. Every push to main triggers a new deployment.

### Step 3: Add custom domain

1. In Vercel dashboard, go to your project > Settings > Domains
2. Add `whatifyouinvested.com` (or your chosen domain)
3. Update your domain's DNS to point to Vercel (they'll show you the records)

## Refreshing stock price data

The data pipeline uses Python and yfinance to pull fresh prices from Yahoo Finance.

```bash
# Install yfinance (one time)
pip install yfinance

# Run the pipeline
python pipeline/pull_data.py

# This outputs updated JSON files to pipeline/output/
# Copy them to the project
cp pipeline/output/*.json public/data/

# Commit and push to trigger a new Vercel deployment
git add public/data/
git commit -m "Refresh price data"
git push
```

Run this monthly to keep prices current.

## Adding new companies

Edit `pull_data.py` and add tickers to the COMPANIES dict:

```python
"TICKER": {"name": "Company Name", "sector": "Sector", "ipo_year": 2000},
```

Then re-run the pipeline.

## Monetization setup

### Google AdSense
1. Sign up at adsense.google.com
2. Add the AdSense script to `app/layout.js` in the `<head>`
3. Create ad units and place them in the page template

### Affiliate links
Update the href values in `app/components/AffiliateCTA.js` with your actual affiliate links for each brokerage.

### Mediavine (at 50k sessions/month)
Apply at mediavine.com. Finance RPMs are typically $25-50, so 50k sessions = $1,250-2,500/month.

## Design system

- Background: #0a0a0f (near-black)
- Cards: #12121a
- Gain (green): #00dc82
- Loss (red): #ff4757
- Accent (purple): #6366f1
- Display font: Outfit
- Body font: DM Sans
- Numbers: JetBrains Mono
