import CryptoBasicsContent from '../../components/CryptoBasicsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Basics - Football Squares',
  description:
    'Learn the fundamentals of cryptocurrency, wallets, and transactions with Football Squares Crypto Basics guide.',
};

export default function CryptoBasicsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <CryptoBasicsContent />
      </main>
    </div>
  );
}
