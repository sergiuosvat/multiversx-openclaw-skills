# MultiversX OpenClaw Skills

Entry point for integrating AI agents with the MultiversX blockchain via [OpenClaw](https://openclaw.io) and the [MX-8004](https://github.com/multiversx/mx-8004) standard.

## What's Here

This package provides:

- **SKILL.md** — Agent-facing instructions for all MultiversX skills
- **Reference docs** — Contract endpoints, ABI schemas, flow diagrams
- **OASF Taxonomy** — Official skill/domain IDs for agent manifests
- **Install script** — One-liner that sets up the full skill bundle + moltbot-starter-kit

## Where's the Implementation Code?

All TypeScript implementations (identity, validation, reputation, escrow, transfers, discovery, hiring, manifest, x402 signing) live in **[moltbot-starter-kit](https://github.com/sasurobert/moltbot-starter-kit)**. The install script automatically pulls it.

## Quick Install

### 1. Install the Skills Bundle

Run the one-liner to download the skills and the starter kit:

```bash
curl -sL https://raw.githubusercontent.com/sergiuosvat/multiversx-openclaw-skills/refs/heads/master/scripts/install.sh | bash
```

This will download:
- `SKILL.md` + reference docs → `.agent/skills/multiversx/`
- `moltbot-starter-kit` → `.agent/skills/multiversx/moltbot-starter-kit/`

### 2. Configure the Starter Kit

Navigate to the installed starter kit and follow the **Quick Start** guide in its `README.md` to set up your agent:

```bash
cd .agent/skills/multiversx/moltbot-starter-kit/
cat README.md
```

## Structure

```
multiversx-openclaw-skills/
├── SKILL.md               ← Agent instructions
├── SKILL_BUNDLE_GUIDE.md   ← API reference guide
├── README.md
├── config.schema.json
├── setup.sh
├── references/            ← Contract reference docs
│   ├── setup.md
│   ├── identity.md
│   ├── validation.md
│   ├── reputation.md
│   ├── escrow.md
│   ├── x402.md
│   └── manifest.md
└── scripts/
    └── install.sh         ← One-liner installer (clones moltbot-starter-kit)
```

## Skills (in moltbot-starter-kit)

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
| `oasf_taxonomy.ts` | OASF skill/domain taxonomy (v0.8.0) |

## License

MIT
