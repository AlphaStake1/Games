import ConferenceLeaderboard from '@/components/ConferenceLeaderboard';

interface Conference {
  id: number;
  name: string;
  price: number;
  filled: number;
  capacity: number;
  featured?: boolean;
}

const conferences: Conference[] = [
  {
    id: 1,
    name: 'Eastern Conference',
    price: 25,
    filled: 87,
    capacity: 100,
  },
  {
    id: 2,
    name: 'Southern Conference',
    price: 50,
    filled: 65,
    capacity: 100,
  },
  {
    id: 3,
    name: 'Northern Conference',
    price: 100,
    filled: 43,
    capacity: 100,
  },
  {
    id: 4,
    name: 'Western Conference',
    price: 200,
    filled: 22,
    capacity: 100,
  },
  {
    id: 5,
    name: 'South-East Conference',
    price: 500,
    filled: 8,
    capacity: 100,
    featured: true,
  },
];

export async function generateStaticParams() {
  return conferences.map((conference) => ({
    id: conference.id.toString(),
  }));
}

const ConferenceLeaderboardPage = ({ params }: { params: { id: string } }) => {
  const conference = conferences.find((c) => c.id.toString() === params.id);

  return <ConferenceLeaderboard conference={conference} />;
};

export default ConferenceLeaderboardPage;
