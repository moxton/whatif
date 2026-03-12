import { getTopPerformers, makeSlug } from './lib/data';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  const popular = getTopPerformers(6);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="font-mono text-6xl font-bold text-white/10 mb-4">404</p>
      <h1 className="font-display text-2xl font-bold text-white mb-2">
        Page not found
      </h1>
      <p className="text-muted-light mb-10">
        That page doesn't exist. Try one of these instead.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 text-left">
        {popular.map((page) => {
          const slug = makeSlug(page.company_name, page.start_year);
          return (
            <a
              key={page.ticker}
              href={`/what-if-you-invested-in/${slug}/`}
              className="bg-surface-800 border border-white/5 rounded-xl p-4 card-hover block group"
            >
              <p className="font-display font-medium text-sm text-white group-hover:text-gain transition-colors">
                {page.company_name}
              </p>
              <p className="text-xs text-muted mt-0.5">
                since {page.start_year}
              </p>
            </a>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg bg-surface-700 text-white font-display font-medium text-sm hover:bg-surface-600 transition-colors border border-white/5"
        >
          Homepage
        </a>
        <a
          href="/calculator/"
          className="px-5 py-2.5 rounded-lg bg-gain text-surface-900 font-display font-semibold text-sm hover:bg-gain/90 transition-colors"
        >
          Open Calculator
        </a>
      </div>
    </div>
  );
}
