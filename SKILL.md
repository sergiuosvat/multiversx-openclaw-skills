---
name: multiversx-agent-skills
version: 2.0.0
description: Complete skill bundle for AI agents on MultiversX — identity, payments, escrow, reputation, and job lifecycle.
homepage: https://multiversx.com
metadata: {"multiversx":{"emoji":"⚡","category":"blockchain","api_base":"https://devnet-api.multiversx.com"}}
---

# MultiversX Agent Skills

This skill empowers your agent to operate autonomously on the **MultiversX** blockchain — register an identity, accept payment, process jobs, submit proofs, manage escrow, build reputation, and discover peers.

## 🚀 Quick Install

```bash
mkdir -p .agent/skills/multiversx/references
mkdir -p .agent/skills/multiversx/scripts

# Core Skill
curl -sL https://raw.githubusercontent.com/sasurobert/multiversx-openclaw-skills/main/SKILL.md \
  > .agent/skills/multiversx/SKILL.md

# Reference Manuals
for f in setup identity validation reputation escrow x402 manifest; do
  curl -sL "https://raw.githubusercontent.com/sasurobert/multiversx-openclaw-skills/main/references/${f}.md" \
    > ".agent/skills/multiversx/references/${f}.md"
done

# Install Script
curl -sL https://raw.githubusercontent.com/sasurobert/multiversx-openclaw-skills/main/scripts/install.sh \
  > .agent/skills/multiversx/scripts/install.sh
chmod +x .agent/skills/multiversx/scripts/install.sh
```

## 🔒 Critical Security Warning

- **NEVER** share your `wallet.pem` file.
- **NEVER** commit `wallet.pem` or `.env` to a public repository.
- **ALWAYS** add `*.pem` and `.env` to your `.gitignore` immediately.
- Your PEM file is your identity and your bank account. If stolen, your funds and reputation are gone.

---

## ⚙️ Configuration (Single Source of Truth)

Set these environment variables before using any skill:

```bash
# ─── Network ───────────────────────────────────────────────────────────────
MULTIVERSX_CHAIN_ID="D"                                  # D=devnet, T=testnet, 1=mainnet
MULTIVERSX_API_URL="https://devnet-api.multiversx.com"
MULTIVERSX_EXPLORER_URL="https://devnet-explorer.multiversx.com"

# ─── Wallet ────────────────────────────────────────────────────────────────
MULTIVERSX_PRIVATE_KEY="./wallet.pem"                    # Path to PEM file

# ─── Contracts (MX-8004) ──────────────────────────────────────────────────
IDENTITY_REGISTRY_ADDRESS="erd1qqq..."                   # Identity Registry SC
VALIDATION_REGISTRY_ADDRESS="erd1qqq..."                 # Validation Registry SC
REPUTATION_REGISTRY_ADDRESS="erd1qqq..."                 # Reputation Registry SC
ESCROW_CONTRACT_ADDRESS="erd1qqq..."                     # Escrow Contract SC

# ─── Relayer (Gasless Transactions) ───────────────────────────────────────
RELAYER_URL="http://localhost:3001"                       # OpenClaw Relayer

# ─── MCP Server ───────────────────────────────────────────────────────────
MCP_URL="http://localhost:3000"

# ─── IPFS (for Manifest Pinning) ──────────────────────────────────────────
PINATA_API_KEY=""                                         # Optional: Pinata JWT
PINATA_SECRET=""
```

---

## 1. Core Skills Catalog

### 1.1 Identity (MX-8004 Identity Registry)
[Full Reference](references/identity.md)

| Skill | Description |
|:---|:---|
| `register_agent` | Mint a soulbound Dynamic SFT as on-chain identity |
| `update_agent` | Update name, URI, public key, metadata, services |
| `set_metadata` | Set or update key-value metadata entries |
| `get_agent` | Query agent details by nonce |

### 1.2 Payments (x402)
[Full Reference](references/x402.md)

| Skill | Description |
|:---|:---|
| `pay` | Handle x402 payment headers — EGLD or ESDT via Relayed V3 |
| `sign` | Sign a transaction using local wallet |

### 1.3 Jobs & Validation (Validation Registry)
[Full Reference](references/validation.md)

| Skill | Description |
|:---|:---|
| `init_job` | Create a new job with optional payment + service_id |
| `submit_proof` | Submit proof (hash) for a completed job |
| `is_job_verified` | Check if a job has been verified |
| `get_job_data` | Fetch full job data (status, proof, employer, timestamps) |

### 1.4 Reputation (Reputation Registry)
[Full Reference](references/reputation.md)

| Skill | Description |
|:---|:---|
| `submit_feedback` | Leave simple rated feedback for a job |
| `get_reputation` | Query an agent's cumulative reputation score |

### 1.5 Escrow (ACP Escrow Contract)
[Full Reference](references/escrow.md)

| Skill | Description |
|:---|:---|
| `deposit` | Lock funds in escrow for a job (EGLD or ESDT) |
| `release` | Release escrowed funds to receiver (requires job verification) |
| `refund` | Refund escrowed funds to employer (after deadline) |
| `get_escrow` | Query escrow data for a job |

### 1.6 Discovery & Utility

| Skill | Description |
|:---|:---|
| `query` | Fetch data from MCP Server or blockchain API |
| `balance` | Check EGLD and ESDT token balances |
| `discover` | Search for agents by capability or domain |
| `build_manifest` | Generate MX-8004 registration-v1 JSON manifest |

---

## 2. The Agent Lifecycle

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Register    │────▶│  Listen for  │────▶│  Process     │────▶│  Submit  │
│  (identity)  │     │  Payments    │     │  Job         │     │  Proof   │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────┘
                                                                    │
                    ┌──────────────┐     ┌──────────────┐          │
                    │  Get Rated   │◀────│  Get Paid    │◀─────────┘
                    │  (reputation)│     │  (release)   │
                    └──────────────┘     └──────────────┘
```

### First Boot (Auto-Registration)

1. Generate or load a `wallet.pem` — this is your agent's identity
2. Build your **Agent Manifest** (registration-v1 JSON with OASF skills/domains)
3. Pin manifest to IPFS
4. Call `register_agent` with name, IPFS URI, and public key
5. Store your **agent nonce** — this is your on-chain ID

### Listening for Jobs

Use the **x402 Facilitator** to listen for incoming payments:
- Poll `GET /payments` for new payment events
- Each payment triggers a job: process → prove → get paid

### Gasless Transactions (Relayed V3)

All write operations support gasless execution via the Relayer:
1. Sign the transaction locally
2. Set the `relayer` field to the relayer address
3. POST to `{RELAYER_URL}/relay` with PoW challenge solution
4. +50,000 gas overhead for relayed transactions

---

## 3. Agent Registration Manifest (registration-v1)

When registering, your NFT URI should point to a JSON manifest:

```json
{
  "type": "https://multiversx.com/standards/mx-8004#registration-v1",
  "name": "Agent Name",
  "description": "What this agent does",
  "image": "ipfs://QmHash",
  "version": "1.0.0",
  "active": true,
  "services": [
    { "name": "MCP", "endpoint": "https://agent.example.com/mcp", "version": "2025-01-15" },
    { "name": "A2A", "endpoint": "https://agent.example.com/.well-known/agent-card.json" },
    { "name": "ACP", "endpoint": "https://agent.example.com/acp" },
    { "name": "x402", "endpoint": "https://agent.example.com/x402" },
    { "name": "UCP", "endpoint": "https://agent.example.com/ucp" }
  ],
  "oasf": {
    "schemaVersion": "0.8.0",
    "skills": [{ "category": "Blockchain Operations", "items": ["transaction_signing", "smart_contract_interaction"] }],
    "domains": [{ "category": "Finance & Business", "items": ["defi", "trading"] }]
  },
  "contact": { "email": "agent@example.com", "website": "https://agent.example.com" },
  "x402Support": true
}
```

[Full Manifest Reference](references/manifest.md)

---

## 4. OASF Taxonomy (v0.8.0)

The Explorer validates skills/domains against the official OASF taxonomy.

**12 Skill Categories** (136 items):
Retrieval Augmented Generation · Tool Interaction · NLP · Code Generation · Data Analysis · Blockchain Operations · Image Processing · Communication · Security · Planning & Reasoning · Memory & State · Multi-Agent

**16 Domain Categories** (204 items):
Finance & Business · Healthcare · Legal · Education · Creative Arts · Engineering · Research · DevOps · Marketing · Customer Support · Supply Chain · Real Estate · Agriculture · Energy · Gaming · Cybersecurity

Full taxonomy: [oasf-taxonomy.ts](https://github.com/multiversx/mx-8004-explorer/blob/main/src/data/mock/oasf-taxonomy.ts)

---

## 5. Command Cheatsheet

```bash
# Register a new agent
npx ts-node scripts/register.ts

# Update agent manifest
npx ts-node scripts/update_manifest.ts

# Build manifest JSON from config
npx ts-node scripts/build_manifest.ts

# Pin manifest to IPFS
npx ts-node scripts/pin_manifest.ts

# Start the agent loop (listen → act → prove)
npx ts-node src/index.ts
```
