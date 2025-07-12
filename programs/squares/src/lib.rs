use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};
use switchboard_solana::VrfAccountData;

declare_id!("Fg6PaFprPjfrgxLbfXyAyzsK1m1S82mC2f43s5D2qQq");

#[program]
pub mod squares {
    use super::*;

    pub fn create_board(ctx: Context<CreateBoard>, game_id: u64) -> Result<()> {
        let board = &mut ctx.accounts.board;
        board.game_id = game_id;
        board.authority = *ctx.accounts.authority.key;
        board.finalized = false;
        board.randomized = false;
        board.game_started = false;
        board.game_ended = false;
        board.winner = Pubkey::default();
        board.payout_amount = 0;
        board.total_pot = 0;
        board.home_score = 0;
        board.away_score = 0;
        board.quarter = 0;
        // Initialize all 100 squares to the system program, signifying they are unclaimed.
        board.squares = [Pubkey::default(); 100];
        // Headers will be set later by the randomizer agent. 10 is a sentinel for "not set".
        board.home_headers = [10; 10];
        board.away_headers = [10; 10];
        board.bump = ctx.bumps.board;

        emit!(BoardCreated {
            game_id,
            authority: *ctx.accounts.authority.key,
        });

        msg!("Board for game #{} created!", game_id);
        Ok(())
    }

    pub fn request_randomization(ctx: Context<RequestRandomization>) -> Result<()> {
        let board = &mut ctx.accounts.board;
        
        require!(!board.randomized, SquaresError::AlreadyRandomized);
        require!(!board.game_started, SquaresError::GameAlreadyStarted);

        // This will be called by Clockwork thread or agent
        emit!(RandomizationRequested {
            board_id: board.game_id,
            vrf_account: *ctx.accounts.vrf_account.key,
        });

        msg!("Randomization requested for board #{}", board.game_id);
        Ok(())
    }

    pub fn fulfill_vrf_callback(ctx: Context<FulfillVrf>, randomness: [u8; 32]) -> Result<()> {
        let board = &mut ctx.accounts.board;
        
        require!(!board.randomized, SquaresError::AlreadyRandomized);

        // Verify VRF proof
        let vrf_account_data = VrfAccountData::new(ctx.accounts.vrf_account.as_ref())?;
        require!(
            vrf_account_data.is_success(),
            SquaresError::InvalidVrfProof
        );

        // Derive headers from randomness
        board.home_headers = derive_headers(&randomness[..16]);
        board.away_headers = derive_headers(&randomness[16..]);
        board.randomized = true;

        emit!(HeadersRandomized {
            board_id: board.game_id,
            home_headers: board.home_headers,
            away_headers: board.away_headers,
        });

        msg!("VRF fulfilled for board #{}", board.game_id);
        Ok(())
    }

    pub fn purchase_square(ctx: Context<PurchaseSquare>, square_index: u8) -> Result<()> {
        let board = &mut ctx.accounts.board;
        
        require!(board.randomized, SquaresError::NotRandomized);
        require!(!board.game_started, SquaresError::GameAlreadyStarted);
        require!(square_index < 100, SquaresError::InvalidSquareIndex);
        require!(
            board.squares[square_index as usize] == Pubkey::default(),
            SquaresError::SquareAlreadyOwned
        );

        // Transfer SOL to board account
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.board.to_account_info(),
        };
        let transfer_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );
        anchor_lang::system_program::transfer(transfer_ctx, 10_000_000)?; // 0.01 SOL

        board.squares[square_index as usize] = *ctx.accounts.buyer.key;
        board.total_pot += 10_000_000;

        emit!(SquarePurchased {
            board_id: board.game_id,
            square_index,
            buyer: *ctx.accounts.buyer.key,
            amount: 10_000_000,
        });

        msg!("Square {} purchased for board #{}", square_index, board.game_id);
        Ok(())
    }

    pub fn record_score(ctx: Context<RecordScore>, home_score: u8, away_score: u8, quarter: u8) -> Result<()> {
        let board = &mut ctx.accounts.board;
        
        require!(board.randomized, SquaresError::NotRandomized);
        require!(!board.game_ended, SquaresError::GameEnded);
        require!(quarter <= 4, SquaresError::InvalidQuarter);

        board.home_score = home_score;
        board.away_score = away_score;
        board.quarter = quarter;

        if !board.game_started {
            board.game_started = true;
        }

        if quarter == 4 {
            board.game_ended = true;
        }

        emit!(ScoreRecorded {
            board_id: board.game_id,
            home_score,
            away_score,
            quarter,
        });

        msg!("Score recorded: {}:{} Q{} for board #{}", home_score, away_score, quarter, board.game_id);
        Ok(())
    }

    pub fn settle_winner(ctx: Context<SettleWinner>) -> Result<()> {
        let board = &mut ctx.accounts.board;
        
        require!(board.game_ended, SquaresError::GameNotEnded);
        require!(board.winner == Pubkey::default(), SquaresError::AlreadySettled);

        let home_digit = board.home_score % 10;
        let away_digit = board.away_score % 10;

        // Find the winner based on the final score digits
        let winner_square = find_winner_square(
            &board.home_headers,
            &board.away_headers,
            home_digit,
            away_digit,
        )?;

        let winner_address = board.squares[winner_square as usize];
        require!(winner_address != Pubkey::default(), SquaresError::NoWinner);

        board.winner = winner_address;
        board.payout_amount = board.total_pot;

        emit!(WinnerSettled {
            board_id: board.game_id,
            winner: winner_address,
            payout_amount: board.payout_amount,
            square_index: winner_square,
        });

        msg!("Winner settled for board #{}: {} wins {} lamports",
             board.game_id, winner_address, board.payout_amount);
        Ok(())
    }

    pub fn payout_winner(ctx: Context<PayoutWinner>) -> Result<()> {
        let board = &mut ctx.accounts.board;
        
        require!(board.winner != Pubkey::default(), SquaresError::NoWinner);
        require!(board.payout_amount > 0, SquaresError::NoPayout);
        require!(board.winner == *ctx.accounts.winner.key, SquaresError::InvalidWinner);

        // Transfer winnings to winner
        let board_seeds = &[
            b"board",
            board.game_id.to_le_bytes().as_ref(),
            &[board.bump],
        ];
        let signer_seeds = &[&board_seeds[..]];

        **ctx.accounts.board.to_account_info().try_borrow_mut_lamports()? -= board.payout_amount;
        **ctx.accounts.winner.to_account_info().try_borrow_mut_lamports()? += board.payout_amount;

        // Mark as paid
        board.payout_amount = 0;

        emit!(WinnerPaid {
            board_id: board.game_id,
            winner: *ctx.accounts.winner.key,
            amount: board.payout_amount,
        });

        msg!("Winner paid for board #{}", board.game_id);
        Ok(())
    }
}

// Helper function to derive headers from randomness
fn derive_headers(randomness: &[u8]) -> [u8; 10] {
    let mut headers = [0u8; 10];
    let mut used = [false; 10];
    
    for i in 0..10 {
        let mut value = (randomness[i % randomness.len()] as usize) % 10;
        while used[value] {
            value = (value + 1) % 10;
        }
        headers[i] = value as u8;
        used[value] = true;
    }
    
    headers
}

// Helper function to find winner square
fn find_winner_square(
    home_headers: &[u8; 10],
    away_headers: &[u8; 10],
    home_digit: u8,
    away_digit: u8,
) -> Result<u8> {
    let home_index = home_headers.iter().position(|&x| x == home_digit)
        .ok_or(SquaresError::InvalidScore)?;
    let away_index = away_headers.iter().position(|&x| x == away_digit)
        .ok_or(SquaresError::InvalidScore)?;
    
    Ok((home_index * 10 + away_index) as u8)
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct CreateBoard<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 8 + 32 + 1 + 1 + 1 + 1 + 32 + 8 + 8 + 1 + 1 + 1 + (32 * 100) + (1 * 10) + (1 * 10) + 1,
        seeds = [b"board", game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub board: Account<'info, Board>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestRandomization<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    /// CHECK: VRF account will be verified by Switchboard
    pub vrf_account: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct FulfillVrf<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    /// CHECK: Switchboard VRF account
    pub vrf_account: AccountInfo<'info>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct PurchaseSquare<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordScore<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettleWinner<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct PayoutWinner<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    #[account(mut)]
    pub winner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Board {
    pub game_id: u64,
    pub authority: Pubkey,
    pub finalized: bool,
    pub randomized: bool,
    pub game_started: bool,
    pub game_ended: bool,
    pub winner: Pubkey,
    pub payout_amount: u64,
    pub total_pot: u64,
    pub home_score: u8,
    pub away_score: u8,
    pub quarter: u8,
    pub squares: [Pubkey; 100],
    pub home_headers: [u8; 10],
    pub away_headers: [u8; 10],
    pub bump: u8,
}

#[event]
pub struct BoardCreated {
    pub game_id: u64,
    pub authority: Pubkey,
}

#[event]
pub struct RandomizationRequested {
    pub board_id: u64,
    pub vrf_account: Pubkey,
}

#[event]
pub struct HeadersRandomized {
    pub board_id: u64,
    pub home_headers: [u8; 10],
    pub away_headers: [u8; 10],
}

#[event]
pub struct SquarePurchased {
    pub board_id: u64,
    pub square_index: u8,
    pub buyer: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ScoreRecorded {
    pub board_id: u64,
    pub home_score: u8,
    pub away_score: u8,
    pub quarter: u8,
}

#[event]
pub struct WinnerSettled {
    pub board_id: u64,
    pub winner: Pubkey,
    pub payout_amount: u64,
    pub square_index: u8,
}

#[event]
pub struct WinnerPaid {
    pub board_id: u64,
    pub winner: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum SquaresError {
    #[msg("Board has already been randomized")]
    AlreadyRandomized,
    #[msg("Game has already started")]
    GameAlreadyStarted,
    #[msg("Game has not ended yet")]
    GameNotEnded,
    #[msg("Game has already ended")]
    GameEnded,
    #[msg("Board has not been randomized")]
    NotRandomized,
    #[msg("Invalid VRF proof")]
    InvalidVrfProof,
    #[msg("Invalid square index")]
    InvalidSquareIndex,
    #[msg("Square is already owned")]
    SquareAlreadyOwned,
    #[msg("Invalid quarter")]
    InvalidQuarter,
    #[msg("No winner found")]
    NoWinner,
    #[msg("Already settled")]
    AlreadySettled,
    #[msg("No payout available")]
    NoPayout,
    #[msg("Invalid winner")]
    InvalidWinner,
    #[msg("Invalid score")]
    InvalidScore,
}