use anchor_lang::prelude::*;

declare_id!("Fg6PaFprPjfrgxLbfXyAyzsK1m1S82mC2f43s5D2qQq");

#[program]
pub mod squares {
    use super::*;

    pub fn create_board(ctx: Context<CreateBoard>, game_id: u64) -> Result<()> {
        let board = &mut ctx.accounts.board;
        board.game_id = game_id;
        board.authority = *ctx.accounts.authority.key;
        board.finalized = false;
        // Initialize all 100 squares to the system program, signifying they are unclaimed.
        board.squares = [Pubkey::default(); 100];
        // Headers will be set later by the randomizer agent. 10 is a sentinel for "not set".
        board.home_headers = [10; 10];
        board.away_headers = [10; 10];

        msg!("Board for game #{} created!", game_id);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct CreateBoard<'info> {
    #[account(
        init,
        payer = authority,
        // Space calculation: 8 (discriminator) + 8 (game_id) + 32 (authority) + 1 (finalized)
        // + 32*100 (squares) + 1*10 (home_headers) + 1*10 (away_headers) = 3269 bytes
        space = 8 + 8 + 32 + 1 + (32 * 100) + (1 * 10) + (1 * 10),
        seeds = [b"board", game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub board: Account<'info, Board>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Board {
    pub game_id: u64,
    pub authority: Pubkey,
    pub finalized: bool,
    // Each square is a Pubkey. Default (all zeros) means unclaimed.
    pub squares: [Pubkey; 100],
    pub home_headers: [u8; 10],
    pub away_headers: [u8; 10],
    // Winner and payout info will be added in later steps.
}