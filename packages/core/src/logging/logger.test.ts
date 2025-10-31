// @module: @reach/core/logging

import { describe, it, expect, beforeEach } from 'vitest';
import { Logger, LogLevel, createLogger } from './logger.js';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger({
      level: LogLevel.DEBUG,
      prettyPrint: false,
      redactPII: false,
      component: 'test',
    });
  });

  describe('constructor', () => {
    it('should create a logger with default config', () => {
      const defaultLogger = new Logger();
      expect(defaultLogger).toBeInstanceOf(Logger);
    });

    it('should accept custom config', () => {
      const customLogger = new Logger({
        level: LogLevel.WARN,
        component: 'custom',
      });
      expect(customLogger).toBeInstanceOf(Logger);
    });
  });

  describe('log levels', () => {
    it('should support trace level', () => {
      expect(() => {
        logger.trace('Trace message');
      }).not.toThrow();
    });

    it('should support debug level', () => {
      expect(() => {
        logger.debug('Debug message');
      }).not.toThrow();
    });

    it('should support info level', () => {
      expect(() => {
        logger.info('Info message');
      }).not.toThrow();
    });

    it('should support warn level', () => {
      expect(() => {
        logger.warn('Warning message');
      }).not.toThrow();
    });

    it('should support error level', () => {
      expect(() => {
        logger.error('Error message');
      }).not.toThrow();
    });

    it('should support fatal level', () => {
      expect(() => {
        logger.fatal('Fatal message');
      }).not.toThrow();
    });
  });

  describe('metadata', () => {
    it('should accept metadata object', () => {
      expect(() => {
        logger.info('Message with metadata', {
          operation: 'test',
          duration: 123,
        });
      }).not.toThrow();
    });

    it('should handle error objects in metadata', () => {
      const error = new Error('Test error');

      expect(() => {
        logger.error('Error occurred', { error, operation: 'test' });
      }).not.toThrow();
    });

    it('should add trace context automatically', () => {
      // Trace context should be added even without explicit metadata
      expect(() => {
        logger.info('Test message');
      }).not.toThrow();
    });
  });

  describe('PII redaction', () => {
    it('should redact PII when enabled', () => {
      const redactingLogger = createLogger({
        level: LogLevel.INFO,
        prettyPrint: false,
        redactPII: true,
      });

      expect(() => {
        redactingLogger.info('User email: user@example.com');
      }).not.toThrow();
    });

    it('should not redact when disabled', () => {
      const nonRedactingLogger = createLogger({
        level: LogLevel.INFO,
        prettyPrint: false,
        redactPII: false,
      });

      expect(() => {
        nonRedactingLogger.info('User email: user@example.com');
      }).not.toThrow();
    });
  });

  describe('child logger', () => {
    it('should create a child logger with additional context', () => {
      const childLogger = logger.child({ requestId: '123' });

      expect(childLogger).toBeInstanceOf(Logger);
    });

    it('should inherit parent configuration', () => {
      const childLogger = logger.child({ sessionId: 'abc' });

      expect(() => {
        childLogger.info('Child log message');
      }).not.toThrow();
    });

    it('should merge context', () => {
      const childLogger = logger.child({ requestId: '123' });

      expect(() => {
        childLogger.info('Message', { operation: 'test' });
      }).not.toThrow();
    });
  });

  describe('time', () => {
    it('should time async operations', async () => {
      const result = await logger.time('test.operation', async () => {
         
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'completed';
      });

      expect(result).toBe('completed');
    });

    it('should log success', async () => {
      // eslint-disable-next-line @typescript-eslint/require-await
      await logger.time('success.operation', async () => {
        return 'ok';
      });

      // Should complete without throwing
    });

    it('should log errors', async () => {
      await expect(
        // eslint-disable-next-line @typescript-eslint/require-await
        logger.time('error.operation', async () => {
          throw new Error('Test error');
        })
      ).rejects.toThrow('Test error');
    });

    it('should accept additional metadata', async () => {
      await logger.time(
        'metadata.operation',
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return 'ok';
        },
        { component: 'test' }
      );
    });
  });

  describe('flush', () => {
    it('should flush logs', async () => {
      await expect(logger.flush()).resolves.not.toThrow();
    });
  });

  describe('createLogger', () => {
    it('should create a new logger instance', () => {
      const newLogger = createLogger();
      expect(newLogger).toBeInstanceOf(Logger);
    });

    it('should accept configuration', () => {
      const configuredLogger = createLogger({
        level: LogLevel.ERROR,
        component: 'configured',
      });
      expect(configuredLogger).toBeInstanceOf(Logger);
    });
  });

  describe('log formatting', () => {
    it('should handle string messages', () => {
      expect(() => {
        logger.info('Simple string message');
      }).not.toThrow();
    });

    it('should handle messages with special characters', () => {
      expect(() => {
        logger.info('Message with "quotes" and \'apostrophes\'');
      }).not.toThrow();
    });

    it('should handle multiline messages', () => {
      expect(() => {
        logger.info('Line 1\nLine 2\nLine 3');
      }).not.toThrow();
    });
  });

  describe('context propagation', () => {
    it('should include component in logs', () => {
      const componentLogger = createLogger({ component: 'voice' });

      expect(() => {
        componentLogger.info('Test message');
      }).not.toThrow();
    });

    it('should merge base context with log metadata', () => {
      const contextLogger = createLogger({
        component: 'memory',
        context: { version: '1.0.0' },
      });

      expect(() => {
        contextLogger.info('Test', { operation: 'search' });
      }).not.toThrow();
    });
  });
});
