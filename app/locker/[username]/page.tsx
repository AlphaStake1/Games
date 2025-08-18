import { Metadata } from 'next';
import { PlayerLockerRoom } from '@/components/locker/PlayerLockerRoom';

export const metadata: Metadata = {
  title: 'Player Locker Room | Football Squares',
  description: "View a player's NFT collection in their personal locker room",
};

interface LockerPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function LockerPage({ params }: LockerPageProps) {
  const { username } = await params;
  return <PlayerLockerRoom username={username} />;
}
