
#!/usr/bin/env bash
set -e

# Use Render's assigned port for Express.
export PORT="${PORT:-10000}"

# Let FastAPI call Express's internal status endpoint.
export EXPRESS_API_URL="http://127.0.0.1:${PORT}"

# Start FastAPI from its application directory.
cd ai-services
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
FASTAPI_PID=$!

# Start Express from backend/, preserving uploads/ path behaviour.
cd ../backend
node src/server.js &
EXPRESS_PID=$!

# Stop the other process if either service exits.
trap 'kill "$FASTAPI_PID" "$EXPRESS_PID" 2>/dev/null || true' EXIT INT TERM

wait -n "$FASTAPI_PID" "$EXPRESS_PID"
