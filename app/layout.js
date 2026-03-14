import './globals.css';
import Script from 'next/script';
import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Nav from './components/Nav';

const display = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: {
    default: 'What If You Invested | Historical Stock Return Calculator',
    template: '%s | What If You Invested',
  },
  description:
    'See what your investment would be worth today. Historical return calculator for every major stock, ETF, and crypto with interactive charts and S&P 500 comparison.',
  verification: {
    google: 'DLopYtAcr9PqmNkfX5v4vrx56rezTaoPx8Or4lKSfI0',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'What If You Invested',
    images: [
      {
        url: 'https://whatifyouinvested.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'What If You Invested - Historical Stock Return Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://whatifyouinvested.com/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JBYFF50D0H"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JBYFF50D0H');
          `}
        </Script>
      </head>
      <body className="font-body bg-surface-900 text-slate-200 min-h-screen">
        <Nav />

        <main>{children}</main>

        <footer className="border-t border-white/5 mt-20 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-display font-semibold text-white mb-3">
                  What if you invested<span className="text-gain">...</span>
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  Historical stock return calculator. See what any investment would
                  be worth today with interactive charts and S&P 500 comparison.
                </p>
              </div>
              <div>
                <h4 className="font-display font-semibold text-white mb-3">
                  Popular
                </h4>
                <div className="flex flex-col gap-1.5 text-sm text-muted-light">
                  <a href="/what-if-you-invested-in/apple-in-2010/" className="hover:text-white transition-colors">Apple since 2010</a>
                  <a href="/what-if-you-invested-in/nvidia-in-2015/" className="hover:text-white transition-colors">Nvidia since 2015</a>
                  <a href="/what-if-you-invested-in/tesla-in-2010/" className="hover:text-white transition-colors">Tesla since 2010</a>
                  <a href="/what-if-you-invested-in/bitcoin-in-2014/" className="hover:text-white transition-colors">Bitcoin since 2014</a>
                  <a href="/what-if-you-invested-in/amazon-in-1997/" className="hover:text-white transition-colors">Amazon since 1997</a>
                </div>
              </div>
              <div>
                <h4 className="font-display font-semibold text-white mb-3">
                  Resources
                </h4>
                <div className="flex flex-col gap-1.5 text-sm text-muted-light">
                  <a href="/calculator/" className="hover:text-white transition-colors">Calculator</a>
                  <a href="/compare/" className="hover:text-white transition-colors">Compare</a>
                  <a href="/blog/" className="hover:text-white transition-colors">Blog</a>
                  <a href="/methodology/" className="hover:text-white transition-colors">Methodology</a>
                  <a href="/about/" className="hover:text-white transition-colors">About</a>
                  <a href="/contact/" className="hover:text-white transition-colors">Contact</a>
                </div>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 text-xs text-muted">
              <p>
                For informational and educational purposes only. Not financial advice.
                Past performance does not guarantee future results. Data sourced from
                Yahoo Finance.
              </p>
              <p className="mt-2">
                &copy; {new Date().getFullYear()} What If You Invested. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
