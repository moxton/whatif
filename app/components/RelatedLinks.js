import { makeSlug } from '../lib/data';

export default function RelatedLinks({ currentPage, companyPages, sectorPages }) {
  // Other start years for the same company
  const otherYears = companyPages
    .filter((p) => p.start_year !== currentPage.start_year)
    .sort((a, b) => a.start_year - b.start_year);

  // Same sector, different companies (limit to 6)
  const sectorCompanies = sectorPages
    .filter((p) => p.ticker !== currentPage.ticker)
    .reduce((acc, p) => {
      // Only show earliest year per company
      if (!acc.find((x) => x.ticker === p.ticker)) acc.push(p);
      return acc;
    }, [])
    .slice(0, 6);

  function formatValue(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  return (
    <div className="space-y-8">
      {/* Other start years */}
      {otherYears.length > 0 && (
        <div className="bg-surface-800 rounded-2xl border border-white/5 p-6">
          <h3 className="font-display font-semibold text-white mb-1">
            {currentPage.company_name} at different times
          </h3>
          <p className="text-xs text-muted mb-4">
            See how the start year changes the outcome
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherYears.map((p) => {
              const isPositive = p.total_return_pct >= 0;
              const slug = makeSlug(p.company_name, p.start_year);
              return (
                <a
                  key={p.start_year}
                  href={`/what-if-you-invested-in/${slug}/`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors group"
                >
                  <span className="text-sm text-muted-light group-hover:text-white transition-colors">
                    Since {p.start_year}
                  </span>
                  <span
                    className={`text-sm font-mono font-medium ${
                      isPositive ? 'text-gain' : 'text-loss'
                    }`}
                  >
                    {formatValue(p.current_value)}
                    <span className="text-xs ml-1 opacity-70">
                      ({isPositive ? '+' : ''}{p.total_return_pct > 10000 ? `${Math.round(p.total_return_pct / 1000)}K` : p.total_return_pct.toFixed(0)}%)
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Same sector */}
      {sectorCompanies.length > 0 && (
        <div className="bg-surface-800 rounded-2xl border border-white/5 p-6">
          <h3 className="font-display font-semibold text-white mb-1">
            More {currentPage.sector} investments
          </h3>
          <p className="text-xs text-muted mb-4">
            Compare returns across the sector
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sectorCompanies.map((p) => {
              const isPositive = p.total_return_pct >= 0;
              const slug = makeSlug(p.company_name, p.start_year);
              return (
                <a
                  key={`${p.ticker}-${p.start_year}`}
                  href={`/what-if-you-invested-in/${slug}/`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors group"
                >
                  <span className="text-sm text-muted-light group-hover:text-white transition-colors">
                    {p.company_name}
                    <span className="text-muted text-xs ml-1">since {p.start_year}</span>
                  </span>
                  <span
                    className={`text-sm font-mono font-medium ${
                      isPositive ? 'text-gain' : 'text-loss'
                    }`}
                  >
                    {isPositive ? '+' : ''}{p.total_return_pct > 10000 ? `${Math.round(p.total_return_pct / 1000)}K` : p.total_return_pct.toFixed(0)}%
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
