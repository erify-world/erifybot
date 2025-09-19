# erifybot
Flame-Powered Discord Bot for the ERIFY™ community — EGO • GOALLIN • DCREEDS • Flame Feed Relay

## Automated Health Checks

This repository includes automated health monitoring for the ERIFY Incident Relay:

- **Schedule**: Health checks run every 30 minutes automatically
- **Endpoint**: Monitors the `/health` endpoint of the relay service
- **Validation**: Ensures the relay returns `{"status": "ok"}` for proper operation
- **Alerts**: Workflow fails if the relay is unhealthy, providing early warning of issues

### Setup Instructions

To enable health checks, configure the `RELAY_HEALTH_URL` secret in the repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `RELAY_HEALTH_URL`
4. Value: Your relay health endpoint URL (e.g., `https://relay.erifyteam.com/health`)
5. Click **Add secret**

The health check workflow will automatically start monitoring once the secret is configured.
