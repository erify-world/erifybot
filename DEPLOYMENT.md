# ERIFY Incident Relay Deployment Guide

This guide covers deploying the ERIFY Incident Relay Worker to Cloudflare.

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Workers enabled
2. **Domain Setup**: `relay.erifyteam.com` should be configured in your Cloudflare zone
3. **Wrangler CLI**: Install and authenticate Wrangler CLI

## Setup

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Configure KV Namespace (Optional)
If you want to store relay status for future enhancements:
```bash
# Create KV namespace
wrangler kv:namespace create "RELAY_STATUS"
wrangler kv:namespace create "RELAY_STATUS" --preview

# Update wrangler.toml with the returned IDs
```

## Deployment

### 1. Deploy to Production
```bash
npm run deploy
```

### 2. Test the Deployment
```bash
# Test against production
TEST_URL=https://relay.erifyteam.com ./test/manual-test.sh

# Or test individual endpoints
curl https://relay.erifyteam.com/health
curl https://relay.erifyteam.com/badge
```

## Configuration

### Custom Domain Routing
The `wrangler.toml` file is configured for `relay.erifyteam.com/*`. Update this if using a different domain:

```toml
[env.production]
routes = [
  "your-domain.com/*"
]
```

### Environment Variables
Currently no environment variables are required, but you can add them in the Cloudflare Dashboard under Workers > Settings > Environment Variables.

## Monitoring

### GitHub Actions Health Check
The repository includes a GitHub Action (`.github/workflows/health-check.yml`) that:
- Runs every 15 minutes
- Tests both `/health` and `/badge` endpoints
- Fails if endpoints return non-200 status codes
- Can be extended to send notifications on failure

### Status Badge
Add the status badge to any documentation:
```markdown
![Relay Status](https://img.shields.io/endpoint?url=https%3A%2F%2Frelay.erifyteam.com%2Fbadge)
```

## Development

### Local Development
```bash
# Start local development server
npm run dev

# Test locally
./test/manual-test.sh
```

### Building
```bash
# Compile TypeScript
npm run build

# Run tests
npm test
```

## Troubleshooting

### Common Issues
1. **Domain not routing**: Ensure the domain is added to your Cloudflare zone and the route is configured
2. **Workers quota exceeded**: Check your Cloudflare Workers usage
3. **Authentication issues**: Run `wrangler login` to re-authenticate

### Logs
View worker logs in the Cloudflare Dashboard under Workers > Your Worker > Logs

### Support
For issues specific to the ERIFY Incident Relay, check:
- Worker logs in Cloudflare Dashboard
- GitHub Actions runs for health check status
- Manual testing with the provided scripts