import { getAllBlogSlugs, getPostBySlug } from '../../lib/blog';
import { getTopPerformers, makeSlug } from '../../lib/data';

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
  };
}

// ── Post content components ─────────────────────────────────────────────

function BestPerformingStocks() {
  const top = getTopPerformers(10);

  function fmt(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 100000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  function fmtPct(pct) {
    if (pct >= 10000) return `${Math.round(pct / 1000)}K%`;
    return `${pct.toFixed(1)}%`;
  }

  return (
    <>
      <p>
        Some stocks have turned modest investments into life-changing sums. We
        ranked every company in our database by total return from the earliest
        start year available to see which ones delivered the biggest gains.
      </p>
      <p>
        All figures below are based on a hypothetical $1,000 investment using
        split-adjusted closing prices. Dividends, taxes, and fees are not
        included.
      </p>

      <h2>The top 10</h2>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted uppercase tracking-wider border-b border-white/5">
              <th className="text-left px-4 py-3 font-display font-medium">#</th>
              <th className="text-left px-4 py-3 font-display font-medium">Company</th>
              <th className="text-right px-4 py-3 font-display font-medium">Since</th>
              <th className="text-right px-4 py-3 font-display font-medium">$1K became</th>
              <th className="text-right px-4 py-3 font-display font-medium hidden sm:table-cell">Total return</th>
              <th className="text-right px-4 py-3 font-display font-medium hidden sm:table-cell">CAGR</th>
            </tr>
          </thead>
          <tbody>
            {top.map((page, i) => {
              const slug = makeSlug(page.company_name, page.start_year);
              return (
                <tr key={page.ticker} className="border-b border-white/[0.03] table-row-hover">
                  <td className="px-4 py-2.5 font-mono text-muted">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <a
                      href={`/what-if-you-invested-in/${slug}/`}
                      className="font-display font-medium text-white hover:text-gain transition-colors"
                    >
                      {page.company_name}
                    </a>
                  </td>
                  <td className="text-right px-4 py-2.5 font-mono text-muted-light">{page.start_year}</td>
                  <td className="text-right px-4 py-2.5 font-mono font-bold text-gain">{fmt(page.current_value)}</td>
                  <td className="text-right px-4 py-2.5 font-mono text-gain hidden sm:table-cell">+{fmtPct(page.total_return_pct)}</td>
                  <td className="text-right px-4 py-2.5 font-mono text-muted-light hidden sm:table-cell">{page.annualized_return_pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>What stands out</h2>
      <p>
        The biggest returns come from companies that were small when they started
        their run. Nvidia, Monster Beverage, and Amazon all traded at single-digit
        prices in their early years. Buying early and holding through volatility
        was the common thread.
      </p>
      <p>
        Tesla and Bitcoin show a different pattern: shorter holding periods but
        extreme growth. Bitcoin's 52.8% annualized return is the highest on the
        list, but it comes with far more volatility than the stock picks.
      </p>
      <p>
        Meanwhile, the S&P 500 returned 8-14% annualized over similar periods.
        Beating the index is rare. Most actively managed funds fail to do it
        consistently over a decade.
      </p>

      <h2>Important context</h2>
      <p>
        Hindsight is perfect. Nobody knew in 1999 that Nvidia would become a
        $3 trillion company. These numbers show what was possible, not what was
        predictable. The real lesson is time in the market, not timing the market.
      </p>
      <p>
        Want to run your own numbers?{' '}
        <a href="/calculator/" className="text-gain hover:underline">
          Try the calculator
        </a>{' '}
        with any company, any start date, any amount.
      </p>
    </>
  );
}

function HowToCalculateReturns() {
  return (
    <>
      <p>
        When you see that a stock "returned 4,432%," what does that actually mean?
        And how is it different from "26.5% annualized"? Here's a plain-language
        breakdown of the most common return metrics.
      </p>

      <h2>Total return</h2>
      <p>
        Total return measures the complete gain or loss from an investment, start
        to finish. The formula is simple:
      </p>
      <div className="bg-surface-800 rounded-xl border border-white/5 p-4 sm:p-6 my-4">
        <p className="font-mono text-sm text-white text-center">
          Total Return = ((End Value - Start Value) / Start Value) x 100
        </p>
      </div>
      <p>
        If you invested $1,000 and it grew to $45,321, your total return is
        ((45321 - 1000) / 1000) x 100 = <span className="font-mono text-gain">+4,432.1%</span>.
      </p>
      <p>
        Total return is useful for seeing the big picture, but it doesn't tell you
        how long it took. A 100% return in 2 years is very different from 100% in
        20 years.
      </p>

      <h2>Annualized return (CAGR)</h2>
      <p>
        CAGR stands for Compound Annual Growth Rate. It tells you the equivalent
        yearly return, assuming the investment grew at a steady pace.
      </p>
      <div className="bg-surface-800 rounded-xl border border-white/5 p-4 sm:p-6 my-4">
        <p className="font-mono text-sm text-white text-center">
          CAGR = ((End Value / Start Value) ^ (1 / Years)) - 1
        </p>
      </div>
      <p>
        Using the same example: $1,000 growing to $45,321 over 16.2 years gives a
        CAGR of about <span className="font-mono text-gain">26.5%</span> per year.
        That's the rate at which your money would need to compound annually to
        reach the same result.
      </p>
      <p>
        CAGR is the better metric for comparing investments with different time
        periods. A stock with 500% total return over 5 years (CAGR ~43%) performed
        better annually than one with 1,000% over 20 years (CAGR ~13%).
      </p>

      <h2>What these numbers don't include</h2>
      <p>
        Most return calculations (including ours) use price return only. That
        means they don't account for:
      </p>
      <ul>
        <li><strong>Dividends.</strong> Reinvesting dividends can significantly increase long-term returns, especially for companies like Coca-Cola or Johnson & Johnson.</li>
        <li><strong>Taxes.</strong> Capital gains taxes reduce your actual take-home return.</li>
        <li><strong>Trading fees.</strong> Less relevant today with zero-commission brokers, but historically significant.</li>
        <li><strong>Inflation.</strong> $1,000 in 2000 had more purchasing power than $1,000 today.</li>
      </ul>

      <h2>Try it yourself</h2>
      <p>
        Our{' '}
        <a href="/calculator/" className="text-gain hover:underline">
          investment calculator
        </a>{' '}
        computes both total return and CAGR for any company in our database, any
        start month, and any dollar amount. It also shows how the same investment
        in the S&P 500 would have performed.
      </p>
    </>
  );
}

function SP500Post() {
  return (
    <>
      <p>
        The S&P 500 is the most common benchmark for investment performance. It
        tracks 500 of the largest US companies and is widely considered the best
        single measure of the US stock market. Here's what $1,000 invested in the
        S&P 500 (via the SPY ETF) would be worth from six different start years.
      </p>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted uppercase tracking-wider border-b border-white/5">
              <th className="text-left px-4 py-3 font-display font-medium">Start year</th>
              <th className="text-right px-4 py-3 font-display font-medium">$1K became</th>
              <th className="text-right px-4 py-3 font-display font-medium">Total return</th>
              <th className="text-right px-4 py-3 font-display font-medium">CAGR</th>
            </tr>
          </thead>
          <tbody>
            {[
              { year: 2000, value: '$7,693', total: '+669%', cagr: '8.1%' },
              { year: 2005, value: '$8,438', total: '+744%', cagr: '10.6%' },
              { year: 2010, value: '$8,394', total: '+739%', cagr: '14.0%' },
              { year: 2015, value: '$4,084', total: '+308%', cagr: '13.3%' },
              { year: 2020, value: '$2,294', total: '+129%', cagr: '14.2%' },
              { year: 2023, value: '$1,731', total: '+73%', cagr: '18.4%' },
            ].map((row) => (
              <tr key={row.year} className="border-b border-white/[0.03] table-row-hover">
                <td className="px-4 py-2.5">
                  <a
                    href={`/what-if-you-invested-in/sp-500-spy-in-${row.year}/`}
                    className="font-mono text-white hover:text-gain transition-colors"
                  >
                    {row.year}
                  </a>
                </td>
                <td className="text-right px-4 py-2.5 font-mono font-bold text-gain">{row.value}</td>
                <td className="text-right px-4 py-2.5 font-mono text-gain">{row.total}</td>
                <td className="text-right px-4 py-2.5 font-mono text-muted-light">{row.cagr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The dot-com crash matters</h2>
      <p>
        Starting in 2000 means buying right before the dot-com bust. The S&P 500
        dropped roughly 50% from its 2000 peak to its 2002 low. Despite that,
        $1,000 invested in January 2000 would still be worth $7,693 today.
        Time eventually overcame even the worst possible timing.
      </p>
      <p>
        Starting in 2005 or 2010 avoided that drawdown and produced similar
        absolute returns in a shorter period, which is why the CAGR is
        meaningfully higher.
      </p>

      <h2>Recent years look strong</h2>
      <p>
        The 2020 and 2023 entries show impressive annualized numbers (14.2% and
        18.4%), but those are over short periods. A few bad months could change
        those figures dramatically. Longer holding periods smooth out volatility
        and give a more reliable picture of expected returns.
      </p>

      <h2>The long-term average</h2>
      <p>
        Historically, the S&P 500 has returned roughly 10% per year on average
        (including dividends). Our figures are price-only, so the actual returns
        with dividends reinvested would be higher.
      </p>
      <p>
        The S&P 500 is the baseline we compare every stock against on the site.
        When we say a stock "beat the market," we mean it outperformed what you
        would have earned in SPY over the same period.
      </p>

      <h2>Run your own numbers</h2>
      <p>
        Use the{' '}
        <a href="/calculator/" className="text-gain hover:underline">
          calculator
        </a>{' '}
        to pick any start month going back to 1993. You can also compare the
        S&P 500 against individual stocks to see which investments would have
        beaten the index.
      </p>
    </>
  );
}

// ── Post content map ────────────────────────────────────────────────────

const POST_CONTENT = {
  'best-performing-stocks-last-20-years': BestPerformingStocks,
  'how-to-calculate-investment-returns': HowToCalculateReturns,
  'what-1000-invested-in-sp500-would-be-worth': SP500Post,
};

// ── Page component ──────────────────────────────────────────────────────

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-white mb-4">Post not found</h1>
        <a href="/blog/" className="text-gain hover:underline">
          Back to blog
        </a>
      </div>
    );
  }

  const Content = POST_CONTENT[post.slug];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <span>/</span>
        <a href="/blog/" className="hover:text-white transition-colors">Blog</a>
        <span>/</span>
        <span className="text-muted-light truncate">{post.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted">
            <time>{post.date}</time>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
        </header>

        <div className="prose-custom space-y-4 text-muted-light leading-relaxed text-[15px]">
          {Content && <Content />}
        </div>
      </article>

      {/* Back to blog */}
      <div className="mt-12 pt-8 border-t border-white/5">
        <a
          href="/blog/"
          className="text-sm text-gain hover:underline font-display font-medium"
        >
          ← Back to blog
        </a>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 px-4 py-3 rounded-lg bg-surface-800 border border-white/5">
        <p className="text-[11px] text-muted leading-relaxed">
          For informational and educational purposes only. Not financial advice.
          Past performance does not guarantee future results. All calculations
          are based on split-adjusted closing prices from Yahoo Finance and do
          not account for dividends, taxes, or trading fees.
        </p>
      </div>
    </div>
  );
}
