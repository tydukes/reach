// @module: @reach/core/logging

/**
 * Trace Context Management
 *
 * Provides utilities for managing trace context across async operations,
 * enabling correlation of logs, metrics, and traces.
 *
 * @packageDocumentation
 */

import { trace, context, ROOT_CONTEXT } from '@opentelemetry/api';
import { randomBytes } from 'crypto';

/**
 * Trace context information
 */
export interface TraceContext {
  /** Trace ID (hex string) */
  traceId: string;

  /** Span ID (hex string) */
  spanId: string;

  /** Whether this trace is sampled */
  sampled: boolean;
}

/**
 * Generates a random trace ID
 *
 * @returns A 32-character hex string
 */
function generateTraceId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Generates a random span ID
 *
 * @returns A 16-character hex string
 */
function generateSpanId(): string {
  return randomBytes(8).toString('hex');
}

/**
 * Gets the current trace context from the active span
 *
 * @returns The current trace context, or undefined if no active span
 *
 * @example
 * ```typescript
 * const ctx = getCurrentTraceContext();
 * if (ctx) {
 *   console.log(`Trace ID: ${ctx.traceId}`);
 * }
 * ```
 */
export function getCurrentTraceContext(): TraceContext | undefined {
  const span = trace.getActiveSpan();

  if (!span) {
    return undefined;
  }

  const spanContext = span.spanContext();

  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    sampled: (spanContext.traceFlags & 0x01) === 0x01,
  };
}

/**
 * Creates a new trace context
 *
 * @param sampled - Whether the trace should be sampled (default: true)
 * @returns A new trace context
 *
 * @example
 * ```typescript
 * const ctx = createTraceContext();
 * console.log(`Created trace: ${ctx.traceId}`);
 * ```
 */
export function createTraceContext(sampled = true): TraceContext {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    sampled,
  };
}

/**
 * Gets or creates a trace context
 *
 * If there's an active span, returns its context.
 * Otherwise, creates a new trace context.
 *
 * @returns A trace context
 *
 * @example
 * ```typescript
 * const ctx = getOrCreateTraceContext();
 * logger.info('Operation started', { traceId: ctx.traceId });
 * ```
 */
export function getOrCreateTraceContext(): TraceContext {
  return getCurrentTraceContext() || createTraceContext();
}

/**
 * Extracts trace context from log metadata
 *
 * @param metadata - Log metadata object
 * @returns Extracted trace context or undefined
 */
export function extractTraceContext(
  metadata: Record<string, unknown>
): TraceContext | undefined {
  if (
    typeof metadata.traceId === 'string' &&
    typeof metadata.spanId === 'string' &&
    typeof metadata.sampled === 'boolean'
  ) {
    return {
      traceId: metadata.traceId,
      spanId: metadata.spanId,
      sampled: metadata.sampled,
    };
  }

  return undefined;
}

/**
 * Formats trace context for logging
 *
 * @param ctx - The trace context
 * @returns An object with trace fields for logging
 *
 * @example
 * ```typescript
 * const ctx = getOrCreateTraceContext();
 * logger.info('Operation completed', formatTraceContext(ctx));
 * ```
 */
export function formatTraceContext(ctx: TraceContext): Record<string, unknown> {
  return {
    traceId: ctx.traceId,
    spanId: ctx.spanId,
    sampled: ctx.sampled,
  };
}

/**
 * Executes a function with trace context
 *
 * @param _ctx - The trace context to use (reserved for future use)
 * @param fn - The function to execute
 * @returns The result of the function
 *
 * @example
 * ```typescript
 * const ctx = createTraceContext();
 * await withTraceContext(ctx, async () => {
 *   // All logging in here will include the trace context
 *   logger.info('Processing request');
 * });
 * ```
 */
export async function withTraceContext<T>(
  _ctx: TraceContext,
  fn: () => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer('@reach/core');
  const span = tracer.startSpan('operation', {}, ROOT_CONTEXT);

  try {
    return await context.with(trace.setSpan(ROOT_CONTEXT, span), fn);
  } finally {
    span.end();
  }
}
