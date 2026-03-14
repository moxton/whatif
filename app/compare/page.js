import { getAllComparisons, formatPercent } from '../lib/data';

export const metadata = {
  title: 'Stock Comparisons - Side-by-Side Investment Returns',
  description: 'Compare historical investment returns between popular stocks. Apple vs Microsoft, Tesla vs Nvidia, Bitcoin vs S&P 500, and more. Interactive charts and calculators.',
};

export default function ComparePage() {
  const allComparisons = getAllComparisons();

  // Group by matchup pair (ticker pair key)
  const grouped = {};
  for (const c of allComparisons) {
    const key = `${c.pageA.ticker}-${c.pageB.ticker}`;
    if (!grouped[key]) {
      grouped[key] = {
        nameA: c.pageA.company_name,
        nameB: c.pageB.company_name,
        tickerA: c.pageA.ticker,
        tickerB: c.pageB.ticker,
        comparisons: [],
      };
    }
    grouped[key].comparisons.push(c);
  }

  // Sort comparisons within each group by year
  for (const group of Object.values(grouped)) {
    group.comparisons.sort((a, b) => a.year - b.year);
  }

  // Sort groups by the earliest comparison's combined return (most dramatic first)
  const groups = Object.values(grouped).sort((a, b) => {
    const aMax = Math.max(a.comparisons[0].pageA.total_return_pct, a.comparisons[0].pageB.total_return_pct);
    const bMax = Math.max(b.comparisons[0].pageA.total_return_pct, b.comparisons[0].pageB.total_return_pct);
    return bMax - aMax;
  });

  function formatValue(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 100000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  function formatReturn(pct) {
    if (pct >= 10000) return `${Math.round(pct / 1000)}K%`;
    return `${pct.toFixed(0)}%`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="text-xs text-muted mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <span>/</span>
        <span className="text-muted-light">Compare</span>
      </nav>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
        Stock comparisons
      </h1>
      <p className="text-sm text-muted-light mb-10">
        Side-by-side investment returns for {groups.length} matchups across {allComparisons.length} time periods. Pick a pair to see interactive charts, calculators, and year-by-year breakdowns.
      </p>

      <div className="space-y-4">
        {groups.map((group) => {
          const earliest = group.comparisons[0];
          const winnerIsA = earliest.pageA.current_value >= earliest.pageB.current_value;

          return (
            <div
              key={`${group.tickerA}-${group.tickerB}`}
              className="bg-surface-800 rounded-2xl border border-white/5 p-5 sm:p-6"
            >
              {/* Matchup header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-white text-base sm:text-lg">
                    {group.nameA}
                  </h2>
                  <span className="text-xs text-muted">vs</span>
                  <h2 className="font-display font-semibold text-white text-base sm:text-lg">
                    {group.nameB}
                  </h2>
                </div>
                <span className="text-xs text-muted font-mono">
                  {group.tickerA} / {group.tickerB}
                </span>
              </div>

              {/* Start year links */}
              <div className="flex flex-wrap gap-2">
                {group.comparisons.map((c) => {
                  const winner = c.pageA.current_value >= c.pageB.current_value ? c.pageA : c.pageB;
                  const winReturn = winner.total_return_pct;

                  return (
                    <a
                      key={c.slug}
                      href={`/compare/${c.slug}/`}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors border border-white/5 group"
                    >
                      <span className="text-sm text-white font-display font-medium group-hover:text-gain transition-colors">
                        Since {c.year}
                      </span>
                      <span className="text-xs font-mono text-muted-light">
                        {formatValue(winner.current_value)}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 px-4 py-3 rounded-lg bg-surface-800 border border-white/5">
        <p className="text-[11px] text-muted leading-relaxed">
          For informational and educational purposes only. Not financial advice.
          Past performance does not guarantee future results. All calculations
          are based on split-adjusted closing prices from Yahoo Finance and do
          not account for dividends, taxes, or trading fees. See our{' '}
          <a href="/methodology/" className="text-gain hover:underline">
            methodology
          </a>{' '}
          and{' '}
          <a href="/disclaimer/" className="text-gain hover:underline">
            full disclaimer
          </a>
          .
        </p>
      </div>
    </div>
  );
}
