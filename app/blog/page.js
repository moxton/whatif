import { getAllPosts } from '../lib/blog';

export const metadata = {
  title: 'Blog',
  description:
    'Investment insights, stock market analysis, and guides to understanding historical returns.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
        Blog
      </h1>
      <p className="text-sm text-muted mb-10">
        Data-driven investment analysis and guides.
      </p>

      <div className="space-y-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}/`}
            className="block bg-surface-800 border border-white/5 rounded-xl p-5 sm:p-6 card-hover group"
          >
            <div className="flex items-center gap-3 text-xs text-muted mb-2">
              <time>{post.date}</time>
              <span>·</span>
              <span>{post.readTime} read</span>
            </div>
            <h2 className="font-display font-semibold text-lg text-white group-hover:text-gain transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-muted-light leading-relaxed">
              {post.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
