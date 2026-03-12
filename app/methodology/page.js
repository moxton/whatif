export const metadata = {
  title: 'Methodology',
  description: 'How we calculate historical stock returns. Data sources, calculation methods, and limitations.',
};

export default function Methodology() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-8">
        Methodology
      </h1>

      <div className="prose-custom space-y-8 text-muted-light leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            Data sources
          </h2>
          <p>
            All historical stock price data is sourced from Yahoo Finance via
            the yfinance Python library. Yahoo Finance provides split-adjusted
            closing prices, which means all historical prices have been
            retroactively adjusted to account for stock splits. For example,
            if a stock split 4-for-1, all pre-split prices are divided by 4
            so that returns can be accurately calculated across the full time
            period.
          </p>
          <p className="mt-3">
            The S&P 500 benchmark data uses the SPDR S&P 500 ETF (SPY),
            which has tracked the S&P 500 index since January 1993.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            Calculation method
          </h2>
          <p>
            For each investment scenario, we calculate returns using the
            following approach:
          </p>
          <div className="bg-surface-800 border border-white/5 rounded-xl p-5 my-4 font-mono text-sm">
            <p className="text-muted mb-2">Shares purchased = Investment amount / Start price</p>
            <p className="text-muted mb-2">Current value = Shares purchased x Current price</p>
            <p className="text-muted mb-2">Total return = (Current value - Investment) / Investment</p>
            <p className="text-muted">CAGR = (Current price / Start price)^(1/years) - 1</p>
          </div>
          <p className="mt-3">
            Start prices use the closing price on the first trading day of
            January for each start year. Current prices reflect the most
            recent available closing price at the time of the last data
            refresh.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            What is included
          </h2>
          <p>
            All calculations use split-adjusted closing prices, which means
            stock splits are fully accounted for. The year-by-year breakdown
            shows the value of the investment on the first trading day of each
            calendar year.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            What is not included
          </h2>
          <p>
            Current calculations reflect price returns only. The following are
            not included:
          </p>
          <div className="bg-surface-800 border border-white/5 rounded-xl p-5 my-4 text-sm space-y-2">
            <p>
              <span className="text-white font-medium">Dividends.</span>{' '}
              Dividend reinvestment is not currently factored into the return
              calculations. For dividend-paying stocks, actual total returns
              would be higher than shown.
            </p>
            <p>
              <span className="text-white font-medium">Taxes.</span>{' '}
              Capital gains taxes, dividend taxes, and other tax implications
              are not considered.
            </p>
            <p>
              <span className="text-white font-medium">Trading fees.</span>{' '}
              Brokerage commissions and transaction costs are not deducted.
            </p>
            <p>
              <span className="text-white font-medium">Inflation.</span>{' '}
              All values are shown in nominal (not inflation-adjusted) dollars.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            Update frequency
          </h2>
          <p>
            Price data is refreshed monthly. The date of the most recent data
            refresh is shown on each individual page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            Accuracy
          </h2>
          <p>
            We make every effort to ensure accuracy, but this site is provided
            for informational and educational purposes only. Numbers are
            derived from publicly available market data and may contain minor
            discrepancies due to rounding, data availability, or differences
            in how adjusted prices are calculated across data providers. If
            you find an error, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
