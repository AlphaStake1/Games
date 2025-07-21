use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo, Transfer};
use anchor_spl::token_2022::{self, Token2022, TokenAccount as TokenAccount2022, Mint as Mint2022, MintTo as MintTo2022};
use anchor_spl::associated_token::AssociatedToken;
use switchboard_solana::VrfAccountData;

declare_id!("SeasonPass11111111111111111111111111111111");

#[program]
pub mod season_pass {
    use super::*;

    /// Initialize a new conference with specified parameters
    pub fn initialize_conference(
        ctx: Context<InitializeConference>,
        conference_id: u8,
        season_type: SeasonType,
        base_price_lamports: u64,
        max_per_wallet: u8,
        season_start_week: u8,
        season_end_week: u8,
    ) -> Result<()> {
        let conference = &mut ctx.accounts.conference;
        
        conference.id = conference_id;
        conference.season_type = season_type;
        conference.base_price_lamports = base_price_lamports;
        conference.capacity = 100;
        conference.filled = 0;
        conference.mint_live = true;
        conference.max_per_wallet = max_per_wallet;
        conference.season_start_week = season_start_week;
        conference.season_end_week = season_end_week;
        conference.authority = ctx.accounts.authority.key();
        conference.bump = ctx.bumps.conference;
        
        // Set scaling curve for Half-Season conferences
        if season_type == SeasonType::Half {
            conference.scale_curve_bps = [0, 1000, 2000, 3000, 4000]; // 0%, 10%, 20%, 30%, 40%
        } else {
            conference.scale_curve_bps = [0, 0, 0, 0, 0]; // No scaling for Full-Season
        }
        
        emit!(ConferenceInitialized {
            conference_id,
            season_type,
            base_price_lamports,
            max_per_wallet,
        });
        
        Ok(())
    }

    /// Mint a season pass NFT for a user
    pub fn mint_season_pass(
        ctx: Context<MintSeasonPass>,
        conference_id: u8,
    ) -> Result<()> {
        let conference = &mut ctx.accounts.conference;
        let wallet_pass_count = &mut ctx.accounts.wallet_pass_count;
        
        // Check if conference is still accepting mints
        require!(conference.mint_live, SeasonPassError::MintingClosed);
        require!(conference.filled < conference.capacity, SeasonPassError::ConferenceFull);
        
        // Check wallet pass count limits
        require!(
            wallet_pass_count.pass_count < conference.max_per_wallet,
            SeasonPassError::WalletCapExceeded
        );
        
        // Calculate price based on current pass count
        let price = calculate_pass_price(
            conference.base_price_lamports,
            wallet_pass_count.pass_count,
            &conference.scale_curve_bps,
        );
        
        // Transfer payment to conference vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.conference.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(transfer_ctx, price)?;
        
        // Mint the NFT (non-transferable)
        let mint_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo2022 {
                mint: ctx.accounts.pass_mint.to_account_info(),
                to: ctx.accounts.pass_token_account.to_account_info(),
                authority: ctx.accounts.conference.to_account_info(),
            },
            &[&[
                b"conference",
                &conference_id.to_le_bytes(),
                &[conference.bump],
            ]],
        );
        token_2022::mint_to(mint_ctx, 1)?;
        
        // Update counters
        conference.filled += 1;
        wallet_pass_count.pass_count += 1;
        
        // Create season pass account
        let season_pass = &mut ctx.accounts.season_pass;
        season_pass.conference_id = conference_id;
        season_pass.owner = ctx.accounts.payer.key();
        season_pass.mint_address = ctx.accounts.pass_mint.key();
        season_pass.total_points = 0;
        season_pass.games_played = 0;
        season_pass.pass_number = wallet_pass_count.pass_count;
        season_pass.is_active = true;
        season_pass.bump = ctx.bumps.season_pass;
        
        emit!(SeasonPassMinted {
            conference_id,
            owner: ctx.accounts.payer.key(),
            mint_address: ctx.accounts.pass_mint.key(),
            pass_number: wallet_pass_count.pass_count,
            price_paid: price,
        });
        
        Ok(())
    }

    /// Assign a random square to a pass holder for a specific game
    pub fn assign_game_square(
        ctx: Context<AssignGameSquare>,
        game_id: u64,
        square_index: u8,
    ) -> Result<()> {
        let game_assignment = &mut ctx.accounts.game_assignment;
        let season_pass = &ctx.accounts.season_pass;
        
        require!(season_pass.is_active, SeasonPassError::PassNotActive);
        require!(square_index < 100, SeasonPassError::InvalidSquareIndex);
        
        game_assignment.game_id = game_id;
        game_assignment.pass_mint = season_pass.mint_address;
        game_assignment.square_index = square_index;
        game_assignment.is_scored = false;
        game_assignment.points_earned = 0;
        game_assignment.bump = ctx.bumps.game_assignment;
        
        emit!(GameSquareAssigned {
            game_id,
            pass_mint: season_pass.mint_address,
            square_index,
        });
        
        Ok(())
    }

    /// Record scoring event and award points
    pub fn record_scoring_event(
        ctx: Context<RecordScoringEvent>,
        game_id: u64,
        home_score: u8,
        away_score: u8,
        quarter: u8,
        is_playoff: bool,
        playoff_round: Option<PlayoffRound>,
    ) -> Result<()> {
        let game_assignment = &mut ctx.accounts.game_assignment;
        let season_pass = &mut ctx.accounts.season_pass;
        
        require!(!game_assignment.is_scored, SeasonPassError::AlreadyScored);
        
        // Calculate hit patterns and points
        let points = calculate_hit_points(
            home_score % 10,
            away_score % 10,
            game_assignment.square_index,
            is_playoff,
            playoff_round,
        )?;
        
        // Update game assignment
        game_assignment.is_scored = true;
        game_assignment.points_earned = points;
        
        // Update season pass totals
        season_pass.total_points += points;
        season_pass.games_played += 1;
        
        emit!(ScoringEventRecorded {
            game_id,
            pass_mint: season_pass.mint_address,
            home_score,
            away_score,
            quarter,
            points_earned: points,
        });
        
        Ok(())
    }

    /// Update conference leaderboard
    pub fn update_leaderboard(
        ctx: Context<UpdateLeaderboard>,
        conference_id: u8,
    ) -> Result<()> {
        let conference = &mut ctx.accounts.conference;
        
        // This would typically aggregate all season pass scores
        // For now, we'll emit an event to trigger off-chain processing
        emit!(LeaderboardUpdateRequested {
            conference_id,
        });
        
        Ok(())
    }
}

// Helper function to calculate pass price with scaling
fn calculate_pass_price(
    base_price: u64,
    current_pass_count: u8,
    scale_curve_bps: &[u16; 5],
) -> u64 {
    if current_pass_count >= 5 {
        return base_price; // Shouldn't happen, but safety check
    }
    
    let multiplier_bps = scale_curve_bps[current_pass_count as usize];
    base_price * (10_000 + multiplier_bps as u64) / 10_000
}

// Helper function to calculate hit points based on patterns
fn calculate_hit_points(
    home_digit: u8,
    away_digit: u8,
    square_index: u8,
    is_playoff: bool,
    playoff_round: Option<PlayoffRound>,
) -> Result<u64> {
    let home_pos = (square_index / 10) as u8;
    let away_pos = (square_index % 10) as u8;
    
    let mut base_points = 0u64;
    
    // Check hit patterns in priority order
    if home_digit == home_pos && away_digit == away_pos {
        base_points = 10; // Forward hit
    } else if home_digit == away_pos && away_digit == home_pos {
        base_points = 7; // Backward hit
    } else if (home_digit + 5) % 10 == home_pos && (away_digit + 5) % 10 == away_pos {
        base_points = 5; // Forward + 5 hit
    } else if (home_digit + 5) % 10 == away_pos && (away_digit + 5) % 10 == home_pos {
        base_points = 3; // Backward + 5 hit
    }
    
    // Apply playoff multipliers
    if is_playoff && base_points > 0 {
        let multiplier = match playoff_round {
            Some(PlayoffRound::WildCard) => 150, // 1.5x
            Some(PlayoffRound::Divisional) => 200, // 2.0x
            Some(PlayoffRound::Conference) => 250, // 2.5x
            Some(PlayoffRound::SuperBowl) => 300, // 3.0x
            None => 100, // 1.0x
        };
        base_points = base_points * multiplier / 100;
    }
    
    Ok(base_points)
}

// Account structs
#[account]
pub struct Conference {
    pub id: u8,
    pub season_type: SeasonType,
    pub base_price_lamports: u64,
    pub capacity: u16,
    pub filled: u16,
    pub mint_live: bool,
    pub max_per_wallet: u8,
    pub scale_curve_bps: [u16; 5],
    pub season_start_week: u8,
    pub season_end_week: u8,
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
pub struct SeasonPass {
    pub conference_id: u8,
    pub owner: Pubkey,
    pub mint_address: Pubkey,
    pub total_points: u64,
    pub games_played: u16,
    pub pass_number: u8,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
pub struct WalletPassCount {
    pub conference_id: u8,
    pub wallet: Pubkey,
    pub pass_count: u8,
    pub bump: u8,
}

#[account]
pub struct GameAssignment {
    pub game_id: u64,
    pub pass_mint: Pubkey,
    pub square_index: u8,
    pub is_scored: bool,
    pub points_earned: u64,
    pub bump: u8,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum SeasonType {
    Full,
    Half,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum PlayoffRound {
    WildCard,
    Divisional,
    Conference,
    SuperBowl,
}

// Context structs
#[derive(Accounts)]
#[instruction(conference_id: u8)]
pub struct InitializeConference<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 1 + 1 + 8 + 2 + 2 + 1 + 1 + 10 + 1 + 1 + 32 + 1,
        seeds = [b"conference", &conference_id.to_le_bytes()],
        bump
    )]
    pub conference: Account<'info, Conference>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(conference_id: u8)]
pub struct MintSeasonPass<'info> {
    #[account(
        mut,
        seeds = [b"conference", &conference_id.to_le_bytes()],
        bump = conference.bump
    )]
    pub conference: Account<'info, Conference>,
    
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + 1 + 32 + 1 + 1,
        seeds = [b"wallet_pass_count", &conference_id.to_le_bytes(), payer.key().as_ref()],
        bump
    )]
    pub wallet_pass_count: Account<'info, WalletPassCount>,
    
    #[account(
        init,
        payer = payer,
        space = 8 + 1 + 32 + 32 + 8 + 2 + 1 + 1 + 1,
        seeds = [b"season_pass", &conference_id.to_le_bytes(), payer.key().as_ref(), &wallet_pass_count.pass_count.to_le_bytes()],
        bump
    )]
    pub season_pass: Account<'info, SeasonPass>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = conference,
        mint::freeze_authority = conference,
        seeds = [b"pass_mint", &conference_id.to_le_bytes(), payer.key().as_ref(), &wallet_pass_count.pass_count.to_le_bytes()],
        bump
    )]
    pub pass_mint: Account<'info, Mint2022>,
    
    #[account(
        init,
        payer = payer,
        associated_token::mint = pass_mint,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub pass_token_account: Account<'info, TokenAccount2022>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct AssignGameSquare<'info> {
    #[account(
        seeds = [b"season_pass", &season_pass.conference_id.to_le_bytes(), season_pass.owner.as_ref(), &season_pass.pass_number.to_le_bytes()],
        bump = season_pass.bump
    )]
    pub season_pass: Account<'info, SeasonPass>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 8 + 32 + 1 + 1 + 8 + 1,
        seeds = [b"game_assignment", &game_id.to_le_bytes(), season_pass.mint_address.as_ref()],
        bump
    )]
    pub game_assignment: Account<'info, GameAssignment>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct RecordScoringEvent<'info> {
    #[account(
        mut,
        seeds = [b"game_assignment", &game_id.to_le_bytes(), season_pass.mint_address.as_ref()],
        bump = game_assignment.bump
    )]
    pub game_assignment: Account<'info, GameAssignment>,
    
    #[account(
        mut,
        seeds = [b"season_pass", &season_pass.conference_id.to_le_bytes(), season_pass.owner.as_ref(), &season_pass.pass_number.to_le_bytes()],
        bump = season_pass.bump
    )]
    pub season_pass: Account<'info, SeasonPass>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(conference_id: u8)]
pub struct UpdateLeaderboard<'info> {
    #[account(
        mut,
        seeds = [b"conference", &conference_id.to_le_bytes()],
        bump = conference.bump
    )]
    pub conference: Account<'info, Conference>,
    
    pub authority: Signer<'info>,
}

// Events
#[event]
pub struct ConferenceInitialized {
    pub conference_id: u8,
    pub season_type: SeasonType,
    pub base_price_lamports: u64,
    pub max_per_wallet: u8,
}

#[event]
pub struct SeasonPassMinted {
    pub conference_id: u8,
    pub owner: Pubkey,
    pub mint_address: Pubkey,
    pub pass_number: u8,
    pub price_paid: u64,
}

#[event]
pub struct GameSquareAssigned {
    pub game_id: u64,
    pub pass_mint: Pubkey,
    pub square_index: u8,
}

#[event]
pub struct ScoringEventRecorded {
    pub game_id: u64,
    pub pass_mint: Pubkey,
    pub home_score: u8,
    pub away_score: u8,
    pub quarter: u8,
    pub points_earned: u64,
}

#[event]
pub struct LeaderboardUpdateRequested {
    pub conference_id: u8,
}

// Errors
#[error_code]
pub enum SeasonPassError {
    #[msg("Minting is currently closed for this conference")]
    MintingClosed,
    #[msg("Conference is at full capacity")]
    ConferenceFull,
    #[msg("Wallet has reached the maximum number of passes for this conference")]
    WalletCapExceeded,
    #[msg("Season pass is not active")]
    PassNotActive,
    #[msg("Invalid square index")]
    InvalidSquareIndex,
    #[msg("Scoring event already recorded for this game")]
    AlreadyScored,
}