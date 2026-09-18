#!/usr/bin/env bash
# scripts/live-demo.sh
# Starts or reconnects the live public demo tunnel for NRJBE Academic Portal

PORT=3000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "  NRJBE Academic Portal - Live Demo Launcher"
echo "=========================================================="

# 1. Ensure Next.js production server is running
if ! curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}" | grep -q "200"; then
  echo "[+] Starting local Next.js production server on port ${PORT}..."
  nohup npm run start > /tmp/nrjbe-next.log 2>&1 &
  sleep 4
fi

echo "[✓] Local server is responding on http://localhost:${PORT}"
echo ""
echo "Launching live public HTTPS tunnel..."
echo ""

# 2. Run Pinggy tunnel with auto-reconnect
while true; do
  ssh -T -p 443 -R0:localhost:${PORT} -o StrictHostKeyChecking=no -o ServerAliveInterval=15 a.pinggy.io
  echo "[!] Tunnel disconnected. Reconnecting in 3 seconds..."
  sleep 3
done
