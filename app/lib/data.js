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

// ── Comparison Pages ─────────────────────────────────────────────────────

/**
 * Pre-defined matchups for comparison pages.
 * Alphabetical by ticker within each pair.
 */
const MATCHUPS = [
  ['AAPL', 'AMZN'],
  ['AAPL', 'GOOGL'],
  ['AAPL', 'MSFT'],
  ['AAPL', 'TSLA'],
  ['AMD', 'NVDA'],
  ['AMZN', 'GOOGL'],
  ['AMZN', 'SHOP'],
  ['BRK-B', 'SPY'],
  ['BTC-USD', 'ETH-USD'],
  ['BTC-USD', 'NVDA'],
  ['BTC-USD', 'SPY'],
  ['CMG', 'MCD'],
  ['CRWD', 'PLTR'],
  ['DIS', 'NFLX'],
  ['GOOGL', 'META'],
  ['GOOGL', 'MSFT'],
  ['HD', 'WMT'],
  ['JPM', 'V'],
  ['KO', 'PG'],
  ['LULU', 'NKE'],
  ['MA', 'V'],
  ['MNST', 'DPZ'],
  ['NVDA', 'TSLA'],
  ['QQQ', 'SPY'],
];

let _comparisonsCache = null;

function cleanName(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate comparison page slug.
 * e.g., "Apple" + "Microsoft" + 2010 => "apple-vs-microsoft-since-2010"
 */
export function makeComparisonSlug(nameA, nameB, year) {
  return `${cleanName(nameA)}-vs-${cleanName(nameB)}-since-${year}`;
}

/**
 * Get all comparison page objects.
 * Returns [{ slug, pageA, pageB, year }]
 */
export function getAllComparisons() {
  if (_comparisonsCache) return _comparisonsCache;

  const index = getCompanyIndex();
  const pages = getAllPages();
  const comparisons = [];

  for (const [tickerA, tickerB] of MATCHUPS) {
    const compA = index.find(c => c.ticker === tickerA);
    const compB = index.find(c => c.ticker === tickerB);
    if (!compA || !compB) continue;

    const overlapping = compA.start_years.filter(y => compB.start_years.includes(y));

    for (const year of overlapping) {
      const pageA = pages.find(p => p.ticker === tickerA && p.start_year === year);
      const pageB = pages.find(p => p.ticker === tickerB && p.start_year === year);
      if (!pageA || !pageB) continue;

      comparisons.push({
        slug: makeComparisonSlug(compA.name, compB.name, year),
        pageA,
        pageB,
        year,
      });
    }
  }

  _comparisonsCache = comparisons;
  return comparisons;
}

/**
 * Get a single comparison by slug.
 */
export function getComparisonBySlug(slug) {
  return getAllComparisons().find(c => c.slug === slug) || null;
}

/**
 * Get all comparison slugs for generateStaticParams.
 */
export function getAllComparisonSlugs() {
  return getAllComparisons().map(c => c.slug);
}

/**
 * Get comparison partners for a given stock page.
 * Returns [{ partnerName, partnerTicker, comparisonSlug }]
 */
export function getComparisonPartnersForPage(ticker, startYear) {
  const comparisons = getAllComparisons();
  const partners = [];

  for (const c of comparisons) {
    if (c.year !== startYear) continue;
    if (c.pageA.ticker === ticker) {
      partners.push({
        partnerName: c.pageB.company_name,
        partnerTicker: c.pageB.ticker,
        comparisonSlug: c.slug,
      });
    } else if (c.pageB.ticker === ticker) {
      partners.push({
        partnerName: c.pageA.company_name,
        partnerTicker: c.pageA.ticker,
        comparisonSlug: c.slug,
      });
    }
  }

  return partners;
}

/**
 * Get popular comparisons for homepage. Returns earliest year per pair for max drama.
 */
export function getPopularComparisons(limit = 6) {
  const comparisons = getAllComparisons();
  const popular = [];

  // Priority matchups for homepage (most searched), as [tickerA, tickerB]
  const priority = [
    ['AAPL', 'MSFT'], ['NVDA', 'TSLA'], ['AAPL', 'AMZN'],
    ['BTC-USD', 'SPY'], ['GOOGL', 'META'], ['AMD', 'NVDA'],
    ['QQQ', 'SPY'], ['KO', 'PG'], ['AAPL', 'GOOGL'], ['HD', 'WMT'],
  ];

  for (const [tA, tB] of priority) {
    if (popular.length >= limit) break;

    const match = comparisons
      .filter(c =>
        (c.pageA.ticker === tA && c.pageB.ticker === tB) ||
        (c.pageA.ticker === tB && c.pageB.ticker === tA)
      )
      .sort((a, b) => a.year - b.year)[0];

    if (match) popular.push(match);
  }

  return popular;
}
