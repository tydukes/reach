// @module: @reach/core/logging

/**
 * Logging and Telemetry
 *
 * Provides structured logging, metrics collection, and trace context
 * management for the REACH framework.
 *
 * @packageDocumentation
 */

// Logger
export {
  Logger,
  LogLevel,
  LoggerConfig,
  LogMetadata,
  createLogger,
  logger,
} from './logger.js';

// PII Redaction
export {
  redact,
  redactString,
  redactObject,
  isSensitiveKey,
  addSensitiveKey,
  RedactionOptions,
} from './pii-redactor.js';

// Trace Context
export {
  TraceContext,
  getCurrentTraceContext,
  createTraceContext,
  getOrCreateTraceContext,
  extractTraceContext,
  formatTraceContext,
  withTraceContext,
} from './context.js';

// Metrics
export {
  MetricType,
  MetricLabels,
  MetricsCollector,
  metricsCollector,
  recordCounter,
  recordHistogram,
  recordDuration,
  recordError,
  startTimer,
} from './metrics.js';
