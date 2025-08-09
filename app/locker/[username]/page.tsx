import { Metadata } from 'next';
import { PlayerLockerRoom } from '@/components/locker/PlayerLockerRoom';

export const metadata: Metadata = {
  title: 'Player Locker Room | Football Squares',
  description: "View a player's NFT collection in their personal locker room",
};

interface LockerPageProps {
  params: {
    username: string;
  };
}

export default function LockerPage({ params }: LockerPageProps) {
  return <PlayerLockerRoom username={params.username} />;
}
