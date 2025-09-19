# ERIFY™ Relay Notification Setup Guide

This guide explains how to configure the ERIFY™ Relay Failure Notifications workflow that sends branded alerts to Slack and Discord when the Relay Health Check workflow fails.

## 🔧 Required Repository Secrets

The notification workflow requires the following secrets to be configured in your GitHub repository:

### 1. `RELAY_HEALTH_URL`
- **Purpose**: The health check endpoint URL for your relay
- **Example**: `https://relay.erifyteam.com/health`
- **Usage**: Displayed in notifications to show which endpoint failed

### 2. `SLACK_WEBHOOK_URL`
- **Purpose**: Slack Incoming Webhook URL for posting notifications
- **Format**: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
- **Setup Steps**:
  1. Go to your Slack workspace settings
  2. Navigate to Apps & integrations
  3. Search for "Incoming Webhooks" and add to workspace
  4. Create a new webhook for your desired channel
  5. Copy the webhook URL and add it as a repository secret

### 3. `DISCORD_WEBHOOK_URL`
- **Purpose**: Discord channel webhook URL for posting notifications
- **Format**: `https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz`
- **Setup Steps**:
  1. Go to your Discord server
  2. Right-click on the channel where you want notifications
  3. Select "Edit Channel" → "Integrations" → "Webhooks"
  4. Click "Create Webhook" or "New Webhook"
  5. Copy the webhook URL and add it as a repository secret

## 📝 How to Add Repository Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names shown above

## 🎯 Workflow Triggers

The notification workflow is triggered by the completion of the "Relay Health Check" workflow:

- **Failure notifications**: Sent immediately when the health check fails
- **Recovery notifications**: Sent when health check succeeds after a previous failure

## 🎨 ERIFY™ Branding Features

The notifications include luxury ERIFY™ branding:

- **Crown emoji and avatars** (👑)
- **Gold color scheme** (#FFD700 for failures, #00FF00 for recovery)
- **Regal footer**: "ERIFY™ Technologies • Luxury-grade monitoring • Crown your infrastructure 💎🔥"
- **Professional username**: "ERIFY™ Crown Guard"

## 📊 Notification Content

Each notification includes:

- Repository name
- Failure/recovery status
- Health endpoint URL
- Timestamp
- Direct link to the workflow run
- ERIFY™ branded footer and styling

## 🔄 Optional: Creating the Relay Health Check Workflow

If you don't have a "Relay Health Check" workflow yet, create `.github/workflows/relay-health-check.yml`:

```yaml
name: Relay Health Check

on:
  schedule:
    - cron: '*/5 * * * *'  # Run every 5 minutes
  workflow_dispatch:       # Allow manual triggering

jobs:
  health-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: 🔍 Check Relay Health
        run: |
          HEALTH_URL="${{ secrets.RELAY_HEALTH_URL }}"
          
          if [ -z "$HEALTH_URL" ]; then
            echo "❌ RELAY_HEALTH_URL secret not configured"
            exit 1
          fi
          
          echo "🔍 Checking health endpoint: $HEALTH_URL"
          
          # Perform health check
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
          
          if [ "$RESPONSE" = "200" ]; then
            echo "✅ Health check passed (HTTP $RESPONSE)"
          else
            echo "❌ Health check failed (HTTP $RESPONSE)"
            exit 1
          fi
```

## 🚀 Testing the Setup

1. Add all required secrets to your repository
2. Trigger the Relay Health Check workflow manually (if it exists)
3. Or wait for the scheduled runs to execute
4. Check your Slack/Discord channels for notifications

---

*Created for ERIFY™ Technologies • Luxury-grade monitoring • Crown your infrastructure* 💎🔥