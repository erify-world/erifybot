# erifybot
Flame-Powered Discord Bot for the ERIFY™ community — EGO • GOALLIN • DCREEDS • Flame Feed Relay

## 🔥 Features

### ERIFY™ Incident Relay Monitoring
Advanced CI notification workflow that provides complete incident pulse coverage:

- **🚀 Recovery Alerts**: Intelligent notifications when relay transitions from failed → OK
- **🎯 Severity States**: 
  - 🟡 **Degraded**: Partial failure (Slack OR Discord down)
  - 🔴 **Down**: Full failure (both channels fail)
  - ✅ **OK**: All systems operational
- **🎨 Rich Notifications**: Custom emojis and color-coded alerts for Slack and Discord
- **📊 State Tracking**: Noise-reducing state change detection

See [INCIDENT_RELAY_SETUP.md](./INCIDENT_RELAY_SETUP.md) for complete setup instructions.

## 🛠️ Setup

### Required Secrets
- `RELAY_HEALTH_URL` - Main relay health endpoint
- `SLACK_WEBHOOK_URL` - Slack incoming webhook
- `DISCORD_WEBHOOK_URL` - Discord webhook

### Quick Start
1. Configure the required secrets in GitHub repository settings
2. The notification workflow runs automatically every 5 minutes
3. Manual triggers available via GitHub Actions

---

_Crown your reliability with ERIFY™ Technologies_ 💎🔥
