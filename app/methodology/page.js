export const metadata = {
  title: 'Methodology',
  description: 'How we calculate historical stock returns. Data sources, calculation methods, and limitations.',
};

export default function Methodology() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-2">
        Methodology
      </h1>
      <p className="text-sm text-muted mb-8">
        How we calculate historical investment returns.
      </p>

      <div className="space-y-6">
        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Data sources
          </h2>
          <p className="text-sm text-muted-light leading-relaxed">
            All historical stock price data is sourced from Yahoo Finance via
            the yfinance Python library. Yahoo Finance provides split-adjusted
            closing prices, which means all historical prices have been
            retroactively adjusted to account for stock splits. For example,
            if a stock split 4-for-1, all pre-split prices are divided by 4
            so that returns can be accurately calculated across the full time
            period.
          </p>
          <p className="text-sm text-muted-light leading-relaxed mt-3">
            The S&P 500 benchmark data uses the SPDR S&P 500 ETF (SPY),
            which has tracked the S&P 500 index since January 1993.
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Calculation method
          </h2>
          <p className="text-sm text-muted-light leading-relaxed mb-4">
            For each investment scenario, we calculate returns using the
            following approach:
          </p>
          <div className="bg-surface-700 border border-white/5 rounded-xl p-4 font-mono text-xs space-y-1.5">
            <p className="text-muted-light">Shares purchased = Investment amount / Start price</p>
            <p className="text-muted-light">Current value = Shares purchased x Current price</p>
            <p className="text-muted-light">Total return = (Current value - Investment) / Investment</p>
            <p className="text-muted-light">CAGR = (Current price / Start price)^(1/years) - 1</p>
          </div>
          <p className="text-sm text-muted-light leading-relaxed mt-4">
            Start prices use the closing price on the first trading day of
            the selected month and year. Current prices reflect the most
            recent available closing price at the time of the last data
            refresh.
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            What is included
          </h2>
          <p className="text-sm text-muted-light leading-relaxed">
            All calculations use split-adjusted closing prices, which means
            stock splits are fully accounted for. The year-by-year breakdown
            shows the value of the investment on the first trading day of each
            calendar year.
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            What is not included
          </h2>
          <p className="text-sm text-muted-light leading-relaxed mb-4">
            Current calculations reflect price returns only. The following are
            not included:
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-loss mt-0.5 shrink-0">x</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">Dividends.</span>{' '}
                Dividend reinvestment is not currently factored into the return
                calculations. For dividend-paying stocks, actual total returns
                would be higher than shown.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-loss mt-0.5 shrink-0">x</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">Taxes.</span>{' '}
                Capital gains taxes, dividend taxes, and other tax implications
                are not considered.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-loss mt-0.5 shrink-0">x</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">Trading fees.</span>{' '}
                Brokerage commissions and transaction costs are not deducted.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-loss mt-0.5 shrink-0">x</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">Inflation.</span>{' '}
                All values are shown in nominal (not inflation-adjusted) dollars.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-3">
              Update frequency
            </h2>
            <p className="text-sm text-muted-light leading-relaxed">
              Price data is refreshed monthly. The date of the most recent data
              refresh is shown on each individual page.
            </p>
          </div>

          <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-3">
              Accuracy
            </h2>
            <p className="text-sm text-muted-light leading-relaxed">
              We make every effort to ensure accuracy, but this site is provided
              for informational and educational purposes only. Numbers may contain
              minor discrepancies due to rounding or data availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
