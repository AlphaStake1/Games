import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WalletConnectionProvider } from '@/contexts/WalletConnectionProvider';
import ClientLayout from '@/components/layout/ClientLayout';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import Footer from '@/components/layout/Footer';

const recursive = Recursive({
  subsets: ['latin'],
  variable: '--font-recursive',
});

export const metadata: Metadata = {
  title: 'Football Squares',
  description:
    'The ultimate destination for NFL squares games and fantasy football resources.',
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
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-1">
                  <UnifiedSidebar />
                  <main className="flex-1 lg:ml-64 transition-all duration-300">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                  </main>
                </div>
                <Footer />
              </div>
            </ClientLayout>
          </WalletConnectionProvider>
        </Providers>
      </body>
    </html>
  );
}
