#!/bin/bash
set -e

echo "============================================"
echo " MultiversX OpenClaw Skills — Setup"
echo "============================================"

# Prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install v18+."; exit 1; }
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
[ "$NODE_MAJOR" -ge 18 ] 2>/dev/null || echo "⚠ Node.js v18+ recommended (found $(node -v))"

echo "✓ node $(node -v), npm $(npm -v)"

# Run the install script to pull SKILL.md, references, and moltbot-starter-kit
echo "📦 Running install script..."
bash scripts/install.sh

echo ""
echo "✅ Setup complete!"
echo "   See SKILL.md for agent instructions."
echo "   Implementation code is in .agent/skills/multiversx/moltbot-starter-kit/"
