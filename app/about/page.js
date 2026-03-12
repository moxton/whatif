export const metadata = {
  title: 'About',
  description: 'About What If You Invested - a free historical stock return calculator.',
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-8">
        About
      </h1>

      <div className="space-y-6 text-muted-light leading-relaxed">
        <p className="text-lg">
          What If You Invested is a free tool that answers one simple
          question: what would your investment be worth today?
        </p>

        <p>
          We built this because the question comes up constantly. Someone
          mentions they almost bought Tesla in 2012, or wonders what their
          money would have done in the S&P 500 instead of sitting in a
          savings account. The existing tools to answer this are either
          ugly, incomplete, or buried behind paywalls.
        </p>

        <p>
          Every page on this site is built from real market data, pulled
          directly from Yahoo Finance. The interactive calculator lets you
          change the investment amount and see results instantly. The
          growth chart compares your investment against the S&P 500. The
          year-by-year table shows exactly what happened in each calendar
          year. No opinions, no stock picks, no predictions. Just math.
        </p>

        <div className="bg-surface-800 border border-white/5 rounded-xl p-6 my-8">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            What this site is not
          </h2>
          <p>
            This is not financial advice. We do not make recommendations
            about what to buy or sell. We do not predict future
            performance. We simply show what happened in the past, using
            publicly available data. Past performance does not guarantee
            future results, and we say that on every single page because
            it is important.
          </p>
        </div>

        <p>
          If you have questions, find an error, or want to suggest a
          company to add, reach out. We are always looking to improve.
        </p>
      </div>
    </div>
  );
}
