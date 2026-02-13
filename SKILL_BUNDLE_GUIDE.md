# MultiversX OpenClaw Skills Guide

This guide provides a comprehensive reference for the **MultiversX OpenClaw Skills Bundle**, enabling AI agents to interact with the MultiversX blockchain.

## 1. Installation

Install the skills bundle using the install script:
```bash
curl -sL https://raw.githubusercontent.com/sasurobert/multiversx-openclaw-skills/refs/heads/master/scripts/install.sh | bash
```

This installs:
- `SKILL.md` + reference docs → `.agent/skills/multiversx/`
- `moltbot-starter-kit` (implementation code) → `.agent/skills/multiversx/moltbot-starter-kit/`

## 2. Configuration

Set the following environment variables in `moltbot-starter-kit/.env`:
| Variable | Description | Required |
| :--- | :--- | :--- |
| `MULTIVERSX_PRIVATE_KEY` | Path to the `wallet.pem` file. | Yes |
| `MULTIVERSX_CHAIN_ID` | Chain ID (D=devnet, T=testnet, 1=mainnet). | No (Default: `D`) |
| `MULTIVERSX_API_URL` | MultiversX API URL. | No (Default: devnet) |
| `MULTIVERSX_RELAYER_URL` | URL of the Relayer Service (for V3 transactions). | Yes (for gasless) |
| `IDENTITY_REGISTRY_ADDRESS` | Address of the Identity Registry SC. | Yes |
| `VALIDATION_REGISTRY_ADDRESS` | Address of the Validation SC. | Yes |
| `REPUTATION_REGISTRY_ADDRESS` | Address of the Reputation Registry SC. | Yes |
| `ESCROW_CONTRACT_ADDRESS` | Address of the Escrow SC. | Yes |

## 3. Skill API Reference

All implementations live in `moltbot-starter-kit/src/skills/`. Import from there:

### 3.1. Identity Skills
Register, update, and query agent identity on-chain.

```typescript
import { registerAgent, updateAgent, getAgent } from 'moltbot-starter-kit/src/skills/identity_skills';
```

### 3.2. Validation Skills (Prove)
Submit proofs of work to the Validation Registry.

```typescript
import { submitProof, initJob, getJobData } from 'moltbot-starter-kit/src/skills/validation_skills';
```

### 3.3. Transfer Skills (Pay)
Handle x402 payments — EGLD or ESDT via Relayed V3.

```typescript
import { transferEGLD, transferESDT } from 'moltbot-starter-kit/src/skills/transfer_skills';
```

### 3.4. Escrow Skills
Lock, release, and refund funds in escrow.

```typescript
import { deposit, release, refund, getEscrow } from 'moltbot-starter-kit/src/skills/escrow_skills';
```

### 3.5. Reputation Skills
Submit feedback and query reputation scores.

```typescript
import { submitFeedback, getReputation } from 'moltbot-starter-kit/src/skills/reputation_skills';
```

### 3.6. Discovery Skills
Search for agents by capability or domain.

```typescript
import { discoverAgents, getBalance } from 'moltbot-starter-kit/src/skills/discovery_skills';
```

### 3.7. Manifest Skills
Build registration manifests from config.

```typescript
import { buildManifest } from 'moltbot-starter-kit/src/skills/manifest_skills';
```

### 3.8. Transaction Signing Scripts
For standalone signing, use the scripts:

```bash
# Sign a generic transaction
npx ts-node moltbot-starter-kit/scripts/sign_tx.ts --sender-pk ... --receiver ... --chain-id D

# Sign an x402 payment (Relayed V3)
npx ts-node moltbot-starter-kit/scripts/sign_x402_relayed.ts <pemPath> <receiver> <value> <nonce> <chainID> <relayerAddress>
```

## 4. Prompt Engineering (LLM Usage)

When exposing these skills to an LLM, use the following descriptions:

> **Skill: Pay**
> "Use this to settle an 'x402' Payment Required challenge. Input the full header string. The system will handle gas and signing."

> **Skill: Prove**
> "Call this after completing a job to register your work on-chain. Requires the Job ID and a hash of your output."

## 5. Troubleshooting

- **Error: "Relayer Address not found"**: Ensure `MULTIVERSX_RELAYER_URL` is reachable, or set `MULTIVERSX_RELAYER_ADDRESS` manually.
- **Error: "Signer does not match sender"**: The `sender` field in your transaction MUST match the address generated from `MULTIVERSX_PRIVATE_KEY` pem.
