export const metadata = {
  title: 'Contact',
  description: 'Get in touch with the What If You Invested team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
        Contact
      </h1>
      <p className="text-muted-light leading-relaxed mb-8">
        Questions, feedback, or data requests? Reach out anytime.
      </p>

      <div className="bg-surface-800 rounded-2xl border border-white/5 p-6 sm:p-8">
        <p className="text-sm text-muted-light mb-2">Email us at</p>
        <a
          href="mailto:hello@whatifyouinvested.com"
          className="font-display font-semibold text-lg text-gain hover:text-gain/80 transition-colors"
        >
          hello@whatifyouinvested.com
        </a>
        <p className="text-xs text-muted mt-6">
          We typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
