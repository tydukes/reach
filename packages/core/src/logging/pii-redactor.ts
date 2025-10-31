// @module: @reach/core/logging

/**
 * PII Redaction Utilities
 *
 * Provides privacy-safe logging by automatically redacting personally
 * identifiable information (PII) from log messages.
 *
 * @packageDocumentation
 */

/**
 * Patterns for detecting common PII types
 */
const PII_PATTERNS = {
  /** Email addresses */
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

  /** Phone numbers (various formats) */
  phone: /\b(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g,

  /** Social Security Numbers */
  ssn: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,

  /** Credit card numbers (with optional separators) */
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,

  /** IP addresses */
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,

  /** Generic API keys (common patterns) */
  apiKey: /\b[A-Za-z0-9_-]{32,}\b/g,

  /** Home directories and user paths */
  homePath: /\/(?:home|Users)\/[^/\s]+/g,
};

/**
 * Keys that should always be redacted in objects
 */
const SENSITIVE_KEYS = new Set([
  'password',
  'passwd',
  'secret',
  'token',
  'apikey',
  'api_key',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'privatekey',
  'private_key',
  'creditcard',
  'credit_card',
  'ssn',
  'socialsecurity',
  'social_security',
]);

/**
 * Options for PII redaction
 */
export interface RedactionOptions {
  /** Whether to redact email addresses */
  redactEmails?: boolean;

  /** Whether to redact phone numbers */
  redactPhones?: boolean;

  /** Whether to redact SSNs */
  redactSSNs?: boolean;

  /** Whether to redact credit cards */
  redactCreditCards?: boolean;

  /** Whether to redact IP addresses */
  redactIPAddresses?: boolean;

  /** Whether to redact API keys */
  redactAPIKeys?: boolean;

  /** Whether to redact file paths */
  redactPaths?: boolean;

  /** Custom replacement text */
  replacementText?: string;
}

/**
 * Default redaction options - redact everything by default
 */
const DEFAULT_OPTIONS: Required<RedactionOptions> = {
  redactEmails: true,
  redactPhones: true,
  redactSSNs: true,
  redactCreditCards: true,
  redactIPAddresses: true,
  redactAPIKeys: true,
  redactPaths: true,
  replacementText: '[REDACTED]',
};

/**
 * Redacts PII from a string
 *
 * @param text - The text to redact
 * @param options - Redaction options
 * @returns The redacted text
 *
 * @example
 * ```typescript
 * const message = 'User email: user@example.com, phone: 555-1234';
 * const redacted = redactString(message);
 * // Result: 'User email: [REDACTED], phone: [REDACTED]'
 * ```
 */
export function redactString(
  text: string,
  options: RedactionOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = text;

  // Order matters! Check longer/more specific patterns first
  // Credit cards before phones (credit cards are longer)
  if (opts.redactCreditCards) {
    result = result.replace(PII_PATTERNS.creditCard, opts.replacementText);
  }

  if (opts.redactSSNs) {
    result = result.replace(PII_PATTERNS.ssn, opts.replacementText);
  }

  if (opts.redactPhones) {
    result = result.replace(PII_PATTERNS.phone, opts.replacementText);
  }

  if (opts.redactEmails) {
    result = result.replace(PII_PATTERNS.email, opts.replacementText);
  }

  if (opts.redactIPAddresses) {
    result = result.replace(PII_PATTERNS.ipAddress, opts.replacementText);
  }

  if (opts.redactAPIKeys) {
    result = result.replace(PII_PATTERNS.apiKey, opts.replacementText);
  }

  if (opts.redactPaths) {
    result = result.replace(PII_PATTERNS.homePath, '/home/[REDACTED]');
  }

  return result;
}

/**
 * Redacts PII from an object (deeply)
 *
 * @param obj - The object to redact
 * @param options - Redaction options
 * @returns A new object with redacted values
 *
 * @example
 * ```typescript
 * const data = {
 *   user: {
 *     name: 'John',
 *     email: 'john@example.com',
 *     password: 'secret123'
 *   }
 * };
 * const redacted = redactObject(data);
 * // Result: { user: { name: 'John', email: '[REDACTED]', password: '[REDACTED]' } }
 * ```
 */
 
export function redactObject(
  obj: unknown,
  options: RedactionOptions = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Handle primitives
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return redactString(obj, options);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj.map((item) => redactObject(item, options));
  }

  // Handle objects
  if (typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};

     
    for (const [key, value] of Object.entries(obj)) {
      // Check if key is sensitive
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        result[key] = opts.replacementText;
        continue;
      }

      // Recursively redact the value
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      result[key] = redactObject(value, options);
    }

    return result;
  }

  return obj;
}

/**
 * Checks if a key is considered sensitive
 *
 * @param key - The key to check
 * @returns True if the key is sensitive
 *
 * @example
 * ```typescript
 * isSensitiveKey('password'); // true
 * isSensitiveKey('username'); // false
 * ```
 */
export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase());
}

/**
 * Adds a custom sensitive key to the redaction list
 *
 * @param key - The key to add
 *
 * @example
 * ```typescript
 * addSensitiveKey('customSecret');
 * ```
 */
export function addSensitiveKey(key: string): void {
  SENSITIVE_KEYS.add(key.toLowerCase());
}

/**
 * Redacts PII from any value (auto-detects type)
 *
 * @param value - The value to redact
 * @param options - Redaction options
 * @returns The redacted value
 *
 * @example
 * ```typescript
 * redact('user@example.com'); // '[REDACTED]'
 * redact({ password: 'secret' }); // { password: '[REDACTED]' }
 * ```
 */
 
export function redact(
  value: unknown,
  options: RedactionOptions = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (typeof value === 'string') {
    return redactString(value, options);
  }

  return redactObject(value, options);
}
