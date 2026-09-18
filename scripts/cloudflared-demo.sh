#!/usr/bin/env bash
# Copyright © 2026 Abhishek. All rights reserved.
#
# scripts/cloudflared-demo.sh
# Cloudflare Quick Tunnel alternative

PORT=3000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "  NRJBE Academic Portal - Cloudflare Tunnel Launcher"
echo "=========================================================="

/home/v3nom/.local/bin/cloudflared tunnel --url http://localhost:${PORT}
