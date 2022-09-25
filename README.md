# GM Solana

Discover Solana Dapp dev using Anchor, Solana (rust) and Svelte (Typescript).

Thanks to https://dev.to/0xmuse/accelerated-guide-to-fullstack-web3-with-ass-anchor-solana-and-svelte-1mg

## Install

### Requirements

First, you will need to install the Rust toolchain.

```bash
curl https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
rustup component add rustfmt
```

To install Solana Tool Suite, you can simply run the installation script. I’m specifying to install v1.9.4:

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.9.4/install)"
```

Note that if you are using zsh, you need to update your PATH.

Check:

```bash
solana --version
```

Now, you can run the test validator (a local testnet) to see if everything works correctly with command:

```bash
solana-test-validator
```

Let’s stop the test validator for now and install Anchor, the recommended framework for Solana programs.
Make sure you have `Yarn v1` installed. Then let's build using Rust package manager:

```bash
cargo install --git https://github.com/project-serum/anchor --tag v0.20.1 anchor-cli --locked
```

Check:

```bash
anchor --version
```

#### Install the Phantom Wallet

It a browser extension, like Metamask, but for Solana.
Install it and create a wallet.

#### Set up keys

Look at `~/.config/solana/id.json` or generate new using `solana-keygen new`.

Then configure Solana to use localhost

```bash
solana config set --url localhost
solana config get
```

### Install the project

Clone the repo, go in it, and install the JS deps

```bash
yarn
```

Then you can run these dev commands:

```bash
anchor build # Install the needed Rust deps and compile the programs (aka: Smart-contract)
anchor test # Exec contract tests using JS test framework
```
