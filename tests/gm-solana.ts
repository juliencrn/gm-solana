import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GmSolana } from "../target/types/gm_solana";
import assert from "assert";

// we need to access SystemProgram so that we can create the base
const { SystemProgram } = anchor.web3;

describe("gm-solana", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GmSolana as Program<GmSolana>;
  let _baseAccount: anchor.web3.Keypair;

  it("creates a base account for gm's", async () => {
    const baseAccount = anchor.web3.Keypair.generate();

    // call the initialize function via RPC
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });

    // fetch the base account
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    // gmCount is a "BigNumber" type, so we need to convert it to a string
    assert.equal(account.gmCount.toString(), "0");

    _baseAccount = baseAccount;
  });
});
