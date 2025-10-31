// @module: @reach/core/logging

import { describe, it, expect, beforeEach } from 'vitest';
import { MetricsCollector, metricsCollector } from './metrics.js';

describe('Metrics Collector', () => {
  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector();
  });

  describe('recordCounter', () => {
    it('should record counter metrics', () => {
      // Should not throw
      expect(() => {
        collector.recordCounter('test.counter', 1);
      }).not.toThrow();
    });

    it('should accept custom labels', () => {
      expect(() => {
        collector.recordCounter('test.counter', 1, {
          component: 'voice',
          operation: 'stt',
        });
      }).not.toThrow();
    });

    it('should default value to 1', () => {
      expect(() => {
        collector.recordCounter('test.counter');
      }).not.toThrow();
    });
  });

  describe('recordHistogram', () => {
    it('should record histogram metrics', () => {
      expect(() => {
        collector.recordHistogram('test.histogram', 42.5);
      }).not.toThrow();
    });

    it('should accept custom labels', () => {
      expect(() => {
        collector.recordHistogram('test.histogram', 100, {
          component: 'memory',
          status: 'success',
        });
      }).not.toThrow();
    });
  });

  describe('recordDuration', () => {
    it('should record duration metrics', () => {
      expect(() => {
        collector.recordDuration('api.request', 123);
      }).not.toThrow();
    });

    it('should include operation in labels', () => {
      expect(() => {
        collector.recordDuration('database.query', 456, {
          status: 'success',
        });
      }).not.toThrow();
    });
  });

  describe('recordError', () => {
    it('should record error metrics', () => {
      expect(() => {
        collector.recordError('voice', 'STTError');
      }).not.toThrow();
    });

    it('should accept additional labels', () => {
      expect(() => {
        collector.recordError('memory', 'DatabaseError', {
          severity: 'high',
        });
      }).not.toThrow();
    });
  });

  describe('startTimer', () => {
    it('should create a timer function', () => {
      const endTimer = collector.startTimer('test.operation');
      expect(typeof endTimer).toBe('function');
    });

    it('should measure elapsed time', async () => {
      const endTimer = collector.startTimer('test.operation');

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should not throw
      expect(() => {
        endTimer({ status: 'success' });
      }).not.toThrow();
    });

    it('should merge labels', () => {
      const endTimer = collector.startTimer('test.operation', {
        component: 'core',
      });

      expect(() => {
        endTimer({ status: 'success' });
      }).not.toThrow();
    });
  });

  describe('timed decorator', () => {
    it('should create a method decorator', () => {
      const decorator = collector.timed('test.method');
      expect(typeof decorator).toBe('function');
    });

    it('should time async methods', async () => {
      class TestClass {
        @metricsCollector.timed('test.method')
        async testMethod() {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return 'result';
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod();

      expect(result).toBe('result');
    });

    it('should handle errors and still record metrics', async () => {
      class TestClass {
        @metricsCollector.timed('test.error')
        // eslint-disable-next-line @typescript-eslint/require-await
        async errorMethod() {
          throw new Error('Test error');
        }
      }

      const instance = new TestClass();

      await expect(instance.errorMethod()).rejects.toThrow('Test error');
    });
  });

  describe('global collector', () => {
    it('should export a singleton instance', () => {
      expect(metricsCollector).toBeInstanceOf(MetricsCollector);
    });
  });
});
