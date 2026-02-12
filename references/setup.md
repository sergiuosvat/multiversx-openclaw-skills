# Setup Guide

## Prerequisites

- Node.js 20+ and npm 10+
- A MultiversX wallet PEM file (never share!)
- Access to MultiversX Devnet API

## Setup

1. Install dependencies:

```bash
npm install @multiversx/sdk-core @multiversx/sdk-wallet @multiversx/sdk-network-providers axios
```

2. Create your `.env` file:

```bash
cp .env.example .env
# Edit with your contract addresses and wallet path
```

3. Generate a wallet (if you don't have one):

```bash
npx @multiversx/sdk-wallet generate-pem -o wallet.pem
```

4. Fund your wallet on devnet:

Visit https://devnet-wallet.multiversx.com/faucet

## Network Selection

| Network | Chain ID | API URL |
|:---|:---|:---|
| Devnet | `D` | `https://devnet-api.multiversx.com` |
| Testnet | `T` | `https://testnet-api.multiversx.com` |
| Mainnet | `1` | `https://api.multiversx.com` |
