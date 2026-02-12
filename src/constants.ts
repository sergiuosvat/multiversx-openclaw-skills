/**
 * MultiversX Agent Economy — Constants
 * Single Source of Truth for all contract addresses, gas limits, and network config.
 */

// ─── Network ───────────────────────────────────────────────────────────────────
export const DEFAULT_MCP_URL = 'http://localhost:3000';
export const DEFAULT_CHAIN_ID = 'D';
export const DEFAULT_API_URL = 'https://devnet-api.multiversx.com';
export const DEFAULT_EXPLORER_URL = 'https://devnet-explorer.multiversx.com';

// ─── Contract Addresses (Devnet) ───────────────────────────────────────────────
export const IDENTITY_REGISTRY_ADDRESS =
    process.env.IDENTITY_REGISTRY_ADDRESS || '';
export const VALIDATION_REGISTRY_ADDRESS =
    process.env.VALIDATION_REGISTRY_ADDRESS || '';
export const REPUTATION_REGISTRY_ADDRESS =
    process.env.REPUTATION_REGISTRY_ADDRESS || '';
export const ESCROW_CONTRACT_ADDRESS =
    process.env.ESCROW_CONTRACT_ADDRESS || '';

// ─── Relayer ───────────────────────────────────────────────────────────────────
export const DEFAULT_RELAYER_URL =
    process.env.RELAYER_URL || 'http://localhost:3001';

// ─── Gas Constants ─────────────────────────────────────────────────────────────
export const BASE_GAS_LIMIT = 50_000;
export const GAS_PER_DATA_BYTE = 1_500;
export const SC_CALL_MIN_GAS = 6_000_000;
export const ESDT_TRANSFER_GAS = 200_000;
export const RELAYED_V3_EXTRA_GAS = 50_000;
export const PROVE_GAS_LIMIT = 10_000_000;
export const REGISTER_GAS_LIMIT = 30_000_000;
export const ESCROW_GAS_LIMIT = 15_000_000;
export const FEEDBACK_GAS_LIMIT = 10_000_000;
export const INIT_JOB_GAS_LIMIT = 15_000_000;

// ─── Timeouts ──────────────────────────────────────────────────────────────────
export const MCP_QUERY_TIMEOUT = 5_000;
export const TX_POLL_INTERVAL_MS = 2_000;
export const TX_TIMEOUT_MS = 60_000;
