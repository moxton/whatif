import { getHomepageCompanies, getTopPerformers, makeSlug, getSectors } from './lib/data';

export default function Home() {
  const featured = getHomepageCompanies();
  const topPerformers = getTopPerformers(10);
  const sectors = getSectors();
  const sectorNames = Object.keys(sectors).filter((s) => s !== 'Index' && s !== 'Crypto');

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
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-4">
              What if you invested
              <span className="text-gain">?</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-light leading-relaxed mb-8 max-w-xl">
              See what any stock investment would be worth today.
              Real data. Interactive charts. No opinions.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="#companies"
                className="px-5 py-2.5 bg-white text-surface-900 font-display font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Browse companies
              </a>
              <a
                href="#top-performers"
                className="px-5 py-2.5 bg-surface-700 text-white font-display font-medium rounded-lg hover:bg-surface-600 transition-colors border border-white/5"
              >
                Top performers
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
            {[
              { label: 'Companies tracked', value: '44' },
              { label: 'Investment scenarios', value: '213' },
              { label: 'Data source', value: 'Yahoo Finance' },
              { label: 'Updated', value: 'Monthly' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-800 border border-white/5 rounded-xl px-4 py-3"
              >
                <p className="text-xs text-muted mb-0.5">{stat.label}</p>
                <p className="font-display font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured companies grid */}
      <section id="companies" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Popular companies
        </h2>
        <p className="text-sm text-muted mb-8">
          Click any company to see the full breakdown with interactive calculator and chart
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
                <div className="flex items-baseline gap-2">
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

      {/* Top performers */}
      <section id="top-performers" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Greatest returns of all time
        </h2>
        <p className="text-sm text-muted mb-8">
          The best-performing investments from their earliest available start year
        </p>

        <div className="bg-surface-800 border border-white/5 rounded-2xl overflow-hidden">
          {topPerformers.map((page, i) => {
            const slug = makeSlug(page.company_name, page.start_year);
            return (
              <a
                key={page.ticker}
                href={`/what-if-you-invested-in/${slug}/`}
                className="flex items-center justify-between px-6 py-4 border-b border-white/[0.03] last:border-0 table-row-hover transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted w-6 text-right">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-display font-medium text-white group-hover:text-gain transition-colors">
                      {page.company_name}
                    </span>
                    <span className="text-xs text-muted ml-2">
                      since {page.start_year}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-gain">
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

      {/* Browse by sector */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Browse by sector
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sectorNames.map((sector) => (
            <div
              key={sector}
              className="bg-surface-800 border border-white/5 rounded-xl p-5"
            >
              <h3 className="font-display font-semibold text-white mb-1">
                {sector}
              </h3>
              <p className="text-xs text-muted mb-3">
                {sectors[sector].length} companies
              </p>
              <div className="flex flex-col gap-1">
                {sectors[sector].slice(0, 3).map((company) => (
                  <a
                    key={company.ticker}
                    href={`/what-if-you-invested-in/${makeSlug(company.name, company.start_years[0])}/`}
                    className="text-sm text-muted-light hover:text-white transition-colors"
                  >
                    {company.name}
                  </a>
                ))}
                {sectors[sector].length > 3 && (
                  <span className="text-xs text-muted">
                    +{sectors[sector].length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 mb-8">
        <div className="bg-surface-800 border border-white/5 rounded-2xl p-8 sm:p-12 text-center gradient-border">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Every investment has a story
          </h2>
          <p className="text-muted-light max-w-lg mx-auto mb-1">
            We track {featured.length}+ companies across every major sector.
            Pick any company and any start year to see what your investment
            would be worth today.
          </p>
          <p className="text-xs text-muted mt-4">
            Not financial advice. Past performance does not guarantee future
            results.
          </p>
        </div>
      </section>
    </div>
  );
}
