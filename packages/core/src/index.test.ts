import { describe, it, expect } from 'vitest';
import { version } from './index';

describe('@reach/core', () => {
  describe('version', () => {
    it('should export a valid version string', () => {
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should be version 0.1.0', () => {
      expect(version).toBe('0.1.0');
    });
  });
});
