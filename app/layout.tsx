import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const recursive = Recursive({
  subsets: ["latin"],
  variable: "--font-recursive",
});

export const metadata: Metadata = {
  title: "Crypto Squares",
  description: "A Solana-Based Football Squares dApp",
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
          {children}
        </Providers>
      </body>
    </html>
  );
}