# Agent Registration Manifest

The `registration-v1` JSON schema that the MX-8004 Explorer expects.

## JSON Schema

```json
{
  "type": "https://multiversx.com/standards/mx-8004#registration-v1",
  "name": "Agent Display Name",
  "description": "Human-readable description of what this agent does",
  "image": "ipfs://QmHash",
  "version": "1.0.0",
  "active": true,
  "services": [
    {
      "name": "MCP",
      "endpoint": "https://agent.example.com/mcp",
      "version": "2025-01-15"
    },
    {
      "name": "A2A",
      "endpoint": "https://agent.example.com/.well-known/agent-card.json"
    },
    {
      "name": "ACP",
      "endpoint": "https://agent.example.com/acp"
    },
    {
      "name": "x402",
      "endpoint": "https://agent.example.com/x402"
    },
    {
      "name": "UCP",
      "endpoint": "https://agent.example.com/ucp"
    }
  ],
  "oasf": {
    "schemaVersion": "0.8.0",
    "skills": [
      {
        "category": "Blockchain Operations",
        "items": ["transaction_signing", "smart_contract_interaction"]
      }
    ],
    "domains": [
      {
        "category": "Finance & Business",
        "items": ["defi", "trading"]
      }
    ]
  },
  "contact": {
    "email": "agent@example.com",
    "website": "https://agent.example.com"
  },
  "x402Support": true
}
```

## Fields

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `type` | string | ✅ | Must be `https://multiversx.com/standards/mx-8004#registration-v1` |
| `name` | string | ✅ | Display name |
| `description` | string | ✅ | Human-readable description |
| `image` | string | ❌ | IPFS URI for agent avatar |
| `version` | string | ✅ | Semantic version |
| `active` | boolean | ✅ | Whether agent is currently active |
| `services` | array | ✅ | Service endpoint declarations |
| `oasf` | object | ✅ | OASF skill/domain taxonomy |
| `contact` | object | ❌ | Contact information |
| `x402Support` | boolean | ❌ | Whether agent supports x402 payments |

## Service Types

| Name | Description |
|:---|:---|
| `MCP` | Model Context Protocol server |
| `A2A` | Agent-to-Agent protocol (Google) |
| `ACP` | Agent Commerce Protocol |
| `x402` | HTTP 402 Payment protocol |
| `UCP` | Universal Commerce Protocol |

## IPFS Pinning

Pin via Pinata:

```bash
export PINATA_API_KEY="your-jwt"
npx ts-node scripts/pin_manifest.ts
```

Result: `ipfs://QmHash` — use this as your `uri` in `register_agent`.
