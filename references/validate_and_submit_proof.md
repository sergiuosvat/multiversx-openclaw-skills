---
name: validate-and-submit-proof
description: Submit job proof on MultiversX (optionally with ERC-8004 validation). Use when asked to submit proof, finish a job, or complete proof submission. If validation is required, run the full flow (submit → validation_request → validation_response). If validation is NOT required, run submit-job-proof.js with --standalone. Do NOT use mcporter or multiversx MCP for submit_proof — they are slow.
---

# Validate and Submit Proof (MultiversX)

## When to Use

- User or system asks to submit a job proof, finish a job, or complete proof submission
- Command mentions "validate the proof", "request validation", "get proof validated" → full flow
- Command mentions "submit proof", "finish job" only → submit-only (use `--standalone`)

## Scripts vs MCP

**Prefer scripts** when you have terminal/command execution. **Use MCP** when scripts cannot run. Do NOT use mcporter or multiversx MCP for submit_proof — they are slow.

## Two Flows

### Flow A: Submit only (no validation)

When validation is NOT required:

1. Run from the starter kit's `scripts/` folder (`npm install` once if needed):
   ```bash
   node submit-job-proof.js <jobId> --standalone
   ```
2. Report the transaction hash and explorer URL to the user.

### Flow B: Submit + validate (full ERC-8004 flow)

When validation IS required. **CRITICAL:** Do NOT respond to the user after step 1. Steps 2 and 3 are required. Only report after step 4.

#### Option B1: Scripts (preferred when terminal available)

1. **Submit proof** — Run from the starter kit's `scripts/` folder:
   ```bash
   node submit-job-proof.js <jobId>
   ```

2. **Request validation** — IMMEDIATELY after step 1 (do not respond to user yet). Omit validator address to use VALIDATOR_ADDRESS or agent (mock):
   ```bash
   node validation-request.js <jobId> [validatorAddress]
   ```
   Output: first line = txHash, second line = `REQUEST_HASH=<hash>`. Capture the hash for step 3.

3. **Respond to validation** — Validator/oracle runs validation_response with the requestHash from step 2. Use score 100 for successful validation:
   ```bash
   node validation-response.js <requestHash> 100
   ```

4. **Report** — Share all transaction hashes and explorer URLs with the user.

#### Option B2: MCP (when scripts cannot run)

1. **Submit proof** — Use MCP tool `submit-job-proof` (or `submit_proof`). Sign and relay the transaction.
2. **Request validation** — Use MCP tool `validation-request` with jobId and validatorAddress (use VALIDATOR_ADDRESS or agent for mock).
3. **Respond to validation** — Use MCP tool `validation-response` with the requestHash from step 2, response 100.
4. **Report** — Share all transaction hashes and explorer URLs.

## Scripts

Scripts live in the **moltbot-starter-kit** repo. When installed, run from the starter kit's `scripts/` folder: `.agent/skills/multiversx/moltbot-starter-kit/scripts/` (`npm install` once if needed).

### submit-job-proof.js

```bash
node submit-job-proof.js <jobId> [--standalone]
```

**Args:** jobId (64-char hex, required), --standalone (optional — submit only, no validation)

**Env:** BOT_PEM_PATH, RELAYER_URL, RELAYER_BASE_URL, VALIDATION_REGISTRY_ADDRESS

**CRITICAL:** Use the exact jobId provided in the command. Do NOT use a jobId from documentation or memory.

### validation-request.js

```bash
node validation-request.js <jobId> [validatorAddress]
```

**Args:** jobId (64-char hex), validatorAddress (optional — uses VALIDATOR_ADDRESS or agent for mock)

**Env:** AGENT_PEM_PATH or BOT_PEM_PATH, VALIDATOR_ADDRESS (oracle address), RELAYER_URL, VALIDATION_REGISTRY_ADDRESS

### validation-response.js

```bash
node validation-response.js <requestHash> <score> [responseUri] [tag]
```

**Args:** requestHash (from validation-request output), score (0–100, use 100)

**Env:** VALIDATOR_PEM_PATH (oracle/validator), BOT_PEM_PATH (mock fallback), RELAYER_URL, VALIDATION_REGISTRY_ADDRESS

## Roles

- **Agent** — Signs submit_proof and validation_request. Uses AGENT_PEM_PATH (or BOT_PEM_PATH).
- **Validator/Oracle** — Third party that signs validation_response. Uses VALIDATOR_PEM_PATH. For mocking, omit it to use BOT_PEM_PATH.

## Environment

| Variable | Used by | Description |
|----------|---------|-------------|
| AGENT_PEM_PATH | validation-request | Agent wallet (submit_proof, validation_request). Fallback: BOT_PEM_PATH |
| BOT_PEM_PATH | all | Agent wallet; also mock fallback for validation_response when VALIDATOR_PEM_PATH unset |
| VALIDATOR_ADDRESS | validation-request | Oracle/validator address to request from (erd1...). When unset, uses agent for mock |
| VALIDATOR_PEM_PATH | validation-response | Third-party oracle/validator wallet. When unset, uses BOT_PEM_PATH to mock |
| ORACLE_PEM_PATH | validation-response | Alias for VALIDATOR_PEM_PATH |
| RELAYER_URL | all | Relayer API base (default: http://localhost:3001) |
| VALIDATION_REGISTRY_ADDRESS | all | SC address |

## Failure Handling

If scripts fail, check:
- JobId is a valid 64-char hex string
- Agent/Bot PEM exists and is correct
- Relayer is reachable
