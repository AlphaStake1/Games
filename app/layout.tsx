'use client';

import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WalletConnectionProvider } from '@/contexts/WalletConnectionProvider';
import WalletConnectionPopup from '@/components/WalletConnectionPopup';
import { useWalletConnection } from '@/contexts/WalletConnectionProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const recursive = Recursive({
  subsets: ['latin'],
  variable: '--font-recursive',
});


const RootLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isPopupOpen, hidePopup, currentIntent, intentData } = useWalletConnection();
  const { connect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  };

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WalletConnectionPopup
        isOpen={isPopupOpen}
        onClose={hidePopup}
        onConnect={handleConnect}
        intent={currentIntent}
        intentData={intentData}
      />
    </>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${recursive.variable} font-sans`}>
      <body>
        <Providers>
          <WalletConnectionProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </WalletConnectionProvider>
        </Providers>
      </body>
    </html>
  );
}
