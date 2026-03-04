#!/bin/bash
# MultiversX Agent Skills — One-Line Installer
# Usage: curl -sL URL | bash
#
# Installs:
#   1. SKILL.md + reference docs       → .agent/skills/multiversx/
#   2. moltbot-starter-kit             → .agent/skills/multiversx/moltbot-starter-kit/
#   3. validate-and-submit-proof skill → .agent/skills/multiversx/validate-and-submit-proof/
#
# The SKILL.md teaches your agent HOW to use the skills.
# The starter kit contains the actual TypeScript implementations.
# validate-and-submit-proof provides fast proof submission scripts (no MCP).

set -euo pipefail

OPENCLAW_REPO="sasurobert/multiversx-openclaw-skills"
MOLTBOT_REPO="sasurobert/moltbot-starter-kit"
BRANCH="master"
OPENCLAW_URL="https://raw.githubusercontent.com/${OPENCLAW_REPO}/${BRANCH}"

SKILL_DIR=".agent/skills/multiversx"
MOLTBOT_DIR="${SKILL_DIR}/moltbot-starter-kit"
VALIDATE_PROOF_DIR="${SKILL_DIR}/validate-and-submit-proof"

echo "⚡ MultiversX Agent Skills Installer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Step 1: Download SKILL.md + reference docs ──────────────────────────────

mkdir -p "${SKILL_DIR}/references"

echo "📥 Downloading SKILL.md..."
curl -sL "${OPENCLAW_URL}/SKILL.md" > "${SKILL_DIR}/SKILL.md"

REFS="setup identity validation reputation escrow x402 manifest"
for ref in ${REFS}; do
  echo "📥 Downloading references/${ref}.md..."
  curl -sL "${OPENCLAW_URL}/references/${ref}.md" > "${SKILL_DIR}/references/${ref}.md"
done

# ── Step 2: Clone moltbot-starter-kit (implementation code) ─────────────────

echo ""
echo "📦 Cloning moltbot-starter-kit..."

if [ -d "${MOLTBOT_DIR}" ]; then
  echo "   ↳ Already exists, pulling latest..."
  cd "${MOLTBOT_DIR}" && git pull --quiet && cd - > /dev/null
else
  git clone --quiet --depth 1 "https://github.com/${MOLTBOT_REPO}.git" "${MOLTBOT_DIR}"
fi

# ── Step 3: Install validate-and-submit-proof skill ─────────────────────────

echo ""
echo "📥 Installing validate-and-submit-proof skill..."

mkdir -p "${VALIDATE_PROOF_DIR}/scripts"

echo "   ↳ SKILL.md, scripts..."
curl -sL "${OPENCLAW_URL}/validate-and-submit-proof/SKILL.md" > "${VALIDATE_PROOF_DIR}/SKILL.md"
curl -sL "${OPENCLAW_URL}/validate-and-submit-proof/scripts/submit-job-proof.js" > "${VALIDATE_PROOF_DIR}/scripts/submit-job-proof.js"
curl -sL "${OPENCLAW_URL}/validate-and-submit-proof/scripts/validation-request.js" > "${VALIDATE_PROOF_DIR}/scripts/validation-request.js"
curl -sL "${OPENCLAW_URL}/validate-and-submit-proof/scripts/validation-response.js" > "${VALIDATE_PROOF_DIR}/scripts/validation-response.js"
curl -sL "${OPENCLAW_URL}/validate-and-submit-proof/scripts/package.json" > "${VALIDATE_PROOF_DIR}/scripts/package.json"

echo "   ↳ npm install..."
cd "${VALIDATE_PROOF_DIR}/scripts" && npm install --quiet && cd - > /dev/null

# ── Step 4: Install moltbot-starter-kit dependencies ────────────────────────

echo ""
echo "📦 Installing moltbot-starter-kit dependencies..."
cd "${MOLTBOT_DIR}" && npm install --quiet && cd - > /dev/null

echo ""
echo "✅ MultiversX Agent Skills installed!"
echo ""
echo "📂 Structure:"
echo "   ${SKILL_DIR}/SKILL.md                    ← Agent instructions"
echo "   ${SKILL_DIR}/references/                 ← Contract docs"
echo "   ${MOLTBOT_DIR}/                          ← Implementation code"
echo "   ${VALIDATE_PROOF_DIR}/                    ← Proof submission scripts"
echo "   ${VALIDATE_PROOF_DIR}/scripts/           ← submit-job-proof, validation-*"
echo ""
echo "📖 Full docs: ${SKILL_DIR}/SKILL.md"
echo "🔗 Skills repo: https://github.com/${OPENCLAW_REPO}"
echo "🔗 Starter kit: https://github.com/${MOLTBOT_REPO}"
