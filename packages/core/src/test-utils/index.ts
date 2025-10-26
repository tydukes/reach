/**
 * Test utilities for REACH packages
 * Shared helpers and mocks for testing
 */

/**
 * Creates a mock logger for testing
 */
export function createMockLogger() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
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
export function createSpy<T extends (...args: any[]) => any>(
  implementation?: T
) {
  return vi.fn(implementation);
}
