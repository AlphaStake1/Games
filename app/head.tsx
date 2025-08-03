import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Football Squares - Decentralized NFL Squares on Solana',
  description:
    'Play Football Squares with crypto rewards. Join games, create boards, and win SOL with our fair and transparent blockchain-based platform.',
};

export default function Head() {
  return (
    <>
      <title>{metadata.title as string}</title>
      <meta name="description" content={metadata.description as string} />
    </>
  );
}
