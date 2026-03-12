'use client';

import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/methodology/', label: 'Methodology', mobile: false },
  { href: '/about/', label: 'About', mobile: false },
  { href: '/disclaimer/', label: 'Disclaimer', mobile: true },
];

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href) => pathname === href || pathname === href.replace(/\/$/, '');

  return (
    <nav className="border-b border-white/5 bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-display font-bold text-lg tracking-tight text-white hover:text-gain transition-colors">
          What if you invested<span className="text-gain">...</span>
        </a>
        <div className="flex items-center gap-5 text-sm">
          {NAV_LINKS.map(({ href, label, mobile }) => (
            <a
              key={href}
              href={href}
              className={`transition-colors ${mobile ? '' : 'hidden sm:block'} ${
                isActive(href)
                  ? 'text-gain font-medium'
                  : 'text-muted-light hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="/calculator/"
            className={`font-display font-semibold text-sm px-3.5 py-1.5 rounded-lg transition-colors ${
              isActive('/calculator/')
                ? 'bg-gain text-surface-900'
                : 'bg-gain/10 text-gain hover:bg-gain/20'
            }`}
          >
            Calculator
          </a>
        </div>
      </div>
    </nav>
  );
}
