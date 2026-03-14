'use client';

import { useState, useRef, useEffect } from 'react';

export default function CompareButton({ partners }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!partners || partners.length === 0) return null;

  // Single partner - direct link
  if (partners.length === 1) {
    return (
      <a
        href={`/compare/${partners[0].comparisonSlug}/`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium bg-surface-700 text-muted-light hover:bg-surface-600 hover:text-white transition-colors border border-white/5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Compare vs {partners[0].partnerName}
      </a>
    );
  }

  // Multiple partners - dropdown
  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium bg-surface-700 text-muted-light hover:bg-surface-600 hover:text-white transition-colors border border-white/5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Compare
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 right-0 mt-1 w-48 bg-surface-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
          {partners.map((p) => (
            <a
              key={p.comparisonSlug}
              href={`/compare/${p.comparisonSlug}/`}
              className="block px-4 py-2.5 text-sm text-muted-light hover:bg-surface-700 hover:text-white transition-colors font-display"
            >
              vs {p.partnerName}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
