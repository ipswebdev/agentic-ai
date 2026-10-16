
#!/usr/bin/env bash
set -e

# Resolve the repository root.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Use Render's assigned public port for Express.
export PORT="${PORT:-10000}"

# FastAPI calls Express through localhost.
export EXPRESS_API_URL="http://127.0.0.1:${PORT}"

# Start FastAPI.
cd "$ROOT_DIR/ai-services"
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
FASTAPI_PID=$!

# Start Express from backend/ so uploads/ resolves correctly.
cd "$ROOT_DIR/backend"
node src/server.js &
EXPRESS_PID=$!

# Stop both services when either one exits.
trap 'kill "$FASTAPI_PID" "$EXPRESS_PID" 2>/dev/null || true' EXIT INT TERM

wait -n "$FASTAPI_PID" "$EXPRESS_PID"
