# ERIFY™ Incident Relay Notification System

## Overview

The ERIFY Incident Relay Notification System provides comprehensive monitoring and alerting for the ERIFY relay infrastructure. It monitors relay health and sends intelligent notifications to Slack and Discord with state change detection, severity differentiation, and recovery alerts.

## Features

### 🔄 Recovery Alerts
- **State Change Detection**: Only notifies on actual state transitions (failure → recovery)
- **Recovery Notifications**: Alerts when relay transitions from failed/degraded back to OK
- **Noise Reduction**: Prevents spam by only sending alerts on state changes

### 🎯 Severity Differentiation
- **🟡 Degraded**: Partial failure (e.g., Slack OR Discord down, but relay functional)
- **🔴 Down**: Full failure (both Slack AND Discord fail, or relay endpoint down)
- **✅ OK**: All systems operational

### 🎨 Custom Icons and Emojis
#### Slack
- 🔥 for failure states
- ✅ for recovery/OK states
- 🟡 for degraded states
- Rich attachment formatting with color coding

#### Discord
- Embed color-coded messages:
  - Green (65280) for OK/Recovery
  - Yellow (16776960) for Degraded
  - Red (16711680) for Down
- Animated crown emoji (👑) for ERIFY™ branding
- Structured embed fields for detailed status

### 📊 State Management
- **GitHub API Integration**: Uses workflow run history to track previous states
- **Transition Detection**: Compares current state with last known state
- **State Mapping**: 
  - GitHub `success` → OK
  - GitHub `failure` → Down
  - GitHub `cancelled` → Degraded

## Setup Instructions

### Required Secrets

Ensure the following secrets are configured in your GitHub repository:

1. **`RELAY_HEALTH_URL`** - The main relay health check endpoint
   ```
   Example: https://your-relay.erify.world/health
   ```

2. **`SLACK_WEBHOOK_URL`** - Slack incoming webhook URL
   ```
   Example: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **`DISCORD_WEBHOOK_URL`** - Discord webhook URL
   ```
   Example: https://discord.com/api/webhooks/123456789012345678/AbCdEfGhIjKlMnOpQrStUvWxYz
   ```

### GitHub Token

The workflow uses the built-in `GITHUB_TOKEN` for API access to retrieve previous workflow states. No additional setup required.

### Webhook Setup

#### Slack Webhook Setup
1. Go to your Slack workspace
2. Navigate to Apps → Custom Integrations → Incoming Webhooks
3. Create a new webhook for your desired channel
4. Copy the webhook URL to `SLACK_WEBHOOK_URL` secret

#### Discord Webhook Setup
1. Go to your Discord server
2. Navigate to Server Settings → Integrations → Webhooks
3. Create a new webhook for your desired channel
4. Copy the webhook URL to `DISCORD_WEBHOOK_URL` secret

## Configuration

### Monitoring Frequency
The workflow runs every 5 minutes by default. To change this:

```yaml
schedule:
  - cron: '*/5 * * * *'  # Every 5 minutes
  # - cron: '*/10 * * * *'  # Every 10 minutes
  # - cron: '0 * * * *'     # Every hour
```

### Manual Triggering
The workflow can be manually triggered via GitHub Actions for testing:
1. Go to Actions → ERIFY Incident Relay Notification
2. Click "Run workflow"

## State Transitions

The system recognizes the following state transitions:

| Previous | Current | Notification Type | Description |
|----------|---------|-------------------|-------------|
| down     | ok      | 🚀 **Recovery**   | Full recovery from outage |
| degraded | ok      | 🚀 **Recovery**   | Recovery from partial failure |
| ok       | degraded| ⚠️ **Degradation** | Partial service failure |
| ok       | down    | 🔥 **Failure**    | Complete service failure |
| degraded | down    | 🔥 **Failure**    | Escalation to complete failure |
| down     | degraded| 📈 **Improvement** | Partial recovery |

## Incident History (Future Enhancement)

The current implementation provides basic state tracking. Future enhancements may include:

- **Downtime Duration**: Track and report how long the relay was down
- **Incident Frequency**: Report number of incidents in the last 24h/7d
- **MTTR Tracking**: Mean Time To Recovery statistics
- **External Storage**: Use GitHub Gist or external KV store for persistent history

## Testing

### Test the Workflow
1. Manually trigger the workflow from GitHub Actions
2. Check the workflow logs for health check results
3. Verify notifications are sent to Slack and Discord

### Test State Transitions
1. Temporarily disable one of your webhook URLs (set to invalid URL)
2. Wait for next workflow run to detect degraded state
3. Restore the webhook URL
4. Verify recovery notification is sent

## Troubleshooting

### Common Issues

1. **No notifications received**
   - Verify webhook URLs are correct and active
   - Check workflow logs for errors
   - Ensure secrets are properly set

2. **Duplicate notifications**
   - Check if multiple workflows are running
   - Verify cron schedule is not too frequent

3. **Missing recovery notifications**
   - Ensure state transitions are being detected
   - Check GitHub API rate limits
   - Verify workflow has proper permissions

### Debug Logging
The workflow includes detailed console output for debugging:
- Health check results for each component
- State transition detection
- Notification sending status

## Security Considerations

- Webhook URLs contain sensitive tokens - store only in GitHub Secrets
- Health check endpoints should not expose sensitive information
- Consider IP allowlisting for webhook endpoints if possible

---

_Created for ERIFY™ Technologies • Luxury-grade incident monitoring • Crown your reliability_ 💎🔥