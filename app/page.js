import { getHomepageCompanies, getTopPerformers, getPopularComparisons, makeSlug, formatPercent } from './lib/data';
import HomepageHero from './components/HomepageHero';
import Sparkline from './components/Sparkline';

export default function Home() {
  const featured = getHomepageCompanies();
  const topPerformers = getTopPerformers(10);
  const popularComparisons = getPopularComparisons(6);

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
    <div>
      {/* Hero with rotating examples */}
      <HomepageHero />

      {/* Top performers - visually dominant section */}
      <section id="top-performers" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-white">
            Greatest returns of all time
          </h2>
          <p className="text-sm text-muted mt-1">
            $1,000 from the earliest available start year
          </p>
        </div>

        {/* Top 3 - big cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {topPerformers.slice(0, 3).map((page, i) => {
            const slug = makeSlug(page.company_name, page.start_year);
            return (
              <a
                key={page.ticker}
                href={`/what-if-you-invested-in/${slug}/`}
                className="bg-surface-800 border border-white/5 rounded-2xl p-5 sm:p-6 card-hover block group relative overflow-hidden"
              >
                <span className="absolute top-3 right-4 font-mono text-4xl font-bold text-white/[0.07]">
                  {i + 1}
                </span>
                <p className="text-xs text-muted font-display mb-1">
                  {page.ticker} · since {page.start_year}
                </p>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-gain transition-colors mb-3">
                  {page.company_name}
                </h3>
                <Sparkline
                  data={page.yearly_breakdown}
                  width={100}
                  height={32}
                  positive={true}
                />
                <p className="font-mono font-bold text-2xl sm:text-3xl text-gain mb-1 mt-2">
                  {formatValue(page.current_value)}
                </p>
                <p className="text-xs font-mono text-gain/60">
                  +{formatReturn(page.total_return_pct)}
                </p>
              </a>
            );
          })}
        </div>

        {/* Rest of top 10 - compact list */}
        <div className="bg-surface-800 border border-white/5 rounded-2xl overflow-hidden">
          {topPerformers.slice(3).map((page, i) => {
            const slug = makeSlug(page.company_name, page.start_year);
            return (
              <a
                key={page.ticker}
                href={`/what-if-you-invested-in/${slug}/`}
                className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.03] last:border-0 table-row-hover transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted w-5 text-right">
                    {i + 4}
                  </span>
                  <div>
                    <span className="font-display font-medium text-sm text-white group-hover:text-gain transition-colors">
                      {page.company_name}
                    </span>
                    <span className="text-xs text-muted ml-2">
                      since {page.start_year}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-gain">
                    {formatValue(page.current_value)}
                  </span>
                  <span className="text-xs text-muted ml-2 font-mono hidden sm:inline">
                    +{formatReturn(page.total_return_pct)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Popular comparisons */}
      {popularComparisons.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-white/5">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Head-to-head comparisons
            </h2>
            <p className="text-sm text-muted mt-1">
              Side-by-side investment returns with interactive charts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularComparisons.map((c) => {
              const winnerIsA = c.pageA.current_value >= c.pageB.current_value;
              return (
                <a
                  key={c.slug}
                  href={`/compare/${c.slug}/`}
                  className="bg-surface-800 border border-white/5 rounded-xl p-5 card-hover block group"
                >
                  <p className="text-xs text-muted mb-2">Since {c.year}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`font-display font-semibold text-sm ${winnerIsA ? 'text-gain' : 'text-white'} group-hover:text-gain transition-colors`}>
                      {c.pageA.company_name}
                    </span>
                    <span className="text-xs text-muted">vs</span>
                    <span className={`font-display font-semibold text-sm ${!winnerIsA ? 'text-gain' : 'text-white'} group-hover:text-gain transition-colors`}>
                      {c.pageB.company_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${c.pageA.total_return_pct >= 0 ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>
                      {c.pageA.total_return_pct >= 0 ? '+' : ''}{formatReturn(c.pageA.total_return_pct)}
                    </span>
                    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${c.pageB.total_return_pct >= 0 ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>
                      {c.pageB.total_return_pct >= 0 ? '+' : ''}{formatReturn(c.pageB.total_return_pct)}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* All companies grid */}
      <section id="companies" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-white/5">
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          All companies
        </h2>
        <p className="text-sm text-muted mb-8">
          Click any company to see the full breakdown with interactive charts
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map((page) => {
            const isPositive = page.total_return_pct >= 0;
            const slug = makeSlug(page.company_name, page.start_year);
            return (
              <a
                key={`${page.ticker}-${page.start_year}`}
                href={`/what-if-you-invested-in/${slug}/`}
                className="bg-surface-800 border border-white/5 rounded-xl p-5 card-hover block group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-white group-hover:text-gain transition-colors">
                      {page.company_name}
                    </h3>
                    <p className="text-xs text-muted">
                      {page.ticker} · Since {page.start_year}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                      isPositive
                        ? 'bg-gain/10 text-gain'
                        : 'bg-loss/10 text-loss'
                    }`}
                  >
                    {isPositive ? '+' : ''}{formatReturn(page.total_return_pct)}
                  </span>
                </div>
                <Sparkline
                  data={page.yearly_breakdown}
                  width={80}
                  height={28}
                  positive={isPositive}
                />
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xs text-muted">$1,000 →</span>
                  <span
                    className={`font-mono font-bold text-lg ${
                      isPositive ? 'text-gain' : 'text-loss'
                    }`}
                  >
                    {formatValue(page.current_value)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 mb-8">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Pick any company. Any year. Any amount.
          </h2>
          <p className="text-muted-light max-w-lg mx-auto mb-6">
            The interactive calculator lets you customize everything.
          </p>
          <a
            href="/calculator/"
            className="inline-block px-6 py-3 bg-gain text-surface-900 font-display font-semibold rounded-lg hover:bg-gain/90 transition-colors text-base"
          >
            Open Calculator
          </a>
          <p className="text-xs text-muted mt-6">
            Not financial advice. Past performance does not guarantee future results.
          </p>
        </div>
      </section>
    </div>
  );
}
