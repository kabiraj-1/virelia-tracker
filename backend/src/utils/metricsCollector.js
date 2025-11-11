import client from 'prom-client';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({
  register,
  prefix: 'virelia_',
  timeout: 10000,
});

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'virelia_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const activeUsers = new client.Gauge({
  name: 'virelia_active_users',
  help: 'Number of currently active users',
});

const locationsShared = new client.Counter({
  name: 'virelia_locations_shared_total',
  help: 'Total number of locations shared',
  labelNames: ['user_id'],
});

const videoCallsActive = new client.Gauge({
  name: 'virelia_video_calls_active',
  help: 'Number of currently active video calls',
});

const databaseQueryDuration = new client.Histogram({
  name: 'virelia_database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
});

const cacheHitRatio = new client.Gauge({
  name: 'virelia_cache_hit_ratio',
  help: 'Cache hit ratio',
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(activeUsers);
register.registerMetric(locationsShared);
register.registerMetric(videoCallsActive);
register.registerMetric(databaseQueryDuration);
register.registerMetric(cacheHitRatio);

export class MetricsCollector {
  static startRequestTimer(method, route) {
    return httpRequestDuration.startTimer({ method, route });
  }

  static incrementActiveUsers() {
    activeUsers.inc();
  }

  static decrementActiveUsers() {
    activeUsers.dec();
  }

  static recordLocationShare(userId) {
    locationsShared.inc({ user_id: userId });
  }

  static incrementVideoCalls() {
    videoCallsActive.inc();
  }

  static decrementVideoCalls() {
    videoCallsActive.dec();
  }

  static startDatabaseTimer(operation, collection) {
    return databaseQueryDuration.startTimer({ operation, collection });
  }

  static setCacheHitRatio(ratio) {
    cacheHitRatio.set(ratio);
  }

  static async getMetrics() {
    return register.metrics();
  }

  static getRegister() {
    return register;
  }
}

// Metrics endpoint middleware
export const metricsMiddleware = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
  } catch (error) {
    res.status(500).send('Error generating metrics');
  }
};