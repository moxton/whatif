export default function FAQSchema({ pageData }) {
  const investment = pageData.default_investment.toLocaleString('en-US');
  const value = Math.round(pageData.current_value).toLocaleString('en-US');
  const sp500Value = pageData.sp500_comparison.current_value
    ? Math.round(pageData.sp500_comparison.current_value).toLocaleString('en-US')
    : null;

  const faqs = [
    {
      question: `What would $${investment} invested in ${pageData.company_name} in ${pageData.start_year} be worth today?`,
      answer: `$${investment} invested in ${pageData.company_name} (${pageData.ticker}) in ${pageData.start_year} would be worth approximately $${value} today, representing a total return of ${pageData.total_return_pct >= 0 ? '+' : ''}${pageData.total_return_pct}% and an annualized return of ${pageData.annualized_return_pct}%.`,
    },
    {
      question: `How does ${pageData.company_name} compare to the S&P 500 since ${pageData.start_year}?`,
      answer: sp500Value
        ? `$${investment} invested in the S&P 500 in ${pageData.start_year} would be worth approximately $${sp500Value} today (${pageData.sp500_comparison.total_return_pct >= 0 ? '+' : ''}${pageData.sp500_comparison.total_return_pct}%), compared to $${value} for ${pageData.company_name} (${pageData.total_return_pct >= 0 ? '+' : ''}${pageData.total_return_pct}%).`
        : `Comparison data is not available for this time period.`,
    },
    {
      question: `What was the annualized return for ${pageData.company_name} since ${pageData.start_year}?`,
      answer: `${pageData.company_name} has delivered an annualized return of ${pageData.annualized_return_pct}% since ${pageData.start_year}, based on split-adjusted price data.`,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
