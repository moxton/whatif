'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { calculateInvestment } from '../lib/calculator';
import GrowthChart from './GrowthChart';
import YearlyTable from './YearlyTable';

const PRESETS = [100, 500, 1000, 5000, 10000, 50000];
const POPULAR_TICKERS = ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'BTC-USD', 'GOOGL', 'NFLX', 'META'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TEASER_EXAMPLES = [
  { name: 'Nvidia', year: 2015, value: '$283,420', pct: '+28,242%' },
  { name: 'Apple', year: 2010, value: '$45,321', pct: '+4,432%' },
  { name: 'Bitcoin', year: 2014, value: '$294,697', pct: '+29,370%' },
  { name: 'Tesla', year: 2010, value: '$118,508', pct: '+11,751%' },
  { name: 'Amazon', year: 1997, value: '$358,742', pct: '+35,774%' },
  { name: 'Netflix', year: 2005, value: '$73,831', pct: '+7,283%' },
];

function formatValue(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  return `$${Math.round(val).toLocaleString('en-US')}`;
}

// ── Rotating Teaser ────────────────────────────────────────────────────
function RotatingTeaser() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TEASER_EXAMPLES.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const example = TEASER_EXAMPLES[index];

  return (
    <div className="text-center py-6">
      <p className={`text-sm text-muted-light mb-1 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        $1,000 in {example.name} in {example.year}
      </p>
      <p className={`font-mono font-bold text-3xl sm:text-4xl text-gain hero-glow tracking-tight transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {example.value}
      </p>
      <p className={`text-xs font-mono text-gain/70 mt-1 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {example.pct}
      </p>
    </div>
  );
}

// ── Share Buttons ──────────────────────────────────────────────────────
function ShareButtons({ result, investment, selectedMonth, selectedYear }) {
  const [copied, setCopied] = useState(false);

  const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const shareUrl = `https://whatifyouinvested.com/calculator/?t=${result.ticker}&m=${monthStr}&a=${investment}`;
  const shareText = `$${investment.toLocaleString('en-US')} invested in ${result.company_name} in ${MONTHS[selectedMonth - 1]} ${selectedYear} would be worth ${formatValue(result.current_value)} today (${result.total_return_pct >= 0 ? '+' : ''}${result.total_return_pct.toFixed(1)}%)`;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTwitter() {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }

  return (
    <div className="flex items-center gap-2 mt-5">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium bg-surface-700 text-muted-light hover:bg-surface-600 hover:text-white transition-colors border border-white/5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <button
        onClick={handleTwitter}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium bg-surface-700 text-muted-light hover:bg-surface-600 hover:text-white transition-colors border border-white/5"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>
    </div>
  );
}

// ── Company Search ──────────────────────────────────────────────────────
function CompanySearch({ companies, selected, onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return companies;
    const q = query.toLowerCase();
    return companies.filter(
      (c) => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q)
    );
  }, [query, companies]);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs text-muted uppercase tracking-wider mb-2 font-display font-medium">
        Company or ticker
      </label>
      <input
        type="text"
        value={selected ? selected.name : query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (selected) onSelect(null);
          setOpen(true);
        }}
        onFocus={() => {
          if (!selected) setOpen(true);
          if (selected) {
            onSelect(null);
            setQuery('');
            setOpen(true);
          }
        }}
        placeholder="Search Apple, TSLA, Bitcoin..."
        className="w-full bg-surface-700 border border-white/10 rounded-lg px-4 py-3 text-white font-body placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-surface-800 border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {filtered.map((company) => (
            <button
              key={company.ticker}
              onClick={() => {
                onSelect(company);
                setQuery('');
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-surface-700 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-white font-display font-medium">{company.name}</span>
                <span className="text-muted text-xs ml-2">{company.ticker}</span>
              </div>
              <span className="text-xs text-muted">{company.sector}</span>
            </button>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-surface-800 border border-white/10 rounded-lg shadow-xl px-4 py-3">
          <p className="text-sm text-muted">No companies found</p>
        </div>
      )}
    </div>
  );
}

// ── Date Picker ─────────────────────────────────────────────────────────
function DatePicker({ firstMonth, lastMonth, selectedMonth, selectedYear, onMonthChange, onYearChange }) {
  const [firstY, firstM] = firstMonth.split('-').map(Number);
  const [lastY, lastM] = lastMonth.split('-').map(Number);

  const years = [];
  for (let y = firstY; y <= lastY; y++) years.push(y);

  // Constrain month options based on selected year
  const monthOptions = MONTHS.map((name, i) => {
    const m = i + 1;
    const tooEarly = selectedYear === firstY && m < firstM;
    const tooLate = selectedYear === lastY && m > lastM;
    return { name, value: m, disabled: tooEarly || tooLate };
  });

  return (
    <div>
      <label className="block text-xs text-muted uppercase tracking-wider mb-2 font-display font-medium">
        Start date
      </label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="bg-surface-700 border border-white/10 rounded-lg px-3 py-3 text-white font-body focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors appearance-none"
        >
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value} disabled={m.disabled}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-surface-700 border border-white/10 rounded-lg px-3 py-3 text-white font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors appearance-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────
export default function InteractiveCalculator({ companies }) {
  const [selected, setSelected] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [spyData, setSpyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [investment, setInvestment] = useState(1000);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2010);
  const [error, setError] = useState(null);

  const spyCacheRef = useRef(null);
  const initializedRef = useRef(false);
  const searchParams = useSearchParams();

  // Load from URL params on mount (for shared links)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const ticker = searchParams.get('t');
    const month = searchParams.get('m');
    const amount = searchParams.get('a');

    if (!ticker) return;

    const company = companies.find((c) => c.ticker === ticker);
    if (!company) return;

    if (amount) setInvestment(Math.max(1, Number(amount) || 1000));
    if (month) {
      const [y, m] = month.split('-').map(Number);
      if (y) setSelectedYear(y);
      if (m) setSelectedMonth(m);
    }

    // Trigger the company load after state is set
    handleSelectCompanyFromParams(company, month, amount);
  }, [companies, searchParams]);

  // Separate loader for URL params (doesn't override date/amount with defaults)
  const handleSelectCompanyFromParams = useCallback(async (company, monthParam, amountParam) => {
    setSelected(company);
    setLoading(true);
    try {
      const ticker = company.ticker.replace('/', '-');
      const res = await fetch(`/data/prices/${ticker}.json`);
      if (!res.ok) throw new Error(`Failed to load ${company.name} data`);
      const data = await res.json();
      setCompanyData(data);

      if (!spyCacheRef.current) {
        const spyRes = await fetch('/data/prices/SPY.json');
        if (!spyRes.ok) throw new Error('Failed to load S&P 500 data');
        spyCacheRef.current = await spyRes.json();
      }
      setSpyData(spyCacheRef.current);
    } catch (e) {
      setError(e.message);
      setCompanyData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectCompany = useCallback(async (company) => {
    setSelected(company);
    setError(null);

    if (!company) {
      setCompanyData(null);
      return;
    }

    setLoading(true);
    try {
      // Fetch company price data
      const ticker = company.ticker.replace('/', '-');
      const res = await fetch(`/data/prices/${ticker}.json`);
      if (!res.ok) throw new Error(`Failed to load ${company.name} data`);
      const data = await res.json();
      setCompanyData(data);

      // Set default date to earliest available
      const [firstY, firstM] = company.first_month.split('-').map(Number);
      setSelectedYear(firstY);
      setSelectedMonth(firstM);

      // Fetch SPY data (cache after first load)
      if (!spyCacheRef.current) {
        const spyRes = await fetch('/data/prices/SPY.json');
        if (!spyRes.ok) throw new Error('Failed to load S&P 500 data');
        const spy = await spyRes.json();
        spyCacheRef.current = spy;
        setSpyData(spy);
      } else {
        setSpyData(spyCacheRef.current);
      }
    } catch (e) {
      setError(e.message);
      setCompanyData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle month/year changes with validation
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    if (selected) {
      const [firstY, firstM] = selected.first_month.split('-').map(Number);
      const [lastY, lastM] = selected.last_month.split('-').map(Number);
      if (year === firstY && selectedMonth < firstM) setSelectedMonth(firstM);
      if (year === lastY && selectedMonth > lastM) setSelectedMonth(lastM);
    }
  }, [selected, selectedMonth]);

  const handleMonthChange = useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  // Calculate results
  const result = useMemo(() => {
    if (!companyData || !spyData) return null;
    const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    return calculateInvestment(companyData, spyData, monthStr, investment);
  }, [companyData, spyData, selectedYear, selectedMonth, investment]);

  // Sync URL params when result changes
  useEffect(() => {
    if (!result) return;
    const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    const params = new URLSearchParams({ t: result.ticker, m: monthStr, a: String(investment) });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [result, selectedYear, selectedMonth, investment]);

  const isPositive = result ? result.total_return_pct >= 0 : true;

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 space-y-5">
          {/* Company search */}
          <CompanySearch
            companies={companies}
            selected={selected}
            onSelect={handleSelectCompany}
          />

          {/* Empty state - teaser + popular picks */}
          {!selected && !loading && (
            <div>
              <RotatingTeaser />

              <div className="border-t border-white/5 pt-5">
                <p className="text-xs text-muted uppercase tracking-wider mb-3 font-display font-medium">
                  Try it yourself
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TICKERS.map((ticker) => {
                    const company = companies.find((c) => c.ticker === ticker);
                    if (!company) return null;
                    return (
                      <button
                        key={ticker}
                        onClick={() => handleSelectCompany(company)}
                        className="px-3 py-1.5 rounded-lg text-sm bg-surface-700 text-muted-light hover:bg-surface-600 hover:text-white transition-colors font-display"
                      >
                        {company.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-white/5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-mono font-bold text-white text-lg">44</p>
                    <p className="text-xs text-muted">Companies</p>
                  </div>
                  <div>
                    <p className="font-mono font-bold text-white text-lg">30+</p>
                    <p className="text-xs text-muted">Years of data</p>
                  </div>
                  <div>
                    <p className="font-mono font-bold text-white text-lg">$1+</p>
                    <p className="text-xs text-muted">Any amount</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date picker - only show when company selected */}
          {selected && !loading && companyData && (
            <DatePicker
              firstMonth={selected.first_month}
              lastMonth={selected.last_month}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
            />
          )}

          {/* Investment amount - only show when company selected */}
          {selected && !loading && companyData && (
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-2 font-display font-medium">
                Investment amount
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESETS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setInvestment(amount)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                      investment === amount
                        ? 'bg-accent text-white'
                        : 'bg-surface-700 text-muted-light hover:bg-surface-600 hover:text-white'
                    }`}
                  >
                    ${amount.toLocaleString('en-US')}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono">$</span>
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full bg-surface-700 border border-white/10 rounded-lg px-3 py-2.5 pl-7 text-white font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                  min="1"
                  step="100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 text-muted-light">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading price data...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-6 pb-6">
            <p className="text-sm text-loss">{error}</p>
          </div>
        )}

        {/* Hero result */}
        {result && (
          <div className="px-6 sm:px-10 py-8 border-t border-white/5 bg-surface-900/30">
            <p className="text-muted-light text-sm mb-2 font-body">
              If you invested{' '}
              <span className="text-white font-medium">
                ${investment.toLocaleString('en-US')}
              </span>{' '}
              in {result.company_name} in {MONTHS[selectedMonth - 1]} {result.start_year}
            </p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className={`font-mono font-bold text-hero-sm sm:text-hero tracking-tight ${
                  isPositive ? 'text-gain hero-glow' : 'text-loss'
                }`}
              >
                {formatValue(result.current_value)}
              </span>
              <span className="text-muted text-lg font-body">today</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className={`font-mono font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
                {isPositive ? '+' : ''}{result.total_return_pct.toFixed(1)}% total return
              </span>
              <span className="text-muted">|</span>
              <span className="text-muted-light font-mono">
                {result.annualized_return_pct >= 0 ? '+' : ''}
                {result.annualized_return_pct}% annualized
              </span>
            </div>

            {result.sp500_comparison.current_value && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-surface-700 border border-white/5">
                <p className="text-sm text-muted-light">
                  The same{' '}
                  <span className="text-white">
                    ${investment.toLocaleString('en-US')}
                  </span>{' '}
                  in the S&P 500 would be worth{' '}
                  <span className="text-white font-mono font-medium">
                    {formatValue(result.sp500_comparison.current_value)}
                  </span>
                  <span className="text-muted ml-2 font-mono text-xs">
                    ({result.sp500_comparison.total_return_pct >= 0 ? '+' : ''}
                    {result.sp500_comparison.total_return_pct}%)
                  </span>
                </p>
              </div>
            )}

            {/* Share buttons */}
            <ShareButtons
              result={result}
              investment={investment}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>
        )}
      </div>

      {/* Chart and table - only when results exist */}
      {result && (
        <>
          <GrowthChart pageData={result} />
          <YearlyTable pageData={result} />

          {/* Disclaimer */}
          <div className="px-4 py-3 rounded-lg bg-surface-800 border border-white/5">
            <p className="text-[11px] text-muted leading-relaxed">
              For informational and educational purposes only. Not financial advice.
              Past performance does not guarantee future results. All calculations
              are based on split-adjusted closing prices from Yahoo Finance and do
              not account for dividends, taxes, or trading fees. See our{' '}
              <a href="/methodology/" className="text-accent hover:underline">
                methodology
              </a>{' '}
              and{' '}
              <a href="/disclaimer/" className="text-accent hover:underline">
                full disclaimer
              </a>
              .
            </p>
          </div>
        </>
      )}
    </div>
  );
}
