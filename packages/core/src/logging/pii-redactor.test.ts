// @module: @reach/core/logging

import { describe, it, expect } from 'vitest';
import {
  redact,
  redactString,
  redactObject,
  isSensitiveKey,
  addSensitiveKey,
} from './pii-redactor.js';

describe('PII Redactor', () => {
  describe('redactString', () => {
    it('should redact email addresses', () => {
      const input = 'Contact us at user@example.com';
      const output = redactString(input);
      expect(output).toBe('Contact us at [REDACTED]');
    });

    it('should redact phone numbers', () => {
      const input = 'Call me at 555-123-4567';
      const output = redactString(input);
      expect(output).toBe('Call me at [REDACTED]');
    });

    it('should redact SSNs', () => {
      const input = 'SSN: 123-45-6789';
      const output = redactString(input);
      expect(output).toBe('SSN: [REDACTED]');
    });

    it('should redact credit card numbers', () => {
      const input = 'Card: 1234-5678-9012-3456';
      const output = redactString(input);
      expect(output).toBe('Card: [REDACTED]');
    });

    it('should redact IP addresses', () => {
      const input = 'Server at 192.168.1.1';
      const output = redactString(input);
      expect(output).toBe('Server at [REDACTED]');
    });

    it('should redact home paths', () => {
      const input = 'File at /home/user/document.txt';
      const output = redactString(input);
      expect(output).toBe('File at /home/[REDACTED]/document.txt');
    });

    it('should handle multiple PII types', () => {
      const input = 'User: user@test.com, Phone: 555-1234, IP: 10.0.0.1';
      const output = redactString(input);
      expect(output).not.toContain('user@test.com');
      expect(output).not.toContain('555-1234');
      expect(output).not.toContain('10.0.0.1');
    });

    it('should respect custom replacement text', () => {
      const input = 'Email: test@example.com';
      const output = redactString(input, { replacementText: '[HIDDEN]' });
      expect(output).toBe('Email: [HIDDEN]');
    });

    it('should allow selective redaction', () => {
      const input = 'Email: test@example.com, Phone: 555-1234';
      const output = redactString(input, {
        redactEmails: true,
        redactPhones: false,
      });
      expect(output).not.toContain('test@example.com');
      expect(output).toContain('555-1234');
    });
  });

  describe('redactObject', () => {
    it('should redact sensitive keys', () => {
      const input = {
        username: 'john',
        password: 'secret123',
        email: 'john@example.com',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = redactObject(input);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.username).toBe('john');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.password).toBe('[REDACTED]');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.email).toBe('[REDACTED]');
    });

    it('should recursively redact nested objects', () => {
      const input = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            apiKey: 'abc123',
          },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = redactObject(input);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.user.name).toBe('John');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.user.credentials.password).toBe('[REDACTED]');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.user.credentials.apiKey).toBe('[REDACTED]');
    });

    it('should handle arrays', () => {
      const input = {
        users: [
          { name: 'Alice', email: 'alice@example.com' },
          { name: 'Bob', password: 'secret' },
        ],
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = redactObject(input);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.users[0].name).toBe('Alice');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.users[0].email).toBe('[REDACTED]');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.users[1].password).toBe('[REDACTED]');
    });

    it('should handle null and undefined', () => {
      expect(redactObject(null)).toBe(null);
      expect(redactObject(undefined)).toBe(undefined);
    });

    it('should handle primitives', () => {
      expect(redactObject('test')).toBe('test');
      expect(redactObject(42)).toBe(42);
      expect(redactObject(true)).toBe(true);
    });

    it('should redact string values containing PII', () => {
      const input = {
        message: 'Contact user@example.com',
        note: 'Phone: 555-1234',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = redactObject(input);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.message).toBe('Contact [REDACTED]');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.note).toBe('Phone: [REDACTED]');
    });
  });

  describe('isSensitiveKey', () => {
    it('should identify common sensitive keys', () => {
      expect(isSensitiveKey('password')).toBe(true);
      expect(isSensitiveKey('Password')).toBe(true);
      expect(isSensitiveKey('apiKey')).toBe(true);
      expect(isSensitiveKey('secret')).toBe(true);
      expect(isSensitiveKey('token')).toBe(true);
    });

    it('should return false for non-sensitive keys', () => {
      expect(isSensitiveKey('username')).toBe(false);
      expect(isSensitiveKey('name')).toBe(false);
      expect(isSensitiveKey('email')).toBe(false);
    });
  });

  describe('addSensitiveKey', () => {
    it('should add custom sensitive keys', () => {
      addSensitiveKey('customSecret');
      expect(isSensitiveKey('customSecret')).toBe(true);
    });

    it('should be case insensitive', () => {
      addSensitiveKey('MySecret');
      expect(isSensitiveKey('mysecret')).toBe(true);
      expect(isSensitiveKey('MYSECRET')).toBe(true);
    });
  });

  describe('redact (auto-detect)', () => {
    it('should handle strings', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = redact('Email: test@example.com');
      expect(output).toBe('Email: [REDACTED]');
    });

    it('should handle objects', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const output = redact({ password: 'secret' });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(output.password).toBe('[REDACTED]');
    });
  });
});
