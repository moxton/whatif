import { getAllPages, getAllSlugs, getPageBySlug, getPagesByCompany, getPagesBySector, makeSlug } from '../../lib/data';
import Calculator from '../../components/Calculator';
import GrowthChart from '../../components/GrowthChart';
import YearlyTable from '../../components/YearlyTable';
import RelatedLinks from '../../components/RelatedLinks';
import FAQSchema from '../../components/FAQSchema';

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const pageData = getPageBySlug(params.slug);
  if (!pageData) return { title: 'Not Found' };

  const value = Math.round(pageData.current_value).toLocaleString('en-US');
  const returnPct = pageData.total_return_pct >= 0
    ? `+${pageData.total_return_pct.toFixed(0)}%`
    : `${pageData.total_return_pct.toFixed(0)}%`;

  return {
    title: `What If You Invested in ${pageData.company_name} in ${pageData.start_year}?`,
    description: `$1,000 invested in ${pageData.company_name} in ${pageData.start_year} would be worth $${value} today (${returnPct}). See the interactive calculator, growth chart, and year-by-year breakdown.`,
    openGraph: {
      title: `$1,000 in ${pageData.company_name} since ${pageData.start_year} = $${value}`,
      description: `That's a ${returnPct} total return. See the full breakdown with interactive charts.`,
    },
  };
}

export default function CompanyPage({ params }) {
  const pageData = getPageBySlug(params.slug);

  if (!pageData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-white mb-4">Page not found</h1>
        <a href="/" className="text-accent hover:underline">
          Back to homepage
        </a>
      </div>
    );
  }

  const companyPages = getPagesByCompany(pageData.ticker);
  const sectorPages = getPagesBySector(pageData.sector);

  return (
    <>
      <FAQSchema pageData={pageData} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6 flex items-center gap-1.5">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <span className="text-muted-light">{pageData.company_name}</span>
          <span>/</span>
          <span className="text-muted-light">Since {pageData.start_year}</span>
        </nav>

        {/* Page heading */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          What if you invested in {pageData.company_name} in {pageData.start_year}?
        </h1>
        <p className="text-sm text-muted mb-8">
          {pageData.ticker} · {pageData.sector} ·{' '}
          Data through {pageData.price_date}
        </p>

        {/* Main content */}
        <div className="space-y-6">
          {/* Calculator hero */}
          <Calculator pageData={pageData} />

          {/* Calculator CTA */}
          <div className="bg-surface-800 rounded-2xl border border-white/5 p-5 flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="font-display font-semibold text-white text-base">
                Try a different start date
              </p>
              <p className="text-xs text-muted mt-0.5">
                Pick any month and year to see what {pageData.company_name} would be worth.
              </p>
            </div>
            <a
              href={`/calculator/?t=${pageData.ticker}&m=${pageData.start_year}-01&a=1000`}
              className="shrink-0 px-5 py-2 rounded-lg bg-accent text-white font-display font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              Open in Calculator
            </a>
          </div>
        </div>

        {/* Charts and data - visual break from hero section */}
        <div className="space-y-6 mt-10">
          {/* Growth chart */}
          <GrowthChart pageData={pageData} />

          {/* Year-by-year table */}
          <YearlyTable pageData={pageData} />
        </div>

        {/* Explore more */}
        <div className="mt-10">
          <RelatedLinks
            currentPage={pageData}
            companyPages={companyPages}
            sectorPages={sectorPages}
          />
        </div>

        {/* Page disclaimer */}
        <div className="mt-10 px-4 py-3 rounded-lg bg-surface-800 border border-white/5">
          <p className="text-[11px] text-muted leading-relaxed">
            For informational and educational purposes only. Not financial advice.
            Past performance does not guarantee future results. All calculations
            are based on split-adjusted closing prices from Yahoo Finance and do
            not account for dividends, taxes, or trading fees. See our{' '}
            <a href="/methodology/" className="text-accent hover:underline">
              methodology
            </a>{' '}
            and{' '}
            <a href="/disclaimer/" className="text-accent hover:underline">
              full disclaimer
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
