export const metadata = {
  title: 'About',
  description: 'About What If You Invested - a free historical stock return calculator.',
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-gain mb-2">
        About
      </h1>
      <p className="text-base text-muted-light mb-8">
        Free historical stock return calculator.
      </p>

      <div className="space-y-6">
        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6 sm:p-8">
          <p className="font-display text-xl sm:text-2xl font-bold text-white leading-snug mb-4">
            What would your investment be worth today?
          </p>
          <p className="text-sm sm:text-base text-muted-light leading-relaxed">
            Someone mentions they almost bought Tesla in 2012, or wonders what
            their money would have done in the S&P 500 instead of sitting in a
            savings account. The existing tools to answer this are either ugly,
            incomplete, or buried behind paywalls. So we built something better.
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            How it works
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-gain font-mono font-bold shrink-0">1</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">Pick a company.</span>{' '}
                Choose from 44+ stocks, ETFs, and crypto.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-gain font-mono font-bold shrink-0">2</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">Pick a date.</span>{' '}
                Any month and year going back to the 1990s for most companies.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-gain font-mono font-bold shrink-0">3</span>
              <p className="text-muted-light">
                <span className="text-white font-medium">See the results.</span>{' '}
                Interactive charts, S&P 500 comparison, and year-by-year breakdown.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            The data
          </h2>
          <p className="text-sm text-muted-light leading-relaxed">
            Every page is built from real market data pulled directly from
            Yahoo Finance. Split-adjusted closing prices, calculated returns,
            S&P 500 benchmarks. No opinions, no stock picks, no predictions.
            Just math.
          </p>
          <p className="text-sm text-muted-light leading-relaxed mt-3">
            See the full details on our{' '}
            <a href="/methodology/" className="text-accent hover:underline">
              methodology page
            </a>.
          </p>
        </div>

        <div className="bg-surface-800 border border-loss/20 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            What this site is not
          </h2>
          <p className="text-sm text-muted-light leading-relaxed">
            This is not financial advice. We do not make recommendations
            about what to buy or sell. We do not predict future performance.
            We simply show what happened in the past, using publicly available
            data. Past performance does not guarantee future results, and we
            say that on every page because it is important.
          </p>
        </div>

        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-light mb-4">
            Have a question, found an error, or want to suggest a company?
          </p>
          <a
            href="/calculator/"
            className="inline-block px-6 py-2.5 rounded-lg bg-accent text-white font-display font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            Try the Calculator
          </a>
        </div>
      </div>
    </div>
  );
}
