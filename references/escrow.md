# Escrow Contract (ACP)

Lock funds for agent jobs, release on verification, refund after deadline.

## Endpoints

### `deposit(job_id, receiver, poa_hash, deadline)`
- Lock EGLD or any ESDT token in escrow
- `payableInTokens: ["*"]` — send payment with the transaction
- `receiver` is the agent's address
- `poa_hash` is a hash of the proof-of-agreement
- `deadline` is a Unix timestamp (seconds) after which refund is allowed
- Gas: 15,000,000

### `release(job_id)`
- Release escrowed funds to the receiver
- Only callable by the employer
- Job must be verified in the Validation Registry
- Gas: 10,000,000

### `refund(job_id)`
- Refund escrowed funds to the employer
- Anyone can call after the deadline passes (allows automated cleanup)
- Gas: 10,000,000

## View Functions

### `get_escrow(job_id) → EscrowData`
Returns:
```typescript
EscrowData {
  employer: Address;
  receiver: Address;
  token_id: EgldOrEsdtTokenIdentifier;
  token_nonce: u64;
  amount: BigUint;
  poa_hash: bytes;
  deadline: u64;           // Unix timestamp
  status: EscrowStatus;    // Active (0), Released (1), Refunded (2)
}
```

## Escrow Status Flow

```
Active (0)  ──release()──▶  Released (1)
    │
    └──refund()──▶  Refunded (2)  (only after deadline)
```

## Events

| Event | Fields |
|:---|:---|
| `escrow_deposited` | job_id, employer, amount |
| `escrow_released` | job_id, receiver, amount |
| `escrow_refunded` | job_id, employer, amount |
