# REACH Logging & Telemetry

Structured logging and telemetry infrastructure for the REACH framework, built on OpenTelemetry with automatic PII redaction.

## Features

- **Structured Logging**: JSON-formatted logs with trace context
- **PII Redaction**: Automatic redaction of sensitive information
- **Trace Context**: Distributed tracing with OpenTelemetry
- **Metrics Collection**: Performance and operational metrics
- **Multiple Transports**: Console and file output
- **Type-Safe**: Full TypeScript support

## Quick Start

```typescript
import { createLogger, LogLevel } from '@reach/core';

// Create a logger
const logger = createLogger({
  level: LogLevel.INFO,
  component: 'my-service',
});

// Log messages
logger.info('Service started', { port: 3000 });
logger.warn('Rate limit approaching', { usage: 90 });
logger.error('Operation failed', { error, operation: 'processData' });
```

## Logger Configuration

### Basic Configuration

```typescript
const logger = createLogger({
  level: LogLevel.DEBUG,           // Log level
  component: 'voice',               // Component name
  prettyPrint: true,                // Human-readable format (dev)
  redactPII: true,                  // Enable PII redaction
});
```

### Log Levels

Available log levels in order of severity:

- `TRACE`: Detailed debugging information
- `DEBUG`: Debug information
- `INFO`: Informational messages
- `WARN`: Warning messages
- `ERROR`: Error conditions
- `FATAL`: Fatal errors

### Child Loggers

Create child loggers with additional context:

```typescript
const requestLogger = logger.child({ requestId: '123', userId: 'abc' });
requestLogger.info('Processing request');
// Logs include both requestId and userId
```

## PII Redaction

The logging system automatically redacts personally identifiable information (PII) to protect user privacy.

### Automatically Redacted

- Email addresses
- Phone numbers
- Social Security Numbers
- Credit card numbers
- IP addresses
- API keys
- File paths containing usernames

### Example

```typescript
logger.info('User registration', {
  email: 'user@example.com',      // Becomes [REDACTED]
  phone: '555-1234',               // Becomes [REDACTED]
  name: 'John',                    // Not redacted
});
```

### Sensitive Keys

These keys are always redacted in objects:

- `password`, `passwd`
- `secret`, `token`
- `apiKey`, `api_key`
- `accessToken`, `refreshToken`
- `privateKey`, `private_key`
- `creditCard`, `ssn`

### Custom Sensitive Keys

Add your own sensitive keys:

```typescript
import { addSensitiveKey } from '@reach/core';

addSensitiveKey('customSecret');
addSensitiveKey('internalToken');
```

## Trace Context

Every log entry includes trace context for distributed tracing:

```typescript
// Logs automatically include trace IDs
logger.info('Processing started');
// {
//   "msg": "Processing started",
//   "traceId": "abc123...",
//   "spanId": "def456...",
//   "sampled": true
// }
```

### Manual Trace Context

```typescript
import { createTraceContext, withTraceContext } from '@reach/core';

const ctx = createTraceContext();
await withTraceContext(ctx, async () => {
  // All logs within this context share the same trace ID
  logger.info('Step 1');
  logger.info('Step 2');
});
```

## Metrics Collection

Record performance and operational metrics:

```typescript
import { metricsCollector } from '@reach/core';

// Record a counter
metricsCollector.recordCounter('api.requests', 1, {
  component: 'voice',
  status: 'success',
});

// Record a histogram
metricsCollector.recordHistogram('response.time', 123, {
  endpoint: '/api/stt',
});

// Time an operation
const endTimer = metricsCollector.startTimer('database.query');
try {
  await db.query();
  endTimer({ status: 'success' });
} catch (error) {
  endTimer({ status: 'error' });
  throw error;
}
```

### Timing Functions

Use the `time` method to automatically measure duration:

```typescript
const result = await logger.time('database.query', async () => {
  return await db.query('SELECT * FROM users');
});
// Automatically logs duration and status
```

### Decorator for Timing

```typescript
import { metricsCollector } from '@reach/core';

class MyService {
  @metricsCollector.timed('service.process')
  async process(data: any) {
    // Duration automatically recorded
    return processData(data);
  }
}
```

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// Good
logger.debug('Entering function', { args });
logger.info('User logged in', { userId });
logger.warn('Cache miss', { key });
logger.error('Failed to save', { error });

// Avoid
logger.info('x = 5');  // Too verbose
logger.error('Success'); // Wrong level
```

### 2. Include Contextual Information

```typescript
// Good
logger.error('Failed to process payment', {
  operation: 'processPayment',
  userId: user.id,
  amount: payment.amount,
  error,
});

// Avoid
logger.error('Payment failed');  // Not enough context
```

### 3. Use Child Loggers for Request Context

```typescript
app.use((req, res, next) => {
  req.logger = logger.child({
    requestId: req.id,
    method: req.method,
    path: req.path,
  });
  next();
});

// In route handlers
req.logger.info('Processing request');
```

### 4. Handle Errors Consistently

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', {
    operation: 'riskyOperation',
    error,
    context: additionalInfo,
  });
  throw error;  // Re-throw after logging
}
```

### 5. Use Metrics for Performance Monitoring

```typescript
// Monitor key operations
metricsCollector.recordDuration('voice.stt', duration, {
  model: 'whisper',
  status: 'success',
});

// Track error rates
metricsCollector.recordError('memory', error.name, {
  severity: 'high',
});
```

## Configuration Examples

### Development Setup

```typescript
const logger = createLogger({
  level: LogLevel.DEBUG,
  prettyPrint: true,
  redactPII: false,  // Disable for easier debugging
  component: 'dev',
});
```

### Production Setup

```typescript
const logger = createLogger({
  level: LogLevel.INFO,
  prettyPrint: false,
  redactPII: true,   // Always enable in production
  component: 'prod',
  logFile: '/var/log/reach/app.log',
});
```

### Testing Setup

```typescript
import { createTestLogger } from '@reach/core/test-utils';

const logger = createTestLogger(LogLevel.ERROR);
// Only logs errors during tests
```

## Troubleshooting

### PII Not Being Redacted

- Ensure `redactPII: true` in logger config
- Check if the pattern matches (see PII patterns in source)
- Add custom patterns if needed

### Missing Trace IDs

- Trace IDs are automatically generated
- Use `withTraceContext` for manual control
- Check OpenTelemetry configuration

### Performance Impact

- Use appropriate log levels (avoid TRACE/DEBUG in production)
- Consider sampling for high-frequency logs
- Use async log writes for file outputs

## API Reference

See TypeScript definitions for complete API documentation:

- `Logger` - Main logger class
- `LogLevel` - Log level enumeration
- `MetricsCollector` - Metrics collection
- `TraceContext` - Trace context management
- `redact()` - PII redaction utilities

## Examples

See `src/logging/*.test.ts` for comprehensive usage examples.
