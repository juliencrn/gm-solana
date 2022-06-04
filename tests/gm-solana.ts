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

  it("receives and saves a gm message", async () => {
    const message = "gm wagmi";
    const user = provider.wallet.publicKey;

    // fetch the base account
    // ...and cache how many messages are there
    const baseAccountBefore = await program.account.baseAccount.fetch(
      _baseAccount.publicKey
    );

    // call the sayGm function with the message via RPC
    const tx = await program.rpc.sayGm(message, {
      accounts: {
        baseAccount: _baseAccount.publicKey,
        user,
      }
    });

    // fetch the base account again
    // ...and check that the gmCount has increased
    const baseAccountAfter = await program.account.baseAccount.fetch(
      _baseAccount.publicKey
    );

    assert.equal(baseAccountBefore.gmCount.toString(), "0");
    assert.equal(baseAccountAfter.gmCount.toString(), "1");

    const gmList = baseAccountAfter.gmList as any[];
    assert.equal(gmList[0].message, message);
    assert.equal(gmList[0].user.toString(), user.toString());
    assert.equal(Number(gmList[0].timestamp.toString() > 0), true);
  });
});
