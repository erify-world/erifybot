# ERIFY Relay Health Check Setup Guide

## Overview

The ERIFY Incident Relay Health Check workflow provides automated monitoring of the relay service to ensure continuous operation and early detection of issues.

## Features

- **Automated Monitoring**: Runs every 30 minutes via GitHub Actions cron schedule
- **Health Validation**: Checks the `/health` endpoint and validates JSON response
- **Status Verification**: Ensures the `status` field returns exactly `"ok"`
- **Failure Detection**: Immediately fails if HTTP request fails or status is not "ok"
- **Manual Triggering**: Can be manually triggered via GitHub Actions UI

## Configuration

### Required Secret

The workflow requires one repository secret to be configured:

- **Secret Name**: `RELAY_HEALTH_URL`
- **Description**: The complete URL to the relay's health check endpoint
- **Example Value**: `https://relay.erifyteam.com/health`

### Setting Up the Secret

1. Navigate to your repository on GitHub
2. Go to **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the following:
   - **Name**: `RELAY_HEALTH_URL`
   - **Value**: Your relay's health endpoint URL
6. Click **Add secret**

## Expected Response Format

The health endpoint must return a JSON response with the following format:

```json
{
  "status": "ok"
}
```

## Workflow Behavior

### Success Case
- HTTP status code is 200
- JSON response contains `"status": "ok"`
- Workflow completes successfully with ✅ status

### Failure Cases
- HTTP status code is not 200
- JSON response is malformed
- Status field is missing or not equal to "ok"
- Network connectivity issues
- Workflow fails with ❌ status

## Monitoring and Alerts

### GitHub Actions Interface
- Monitor workflow runs in the **Actions** tab
- Failed runs will show red ❌ status
- Success runs will show green ✅ status

### Manual Execution
You can manually trigger a health check:
1. Go to **Actions** tab
2. Select "ERIFY Relay Health Check" workflow
3. Click **Run workflow**
4. Click **Run workflow** button to execute

### Notification Options (Future Enhancement)

The workflow includes placeholder comments for integrating external notifications:
- Slack webhook notifications
- Discord webhook notifications
- Email alerts via GitHub Actions

To enable notifications, uncomment and configure the webhook sections in the workflow file.

## Troubleshooting

### Common Issues

1. **Secret Not Configured**
   - Error: Workflow references empty `RELAY_HEALTH_URL`
   - Solution: Configure the secret as described above

2. **Health Endpoint Returns Different Status**
   - Error: Status is not "ok"
   - Solution: Check relay service configuration

3. **Network Connectivity Issues**
   - Error: HTTP request fails
   - Solution: Verify endpoint URL and network accessibility

4. **JSON Format Issues**
   - Error: Cannot parse response
   - Solution: Ensure endpoint returns valid JSON

### Workflow Logs

Detailed logs are available in the GitHub Actions interface:
1. Go to **Actions** tab
2. Click on a specific workflow run
3. Click on the "Check ERIFY Incident Relay Health" job
4. Expand steps to see detailed output

## Workflow Schedule

- **Frequency**: Every 30 minutes
- **Cron Expression**: `*/30 * * * *`
- **Timezone**: UTC (GitHub Actions default)

## Security Considerations

- The `RELAY_HEALTH_URL` secret is securely stored and not exposed in logs
- Only the final health status is logged, not the actual endpoint URL
- Use HTTPS endpoints to ensure encrypted communication

---

*Created for ERIFY™ Technologies • Continuous monitoring for luxury-grade reliability* 💎🔥