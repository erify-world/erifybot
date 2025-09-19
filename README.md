# erifybot

![Relay Status](https://img.shields.io/endpoint?url=https%3A%2F%2Frelay.erifyteam.com%2Fbadge)

Flame-Powered Discord Bot for the ERIFY™ community — EGO • GOALLIN • DCREEDS • Flame Feed Relay

## ERIFY Incident Relay Worker

The ERIFY Incident Relay Worker is a Cloudflare Worker that provides health monitoring and status reporting for the ERIFY community infrastructure.

### Endpoints

- **Health Check**: `/health` - Returns current status, service name, and timestamp
- **Status Badge**: `/badge` - Returns Shields.io-compatible badge data
- **Service Info**: `/` - Returns general service information

### Health Check Endpoint

The `/health` endpoint returns a JSON object with the current status:

```json
{
  "status": "ok",
  "name": "erify-incident-relay",
  "time": "2025-09-19T21:38:05.000Z"
}
```

### Badge Endpoint

The `/badge` endpoint returns Shields.io-compatible schema for status badges:

```json
{
  "schemaVersion": 1,
  "label": "Relay",
  "message": "Online / OK",
  "color": "brightgreen"
}
```

### Testing

You can test the endpoints using cURL:

```bash
# Test health endpoint
curl https://relay.erifyteam.com/health

# Test badge endpoint
curl https://relay.erifyteam.com/badge

# Test service info
curl https://relay.erifyteam.com/
```

### Development

This worker is built with TypeScript and deployed using Cloudflare Workers.

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

### Configuration

The worker is configured to run on `relay.erifyteam.com` with custom routing defined in `wrangler.toml`.
