import { getAllComparisons, getAllComparisonSlugs, getComparisonBySlug, makeSlug, formatCurrency, formatPercent } from '../../lib/data';
import ComparisonCalculator from '../../components/ComparisonCalculator';
import ComparisonChart from '../../components/ComparisonChart';
import ComparisonTable from '../../components/ComparisonTable';
import ComparisonFAQSchema from '../../components/ComparisonFAQSchema';

export function generateStaticParams() {
  const slugs = getAllComparisonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const comparison = getComparisonBySlug(params.slug);
  if (!comparison) return { title: 'Not Found' };

  const { pageA, pageB } = comparison;
  const valueA = Math.round(pageA.current_value).toLocaleString('en-US');
  const valueB = Math.round(pageB.current_value).toLocaleString('en-US');

  return {
    title: `${pageA.company_name} vs ${pageB.company_name}: Investment Returns Since ${pageA.start_year}`,
    description: `$1,000 in ${pageA.company_name} since ${pageA.start_year} = $${valueA}. $1,000 in ${pageB.company_name} = $${valueB}. See the side-by-side comparison with interactive charts.`,
    openGraph: {
      title: `${pageA.company_name} vs ${pageB.company_name} since ${pageA.start_year}`,
      description: `$1,000 in ${pageA.company_name} = $${valueA} vs $1,000 in ${pageB.company_name} = $${valueB}. Which was the better investment?`,
    },
  };
}

export default function ComparisonPage({ params }) {
  const comparison = getComparisonBySlug(params.slug);

  if (!comparison) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-white mb-4">Comparison not found</h1>
        <a href="/" className="text-gain hover:underline">
          Back to homepage
        </a>
      </div>
    );
  }

  const { pageA, pageB, slug } = comparison;

  // Get other years for this same matchup
  const allComparisons = getAllComparisons();
  const otherYears = allComparisons.filter(
    (c) =>
      c.slug !== slug &&
      ((c.pageA.ticker === pageA.ticker && c.pageB.ticker === pageB.ticker) ||
       (c.pageA.ticker === pageB.ticker && c.pageB.ticker === pageA.ticker))
  );

  return (
    <>
      <ComparisonFAQSchema pageA={pageA} pageB={pageB} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6 flex items-center gap-1.5">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <span className="text-muted-light">Compare</span>
          <span>/</span>
          <span className="text-muted-light">{pageA.company_name} vs {pageB.company_name}</span>
        </nav>

        {/* Heading */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          {pageA.company_name} vs {pageB.company_name}: $1,000 invested since {pageA.start_year}
        </h1>
        <p className="text-sm text-muted mb-8">
          {pageA.ticker} vs {pageB.ticker} · Data through {pageA.price_date}
        </p>

        {/* Main content */}
        <div className="space-y-6">
          <ComparisonCalculator pageA={pageA} pageB={pageB} slug={slug} />
        </div>

        {/* Chart and table */}
        <div className="space-y-6 mt-10">
          <ComparisonChart pageA={pageA} pageB={pageB} />
          <ComparisonTable pageA={pageA} pageB={pageB} />
        </div>

        {/* Other start years for this matchup */}
        {otherYears.length > 0 && (
          <div className="mt-10">
            <div className="bg-surface-800 rounded-2xl border border-white/5 p-6">
              <h3 className="font-display font-semibold text-white mb-1">
                Other start years
              </h3>
              <p className="text-xs text-muted mb-4">
                {pageA.company_name} vs {pageB.company_name} from a different starting point
              </p>
              <div className="flex flex-wrap gap-2">
                {otherYears
                  .sort((a, b) => a.year - b.year)
                  .map((c) => (
                    <a
                      key={c.slug}
                      href={`/compare/${c.slug}/`}
                      className="px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors border border-white/5"
                    >
                      <span className="text-sm text-white font-display font-medium">Since {c.year}</span>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Links to individual pages */}
        <div className="mt-6">
          <div className="bg-surface-800 rounded-2xl border border-white/5 p-6">
            <h3 className="font-display font-semibold text-white mb-4">
              Individual stock pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`/what-if-you-invested-in/${makeSlug(pageA.company_name, pageA.start_year)}/`}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors border border-white/5"
              >
                <span className="font-display font-medium text-white text-sm">{pageA.company_name} since {pageA.start_year}</span>
                <span className={`font-mono text-xs font-medium px-2 py-0.5 rounded ${pageA.total_return_pct >= 0 ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>
                  {pageA.total_return_pct >= 0 ? '+' : ''}{formatPercent(pageA.total_return_pct)}
                </span>
              </a>
              <a
                href={`/what-if-you-invested-in/${makeSlug(pageB.company_name, pageB.start_year)}/`}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors border border-white/5"
              >
                <span className="font-display font-medium text-white text-sm">{pageB.company_name} since {pageB.start_year}</span>
                <span className={`font-mono text-xs font-medium px-2 py-0.5 rounded ${pageB.total_return_pct >= 0 ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>
                  {pageB.total_return_pct >= 0 ? '+' : ''}{formatPercent(pageB.total_return_pct)}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 px-4 py-3 rounded-lg bg-surface-800 border border-white/5">
          <p className="text-[11px] text-muted leading-relaxed">
            For informational and educational purposes only. Not financial advice.
            Past performance does not guarantee future results. All calculations
            are based on split-adjusted closing prices from Yahoo Finance and do
            not account for dividends, taxes, or trading fees. See our{' '}
            <a href="/methodology/" className="text-gain hover:underline">
              methodology
            </a>{' '}
            and{' '}
            <a href="/disclaimer/" className="text-gain hover:underline">
              full disclaimer
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
