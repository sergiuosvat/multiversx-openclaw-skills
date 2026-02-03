import { UserSigner } from '@multiversx/sdk-wallet';
import { Transaction, TransactionPayload, Address } from '@multiversx/sdk-core';
import { promises as fs } from 'fs';
import axios from 'axios';
import { DEFAULT_MCP_URL, DEFAULT_CHAIN_ID, PROVE_GAS_LIMIT } from './constants';

interface ProveInput {
    jobId: string;
    resultHash: string; // SHA256 hex string
    registryAddress?: string;
    walletPath?: string;
}

/**
 * Submits a proof to the Validation Registry Smart Contract.
 * 
 * @param input ProveInput
 * @returns Transaction Hash
 */
export async function prove(input: ProveInput): Promise<string> {
    const pemPath = input.walletPath || process.env.MULTIVERSX_PRIVATE_KEY;
    if (!pemPath) throw new Error("Wallet path not found");

    const pemContent = await fs.readFile(pemPath, 'utf8');
    const signer = UserSigner.fromPem(pemContent);

    // Default Registry Address if not provided (should be in config/env)
    const registryAddress = input.registryAddress || process.env.MULTIVERSX_VALIDATION_REGISTRY;
    if (!registryAddress) throw new Error("Validation Registry Address not configured");

    // Construct Data: submit_proof@<job_id_hex>@<hash>
    const jobIdHex = Buffer.from(input.jobId).toString('hex');
    const data = `submit_proof@${jobIdHex}@${input.resultHash}`;

    const tx = new Transaction({
        nonce: 0,
        value: "0",
        receiver: new Address(registryAddress),
        gasLimit: BigInt(PROVE_GAS_LIMIT),
        chainID: process.env.MULTIVERSX_CHAIN_ID || DEFAULT_CHAIN_ID,
        data: new TransactionPayload(data),
        sender: new Address(signer.getAddress().bech32())
    });

    const mcpUrl = process.env.MULTIVERSX_MCP_URL || DEFAULT_MCP_URL;

    // Fetch Nonce
    try {
        const nonceResp = await axios.get(`${mcpUrl}/accounts/${signer.getAddress().bech32()}`);
        tx.setNonce(BigInt(nonceResp.data.nonce || 0));
    } catch (e) {
        console.warn("Could not fetch nonce, using 0");
        tx.setNonce(0n);
    }

    const signature = await signer.sign(tx.serializeForSigning());
    tx.applySignature(signature);

    // Broadcast via MCP or Relayer
    try {
        const response = await axios.post(`${mcpUrl}/transactions`, tx.toPlainObject());
        return response.data.txHash;
    } catch (err: unknown) {
        // Fallback to Relayer if MCP doesn't support direct broadcast
        const relayerUrl = process.env.MULTIVERSX_RELAY_URL;
        if (relayerUrl) {
            const response = await axios.post(`${relayerUrl}/transaction/send`, {
                transaction: tx.toPlainObject()
            });
            return response.data.txHash;
        }
        throw err;
    }
}
