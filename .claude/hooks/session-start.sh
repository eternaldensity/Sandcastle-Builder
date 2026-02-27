#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Installing npm dependencies..."
npm install

echo "Installing Playwright browsers for parity tests (best-effort)..."
npx playwright install --with-deps chromium || echo "Warning: Playwright browser install failed (parity tests may not work, but unit tests will still run)"

echo "Session start setup complete."
