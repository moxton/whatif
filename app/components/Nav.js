'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/methodology/', label: 'Methodology' },
  { href: '/about/', label: 'About' },
  { href: '/disclaimer/', label: 'Disclaimer' },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href || pathname === href.replace(/\/$/, '');

  return (
    <nav className="border-b border-white/5 bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-display font-bold text-lg tracking-tight text-white hover:text-gain transition-colors">
          What if you invested<span className="text-gain">...</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-5 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`transition-colors ${
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

        {/* Mobile nav: calculator button + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <a
            href="/calculator/"
            className={`font-display font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isActive('/calculator/')
                ? 'bg-gain text-surface-900'
                : 'bg-gain/10 text-gain hover:bg-gain/20'
            }`}
          >
            Calculator
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-muted-light hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/5 bg-surface-900/95 backdrop-blur-md px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(href)
                  ? 'text-gain font-medium bg-gain/5'
                  : 'text-muted-light hover:text-white hover:bg-surface-700'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
