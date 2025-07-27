import WalletConnectionContent from '@/components/WalletConnectionContent';

export const metadata = {
  title: 'Wallet Connection Guide | Football Squares',
  description:
    'Learn how to connect your Solana wallet to participate in trustless Football Squares games. Step-by-step setup for Phantom, Solflare, and other supported wallets.',
  keywords:
    'Solana wallet, Phantom wallet, Solflare wallet, wallet connection, trustless gaming, smart contracts, Football Squares wallet setup',
};

export default function PaymentGuidePage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300">
      <WalletConnectionContent />
    </div>
  );
}
