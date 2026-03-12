'use client';

import { useState, useMemo } from 'react';

export default function Calculator({ pageData }) {
  const [investment, setInvestment] = useState(pageData.default_investment);

  const multiplier = pageData.current_price / pageData.start_price;
  const sp500Multiplier = pageData.sp500_comparison.current_value
    ? pageData.sp500_comparison.current_value / pageData.default_investment
    : null;

  const currentValue = investment * multiplier;
  const sp500Value = sp500Multiplier ? investment * sp500Multiplier : null;
  const totalReturn = ((multiplier - 1) * 100);
  const isPositive = totalReturn >= 0;

  const presets = [100, 500, 1000, 5000, 10000, 50000];

  function formatValue(val) {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  return (
    <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
      {/* Hero result */}
      <div className="px-6 sm:px-10 pt-8 sm:pt-12 pb-6">
        <p className="text-muted-light text-sm mb-2 font-body">
          If you invested{' '}
          <span className="text-white font-medium">
            ${investment.toLocaleString('en-US')}
          </span>{' '}
          in {pageData.company_name} in {pageData.start_year}
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className={`font-mono font-bold text-hero-sm sm:text-hero tracking-tight ${
              isPositive ? 'text-gain hero-glow' : 'text-loss'
            }`}
          >
            {formatValue(currentValue)}
          </span>
          <span className="text-muted text-lg font-body">today</span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className={`font-mono font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
            {isPositive ? '+' : ''}{totalReturn.toFixed(1)}% total return
          </span>
          <span className="text-muted">|</span>
          <span className="text-muted-light font-mono">
            {pageData.annualized_return_pct >= 0 ? '+' : ''}
            {pageData.annualized_return_pct}% annualized
          </span>
        </div>

        {sp500Value && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-surface-700 border border-white/5">
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
                ({pageData.sp500_comparison.total_return_pct >= 0 ? '+' : ''}
                {pageData.sp500_comparison.total_return_pct}%)
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Investment amount selector */}
      <div className="px-6 sm:px-10 py-5 border-t border-white/5 bg-surface-900/50">
        <label className="block text-xs text-muted uppercase tracking-wider mb-3 font-display font-medium">
          Change investment amount
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((amount) => (
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
    </div>
  );
}
