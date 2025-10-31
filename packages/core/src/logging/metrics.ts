// @module: @reach/core/logging

/**
 * Metrics Collection
 *
 * Provides utilities for collecting and recording metrics for key operations.
 * Uses OpenTelemetry metrics for standardized metric collection.
 *
 * @packageDocumentation
 */

import { metrics, Counter, Histogram, ValueType } from '@opentelemetry/api';

/**
 * Metric type enumeration
 */
export enum MetricType {
  /** Counter - monotonically increasing value */
  COUNTER = 'counter',

  /** Histogram - distribution of values */
  HISTOGRAM = 'histogram',

  /** Gauge - current value that can go up or down */
  GAUGE = 'gauge',
}

/**
 * Metric labels for categorization
 */
export interface MetricLabels {
  /** Component or package name */
  component?: string;

  /** Operation name */
  operation?: string;

  /** Status code or result */
  status?: string;

  /** Custom labels */
  [key: string]: string | undefined;
}

/**
 * Metrics collector singleton
 */
export class MetricsCollector {
  private meter = metrics.getMeter('@reach/core', '0.1.0');
  private counters = new Map<string, Counter>();
  private histograms = new Map<string, Histogram>();

  /**
   * Records a counter metric
   *
   * @param name - Metric name
   * @param value - Value to add (default: 1)
   * @param labels - Optional metric labels
   *
   * @example
   * ```typescript
   * metrics.recordCounter('api.requests', 1, {
   *   component: 'voice',
   *   operation: 'stt',
   *   status: 'success'
   * });
   * ```
   */
  recordCounter(name: string, value = 1, labels: MetricLabels = {}): void {
    let counter = this.counters.get(name);

    if (!counter) {
      counter = this.meter.createCounter(name, {
        description: `Counter for ${name}`,
        valueType: ValueType.INT,
      });
      this.counters.set(name, counter);
    }

    counter.add(value, labels);
  }

  /**
   * Records a histogram metric (for distributions)
   *
   * @param name - Metric name
   * @param value - Value to record
   * @param labels - Optional metric labels
   *
   * @example
   * ```typescript
   * const startTime = Date.now();
   * // ... perform operation ...
   * const duration = Date.now() - startTime;
   * metrics.recordHistogram('operation.duration', duration, {
   *   component: 'memory',
   *   operation: 'search'
   * });
   * ```
   */
  recordHistogram(name: string, value: number, labels: MetricLabels = {}): void {
    let histogram = this.histograms.get(name);

    if (!histogram) {
      histogram = this.meter.createHistogram(name, {
        description: `Histogram for ${name}`,
        valueType: ValueType.DOUBLE,
      });
      this.histograms.set(name, histogram);
    }

    histogram.record(value, labels);
  }

  /**
   * Records operation duration
   *
   * @param operation - Operation name
   * @param duration - Duration in milliseconds
   * @param labels - Optional metric labels
   *
   * @example
   * ```typescript
   * const start = Date.now();
   * await performOperation();
   * metrics.recordDuration('api.request', Date.now() - start, {
   *   status: 'success'
   * });
   * ```
   */
  recordDuration(
    operation: string,
    duration: number,
    labels: MetricLabels = {}
  ): void {
    this.recordHistogram(
      'operation.duration',
      duration,
      { operation, ...labels }
    );
  }

  /**
   * Records an error
   *
   * @param component - Component name
   * @param error - Error type or message
   * @param labels - Optional metric labels
   *
   * @example
   * ```typescript
   * try {
   *   await riskyOperation();
   * } catch (error) {
   *   metrics.recordError('voice', error.name);
   * }
   * ```
   */
  recordError(
    component: string,
    error: string,
    labels: MetricLabels = {}
  ): void {
    this.recordCounter(
      'errors.total',
      1,
      { component, error, ...labels }
    );
  }

  /**
   * Creates a timer for measuring operation duration
   *
   * @param operation - Operation name
   * @param labels - Optional metric labels
   * @returns A function to call when the operation completes
   *
   * @example
   * ```typescript
   * const endTimer = metrics.startTimer('database.query', {
   *   component: 'memory'
   * });
   *
   * try {
   *   await executeQuery();
   *   endTimer({ status: 'success' });
   * } catch (error) {
   *   endTimer({ status: 'error' });
   * }
   * ```
   */
  startTimer(
    operation: string,
    labels: MetricLabels = {}
  ): (additionalLabels?: MetricLabels) => void {
    const startTime = Date.now();

    return (additionalLabels: MetricLabels = {}) => {
      const duration = Date.now() - startTime;
      this.recordDuration(operation, duration, { ...labels, ...additionalLabels });
    };
  }

  /**
   * Decorator for automatically timing async functions
   *
   * @param operation - Operation name
   * @param labels - Optional metric labels
   * @returns Method decorator
   *
   * @example
   * ```typescript
   * class MyService {
   *   @metrics.timed('service.process')
   *   async process(data: any) {
   *     // Duration will be automatically recorded
   *   }
   * }
   * ```
   */
  timed(operation: string, labels: MetricLabels = {}) {
     
    return (
      _target: unknown,
      _propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const originalMethod = descriptor.value;

       
      descriptor.value = async function (this: unknown, ...args: unknown[]) {
        const endTimer = metricsCollector.startTimer(operation, labels);

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const result = await originalMethod.apply(this, args);
          endTimer({ status: 'success' });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return result;
        } catch (error) {
          endTimer({ status: 'error' });
          throw error;
        }
      };

      return descriptor;
    };
  }
}

/**
 * Global metrics collector instance
 */
export const metricsCollector = new MetricsCollector();

/**
 * Convenience method for recording counters
 */
export function recordCounter(
  name: string,
  value = 1,
  labels: MetricLabels = {}
): void {
  metricsCollector.recordCounter(name, value, labels);
}

/**
 * Convenience method for recording histograms
 */
export function recordHistogram(
  name: string,
  value: number,
  labels: MetricLabels = {}
): void {
  metricsCollector.recordHistogram(name, value, labels);
}

/**
 * Convenience method for recording durations
 */
export function recordDuration(
  operation: string,
  duration: number,
  labels: MetricLabels = {}
): void {
  metricsCollector.recordDuration(operation, duration, labels);
}

/**
 * Convenience method for recording errors
 */
export function recordError(
  component: string,
  error: string,
  labels: MetricLabels = {}
): void {
  metricsCollector.recordError(component, error, labels);
}

/**
 * Convenience method for starting a timer
 */
export function startTimer(
  operation: string,
  labels: MetricLabels = {}
): (additionalLabels?: MetricLabels) => void {
  return metricsCollector.startTimer(operation, labels);
}
