import type { Metadata } from 'next';
import {
  Recursive,
  Caveat,
  Qwigley,
  Dancing_Script,
  Patrick_Hand,
  Shadows_Into_Light,
} from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WalletConnectionProvider } from '@/contexts/WalletConnectionProvider';
import ClientLayout from '@/components/layout/ClientLayout';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import Footer from '@/components/layout/Footer';
import { NetworkBanner } from '@/components/NetworkBanner';
import WalletConnectionWrapper from '@/components/WalletConnectionWrapper';

const recursive = Recursive({
  subsets: ['latin'],
  variable: '--font-recursive',
});

// Signature fonts
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

const qwigley = Qwigley({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-qwigley',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick-hand',
});

const shadowsIntoLight = Shadows_Into_Light({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-shadows-into-light',
});

export const metadata: Metadata = {
  title: 'Football Squares',
  description: 'Platform for NFL squares games and fantasy football resources.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${recursive.variable} ${caveat.variable} ${qwigley.variable} ${dancingScript.variable} ${patrickHand.variable} ${shadowsIntoLight.variable} font-sans`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <WalletConnectionProvider>
            <WalletConnectionWrapper>
              <ClientLayout>
                <NetworkBanner />
                <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
                  <div className="flex flex-1 pt-10">
                    <UnifiedSidebar />
                    <main className="flex-1 lg:ml-64 transition-all duration-300">
                      <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">{children}</div>
                      </div>
                    </main>
                  </div>
                  <Footer />
                </div>
              </ClientLayout>
            </WalletConnectionWrapper>
          </WalletConnectionProvider>
        </Providers>
      </body>
    </html>
  );
}
