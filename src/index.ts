/**
 * ERIFY Incident Relay Worker
 * Provides health monitoring and status badge endpoints
 */

export interface Env {
  RELAY_STATUS?: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow GET requests for our endpoints
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      switch (path) {
        case '/health':
          return handleHealthCheck(corsHeaders);
        case '/badge':
          return handleBadgeEndpoint(corsHeaders);
        case '/':
          return handleRoot(corsHeaders);
        default:
          return new Response('Not Found', {
            status: 404,
            headers: corsHeaders,
          });
      }
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

/**
 * Health check endpoint
 * Returns current status, service name, and timestamp
 */
function handleHealthCheck(corsHeaders: Record<string, string>): Response {
  const healthData = {
    status: 'ok',
    name: 'erify-incident-relay',
    time: new Date().toISOString(),
  };

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * Badge endpoint for Shields.io
 * Returns a Shields.io-compatible schema
 */
function handleBadgeEndpoint(corsHeaders: Record<string, string>): Response {
  const badgeData = {
    schemaVersion: 1,
    label: 'Relay',
    message: 'Online / OK',
    color: 'brightgreen',
  };

  return new Response(JSON.stringify(badgeData, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=60', // Cache for 1 minute
    },
  });
}

/**
 * Root endpoint
 * Returns basic service information
 */
function handleRoot(corsHeaders: Record<string, string>): Response {
  const serviceInfo = {
    service: 'ERIFY Incident Relay Worker',
    version: '1.0.0',
    description: 'Flame-Powered Discord Bot Relay for the ERIFY™ community',
    endpoints: {
      health: '/health',
      badge: '/badge',
    },
    time: new Date().toISOString(),
  };

  return new Response(JSON.stringify(serviceInfo, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}