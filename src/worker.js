/**
 * ERIFY™ Incident Alert Relay Worker
 * Relays incident alerts to both Slack and Discord with ERIFY™ branding
 */

// ERIFY™ Brand Constants
const ERIFY_BRAND = {
  name: 'ERIFY™',
  colors: {
    gold: '#FFD700',      // Alert/investigating
    blue: '#4A90E2',      // Monitoring
    green: '#50C878',     // Resolved
    primary: '#FFD700'    // Default brand color
  },
  emojis: {
    investigating: '🔥',
    monitoring: '💎',
    resolved: '✅',
    crown: '👑',
    world: '🌍',
    diamond: '💎',
    fire: '🔥'
  },
  footer: '👑 ERIFY™ | Stay Regal. Stay Strategic. 🌍💎🔥',
  avatar: 'https://cdn.erify.world/assets/erify-logo.png' // Default avatar URL
};

// Severity to brand mapping
const SEVERITY_MAPPING = {
  investigating: {
    color: ERIFY_BRAND.colors.gold,
    emoji: ERIFY_BRAND.emojis.investigating,
    slackColor: '#FFD700'
  },
  monitoring: {
    color: ERIFY_BRAND.colors.blue,
    emoji: ERIFY_BRAND.emojis.monitoring,
    slackColor: '#4A90E2'
  },
  resolved: {
    color: ERIFY_BRAND.colors.green,
    emoji: ERIFY_BRAND.emojis.resolved,
    slackColor: '#50C878'
  },
  // Aliases
  identified: {
    color: ERIFY_BRAND.colors.blue,
    emoji: ERIFY_BRAND.emojis.monitoring,
    slackColor: '#4A90E2'
  },
  postmortem: {
    color: ERIFY_BRAND.colors.green,
    emoji: ERIFY_BRAND.emojis.resolved,
    slackColor: '#50C878'
  }
};

/**
 * Normalize incident data from various sources
 */
function normalizeIncident(payload) {
  // Handle Statuspage.io format
  if (payload.page && payload.incident) {
    const incident = payload.incident;
    return {
      id: incident.id,
      title: incident.name,
      status: incident.status,
      severity: incident.impact || 'none',
      description: incident.incident_updates?.[0]?.body || '',
      created_at: incident.created_at,
      updated_at: incident.updated_at,
      url: incident.shortlink || `https://${payload.page.subdomain}.statuspage.io/incidents/${incident.id}`,
      components: incident.components?.map(c => c.name) || [],
      page_name: payload.page.name
    };
  }
  
  // Handle custom format
  return {
    id: payload.id || 'unknown',
    title: payload.title || payload.name || 'Incident Alert',
    status: payload.status || 'investigating',
    severity: payload.severity || payload.impact || 'medium',
    description: payload.description || payload.message || '',
    created_at: payload.created_at || payload.timestamp || new Date().toISOString(),
    updated_at: payload.updated_at || payload.timestamp || new Date().toISOString(),
    url: payload.url || payload.link || '',
    components: payload.components || payload.affected_components || [],
    page_name: payload.page_name || payload.service_name || 'ERIFY™ Services'
  };
}

/**
 * Create Slack message payload
 */
function createSlackMessage(incident, env) {
  const mapping = SEVERITY_MAPPING[incident.status] || SEVERITY_MAPPING.investigating;
  const timestamp = Math.floor(new Date(incident.created_at).getTime() / 1000);
  
  const fields = [
    {
      title: 'Status',
      value: `${mapping.emoji} ${incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}`,
      short: true
    },
    {
      title: 'Severity',
      value: incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1),
      short: true
    }
  ];

  if (incident.components.length > 0) {
    fields.push({
      title: 'Affected Components',
      value: incident.components.join(', '),
      short: false
    });
  }

  if (incident.url) {
    fields.push({
      title: 'More Details',
      value: `<${incident.url}|View Incident>`,
      short: false
    });
  }

  return {
    username: 'ERIFY™ Incident Relay',
    icon_url: env.BRAND_AVATAR_URL || ERIFY_BRAND.avatar,
    attachments: [
      {
        color: mapping.slackColor,
        title: `${mapping.emoji} ${incident.title}`,
        title_link: incident.url,
        text: incident.description,
        fields: fields,
        footer: ERIFY_BRAND.footer,
        footer_icon: env.BRAND_AVATAR_URL || ERIFY_BRAND.avatar,
        ts: timestamp
      }
    ]
  };
}

/**
 * Create Discord embed payload
 */
function createDiscordMessage(incident, env) {
  const mapping = SEVERITY_MAPPING[incident.status] || SEVERITY_MAPPING.investigating;
  const timestamp = new Date(incident.created_at).toISOString();
  
  const fields = [
    {
      name: 'Status',
      value: `${mapping.emoji} ${incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}`,
      inline: true
    },
    {
      name: 'Severity',
      value: incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1),
      inline: true
    },
    {
      name: 'Service',
      value: incident.page_name,
      inline: true
    }
  ];

  if (incident.components.length > 0) {
    fields.push({
      name: 'Affected Components',
      value: incident.components.join(', '),
      inline: false
    });
  }

  const embed = {
    title: `${mapping.emoji} ${incident.title}`,
    description: incident.description,
    color: parseInt(mapping.color.replace('#', ''), 16),
    fields: fields,
    timestamp: timestamp,
    footer: {
      text: ERIFY_BRAND.footer,
      icon_url: env.BRAND_AVATAR_URL || ERIFY_BRAND.avatar
    }
  };

  if (incident.url) {
    embed.url = incident.url;
  }

  return {
    username: 'ERIFY™ Incident Relay',
    avatar_url: env.BRAND_AVATAR_URL || ERIFY_BRAND.avatar,
    embeds: [embed]
  };
}

/**
 * Send webhook with retry logic
 */
async function sendWebhook(url, payload, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ERIFY-IncidentRelay/1.0'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true, status: response.status };
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status} ${response.statusText}`);
      }

      // Server error (5xx), will retry
      if (attempt === maxRetries) {
        throw new Error(`Server error after ${maxRetries} attempts: ${response.status} ${response.statusText}`);
      }

      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      
    } catch (error) {
      if (attempt === maxRetries) {
        return { success: false, error: error.message };
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }
}

/**
 * Main request handler
 */
async function handleRequest(request, env) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Check authentication if token is configured
  if (env.RELAY_AUTH_TOKEN) {
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${env.RELAY_AUTH_TOKEN}`;
    
    if (!authHeader || authHeader !== expectedAuth) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  // Parse request body
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return new Response('Invalid JSON payload', { status: 400 });
  }

  // Normalize incident data
  const incident = normalizeIncident(payload);

  // Prepare results
  const results = {
    incident_id: incident.id,
    processed_at: new Date().toISOString(),
    results: {}
  };

  // Send to Slack if URL is configured
  if (env.SLACK_URL) {
    const slackMessage = createSlackMessage(incident, env);
    const slackResult = await sendWebhook(env.SLACK_URL, slackMessage);
    results.results.slack = slackResult;
  }

  // Send to Discord if URL is configured
  if (env.DISCORD_URL) {
    const discordMessage = createDiscordMessage(incident, env);
    const discordResult = await sendWebhook(env.DISCORD_URL, discordMessage);
    results.results.discord = discordResult;
  }

  // Check if any webhook was configured
  if (!env.SLACK_URL && !env.DISCORD_URL) {
    return new Response('No webhook URLs configured', { status: 500 });
  }

  // Return results
  const allSuccessful = Object.values(results.results).every(result => result.success);
  const statusCode = allSuccessful ? 200 : 207; // 207 Multi-Status for partial success

  return new Response(JSON.stringify(results, null, 2), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Powered-By': 'ERIFY™ Incident Relay'
    }
  });
}

/**
 * Health check endpoint
 */
async function handleHealthCheck() {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'ERIFY™ Incident Relay',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Main entry point
 */
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/health') {
    event.respondWith(handleHealthCheck());
  } else if (url.pathname === '/' || url.pathname === '/relay') {
    event.respondWith(handleRequest(event.request, process.env || {}));
  } else {
    event.respondWith(new Response('Not Found', { status: 404 }));
  }
});

// Export for module-based usage
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/health') {
      return handleHealthCheck();
    } else if (url.pathname === '/' || url.pathname === '/relay') {
      return handleRequest(request, env);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  }
};