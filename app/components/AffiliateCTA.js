export default function AffiliateCTA() {
  return (
    <div className="bg-surface-800 rounded-2xl border border-white/5 p-6 gradient-border">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gain/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="w-5 h-5 text-gain"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-display font-semibold text-white mb-1">
            Ready to start investing?
          </h4>
          <p className="text-sm text-muted-light mb-4 leading-relaxed">
            Compare top brokerages and open an account in minutes. Most offer
            commission-free stock and ETF trading.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.fidelity.com/open-account/overview"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm text-white transition-colors"
              rel="nofollow noopener noreferrer"
            >
              Fidelity
              <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href="https://www.schwab.com/open-an-account"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm text-white transition-colors"
              rel="nofollow noopener noreferrer"
            >
              Schwab
              <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href="https://robinhood.com/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm text-white transition-colors"
              rel="nofollow noopener noreferrer"
            >
              Robinhood
              <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <p className="text-[10px] text-muted mt-3">
            We may earn a commission if you open an account through these links.
            This does not affect our data or calculations.
          </p>
        </div>
      </div>
    </div>
  );
}
