'use client';

import { useState } from 'react';
import ShareButtons from './ShareButtons';

export default function ComparisonCalculator({ pageA, pageB, slug }) {
  const [investment, setInvestment] = useState(pageA.default_investment);

  const multiplierA = pageA.current_price / pageA.start_price;
  const multiplierB = pageB.current_price / pageB.start_price;
  const sp500Multiplier = pageA.sp500_comparison.current_value / pageA.default_investment;

  const valueA = investment * multiplierA;
  const valueB = investment * multiplierB;
  const sp500Value = investment * sp500Multiplier;
  const returnA = (multiplierA - 1) * 100;
  const returnB = (multiplierB - 1) * 100;

  const winnerIsA = valueA >= valueB;

  const presets = [100, 500, 1000, 5000, 10000, 50000];

  function formatValue(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  const shareUrl = `https://whatifyouinvested.com/compare/${slug}/`;
  const shareText = `$${investment.toLocaleString('en-US')} in ${pageA.company_name} since ${pageA.start_year} = ${formatValue(valueA)} vs ${pageB.company_name} = ${formatValue(valueB)}. Which was the better investment?`;

  return (
    <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
      {/* Investment amount selector */}
      <div className="px-6 sm:px-10 py-5 border-b border-white/5 bg-surface-900/50">
        <label className="block text-xs text-muted uppercase tracking-wider mb-3 font-display font-medium">
          Investment amount
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((amount) => (
            <button
              key={amount}
              onClick={() => setInvestment(amount)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                investment === amount
                  ? 'bg-gain text-surface-900'
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
            className="w-full bg-surface-700 border border-white/10 rounded-lg px-3 py-2.5 pl-7 text-white font-mono focus:outline-none focus:border-gain focus:ring-1 focus:ring-gain/50 transition-colors"
            min="1"
            step="100"
          />
        </div>
      </div>

      {/* Side-by-side hero results */}
      <div className="px-6 sm:px-10 pt-8 pb-6">
        <p className="text-muted-light text-sm mb-4 font-body">
          ${investment.toLocaleString('en-US')} invested in {pageA.start_year} would be worth
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Company A */}
          <div className={`${winnerIsA ? '' : 'opacity-80'}`}>
            <p className="text-xs text-muted uppercase tracking-wider mb-1 font-display font-medium flex items-center gap-2">
              {pageA.company_name}
              {winnerIsA && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gain/10 text-gain uppercase tracking-wider">Winner</span>
              )}
            </p>
            <span
              className={`font-mono font-bold tracking-tight ${
                winnerIsA ? 'text-3xl sm:text-4xl text-gain hero-glow' : 'text-2xl sm:text-3xl text-gain'
              }`}
            >
              {formatValue(valueA)}
            </span>
            <p className={`text-sm font-mono mt-1 ${returnA >= 0 ? 'text-gain' : 'text-loss'}`}>
              {returnA >= 0 ? '+' : ''}{returnA.toFixed(1)}%
            </p>
          </div>

          {/* Company B */}
          <div className={`${!winnerIsA ? '' : 'opacity-80'}`}>
            <p className="text-xs text-muted uppercase tracking-wider mb-1 font-display font-medium flex items-center gap-2">
              {pageB.company_name}
              {!winnerIsA && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-compare/10 text-compare uppercase tracking-wider">Winner</span>
              )}
            </p>
            <span
              className={`font-mono font-bold tracking-tight ${
                !winnerIsA ? 'text-3xl sm:text-4xl text-compare' : 'text-2xl sm:text-3xl text-compare'
              }`}
              style={{ color: '#a855f7' }}
            >
              {formatValue(valueB)}
            </span>
            <p className={`text-sm font-mono mt-1 ${returnB >= 0 ? 'text-gain' : 'text-loss'}`}>
              {returnB >= 0 ? '+' : ''}{returnB.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* S&P 500 comparison */}
        <div className="mt-6 px-4 py-3 rounded-lg bg-surface-700 border border-white/5">
          <p className="text-sm text-muted-light">
            The same{' '}
            <span className="text-white">
              ${investment.toLocaleString('en-US')}
            </span>{' '}
            in the S&P 500 would be worth{' '}
            <span className="text-white font-mono font-medium">
              {formatValue(sp500Value)}
            </span>
            <span className="text-muted ml-2 font-mono text-xs">
              ({pageA.sp500_comparison.total_return_pct >= 0 ? '+' : ''}
              {pageA.sp500_comparison.total_return_pct}%)
            </span>
          </p>
        </div>

        <ShareButtons url={shareUrl} text={shareText} />
      </div>
    </div>
  );
}
