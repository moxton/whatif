'use client';

export default function ComparisonTable({ pageA, pageB, investment = 1000 }) {
  const multiplier = investment / 1000;
  const yearlyA = pageA.yearly_breakdown;
  const yearlyB = pageB.yearly_breakdown;
  const sp500 = pageA.sp500_yearly_breakdown;

  function formatValue(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  function formatPct(val, isFirst) {
    if (isFirst) return '-';
    if (val >= 0) return `+${val.toFixed(1)}%`;
    return `${val.toFixed(1)}%`;
  }

  return (
    <div className="bg-surface-800 rounded-2xl border border-white/5 p-4 sm:p-6">
      <h3 className="font-display font-semibold text-white mb-1">
        Year-by-year comparison
      </h3>
      <p className="text-xs text-muted mb-4">
        {pageA.company_name} vs. {pageB.company_name}, {pageA.start_year} to present
      </p>

      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs text-muted font-display font-medium py-3 pr-3">Year</th>
              <th className="text-right text-xs font-display font-medium py-3 px-2" style={{ color: '#00dc82' }}>
                {pageA.company_name}
              </th>
              <th className="text-right text-xs text-muted font-display font-medium py-3 px-2 hidden sm:table-cell">
                Return
              </th>
              <th className="text-right text-xs font-display font-medium py-3 px-2" style={{ color: '#a855f7' }}>
                {pageB.company_name}
              </th>
              <th className="text-right text-xs text-muted font-display font-medium py-3 px-2 hidden sm:table-cell">
                Return
              </th>
              <th className="text-right text-xs text-muted font-display font-medium py-3 pl-2 hidden md:table-cell">
                S&P 500
              </th>
            </tr>
          </thead>
          <tbody>
            {yearlyA.map((rowA, i) => {
              const rowB = yearlyB.find((b) => b.year === rowA.year);
              const sp500Row = sp500.find((s) => s.year === rowA.year);
              const isFirst = i === 0;
              const isLast = i === yearlyA.length - 1;
              const valA = rowA.value * multiplier;
              const valB = rowB ? rowB.value * multiplier : null;
              const valSP = sp500Row ? sp500Row.value * multiplier : null;

              return (
                <tr
                  key={rowA.year}
                  className={`border-b border-white/[0.03] table-row-hover ${isLast ? 'bg-white/[0.02]' : ''}`}
                >
                  <td className="py-2.5 pr-3 font-mono text-muted-light">{rowA.year}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-white">
                    {formatValue(valA)}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs hidden sm:table-cell ${
                    isFirst ? 'text-muted' : rowA.annual_return_pct >= 0 ? 'text-gain' : 'text-loss'
                  }`}>
                    {formatPct(rowA.annual_return_pct, isFirst)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-white">
                    {valB !== null ? formatValue(valB) : '-'}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs hidden sm:table-cell ${
                    isFirst ? 'text-muted' : rowB && rowB.annual_return_pct >= 0 ? 'text-gain' : 'text-loss'
                  }`}>
                    {rowB ? formatPct(rowB.annual_return_pct, isFirst) : '-'}
                  </td>
                  <td className="py-2.5 pl-2 text-right font-mono text-muted-light hidden md:table-cell">
                    {valSP !== null ? formatValue(valSP) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
