#!/usr/bin/env python3
"""
What If You Invested — Data Pipeline
Pulls historical stock prices via yfinance, calculates returns,
and outputs structured JSON for page generation.
"""

import yfinance as yf
import json
import os
import sys
from datetime import datetime, date
from math import pow

# ── Seed Companies ──────────────────────────────────────────────────────────

COMPANIES = {
    # Mega-cap tech
    "AAPL":  {"name": "Apple", "sector": "Technology", "ipo_year": 1980},
    "MSFT":  {"name": "Microsoft", "sector": "Technology", "ipo_year": 1986},
    "AMZN":  {"name": "Amazon", "sector": "Technology", "ipo_year": 1997},
    "GOOGL": {"name": "Alphabet (Google)", "sector": "Technology", "ipo_year": 2004},
    "META":  {"name": "Meta (Facebook)", "sector": "Technology", "ipo_year": 2012},
    "NVDA":  {"name": "Nvidia", "sector": "Technology", "ipo_year": 1999},
    "TSLA":  {"name": "Tesla", "sector": "Technology", "ipo_year": 2010},
    "NFLX":  {"name": "Netflix", "sector": "Technology", "ipo_year": 2002},

    # Blue chips
    "BRK-B": {"name": "Berkshire Hathaway", "sector": "Financial", "ipo_year": 1996},
    "JNJ":   {"name": "Johnson & Johnson", "sector": "Healthcare", "ipo_year": 1944},
    "PG":    {"name": "Procter & Gamble", "sector": "Consumer", "ipo_year": 1890},
    "KO":    {"name": "Coca-Cola", "sector": "Consumer", "ipo_year": 1919},
    "WMT":   {"name": "Walmart", "sector": "Consumer", "ipo_year": 1972},
    "JPM":   {"name": "JPMorgan Chase", "sector": "Financial", "ipo_year": 1969},
    "DIS":   {"name": "Disney", "sector": "Consumer", "ipo_year": 1957},
    "MCD":   {"name": "McDonald's", "sector": "Consumer", "ipo_year": 1965},
    "NKE":   {"name": "Nike", "sector": "Consumer", "ipo_year": 1980},
    "HD":    {"name": "Home Depot", "sector": "Consumer", "ipo_year": 1981},
    "V":     {"name": "Visa", "sector": "Financial", "ipo_year": 2008},
    "MA":    {"name": "Mastercard", "sector": "Financial", "ipo_year": 2006},

    # High-growth stories
    "SHOP":  {"name": "Shopify", "sector": "Technology", "ipo_year": 2015},
    "ZM":    {"name": "Zoom", "sector": "Technology", "ipo_year": 2019},
    "ROKU":  {"name": "Roku", "sector": "Technology", "ipo_year": 2017},
    "CRWD":  {"name": "CrowdStrike", "sector": "Technology", "ipo_year": 2019},
    "PLTR":  {"name": "Palantir", "sector": "Technology", "ipo_year": 2020},
    "SNOW":  {"name": "Snowflake", "sector": "Technology", "ipo_year": 2020},
    "MELI":  {"name": "MercadoLibre", "sector": "Technology", "ipo_year": 2007},
    "SE":    {"name": "Sea Limited", "sector": "Technology", "ipo_year": 2017},

    # Recent IPOs / popular retail
    "ABNB":  {"name": "Airbnb", "sector": "Consumer", "ipo_year": 2020},
    "DASH":  {"name": "DoorDash", "sector": "Technology", "ipo_year": 2020},
    "COIN":  {"name": "Coinbase", "sector": "Financial", "ipo_year": 2021},
    "RIVN":  {"name": "Rivian", "sector": "Industrial", "ipo_year": 2021},
    "RBLX":  {"name": "Roblox", "sector": "Technology", "ipo_year": 2021},

    # Classic "what if" stories
    "MNST":  {"name": "Monster Beverage", "sector": "Consumer", "ipo_year": 1995},
    "DPZ":   {"name": "Domino's Pizza", "sector": "Consumer", "ipo_year": 2004},
    "AMD":   {"name": "AMD", "sector": "Technology", "ipo_year": 1972},
    "LULU":  {"name": "Lululemon", "sector": "Consumer", "ipo_year": 2007},
    "CMG":   {"name": "Chipotle", "sector": "Consumer", "ipo_year": 2006},

    # Index funds
    "SPY":   {"name": "S&P 500 (SPY)", "sector": "Index", "ipo_year": 1993},
    "QQQ":   {"name": "Nasdaq 100 (QQQ)", "sector": "Index", "ipo_year": 1999},
    "DIA":   {"name": "Dow Jones (DIA)", "sector": "Index", "ipo_year": 1998},
    "VTI":   {"name": "Total Market (VTI)", "sector": "Index", "ipo_year": 2001},
}

# Crypto handled separately (yfinance supports these tickers)
CRYPTO = {
    "BTC-USD": {"name": "Bitcoin", "sector": "Crypto", "ipo_year": 2014},
    "ETH-USD": {"name": "Ethereum", "sector": "Crypto", "ipo_year": 2017},
}

# S&P 500 benchmark ticker
SP500_TICKER = "SPY"

# Standard start years to generate pages for
STANDARD_YEARS = [2000, 2005, 2010, 2015, 2020]

# Default investment amount
DEFAULT_INVESTMENT = 1000


def get_start_years(ipo_year):
    """
    Determine which start years to generate pages for.
    Include IPO year (or year after) plus standard intervals.
    """
    # Earliest available year is max(ipo_year, 2000) for most, but allow older blue chips
    earliest = max(ipo_year, 1995)
    years = []

    # Add IPO year if it's meaningful
    if ipo_year >= 1995:
        years.append(ipo_year)

    # Add standard years that are >= IPO year
    for y in STANDARD_YEARS:
        if y >= earliest and y not in years:
            years.append(y)

    # Always try to add a recent year
    if 2023 not in years and 2023 >= earliest:
        years.append(2023)

    return sorted(years)


def fetch_history(ticker, start_date="1993-01-01"):
    """Fetch full price history from yfinance. Returns monthly data."""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(start=start_date, interval="1mo", auto_adjust=True)
        if hist.empty:
            print(f"  WARNING: No data for {ticker}")
            return None
        return hist
    except Exception as e:
        print(f"  ERROR fetching {ticker}: {e}")
        return None


def get_price_at_date(hist, year, month=1):
    """Get the closing price closest to Jan 1 of the given year."""
    target = f"{year}-{month:02d}"
    # Find closest date at or after target
    mask = hist.index >= target
    if mask.any():
        return float(hist.loc[mask].iloc[0]["Close"])
    return None


def get_latest_price(hist):
    """Get the most recent closing price."""
    if hist is not None and not hist.empty:
        return float(hist.iloc[-1]["Close"])
    return None


def get_latest_date(hist):
    """Get the date of the most recent price."""
    if hist is not None and not hist.empty:
        return hist.index[-1].strftime("%Y-%m-%d")
    return None


def build_yearly_breakdown(hist, start_year, start_price, investment=DEFAULT_INVESTMENT):
    """
    Build year-by-year table from start_year to present.
    Returns list of dicts with year, price, value, annual return, cumulative return.
    """
    current_year = datetime.now().year
    rows = []
    prev_price = start_price
    shares = investment / start_price

    for y in range(start_year, current_year + 1):
        price = get_price_at_date(hist, y)
        if price is None:
            continue

        value = shares * price
        annual_return = ((price - prev_price) / prev_price) * 100 if prev_price else 0
        cumulative_return = ((price - start_price) / start_price) * 100

        rows.append({
            "year": y,
            "price": round(price, 2),
            "value": round(value, 2),
            "annual_return_pct": round(annual_return, 1),
            "cumulative_return_pct": round(cumulative_return, 1),
        })
        prev_price = price

    return rows


def calculate_annualized_return(start_price, end_price, years):
    """Calculate compound annual growth rate (CAGR)."""
    if years <= 0 or start_price <= 0:
        return 0
    return (pow(end_price / start_price, 1 / years) - 1) * 100


def extract_monthly_prices(hist):
    """Extract monthly closing prices as compact {d, p} records."""
    records = []
    for idx, row in hist.iterrows():
        month_str = idx.strftime("%Y-%m")
        records.append({"d": month_str, "p": round(float(row["Close"]), 2)})
    return records


def process_company(ticker, info, sp500_hist, history_cache=None):
    """Process one company: fetch data, calculate returns for all start years."""
    print(f"Processing {ticker} ({info['name']})...")
    hist = fetch_history(ticker)
    if hist is None:
        return None

    # Cache the history DataFrame for later price file output
    if history_cache is not None:
        history_cache[ticker] = hist

    latest_price = get_latest_price(hist)
    latest_date = get_latest_date(hist)
    if latest_price is None:
        print(f"  Skipping {ticker} - no current price")
        return None

    start_years = get_start_years(info["ipo_year"])
    pages = []

    for year in start_years:
        start_price = get_price_at_date(hist, year)
        if start_price is None:
            print(f"  Skipping {ticker} for {year} - no price data")
            continue

        # Calculate investment returns
        shares = DEFAULT_INVESTMENT / start_price
        current_value = shares * latest_price
        total_return_pct = ((latest_price - start_price) / start_price) * 100
        years_held = datetime.now().year - year + (datetime.now().month / 12)
        cagr = calculate_annualized_return(start_price, latest_price, years_held)

        # S&P 500 comparison for same period
        sp500_start = get_price_at_date(sp500_hist, year)
        sp500_end = get_latest_price(sp500_hist)
        sp500_value = None
        sp500_return_pct = None
        sp500_cagr = None
        if sp500_start and sp500_end:
            sp500_shares = DEFAULT_INVESTMENT / sp500_start
            sp500_value = round(sp500_shares * sp500_end, 2)
            sp500_return_pct = round(((sp500_end - sp500_start) / sp500_start) * 100, 1)
            sp500_cagr = round(calculate_annualized_return(sp500_start, sp500_end, years_held), 1)

        # Year-by-year breakdown
        yearly = build_yearly_breakdown(hist, year, start_price)

        # S&P 500 year-by-year for chart overlay
        sp500_yearly = []
        if sp500_start:
            sp500_yearly = build_yearly_breakdown(sp500_hist, year, sp500_start)

        page_data = {
            "ticker": ticker,
            "company_name": info["name"],
            "sector": info["sector"],
            "start_year": year,
            "start_price": round(start_price, 2),
            "current_price": round(latest_price, 2),
            "price_date": latest_date,
            "default_investment": DEFAULT_INVESTMENT,
            "current_value": round(current_value, 2),
            "total_return_pct": round(total_return_pct, 1),
            "annualized_return_pct": round(cagr, 1),
            "years_held": round(years_held, 1),
            "sp500_comparison": {
                "start_price": round(sp500_start, 2) if sp500_start else None,
                "current_value": sp500_value,
                "total_return_pct": sp500_return_pct,
                "annualized_return_pct": sp500_cagr,
            },
            "yearly_breakdown": yearly,
            "sp500_yearly_breakdown": sp500_yearly,
        }
        pages.append(page_data)
        print(f"  ✓ {info['name']} in {year}: ${DEFAULT_INVESTMENT} → ${current_value:,.2f} ({total_return_pct:+.1f}%)")

    return pages


def main():
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
    os.makedirs(output_dir, exist_ok=True)

    print("=" * 70)
    print("WHAT IF YOU INVESTED — Data Pipeline")
    print("=" * 70)
    print(f"Pulling data for {len(COMPANIES) + len(CRYPTO)} tickers...")
    print()

    # Fetch S&P 500 benchmark data first
    print("Fetching S&P 500 benchmark data...")
    sp500_hist = fetch_history(SP500_TICKER, start_date="1993-01-01")
    if sp500_hist is None:
        print("FATAL: Could not fetch S&P 500 data. Exiting.")
        sys.exit(1)
    print(f"  S&P 500 data: {len(sp500_hist)} monthly records")
    print()

    all_pages = []
    company_index = []
    errors = []
    history_cache = {}  # Cache DataFrames for price file output

    # Process stocks
    all_tickers = {**COMPANIES, **CRYPTO}
    for ticker, info in all_tickers.items():
        try:
            pages = process_company(ticker, info, sp500_hist, history_cache)
            if pages:
                all_pages.extend(pages)
                company_index.append({
                    "ticker": ticker,
                    "name": info["name"],
                    "sector": info["sector"],
                    "page_count": len(pages),
                    "start_years": [p["start_year"] for p in pages],
                })
            else:
                errors.append(ticker)
        except Exception as e:
            print(f"  EXCEPTION on {ticker}: {e}")
            errors.append(ticker)

    # Save all page data
    pages_file = os.path.join(output_dir, "all_pages.json")
    with open(pages_file, "w") as f:
        json.dump(all_pages, f, indent=2)

    # Save company index
    index_file = os.path.join(output_dir, "company_index.json")
    with open(index_file, "w") as f:
        json.dump(company_index, f, indent=2)

    # Save sector groupings
    sectors = {}
    for item in company_index:
        sec = item["sector"]
        if sec not in sectors:
            sectors[sec] = []
        sectors[sec].append(item)
    sector_file = os.path.join(output_dir, "sectors.json")
    with open(sector_file, "w") as f:
        json.dump(sectors, f, indent=2)

    # ── Per-ticker monthly price files for interactive calculator ────────
    prices_dir = os.path.join(output_dir, "prices")
    os.makedirs(prices_dir, exist_ok=True)

    # Also cache SPY history
    history_cache[SP500_TICKER] = sp500_hist

    calculator_index = []
    price_file_count = 0

    for ticker, hist in history_cache.items():
        if hist is None or hist.empty:
            continue
        info = all_tickers.get(ticker, {"name": ticker, "sector": "Index"})
        prices = extract_monthly_prices(hist)
        if not prices:
            continue

        price_data = {
            "ticker": ticker,
            "name": info["name"],
            "sector": info["sector"],
            "prices": prices,
        }
        # Use ticker as filename, replace special chars for filesystem
        safe_ticker = ticker.replace("/", "-")
        price_file = os.path.join(prices_dir, f"{safe_ticker}.json")
        with open(price_file, "w") as f:
            json.dump(price_data, f, separators=(",", ":"))
        price_file_count += 1

        calculator_index.append({
            "ticker": ticker,
            "name": info["name"],
            "sector": info["sector"],
            "first_month": prices[0]["d"],
            "last_month": prices[-1]["d"],
        })

    # Save calculator index
    calc_index_file = os.path.join(output_dir, "calculator_index.json")
    with open(calc_index_file, "w") as f:
        json.dump(calculator_index, f, indent=2)

    print()
    print(f"Calculator price files: {price_file_count} tickers in {prices_dir}")
    print(f"Calculator index: {calc_index_file}")

    # Summary
    print()
    print("=" * 70)
    print("PIPELINE COMPLETE")
    print("=" * 70)
    print(f"Total pages generated: {len(all_pages)}")
    print(f"Companies processed:   {len(company_index)}")
    print(f"Errors/skipped:        {len(errors)} — {errors if errors else 'none'}")
    print()
    print(f"Output files:")
    print(f"  {pages_file} ({os.path.getsize(pages_file) / 1024:.0f} KB)")
    print(f"  {index_file}")
    print(f"  {sector_file}")

    # Print top performers summary
    print()
    print("TOP 10 BEST RETURNS (earliest available start year):")
    print("-" * 70)

    # Get earliest page per company
    earliest = {}
    for p in all_pages:
        key = p["ticker"]
        if key not in earliest or p["start_year"] < earliest[key]["start_year"]:
            earliest[key] = p

    sorted_pages = sorted(earliest.values(), key=lambda x: x["total_return_pct"], reverse=True)
    for i, p in enumerate(sorted_pages[:10]):
        print(f"  {i+1:2d}. {p['company_name']:25s} (since {p['start_year']}): "
              f"${DEFAULT_INVESTMENT} → ${p['current_value']:>12,.2f} ({p['total_return_pct']:>+10.1f}%)")


if __name__ == "__main__":
    main()
