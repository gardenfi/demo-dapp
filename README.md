# Demo App

This project demonstrates how to use the [Garden SDK](https://docs.garden.finance/developers/sdk/) to create a simple dApp for swapping from WBTC to BTC.

> [!NOTE]
> For better developer experience, we are conducting the swap on a local network, but you can do the same on Testnet or Mainnet by changing the parameters.

## Features

- **Merry** : Provides a comprehensive environment for multichain operations. 
- **Swap Interface**: Easily swap from WBTC to BTC.
- **Transaction Management**: Track and display the latest transactions.
- **Garden SDK Integration**: Uses Garden SDK to make the swap possible.
- **State Management**: We use [zustand](https://zustand-demo.pmnd.rs/) for state management.

## Environment Setup

To improve the developer experience, we will be using [Merry](https://docs.garden.finance/developers/merry/) to set up the multichain environment necessary for performing a swap. This setup includes all essential components such as the [Orderbook](https://docs.garden.finance/developers/fundamentals/orderbook/), [Filler](https://docs.garden.finance/developers/fundamentals/filler/), [Faucet](https://www.alchemy.com/faucets#faucets-switchback-right-light), and nodes for Bitcoin, Ethereum, and Arbitrum.

1. Install Merry

```bash
curl https://get.merry.dev | bash
```

2. Start Merry

```bash
# Start Merry with explorer
merry go
```

or

```bash
# Start Merry without explorer
merry go --headless
```

3. Fund your EVM address

```bash
 merry faucet --to <EVM Address>
```

## Project Setup

1. Clone the repository

```bash
git clone https://github.com/gardenfi/demo-app
cd demo-app
```

2. Install dependencies

```bash
bun install
```

3. Run the development server

```bash
bun run dev
```

The dApp should look something like this

![final_dapp](https://github.com/Sushants-Git/demo-app/assets/100516354/bf939a2f-3ac1-40f6-882c-c779ee4928ee)

