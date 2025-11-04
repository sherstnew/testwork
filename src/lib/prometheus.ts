import client from 'prom-client';

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});

export const clientSessions = new client.Histogram({
  name: 'client_sessions',
  help: 'Number of active sessions at the moment',
  buckets: [0, 1, 5, 10, 15],
});

export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  buckets: [0.1, 0.2, 0.5, 1, 2, 5, 10],
  labelNames: ["method", "route", "status_code"]
});