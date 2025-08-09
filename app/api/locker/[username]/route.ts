import { NextRequest, NextResponse } from 'next/server';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { Metaplex } from '@metaplex-foundation/js';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Mock database - replace with actual database
const userProfiles = new Map<string, any>([
  [
    'demo',
    {
      walletAddress: 'DemoWallet123ABC',
      displayName: 'Demo Player',
      lockerStyle: 'pro',
      isPublic: true,
      jerseyNumber: '88',
      joinedDate: 'Jan 2024',
    },
  ],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;

    // Check cache first
    const cached = cache.get(username);
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data);
    }

    // Get user profile from database
    const profile = userProfiles.get(username);

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!profile.isPublic) {
      return NextResponse.json(
        { error: 'Locker is private', isPublic: false },
        { status: 403 },
      );
    }

    // For demo purposes, return mock data
    // In production, fetch NFTs from Solana using wallet address
    const lockerData = {
      username,
      walletAddress: profile.walletAddress,
      displayName: profile.displayName,
      lockerStyle: profile.lockerStyle || 'rookie',
      teamColors: {
        primary: '#002244',
        secondary: '#ed5925',
      },
      nfts:
        username === 'demo'
          ? [
              {
                id: '1',
                name: 'Golden Victory',
                description:
                  'Won this beauty in the 2024 Championship Game. The golden glow represents the final touchdown that sealed our victory!',
                image: '/api/placeholder/200/200',
                tier: 'house',
                rarity: 'legendary',
                wins: 5,
              },
              {
                id: '2',
                name: 'Lucky Shamrock',
                description:
                  "My St. Patrick's Day special - hasn't lost a game yet!",
                image: '/api/placeholder/200/200',
                tier: 'custom',
                rarity: 'rare',
              },
              {
                id: '3',
                name: 'Electric Thunder',
                description:
                  'AI-generated from my prompt: "lightning striking a football". Pure energy!',
                image: '/api/placeholder/200/200',
                tier: 'ai',
                rarity: 'rare',
              },
              {
                id: '4',
                name: 'First Timer',
                description: 'My first ever NFT - simple but special',
                image: '/api/placeholder/200/200',
                tier: 'default',
                rarity: 'common',
              },
              {
                id: '5',
                name: 'Neon Dreams',
                description: 'Animated neon sign that pulses with team colors',
                image: '/api/placeholder/200/200',
                tier: 'animated',
                rarity: 'legendary',
              },
              {
                id: '6',
                name: 'Doodle Champion',
                description:
                  'Drew this after our big win - stick figure doing a touchdown dance!',
                image: '/api/placeholder/200/200',
                tier: 'hand-drawn',
                rarity: 'common',
              },
            ]
          : [], // Would be fetched from Solana
      featuredNft:
        username === 'demo'
          ? {
              id: '5',
              name: 'Neon Dreams',
              description: 'Animated neon sign that pulses with team colors',
              image: '/api/placeholder/200/200',
              tier: 'animated',
              rarity: 'legendary',
            }
          : null,
      trophies: 12,
      totalGames: 48,
      viewCount: 342,
      isPublic: true,
      jerseyNumber: profile.jerseyNumber,
      joinedDate: profile.joinedDate,
    };

    // If we have a real wallet address, fetch NFTs from Solana
    if (profile.walletAddress && profile.walletAddress !== 'DemoWallet123ABC') {
      // TODO: Uncomment and implement when Solana packages are installed
      /*
      try {
        // Initialize Solana connection
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
            'https://api.mainnet-beta.solana.com',
        );

        const metaplex = new Metaplex(connection);
        const owner = new PublicKey(profile.walletAddress);

        // Fetch NFTs owned by this wallet
        // This is optimized to only fetch metadata, not the full NFT data
        const nfts = await metaplex.nfts().findAllByOwner({ owner }).run();

        // Filter for Football Squares NFTs (you'd check by collection or creator)
        // Transform to our format
        lockerData.nfts = nfts.slice(0, 12).map((nft: any) => ({
          id: nft.address.toString(),
          name: nft.name || 'Unnamed NFT',
          description: nft.json?.description || '',
          image: nft.json?.image || '/api/placeholder/200/200',
          tier: 'custom', // Would be determined from metadata
          rarity: 'common',
        }));
      } catch (error) {
        console.error('Error fetching NFTs from Solana:', error);
        // Continue with empty NFTs rather than failing
      }
      */
    }

    // Cache the result
    cache.set(username, {
      data: lockerData,
      expiry: Date.now() + CACHE_TTL,
    });

    // Increment view count (in production, do this in database)
    // This is fire-and-forget, don't await
    incrementViewCount(username);

    return NextResponse.json(lockerData);
  } catch (error) {
    console.error('Error in locker API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Helper function to increment view count
async function incrementViewCount(username: string) {
  // In production, update database
  // For now, just log
  console.log(`View count incremented for ${username}`);
}

// Optional: Add POST endpoint for updating locker settings
export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;
    const body = await request.json();

    // Verify user owns this locker (check auth)
    // Update settings in database

    // Clear cache for this user
    cache.delete(username);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update locker' },
      { status: 500 },
    );
  }
}
