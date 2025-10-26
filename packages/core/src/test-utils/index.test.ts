import { describe, it, expect, vi } from 'vitest';
import { createMockLogger, delay, createSpy } from './index';

describe('Test Utilities', () => {
  describe('createMockLogger', () => {
    it('should create a mock logger with all methods', () => {
      const logger = createMockLogger();

      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.debug).toBeDefined();
    });

    it('should track function calls', () => {
      const logger = createMockLogger();

      logger.info('test message');
      logger.error('error message');

      expect(logger.info).toHaveBeenCalledWith('test message');
      expect(logger.error).toHaveBeenCalledWith('error message');
      expect(logger.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('delay', () => {
    it('should delay execution for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(95); // Allow small margin
      expect(elapsed).toBeLessThan(150);
    });
  });

  describe('createSpy', () => {
    it('should create a spy function', () => {
      const spy = createSpy();

      expect(vi.isMockFunction(spy)).toBe(true);
    });

    it('should track function calls', () => {
      const spy = createSpy();

      spy('arg1', 'arg2');
      spy('arg3');

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('arg1', 'arg2');
      expect(spy).toHaveBeenCalledWith('arg3');
    });

    it('should use custom implementation', () => {
      const spy = createSpy((a: number, b: number) => a + b);

      const result = spy(2, 3);

      expect(result).toBe(5);
      expect(spy).toHaveBeenCalledWith(2, 3);
    });
  });
});
