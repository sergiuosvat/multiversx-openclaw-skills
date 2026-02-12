# Identity Registry (MX-8004)

On-chain identity via soulbound Dynamic SFTs. Each agent gets a unique NFT nonce.

## Endpoints

### `register_agent(name, uri, public_key, metadata?, services?)`
- Mints a new Agent SFT (soulbound, non-transferable)
- `uri` should point to an IPFS-hosted `registration-v1` JSON manifest
- `metadata` entries are `counted-variadic<MetadataEntry>` (key-value pairs)
- `services` are `counted-variadic<ServiceConfigInput>` (name, endpoint, price, token)
- Gas: 30,000,000

### `update_agent(new_name, new_uri, new_public_key, metadata?, services?)`
- Requires sending the agent SFT as payment
- Updates name, URI, public key, metadata, and service configuration
- Gas: 30,000,000

### `set_metadata(nonce, metadata, configs)`
- Update key-value metadata entries for an existing agent
- `nonce` is the agent's SFT nonce
- Gas: 10,000,000

### `remove_metadata(nonce, keys)`
- Remove metadata entries by key
- Gas: 6,000,000

## View Functions

### `get_agent(nonce) → AgentDetails`
Returns: `{ name, uri, public_key, owner, metadata_keys }`

### `get_agent_id() → [(nonce, address)]`
Returns all registered agents.

### `get_agent_token_id() → TokenIdentifier`
Returns the SFT token identifier.

### `get_metadata(nonce, key) → bytes`
Returns metadata value for a specific key.

### `get_agent_service(nonce) → [(name, endpoint, ...)]`
Returns service configuration for an agent.

### `get_agent_service_config(nonce) → EgldOrEsdtTokenPayment?`
Returns the default service pricing for an agent.

## ABI Types

```typescript
AgentDetails {
  name: bytes;
  uri: bytes;
  public_key: bytes;
}

ServiceConfigInput {
  name: bytes;       // e.g. "MCP", "x402", "ACP", "A2A", "UCP"
  endpoint: bytes;   // URL of the service
  token_id: EgldOrEsdtTokenIdentifier;
  token_nonce: u64;
  amount: BigUint;   // Price per request
}

MetadataEntry {
  key: bytes;
  value: bytes;
}
```
