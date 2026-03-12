import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import InteractiveCalculator from '../components/InteractiveCalculator';

export const metadata = {
  title: 'Investment Calculator - Pick Any Stock, Any Date',
  description:
    'Calculate what any stock investment would be worth today. Choose from 44+ companies, pick any start month, and see interactive charts with S&P 500 comparison.',
  openGraph: {
    title: 'Stock Investment Calculator - What If You Invested?',
    description:
      'Pick any company, any date, any amount. See exactly what your investment would be worth today with interactive charts.',
  },
};

function getCalculatorIndex() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'calculator_index.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export default function CalculatorPage() {
  const companies = getCalculatorIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
        Investment Calculator
      </h1>
      <p className="text-sm text-muted mb-8">
        Pick any company, any start date, any amount. See what it would be worth today.
      </p>

      <Suspense fallback={<div className="text-muted text-sm">Loading calculator...</div>}>
        <InteractiveCalculator companies={companies} />
      </Suspense>
    </div>
  );
}
