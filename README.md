# MultiversX OpenClaw Skills

Entry point for integrating AI agents with the MultiversX blockchain via [OpenClaw](https://openclaw.io) and the [MX-8004](https://github.com/multiversx/mx-8004) standard.

## What's Here

This package provides:

- **SKILL.md** — Agent-facing instructions for all MultiversX skills
- **Reference docs** — Contract endpoints, ABI schemas, flow diagrams
- **4 Core x402 Skills** — `pay.ts`, `prove.ts`, `query.ts`, `sign.ts`
- **OASF Taxonomy** — Official skill/domain IDs for agent manifests
- **Install script** — One-liner that sets up the full skill bundle

## Where's the Implementation Code?

The expanded skill implementations (identity, validation, reputation, escrow, transfers, discovery, hiring, manifest) live in **[moltbot-starter-kit](https://github.com/sasurobert/moltbot-starter-kit)**. The install script automatically pulls it.

## Quick Install

```bash
curl -sL https://raw.githubusercontent.com/sasurobert/multiversx-openclaw-skills/main/scripts/install.sh | bash
```

This downloads:
1. `SKILL.md` + reference docs → `.agent/skills/multiversx/`
2. `moltbot-starter-kit` → `.agent/skills/multiversx/moltbot-starter-kit/`

## Structure

```
multiversx-openclaw-skills/
├── SKILL.md               ← Agent instructions
├── references/            ← Contract reference docs
│   ├── setup.md
│   ├── identity.md
│   ├── validation.md
│   ├── reputation.md
│   ├── escrow.md
│   ├── x402.md
│   └── manifest.md
├── src/
│   ├── pay.ts             ← x402 payment skill
│   ├── prove.ts           ← Submit proof of work
│   ├── query.ts           ← Query contract views
│   ├── sign.ts            ← Transaction signing
│   ├── constants.ts       ← Shared constants
│   └── oasf_taxonomy.ts   ← OASF skill/domain taxonomy
├── scripts/
│   ├── install.sh         ← One-liner installer
│   ├── build_manifest.ts  ← Manifest builder
│   └── pin_manifest.ts    ← IPFS pinning (Pinata)
└── tests/
```

## Core x402 Skills

| Skill | Description |
|:------|:-----------|
| `pay.ts` | Submit x402 payments via the Facilitator |
| `prove.ts` | Submit proof of completed work to the Validation Registry |
| `query.ts` | Query smart contract views (identity, validation, reputation) |
| `sign.ts` | Sign arbitrary data with the agent's private key |

## Expanded Skills (in moltbot-starter-kit)

| Skill | Description |
|:------|:-----------|
| `identity_skills.ts` | Register, update, query agents |
| `validation_skills.ts` | Job lifecycle — init, proof, verify |
| `reputation_skills.ts` | Feedback and reputation queries |
| `escrow_skills.ts` | Deposit, release, refund escrow |
| `transfer_skills.ts` | EGLD, ESDT, NFT, multi-transfer |
| `discovery_skills.ts` | Agent discovery and balance queries |
| `hire_skills.ts` | Composite: init_job + escrow deposit |
| `manifest_skills.ts` | Build registration manifests with OASF validation |

## License

MIT
