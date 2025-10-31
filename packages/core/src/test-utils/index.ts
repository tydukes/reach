// @module: @reach/core

/**
 * Test utilities for REACH packages
 * Shared helpers and mocks for testing
 */

import { vi } from 'vitest';
import { Logger, LogLevel } from '../logging/logger.js';

/**
 * Creates a mock logger for testing
 */
export function createMockLogger() {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn(() => createMockLogger()),
    time: vi.fn(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
      async (_operation: string, fn: () => Promise<any>) => fn()
    ),
    flush: vi.fn(async () => {}),
  };
}

/**
 * Creates a test logger with configurable behavior
 */
export function createTestLogger(level: LogLevel = LogLevel.ERROR) {
  return new Logger({
    level,
    prettyPrint: false,
    redactPII: false,
    component: 'test',
  });
}

/**
 * Delays execution for testing async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a spy for testing function calls
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSpy<T extends (...args: any[]) => any>(
  implementation?: T
) {
  return implementation ? vi.fn(implementation) : vi.fn();
}
