# erifybot
Flame-Powered Discord Bot for the ERIFY™ community — EGO • GOALLIN • DCREEDS • Flame Feed Relay

## Components

### 🔥 Incident Alert Relay Worker
A Cloudflare Worker that relays incident alerts to both Slack and Discord with ERIFY™ branding.

**Key Features:**
- Multi-platform alert delivery (Slack + Discord)
- ERIFY™ branded formatting with gold, blue, and green color schemes
- Support for both custom format and Statuspage.io webhooks
- Built-in retry logic with exponential backoff
- Optional authentication with shared secret tokens

**Quick Start:**
```bash
# Deploy the incident relay worker
cd erifybot
wrangler deploy --env production

# Test with sample payload
curl -X POST https://your-worker.workers.dev/relay \
  -H "Content-Type: application/json" \
  -d @samples/investigating.json
```

📖 **Full Documentation:** See [INCIDENT_RELAY_README.md](./INCIDENT_RELAY_README.md)

---

**ERIFY™ | Stay Regal. Stay Strategic. 🌍💎🔥**
