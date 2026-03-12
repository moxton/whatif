/**
 * Client-side calculation engine for the interactive calculator.
 * Produces pageData-compatible objects so GrowthChart and YearlyTable
 * work without modification.
 */

/**
 * Find the price entry for a given YYYY-MM string.
 */
export function getPriceAtMonth(prices, monthStr) {
  return prices.find((p) => p.d === monthStr) || null;
}

/**
 * Find the closest price entry at or after a given YYYY-MM string.
 */
export function getClosestPrice(prices, monthStr) {
  const exact = getPriceAtMonth(prices, monthStr);
  if (exact) return exact;
  for (const p of prices) {
    if (p.d >= monthStr) return p;
  }
  return null;
}

/**
 * Get the latest (last) price entry.
 */
export function getLatestPrice(prices) {
  return prices[prices.length - 1] || null;
}

/**
 * Calculate CAGR (compound annual growth rate).
 */
function calculateCAGR(startPrice, endPrice, years) {
  if (years <= 0 || startPrice <= 0) return 0;
  return (Math.pow(endPrice / startPrice, 1 / years) - 1) * 100;
}

/**
 * Build a yearly breakdown from monthly price data.
 * One entry per January from startYear to present year.
 */
function buildYearlyBreakdown(prices, startYear, startPrice, investment) {
  const latest = getLatestPrice(prices);
  if (!latest) return [];
  const currentYear = parseInt(latest.d.split('-')[0], 10);
  const rows = [];
  let prevPrice = startPrice;
  const shares = investment / startPrice;

  for (let y = startYear; y <= currentYear; y++) {
    const entry = getClosestPrice(prices, `${y}-01`);
    if (!entry) continue;

    const price = entry.p;
    const value = shares * price;
    const annualReturn = prevPrice ? ((price - prevPrice) / prevPrice) * 100 : 0;
    const cumulativeReturn = ((price - startPrice) / startPrice) * 100;

    rows.push({
      year: y,
      price: Math.round(price * 100) / 100,
      value: Math.round(value * 100) / 100,
      annual_return_pct: Math.round(annualReturn * 10) / 10,
      cumulative_return_pct: Math.round(cumulativeReturn * 10) / 10,
    });
    prevPrice = price;
  }

  return rows;
}

/**
 * Calculate investment results.
 * Returns a pageData-compatible object for GrowthChart and YearlyTable.
 *
 * @param {object} companyData - Full ticker JSON {ticker, name, sector, prices}
 * @param {object} spyData - SPY JSON {ticker, name, sector, prices}
 * @param {string} startMonth - "YYYY-MM"
 * @param {number} investmentAmount - Dollar amount
 * @returns {object|null} - pageData-compatible object, or null if no data
 */
export function calculateInvestment(companyData, spyData, startMonth, investmentAmount) {
  const startEntry = getClosestPrice(companyData.prices, startMonth);
  if (!startEntry) return null;

  const latest = getLatestPrice(companyData.prices);
  if (!latest) return null;

  const startPrice = startEntry.p;
  const currentPrice = latest.p;
  const startYear = parseInt(startEntry.d.split('-')[0], 10);

  const shares = investmentAmount / startPrice;
  const currentValue = shares * currentPrice;
  const totalReturnPct = ((currentPrice - startPrice) / startPrice) * 100;

  // Calculate years held from start month to latest month
  const [startY, startM] = startEntry.d.split('-').map(Number);
  const [endY, endM] = latest.d.split('-').map(Number);
  const yearsHeld = (endY - startY) + (endM - startM) / 12;

  const cagr = calculateCAGR(startPrice, currentPrice, yearsHeld);

  // S&P 500 comparison
  let sp500Comparison = {
    start_price: null,
    current_value: null,
    total_return_pct: null,
    annualized_return_pct: null,
  };

  const spyStart = getClosestPrice(spyData.prices, startMonth);
  const spyLatest = getLatestPrice(spyData.prices);
  if (spyStart && spyLatest) {
    const spyShares = investmentAmount / spyStart.p;
    const spyValue = spyShares * spyLatest.p;
    const spyReturn = ((spyLatest.p - spyStart.p) / spyStart.p) * 100;
    const spyCagr = calculateCAGR(spyStart.p, spyLatest.p, yearsHeld);

    sp500Comparison = {
      start_price: Math.round(spyStart.p * 100) / 100,
      current_value: Math.round(spyValue * 100) / 100,
      total_return_pct: Math.round(spyReturn * 10) / 10,
      annualized_return_pct: Math.round(spyCagr * 10) / 10,
    };
  }

  // Build yearly breakdowns
  const yearlyBreakdown = buildYearlyBreakdown(
    companyData.prices, startYear, startPrice, investmentAmount
  );
  const sp500YearlyBreakdown = spyStart
    ? buildYearlyBreakdown(spyData.prices, startYear, spyStart.p, investmentAmount)
    : [];

  return {
    ticker: companyData.ticker,
    company_name: companyData.name,
    sector: companyData.sector,
    start_year: startYear,
    start_price: Math.round(startPrice * 100) / 100,
    current_price: Math.round(currentPrice * 100) / 100,
    price_date: latest.d,
    default_investment: investmentAmount,
    current_value: Math.round(currentValue * 100) / 100,
    total_return_pct: Math.round(totalReturnPct * 10) / 10,
    annualized_return_pct: Math.round(cagr * 10) / 10,
    years_held: Math.round(yearsHeld * 10) / 10,
    sp500_comparison: sp500Comparison,
    yearly_breakdown: yearlyBreakdown,
    sp500_yearly_breakdown: sp500YearlyBreakdown,
  };
}
