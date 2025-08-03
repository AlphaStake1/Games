import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WalletConnectionProvider } from '@/contexts/WalletConnectionProvider';
import ClientLayout from '@/components/layout/ClientLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const recursive = Recursive({
  subsets: ['latin'],
  variable: '--font-recursive',
});

export const metadata: Metadata = {
  title: 'Football Squares',
  description: 'The ultimate destination for NFL squares games and fantasy football resources.',
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
            <ClientLayout>
              <Header />
              <main>{children}</main>
              <Footer />
            </ClientLayout>
          </WalletConnectionProvider>
        </Providers>
      </body>
    </html>
  );
}
