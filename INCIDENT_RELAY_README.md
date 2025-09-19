# ERIFY™ Incident Alert Relay Worker

A Cloudflare Worker that relays incident alerts to both Slack and Discord with ERIFY™ branding. This worker accepts HTTP POST requests with incident details and forwards them to configured webhooks with beautiful, branded formatting.

## Features

- 🔥 **Multi-Platform Support**: Relay alerts to both Slack and Discord simultaneously
- 💎 **ERIFY™ Branding**: Custom colors, emojis, and branded footers
- ✅ **Smart Mapping**: Incident severity mapped to brand-specific colors and emojis
- 🌍 **Flexible Input**: Handles custom format or Statuspage.io webhooks
- 👑 **Retry Logic**: Built-in exponential backoff for failed webhook deliveries
- 🔐 **Authentication**: Optional shared secret token protection

## Status Mapping

| Status | Color | Emoji | Description |
|--------|--------|-------|-------------|
| `investigating` | Gold (#FFD700) | 🔥 | Active incident investigation |
| `monitoring` | Blue (#4A90E2) | 💎 | Issue identified and being monitored |
| `resolved` | Green (#50C878) | ✅ | Incident fully resolved |

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/erify-world/erifybot.git
cd erifybot

# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 2. Configuration

Set up your environment variables:

```bash
# Set Slack webhook URL
wrangler secret put SLACK_URL
# Enter: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Set Discord webhook URL
wrangler secret put DISCORD_URL
# Enter: https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# (Optional) Set custom brand avatar URL
wrangler secret put BRAND_AVATAR_URL
# Enter: https://your-domain.com/logo.png

# (Optional) Set authentication token
wrangler secret put RELAY_AUTH_TOKEN
# Enter: your-secret-token-here
```

### 3. Deployment

```bash
# Deploy to development
wrangler deploy --env development

# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

## Usage

### Basic Request

Send a POST request to your worker URL:

```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/relay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token-here" \
  -d '{
    "id": "incident-001",
    "title": "Database Connection Issues",
    "status": "investigating",
    "severity": "high",
    "description": "Users experiencing intermittent database connection timeouts.",
    "components": ["Database", "API Gateway"],
    "url": "https://status.erify.world/incidents/001"
  }'
```

### Endpoints

- `POST /` or `POST /relay` - Main incident relay endpoint
- `GET /health` - Health check endpoint

## Input Formats

### Custom Format

```json
{
  "id": "incident-001",
  "title": "Service Disruption",
  "status": "investigating",
  "severity": "high",
  "description": "Brief description of the incident",
  "components": ["Component 1", "Component 2"],
  "url": "https://status.example.com/incidents/001",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Statuspage.io Format

The worker automatically detects and normalizes Statuspage.io webhook payloads:

```json
{
  "page": {
    "id": "page-id",
    "name": "ERIFY™ Status",
    "subdomain": "erify-status"
  },
  "incident": {
    "id": "incident-id",
    "name": "Service Disruption",
    "status": "investigating",
    "impact": "major",
    "created_at": "2024-01-01T12:00:00Z",
    "incident_updates": [
      {
        "body": "We are investigating reports of service disruption."
      }
    ],
    "components": [
      {
        "name": "API Gateway"
      }
    ]
  }
}
```

## Sample Payloads

### Investigating Status

```json
{
  "id": "inc-2024-001",
  "title": "High Response Times on API Gateway",
  "status": "investigating",
  "severity": "major",
  "description": "We are currently investigating reports of elevated response times affecting our API Gateway. Users may experience slower than normal page loads and API responses.",
  "components": ["API Gateway", "Load Balancer"],
  "url": "https://status.erify.world/incidents/2024-001",
  "page_name": "ERIFY™ Platform Status",
  "created_at": "2024-01-15T14:30:00Z"
}
```

### Monitoring Status

```json
{
  "id": "inc-2024-001",
  "title": "High Response Times on API Gateway",
  "status": "monitoring",
  "severity": "major",
  "description": "We have identified the root cause of the elevated response times and have implemented a fix. We are currently monitoring the situation to ensure stability.",
  "components": ["API Gateway", "Load Balancer"],
  "url": "https://status.erify.world/incidents/2024-001",
  "page_name": "ERIFY™ Platform Status",
  "updated_at": "2024-01-15T15:15:00Z"
}
```

### Resolved Status

```json
{
  "id": "inc-2024-001",
  "title": "High Response Times on API Gateway",
  "status": "resolved",
  "severity": "major",
  "description": "The issue with elevated response times has been fully resolved. All systems are operating normally. We will be conducting a post-incident review to prevent similar issues in the future.",
  "components": ["API Gateway", "Load Balancer"],
  "url": "https://status.erify.world/incidents/2024-001",
  "page_name": "ERIFY™ Platform Status",
  "updated_at": "2024-01-15T16:00:00Z"
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SLACK_URL` | No* | Slack incoming webhook URL |
| `DISCORD_URL` | No* | Discord webhook URL |
| `BRAND_AVATAR_URL` | No | Custom avatar/logo URL (defaults to ERIFY™ logo) |
| `RELAY_AUTH_TOKEN` | No | Shared secret for request authentication |

*At least one webhook URL (Slack or Discord) must be configured.

## Custom Domain Setup

To use a custom domain like `incidents.erify.world`:

1. Add the domain to your Cloudflare account
2. Update `wrangler.toml` routes section:
   ```toml
   [[routes]]
   pattern = "incidents.erify.world/*"
   zone_name = "erify.world"
   ```
3. Deploy with `wrangler deploy --env production`

## Development

### Local Testing

```bash
# Start local development server
wrangler dev

# Test with sample payload
curl -X POST http://localhost:8787/relay \
  -H "Content-Type: application/json" \
  -d @sample-investigating.json
```

### Project Structure

```
├── src/
│   └── worker.js          # Main worker script
├── wrangler.toml          # Wrangler configuration
├── README.md              # This file
└── samples/               # Sample payload files
    ├── investigating.json
    ├── monitoring.json
    └── resolved.json
```

## Response Format

The worker returns a JSON response with delivery status:

```json
{
  "incident_id": "inc-2024-001",
  "processed_at": "2024-01-15T14:30:15Z",
  "results": {
    "slack": {
      "success": true,
      "status": 200
    },
    "discord": {
      "success": true,
      "status": 200
    }
  }
}
```

## Error Handling

- **400 Bad Request**: Invalid JSON payload
- **401 Unauthorized**: Missing or invalid authentication token
- **405 Method Not Allowed**: Non-POST request to relay endpoint
- **500 Internal Server Error**: No webhook URLs configured
- **207 Multi-Status**: Partial success (some webhooks failed)

## Retry Logic

The worker implements exponential backoff retry logic:
- Initial retry after 1 second
- Second retry after 2 seconds  
- Final retry after 4 seconds
- Maximum 3 attempts per webhook

## Support

For issues and questions:
- 📧 Email: support@erify.world
- 🌍 Website: https://erify.world
- 👑 Discord: ERIFY™ Community Server

---

**ERIFY™ | Stay Regal. Stay Strategic. 🌍💎🔥**