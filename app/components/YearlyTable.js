'use client';

export default function YearlyTable({ pageData }) {
  const yearly = pageData.yearly_breakdown;
  const sp500 = pageData.sp500_yearly_breakdown;

  return (
    <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="font-display font-semibold text-white">
          Year-by-Year Returns
        </h3>
        <p className="text-xs text-muted mt-1">
          ${pageData.default_investment.toLocaleString('en-US')} invested in{' '}
          {pageData.company_name} starting January {pageData.start_year}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted uppercase tracking-wider border-b border-white/5">
              <th className="text-left px-6 py-3 font-display font-medium">Year</th>
              <th className="text-right px-4 py-3 font-display font-medium">Price</th>
              <th className="text-right px-4 py-3 font-display font-medium">Value</th>
              <th className="text-right px-4 py-3 font-display font-medium">Annual</th>
              <th className="text-right px-4 py-3 font-display font-medium hidden sm:table-cell">
                Cumulative
              </th>
              <th className="text-right px-6 py-3 font-display font-medium hidden md:table-cell">
                S&P 500 Value
              </th>
            </tr>
          </thead>
          <tbody>
            {yearly.map((row, i) => {
              const sp500Row = sp500.find((s) => s.year === row.year);
              const isFirst = i === 0;
              const isLast = i === yearly.length - 1;
              const annualPositive = row.annual_return_pct >= 0;
              const cumulativePositive = row.cumulative_return_pct >= 0;

              return (
                <tr
                  key={row.year}
                  className={`border-b border-white/[0.03] table-row-hover transition-colors ${
                    isLast ? 'bg-surface-700/30' : ''
                  }`}
                >
                  <td className="px-6 py-2.5 font-mono text-white font-medium">
                    {row.year}
                  </td>
                  <td className="text-right px-4 py-2.5 font-mono text-muted-light">
                    ${row.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-right px-4 py-2.5 font-mono text-white font-medium">
                    ${Math.round(row.value).toLocaleString('en-US')}
                  </td>
                  <td
                    className={`text-right px-4 py-2.5 font-mono font-medium ${
                      isFirst
                        ? 'text-muted'
                        : annualPositive
                        ? 'text-gain'
                        : 'text-loss'
                    }`}
                  >
                    {isFirst
                      ? '-'
                      : `${annualPositive ? '+' : ''}${row.annual_return_pct}%`}
                  </td>
                  <td
                    className={`text-right px-4 py-2.5 font-mono font-medium hidden sm:table-cell ${
                      isFirst
                        ? 'text-muted'
                        : cumulativePositive
                        ? 'text-gain'
                        : 'text-loss'
                    }`}
                  >
                    {isFirst
                      ? '-'
                      : `${cumulativePositive ? '+' : ''}${row.cumulative_return_pct.toLocaleString('en-US')}%`}
                  </td>
                  <td className="text-right px-6 py-2.5 font-mono text-muted-light hidden md:table-cell">
                    {sp500Row
                      ? `$${Math.round(sp500Row.value).toLocaleString('en-US')}`
                      : '-'}
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
