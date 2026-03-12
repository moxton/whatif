export const metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers about the use of historical stock return data on this site.',
};

export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-2">
        Disclaimer
      </h1>
      <p className="text-sm text-muted mb-8">
        Important information about this site and its content.
      </p>

      <div className="space-y-6 text-muted-light leading-relaxed">
        <section className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Not financial advice
          </h2>
          <p>
            The content on What If You Invested is for informational and
            educational purposes only. Nothing on this site constitutes
            financial advice, investment advice, trading advice, or any
            other kind of advice, and you should not treat any of the
            site's content as such. We do not recommend that any
            securities or investments be bought, sold, or held by you.
            Do your own due diligence and consult a financial advisor
            before making any investment decisions.
          </p>
        </section>

        <section className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Past performance
          </h2>
          <p>
            Past performance is not indicative of future results. The
            historical returns shown on this site do not guarantee,
            predict, or forecast future performance of any security,
            investment, or index. Any historical returns, expected returns,
            or probability projections may not reflect actual future
            performance.
          </p>
        </section>

        <section className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Data accuracy
          </h2>
          <p>
            While we strive to ensure the accuracy of all data presented,
            we cannot guarantee that all information is complete, accurate,
            or up to date. Stock prices, returns, and other financial data
            are sourced from Yahoo Finance and may contain errors,
            omissions, or discrepancies. Users should independently verify
            any data before making decisions based on it.
          </p>
        </section>

        <section className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Affiliate disclosure
          </h2>
          <p>
            This site may contain links to third-party products and
            services, including brokerage accounts. Some of these links
            may be affiliate links, meaning we may earn a commission if
            you click through and make a purchase or open an account.
            This does not affect the data, calculations, or content
            presented on this site. Affiliate relationships do not
            influence which companies or investments are featured.
          </p>
        </section>

        <section className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Limitation of liability
          </h2>
          <p>
            Under no circumstances shall What If You Invested be liable
            for any direct, indirect, incidental, special, consequential,
            or exemplary damages resulting from the use of, or the
            inability to use, the information provided on this site. This
            includes, without limitation, damages for loss of profits,
            goodwill, data, or other intangible losses, even if we have
            been advised of the possibility of such damages.
          </p>
        </section>

        <section className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-3">
            Calculations and limitations
          </h2>
          <p>
            Return calculations are based on split-adjusted closing
            prices and do not include dividend reinvestment, taxes,
            trading fees, or inflation adjustments. Actual investment
            returns may differ significantly from the figures shown.
            See our{' '}
            <a href="/methodology/" className="text-accent hover:underline">
              methodology page
            </a>{' '}
            for complete details on how returns are calculated.
          </p>
        </section>
      </div>
    </div>
  );
}
