// @module: @reach/core/logging

/**
 * Logger Service
 *
 * Provides structured logging with OpenTelemetry integration,
 * automatic PII redaction, and trace context propagation.
 *
 * @packageDocumentation
 */

import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';
import { redact, RedactionOptions } from './pii-redactor.js';
import {
  getOrCreateTraceContext,
  formatTraceContext,
} from './context.js';

/**
 * Log level enumeration
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /** Log level (default: 'info') */
  level?: LogLevel;

  /** Whether to enable pretty printing (default: true in dev, false in prod) */
  prettyPrint?: boolean;

  /** Whether to enable PII redaction (default: true) */
  redactPII?: boolean;

  /** Custom redaction options */
  redactionOptions?: RedactionOptions;

  /** Log file path (optional, if undefined logs only to console) */
  logFile?: string;

  /** Component name for this logger */
  component?: string;

  /** Additional context to include in all logs */
  context?: Record<string, unknown>;
}

/**
 * Log metadata interface
 */
export interface LogMetadata {
  /** Component name */
  component?: string;

  /** Operation or function name */
  operation?: string;

  /** Trace context */
  traceId?: string;
  spanId?: string;
  sampled?: boolean;

  /** Error object */
  error?: Error;

  /** Duration in milliseconds */
  duration?: number;

  /** Additional custom fields */
  [key: string]: unknown;
}

/**
 * Logger class with structured logging and PII redaction
 */
export class Logger {
  private pinoLogger: PinoLogger;
  private config: Required<LoggerConfig>;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      level: config.level || LogLevel.INFO,
      prettyPrint: config.prettyPrint ?? process.env.NODE_ENV !== 'production',
      redactPII: config.redactPII ?? true,
      redactionOptions: config.redactionOptions || {},
      logFile: config.logFile || '',
      component: config.component || 'core',
      context: config.context || {},
    };

    const pinoOptions: LoggerOptions = {
      level: this.config.level,
      base: {
        component: this.config.component,
        ...this.config.context,
      },
    };

    // Configure transport for pretty printing or file output
    if (this.config.prettyPrint) {
      pinoOptions.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
    }

    this.pinoLogger = pino(pinoOptions);
  }

  /**
   * Prepares log metadata with trace context and PII redaction
   */
  private prepareMetadata(metadata: LogMetadata = {}): LogMetadata {
    let prepared = { ...metadata };

    // Add trace context if not present
    if (!prepared.traceId) {
      const traceContext = getOrCreateTraceContext();
      prepared = {
        ...prepared,
        ...formatTraceContext(traceContext),
      };
    }

    // Redact PII if enabled
    if (this.config.redactPII) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      prepared = redact(prepared, this.config.redactionOptions);
    }

    return prepared;
  }

  /**
   * Prepares log message with PII redaction
   */
  private prepareMessage(message: string): string {
    if (this.config.redactPII) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redact(message, this.config.redactionOptions);
    }
    return message;
  }

  /**
   * Logs a trace-level message
   *
   * @param message - Log message
   * @param metadata - Optional metadata
   *
   * @example
   * ```typescript
   * logger.trace('Function entry', { operation: 'processInput' });
   * ```
   */
  trace(message: string, metadata?: LogMetadata): void {
    const prepared = this.prepareMetadata(metadata);
    this.pinoLogger.trace(prepared, this.prepareMessage(message));
  }

  /**
   * Logs a debug-level message
   *
   * @param message - Log message
   * @param metadata - Optional metadata
   *
   * @example
   * ```typescript
   * logger.debug('Processing data', { itemCount: 42 });
   * ```
   */
  debug(message: string, metadata?: LogMetadata): void {
    const prepared = this.prepareMetadata(metadata);
    this.pinoLogger.debug(prepared, this.prepareMessage(message));
  }

  /**
   * Logs an info-level message
   *
   * @param message - Log message
   * @param metadata - Optional metadata
   *
   * @example
   * ```typescript
   * logger.info('Service started', { port: 3000 });
   * ```
   */
  info(message: string, metadata?: LogMetadata): void {
    const prepared = this.prepareMetadata(metadata);
    this.pinoLogger.info(prepared, this.prepareMessage(message));
  }

  /**
   * Logs a warning-level message
   *
   * @param message - Log message
   * @param metadata - Optional metadata
   *
   * @example
   * ```typescript
   * logger.warn('Rate limit approaching', { usage: 90 });
   * ```
   */
  warn(message: string, metadata?: LogMetadata): void {
    const prepared = this.prepareMetadata(metadata);
    this.pinoLogger.warn(prepared, this.prepareMessage(message));
  }

  /**
   * Logs an error-level message
   *
   * @param message - Log message
   * @param metadata - Optional metadata (can include error object)
   *
   * @example
   * ```typescript
   * try {
   *   await riskyOperation();
   * } catch (error) {
   *   logger.error('Operation failed', { error, operation: 'riskyOperation' });
   * }
   * ```
   */
  error(message: string, metadata?: LogMetadata): void {
    const prepared = this.prepareMetadata(metadata);

    // Special handling for error objects
    if (prepared.error instanceof Error) {
      const errorInfo = {
        ...prepared,
        error: {
          name: prepared.error.name,
          message: prepared.error.message,
          stack: prepared.error.stack,
        },
      };
      this.pinoLogger.error(errorInfo, this.prepareMessage(message));
    } else {
      this.pinoLogger.error(prepared, this.prepareMessage(message));
    }
  }

  /**
   * Logs a fatal-level message
   *
   * @param message - Log message
   * @param metadata - Optional metadata
   *
   * @example
   * ```typescript
   * logger.fatal('Critical system failure', { component: 'database' });
   * ```
   */
  fatal(message: string, metadata?: LogMetadata): void {
    const prepared = this.prepareMetadata(metadata);
    this.pinoLogger.fatal(prepared, this.prepareMessage(message));
  }

  /**
   * Creates a child logger with additional context
   *
   * @param context - Additional context to add to all logs
   * @returns A new child logger
   *
   * @example
   * ```typescript
   * const requestLogger = logger.child({ requestId: '123' });
   * requestLogger.info('Processing request'); // Includes requestId
   * ```
   */
  child(context: Record<string, unknown>): Logger {
    return new Logger({
      ...this.config,
      context: {
        ...this.config.context,
        ...context,
      },
    });
  }

  /**
   * Times an async operation and logs its duration
   *
   * @param operation - Operation name
   * @param fn - Async function to execute
   * @param metadata - Optional metadata
   * @returns The result of the function
   *
   * @example
   * ```typescript
   * const result = await logger.time('database.query', async () => {
   *   return await db.query('SELECT * FROM users');
   * }, { query: 'users' });
   * ```
   */
  async time<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata: LogMetadata = {}
  ): Promise<T> {
    const start = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - start;

      this.info(`${operation} completed`, {
        ...metadata,
        operation,
        duration,
        status: 'success',
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;

      this.error(`${operation} failed`, {
        ...metadata,
        operation,
        duration,
        status: 'error',
        error: error as Error,
      });

      throw error;
    }
  }

  /**
   * Flushes any buffered logs (useful before process exit)
   */
  async flush(): Promise<void> {
    return new Promise((resolve) => {
      this.pinoLogger.flush(() => resolve());
    });
  }
}

/**
 * Creates a new logger instance
 *
 * @param config - Logger configuration
 * @returns A new logger
 *
 * @example
 * ```typescript
 * const logger = createLogger({ component: 'voice', level: LogLevel.DEBUG });
 * logger.info('Voice service initialized');
 * ```
 */
export function createLogger(config: LoggerConfig = {}): Logger {
  return new Logger(config);
}

/**
 * Default logger instance for convenience
 */
export const logger = createLogger();
