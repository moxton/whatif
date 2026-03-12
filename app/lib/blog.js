/**
 * Blog post data. Each post is a static object with content
 * rendered as JSX in the blog page template.
 */

export const BLOG_POSTS = [
  {
    slug: 'best-performing-stocks-last-20-years',
    title: 'The 10 Best Performing Stocks of the Last 20+ Years',
    description:
      'Which stocks turned $1,000 into a fortune? We ranked every company in our database by total return from the earliest available start year.',
    date: '2026-03-12',
    readTime: '5 min',
  },
  {
    slug: 'how-to-calculate-investment-returns',
    title: 'How to Calculate Investment Returns (Total Return, CAGR Explained)',
    description:
      'Total return, annualized return, CAGR. What they mean, how to calculate them, and why they matter when comparing investments.',
    date: '2026-03-12',
    readTime: '4 min',
  },
  {
    slug: 'what-1000-invested-in-sp500-would-be-worth',
    title: 'What $1,000 Invested in the S&P 500 Would Be Worth Today',
    description:
      'We calculated what a $1,000 investment in the S&P 500 would be worth from six different start years, from 2000 to 2023.',
    date: '2026-03-12',
    readTime: '4 min',
  },
];

export function getAllPosts() {
  return BLOG_POSTS;
}

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export function getAllBlogSlugs() {
  return BLOG_POSTS.map((p) => p.slug);
}
