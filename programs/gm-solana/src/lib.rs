use anchor_lang::prelude::*;

declare_id!("4ad4ktXGunyZ34eBpnXz54j3kwFsKwXGafP7iNSC3kdp");

#[program]
pub mod gm_solana {
    use super::*;

    /// Initialize the BaseAccount and set default values.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;

        base_account.gm_count = 0;

        Ok(())
    }

    pub fn say_gm(ctx: Context<SayGm>, message: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;

        // grab a copy of the input data
        let message = message.clone();

        // get the current Solana network time
        let timestamp = Clock::get().unwrap().unix_timestamp;

        // grab the public key of the txns sender
        let user = *ctx.accounts.user.to_account_info().key;

        let gm = GmMessage {
            user,
            message,
            timestamp,
        };

        base_account.gm_list.push(gm);
        base_account.gm_count += 1;

        Ok(())
    }
}

// TODO: Understand differences between kinds of accounts/storage in Solana
// See: https://project-serum.github.io/anchor/tutorials/tutorial-2.html#defining-a-program

#[derive(Accounts)]
pub struct Initialize<'info> {
    // initialize the following account (base_account)
    #[account(init, payer = user, space = 64 + 1024)]
    pub base_account: Account<'info, BaseAccount>,

    // means the `user`'ll be mutated, it represents the signer of the txn
    #[account(mut)]
    pub user: Signer<'info>,

    // SystemProgram is like OS in Solana, handles account creation
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SayGm<'info> {
    // AccountInfo<'info> can also represent a user, but there’s no validation in place that anyone can be an imposter by simply passing in a random account.
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,

    // This is how we will be able to authenticate, to verify that this address is indeed the one that signed the transaction.
    pub user: Signer<'info>,
}

#[account]
pub struct BaseAccount {
    pub gm_count: u64,
    pub gm_list: Vec<GmMessage>,
}

// define a struct called GmMessage that contains a message, sender, and timestamp
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct GmMessage {
    pub message: String,
    pub user: Pubkey,
    pub timestamp: i64,
}
