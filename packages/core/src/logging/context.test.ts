// @module: @reach/core/logging

import { describe, it, expect } from 'vitest';
import {
  createTraceContext,
  formatTraceContext,
  extractTraceContext,
} from './context.js';

describe('Trace Context', () => {
  describe('createTraceContext', () => {
    it('should create a valid trace context', () => {
      const ctx = createTraceContext();

      expect(ctx).toHaveProperty('traceId');
      expect(ctx).toHaveProperty('spanId');
      expect(ctx).toHaveProperty('sampled');

      expect(typeof ctx.traceId).toBe('string');
      expect(typeof ctx.spanId).toBe('string');
      expect(typeof ctx.sampled).toBe('boolean');
    });

    it('should create unique trace IDs', () => {
      const ctx1 = createTraceContext();
      const ctx2 = createTraceContext();

      expect(ctx1.traceId).not.toBe(ctx2.traceId);
      expect(ctx1.spanId).not.toBe(ctx2.spanId);
    });

    it('should have correct trace ID length (32 hex chars)', () => {
      const ctx = createTraceContext();

      expect(ctx.traceId).toHaveLength(32);
      expect(ctx.traceId).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should have correct span ID length (16 hex chars)', () => {
      const ctx = createTraceContext();

      expect(ctx.spanId).toHaveLength(16);
      expect(ctx.spanId).toMatch(/^[0-9a-f]{16}$/);
    });

    it('should default to sampled=true', () => {
      const ctx = createTraceContext();
      expect(ctx.sampled).toBe(true);
    });

    it('should allow setting sampled=false', () => {
      const ctx = createTraceContext(false);
      expect(ctx.sampled).toBe(false);
    });
  });

  describe('formatTraceContext', () => {
    it('should format trace context for logging', () => {
      const ctx = createTraceContext();
      const formatted = formatTraceContext(ctx);

      expect(formatted).toEqual({
        traceId: ctx.traceId,
        spanId: ctx.spanId,
        sampled: ctx.sampled,
      });
    });

    it('should preserve all fields', () => {
      const ctx = {
        traceId: 'abc123',
        spanId: 'def456',
        sampled: false,
      };
      const formatted = formatTraceContext(ctx);

      expect(formatted.traceId).toBe('abc123');
      expect(formatted.spanId).toBe('def456');
      expect(formatted.sampled).toBe(false);
    });
  });

  describe('extractTraceContext', () => {
    it('should extract trace context from metadata', () => {
      const metadata = {
        traceId: 'abc123',
        spanId: 'def456',
        sampled: true,
        other: 'data',
      };

      const ctx = extractTraceContext(metadata);

      expect(ctx).toEqual({
        traceId: 'abc123',
        spanId: 'def456',
        sampled: true,
      });
    });

    it('should return undefined if trace context is incomplete', () => {
      expect(extractTraceContext({ traceId: 'abc' })).toBeUndefined();
      expect(extractTraceContext({ spanId: 'def' })).toBeUndefined();
      expect(extractTraceContext({ sampled: true })).toBeUndefined();
    });

    it('should return undefined for empty metadata', () => {
      expect(extractTraceContext({})).toBeUndefined();
    });
  });
});
