'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const router = useRouter();

  const handleJoinGames = () => {
    router.push('/boards?mode=weekly');
  };

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Weekly Cash Games Start Here
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Join upcoming NFL games with instant payouts every quarter.
          </p>
          <Button
            onClick={handleJoinGames}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Join Weekly Cash Games
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
