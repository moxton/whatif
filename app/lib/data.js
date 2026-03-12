import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

let _pagesCache = null;
let _indexCache = null;
let _sectorsCache = null;

export function getAllPages() {
  if (_pagesCache) return _pagesCache;
  const raw = fs.readFileSync(path.join(DATA_DIR, 'all_pages.json'), 'utf-8');
  _pagesCache = JSON.parse(raw);
  return _pagesCache;
}

export function getCompanyIndex() {
  if (_indexCache) return _indexCache;
  const raw = fs.readFileSync(path.join(DATA_DIR, 'company_index.json'), 'utf-8');
  _indexCache = JSON.parse(raw);
  return _indexCache;
}

export function getSectors() {
  if (_sectorsCache) return _sectorsCache;
  const raw = fs.readFileSync(path.join(DATA_DIR, 'sectors.json'), 'utf-8');
  _sectorsCache = JSON.parse(raw);
  return _sectorsCache;
}

/**
 * Generate URL slug from company name and year.
 * e.g., "Apple" + 2010 => "apple-in-2010"
 */
export function makeSlug(companyName, year) {
  const clean = companyName
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${clean}-in-${year}`;
}

/**
 * Get a single page by its slug.
 */
export function getPageBySlug(slug) {
  const pages = getAllPages();
  return pages.find(p => makeSlug(p.company_name, p.start_year) === slug) || null;
}

/**
 * Get all pages for a given company (different start years).
 */
export function getPagesByCompany(ticker) {
  const pages = getAllPages();
  return pages.filter(p => p.ticker === ticker);
}

/**
 * Get all pages for a given sector.
 */
export function getPagesBySector(sector) {
  const pages = getAllPages();
  return pages.filter(p => p.sector === sector);
}

/**
 * Get all unique slugs for static path generation.
 */
export function getAllSlugs() {
  const pages = getAllPages();
  return pages.map(p => makeSlug(p.company_name, p.start_year));
}

/**
 * Get top performers by total return.
 */
export function getTopPerformers(limit = 20) {
  const pages = getAllPages();
  // Get the earliest start year page for each company
  const earliest = {};
  for (const p of pages) {
    if (!earliest[p.ticker] || p.start_year < earliest[p.ticker].start_year) {
      earliest[p.ticker] = p;
    }
  }
  return Object.values(earliest)
    .sort((a, b) => b.total_return_pct - a.total_return_pct)
    .slice(0, limit);
}

/**
 * Get popular/notable companies for homepage grid.
 */
export function getHomepageCompanies() {
  const featured = [
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'NVDA', 'TSLA',
    'META', 'NFLX', 'BRK-B', 'V', 'JPM', 'DPZ',
    'MNST', 'AMD', 'SHOP', 'CMG', 'BTC-USD', 'SPY',
  ];
  const pages = getAllPages();
  const result = [];
  for (const ticker of featured) {
    // Get the page with the most impressive return (earliest year)
    const companyPages = pages
      .filter(p => p.ticker === ticker)
      .sort((a, b) => a.start_year - b.start_year);
    if (companyPages.length > 0) {
      result.push(companyPages[0]);
    }
  }
  return result;
}

/**
 * Format currency for display.
 */
export function formatCurrency(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 100000) {
    return `$${Math.round(value).toLocaleString('en-US')}`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format percentage for display.
 */
export function formatPercent(value) {
  if (value >= 10000) {
    return `${Math.round(value).toLocaleString('en-US')}%`;
  }
  return `${value.toFixed(1)}%`;
}
