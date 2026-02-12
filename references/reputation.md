# Reputation Registry

On-chain reputation via cumulative feedback and ERC-8004-style raw signals.

## Endpoints

### `giveFeedbackSimple(agent_nonce, rating)`
- Simple rated feedback (cumulative moving average on-chain)
- Caller must be the employer who created the job
- `rating` is a `BigUint` (e.g., 1-100 scale)
- Gas: 10,000,000

### `giveFeedback(agent_nonce, tag1, tag2, feedback_hash)`
- ERC-8004 raw signal feedback — stores raw data, off-chain aggregation expected
- Anyone can give feedback except the agent owner
- `tag1`, `tag2` are categorical tags (bytes)
- `feedback_hash` is an IPFS hash or similar proof of detailed feedback
- Gas: 10,000,000

### `revokeFeedback(agent_nonce, feedback_index)`
- Only the original feedback author can revoke
- Returns the revoked `FeedbackData`
- Gas: 6,000,000

### `append_response(agent_nonce, feedback_index, response_hash)`
- Anyone can append a response to existing feedback
- Useful for disputes, spam tagging, refund proofs
- Gas: 6,000,000

## View Functions

### `get_reputation_score(agent_nonce) → BigUint`
Returns the cumulative reputation score.

### `get_total_feedbacks(agent_nonce) → u64`
Returns total feedback count.

### `getFeedbackData(agent_nonce, index) → FeedbackData`
Returns:
```typescript
FeedbackData {
  tag1: bytes;
  tag2: bytes;
  feedback_hash: bytes;
  is_revoked: bool;
}
```

### `getLastIndex(agent_nonce, job_id) → u64`
Returns the last feedback index for a specific job.
