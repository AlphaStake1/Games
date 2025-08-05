import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { FootballSquares } from '../target/types/football_squares';
import { createClient } from '@supabase/supabase-js';

// Database setup (adjust based on your setup)
const supabase = createClient(
  process.env.SUPABASE_URL || 'your-supabase-url',
  process.env.SUPABASE_ANON_KEY || 'your-supabase-key',
);

// Solana setup
const connection = new Connection(
  process.env.RPC_URL || 'https://api.devnet.solana.com',
);
const programId = new PublicKey('7B8QfzEJZ8KFjJKpqZ4YvZyYvTqZ4YvZyYvTqZ4YvZyY');

interface BoardMetadataRow {
  game_id: string;
  cbl_wallet: string;
  fill_rate: number;
  boost_amount: string;
  promoted_until: string;
  created_at: string;
  tags: string;
  board_metadata_pubkey: string;
  last_updated: string;
}

class BoardBoostIndexer {
  private program: Program<FootballSquares>;

  constructor() {
    // Initialize program without wallet for read-only operations
    const provider = new AnchorProvider(
      connection,
      new Wallet(null as any),
      {},
    );
    this.program = new Program(
      require('../target/idl/football_squares.json'),
      programId,
      provider,
    );
  }

  async startListening() {
    console.log('🚀 Starting Board Boost Indexer...');

    // Listen for BoardPublished events
    this.program.addEventListener(
      'BoardPublished',
      async (event, slot, signature) => {
        console.log('📢 Board Published:', event);
        await this.handleBoardPublished(event, signature);
      },
    );

    // Listen for BoardBoosted events
    this.program.addEventListener(
      'BoardBoosted',
      async (event, slot, signature) => {
        console.log('🚀 Board Boosted:', event);
        await this.handleBoardBoosted(event, signature);
      },
    );

    // Also scan for existing boards on startup
    await this.scanExistingBoards();

    console.log('✅ Indexer running. Listening for events...');
  }

  private async handleBoardPublished(event: any, signature: string) {
    try {
      const row: BoardMetadataRow = {
        game_id: event.gameId.toString(),
        cbl_wallet: event.cbl.toString(),
        fill_rate: 0,
        boost_amount: '0',
        promoted_until: new Date(0).toISOString(),
        created_at: new Date().toISOString(),
        tags: this.decodeTagsToString(event.tags || []),
        board_metadata_pubkey: event.boardMetadata.toString(),
        last_updated: new Date().toISOString(),
      };

      const { error } = await supabase.from('board_metadata').insert([row]);

      if (error) {
        console.error('❌ Error inserting board metadata:', error);
      } else {
        console.log('✅ Board metadata indexed:', event.gameId.toString());
      }
    } catch (error) {
      console.error('❌ Error handling BoardPublished:', error);
    }
  }

  private async handleBoardBoosted(event: any, signature: string) {
    try {
      const { error } = await supabase
        .from('board_metadata')
        .update({
          boost_amount: event.newBoostTotal.toString(),
          promoted_until: new Date(
            event.promotedUntil.toNumber() * 1000,
          ).toISOString(),
          last_updated: new Date().toISOString(),
        })
        .eq('game_id', event.gameId.toString());

      if (error) {
        console.error('❌ Error updating boost data:', error);
      } else {
        console.log('✅ Boost data updated for game:', event.gameId.toString());
      }
    } catch (error) {
      console.error('❌ Error handling BoardBoosted:', error);
    }
  }

  private async scanExistingBoards() {
    try {
      console.log('🔍 Scanning for existing BoardMetadata accounts...');

      const accounts = await this.program.account.boardMetadata.all();
      console.log(`📊 Found ${accounts.length} existing boards`);

      for (const account of accounts) {
        const data = account.account;
        const row: BoardMetadataRow = {
          game_id: data.gameId.toString(),
          cbl_wallet: data.cbl.toString(),
          fill_rate: data.fillRate,
          boost_amount: data.boostAmount.toString(),
          promoted_until: new Date(
            data.promotedUntil.toNumber() * 1000,
          ).toISOString(),
          created_at: new Date(data.createdAt.toNumber() * 1000).toISOString(),
          tags: this.decodeTagsToString(data.tags),
          board_metadata_pubkey: account.publicKey.toString(),
          last_updated: new Date().toISOString(),
        };

        // Upsert to handle duplicates
        const { error } = await supabase
          .from('board_metadata')
          .upsert([row], { onConflict: 'game_id' });

        if (error) {
          console.error('❌ Error upserting board:', error);
        }
      }

      console.log('✅ Existing boards scan complete');
    } catch (error) {
      console.error('❌ Error scanning existing boards:', error);
    }
  }

  private decodeTagsToString(tags: number[]): string {
    // Convert tags array back to string, removing null bytes
    const buffer = Buffer.from(tags);
    const nullIndex = buffer.indexOf(0);
    return buffer
      .subarray(0, nullIndex > -1 ? nullIndex : buffer.length)
      .toString('utf8');
  }

  // Calculate fill rate based on board squares (to be called periodically)
  async updateFillRates() {
    console.log('📊 Updating fill rates...');
    // This would scan actual board accounts and calculate fill rates
    // Implementation depends on your existing Board account structure
  }
}

// Database schema (run this SQL to set up the table)
const createTableSQL = `
CREATE TABLE IF NOT EXISTS board_metadata (
  game_id TEXT PRIMARY KEY,
  cbl_wallet TEXT NOT NULL,
  fill_rate INTEGER DEFAULT 0,
  boost_amount TEXT DEFAULT '0',
  promoted_until TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01T00:00:00Z',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT DEFAULT '',
  board_metadata_pubkey TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for discovery queries
CREATE INDEX IF NOT EXISTS idx_promoted_boards ON board_metadata(promoted_until DESC, boost_amount DESC);
CREATE INDEX IF NOT EXISTS idx_cbl_boards ON board_metadata(cbl_wallet);
CREATE INDEX IF NOT EXISTS idx_tags ON board_metadata USING gin(to_tsvector('english', tags));
`;

// Start the indexer
if (require.main === module) {
  const indexer = new BoardBoostIndexer();
  indexer.startListening().catch(console.error);
}

export { BoardBoostIndexer, createTableSQL };
