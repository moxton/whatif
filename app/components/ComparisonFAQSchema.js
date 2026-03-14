export default function ComparisonFAQSchema({ pageA, pageB }) {
  function formatValue(val) {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${Math.round(val).toLocaleString('en-US')}`;
  }

  const winnerName = pageA.current_value >= pageB.current_value ? pageA.company_name : pageB.company_name;
  const winnerValue = Math.max(pageA.current_value, pageB.current_value);
  const loserName = pageA.current_value >= pageB.current_value ? pageB.company_name : pageA.company_name;
  const loserValue = Math.min(pageA.current_value, pageB.current_value);

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Which was the better investment since ${pageA.start_year}, ${pageA.company_name} or ${pageB.company_name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${winnerName} was the better investment. $1,000 invested in ${winnerName} in ${pageA.start_year} would be worth ${formatValue(winnerValue)} today, compared to ${formatValue(loserValue)} for ${loserName}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What would $1,000 in ${pageA.company_name} vs ${pageB.company_name} be worth today?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `$1,000 invested in ${pageA.company_name} in ${pageA.start_year} would be worth ${formatValue(pageA.current_value)} today (${pageA.total_return_pct >= 0 ? '+' : ''}${pageA.total_return_pct.toFixed(1)}%). The same $1,000 in ${pageB.company_name} would be worth ${formatValue(pageB.current_value)} (${pageB.total_return_pct >= 0 ? '+' : ''}${pageB.total_return_pct.toFixed(1)}%).`,
        },
      },
      {
        '@type': 'Question',
        name: `How do ${pageA.company_name} and ${pageB.company_name} compare to the S&P 500 since ${pageA.start_year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The same $1,000 invested in the S&P 500 in ${pageA.start_year} would be worth ${formatValue(pageA.sp500_comparison.current_value)} today (${pageA.sp500_comparison.total_return_pct >= 0 ? '+' : ''}${pageA.sp500_comparison.total_return_pct}%). ${pageA.company_name} returned ${formatValue(pageA.current_value)} and ${pageB.company_name} returned ${formatValue(pageB.current_value)} over the same period.`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}
