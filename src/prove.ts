import { UserSigner } from '@multiversx/sdk-wallet';
import { Transaction, TransactionPayload, Address } from '@multiversx/sdk-core';
import { promises as fs } from 'fs';
import axios from 'axios';

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

    // Construct Data: submitProof@<job_id_hex>@<hash>
    const jobIdHex = Buffer.from(input.jobId).toString('hex');
    const data = `submitProof@${jobIdHex}@${input.resultHash}`;

    const tx = new Transaction({
        nonce: 0,
        value: "0",
        receiver: new Address(registryAddress),
        gasLimit: 10000000n, // Estimated gas for storage write
        chainID: "D", // TODO: Configurable
        data: new TransactionPayload(data),
        sender: new Address(signer.getAddress().bech32())
    });

    // Fetch Nonce (Reuse logic or helper)
    try {
        const mcpUrl = process.env.MULTIVERSX_MCP_URL || 'http://localhost:3000';
        const nonceResp = await axios.get(`${mcpUrl}/accounts/${signer.getAddress().bech32()}`);
        tx.setNonce(BigInt(nonceResp.data.nonce || 0));
    } catch (e) {
        console.warn("Could not fetch nonce, using 0");
        tx.setNonce(0n);
    }

    const signature = await signer.sign(tx.serializeForSigning());
    tx.applySignature(signature);

    // Broadcast via MCP or Relayer
    // Assuming MCP has a broadcast endpoint or we use the relayer for everything
    const mcpUrl = process.env.MULTIVERSX_MCP_URL || 'http://localhost:3000';
    try {
        const response = await axios.post(`${mcpUrl}/transactions`, tx.toPlainObject());
        return response.data.txHash;
    } catch (err: any) {
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
