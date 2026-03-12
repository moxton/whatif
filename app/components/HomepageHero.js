'use client';

import { useState, useEffect } from 'react';

const EXAMPLES = [
  { name: 'Nvidia', ticker: 'NVDA', year: 2015, value: '$283,420', pct: '+28,242%' },
  { name: 'Bitcoin', ticker: 'BTC-USD', year: 2014, value: '$294,697', pct: '+29,370%' },
  { name: 'Amazon', ticker: 'AMZN', year: 1997, value: '$358,742', pct: '+35,774%' },
  { name: 'Tesla', ticker: 'TSLA', year: 2010, value: '$118,508', pct: '+11,751%' },
  { name: 'Apple', ticker: 'AAPL', year: 2010, value: '$45,321', pct: '+4,432%' },
  { name: 'Netflix', ticker: 'NFLX', year: 2005, value: '$73,831', pct: '+7,283%' },
];

export default function HomepageHero() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % EXAMPLES.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const example = EXAMPLES[index];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gain/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-20 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Static headline */}
          <p className="text-sm sm:text-base text-muted-light mb-6 font-display tracking-wide uppercase">
            $1,000 invested in
          </p>

          {/* Rotating company + value */}
          <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-3">
              {example.name} in {example.year}
            </h1>
            <p className="font-mono font-bold text-5xl sm:text-6xl lg:text-7xl text-gain hero-glow tracking-tight mb-2">
              {example.value}
            </p>
            <p className="font-mono text-sm sm:text-base text-gain/60">
              {example.pct} total return
            </p>
          </div>

          {/* Static CTA */}
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-10">
            <a
              href="/calculator/"
              className="px-6 py-3 bg-gain text-surface-900 font-display font-semibold rounded-lg hover:bg-gain/90 transition-colors text-base"
            >
              Try any investment
            </a>
            <a
              href="#companies"
              className="px-6 py-3 bg-surface-700 text-white font-display font-medium rounded-lg hover:bg-surface-600 transition-colors border border-white/5 text-base"
            >
              Browse companies
            </a>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 mt-8">
            {EXAMPLES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setIndex(i); setFade(true); }, 150); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? 'bg-gain w-4' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Show ${EXAMPLES[i].name} example`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
