# @reach/core

Foundation package containing shared types, interfaces, and utilities used across all REACH packages.

## Overview

The `@reach/core` package serves as the foundation for the entire REACH ecosystem. It provides:

- Common TypeScript types and interfaces
- Shared utility functions
- Core abstractions for extensibility
- Constants and configuration schemas
- **Logging & Telemetry Infrastructure**
  - Structured logging with OpenTelemetry
  - Automatic PII redaction
  - Trace context propagation
  - Metrics collection

All other packages depend on `@reach/core`, making it the first package built in the monorepo.

## Installation

```bash
npm install @reach/core
```

## Key Exports

### Core Interfaces

The package exports interfaces for all major REACH components:

```typescript
import {
  ISession,      // Session management
  IMemory,       // Memory operations
  IVoice,        // Voice input/output
  IAI,           // AI/LLM integration
  IGuardrails,   // Safety guardrails
} from '@reach/core';
```

### Logging & Telemetry

#### Logger

Structured logging with automatic PII redaction and trace context:

```typescript
import { createLogger, LogLevel } from '@reach/core';

const logger = createLogger({
  level: LogLevel.INFO,
  component: 'my-service',
  redactPII: true,
});

logger.info('User logged in', { userId: '123' });
logger.error('Operation failed', { error, operation: 'processData' });
```

#### PII Redaction

Automatic redaction of sensitive information:

```typescript
import { redact, addSensitiveKey } from '@reach/core';

// Redact PII from strings or objects
const safe = redact('Email: user@example.com');
// Result: 'Email: [REDACTED]'

// Add custom sensitive keys
addSensitiveKey('customSecret');
```

#### Trace Context

Distributed tracing with OpenTelemetry:

```typescript
import { createTraceContext, withTraceContext } from '@reach/core';

const ctx = createTraceContext();
await withTraceContext(ctx, async () => {
  // All logs share the same trace ID
  logger.info('Step 1');
  logger.info('Step 2');
});
```

#### Metrics

Performance and operational metrics:

```typescript
import { metricsCollector } from '@reach/core';

// Record counters
metricsCollector.recordCounter('api.requests', 1, {
  component: 'voice',
  status: 'success',
});

// Time operations
const endTimer = metricsCollector.startTimer('database.query');
await performQuery();
endTimer({ status: 'success' });
```

### Test Utilities

```typescript
import { createMockLogger, createTestLogger, delay } from '@reach/core/test-utils';

// Mock logger for unit tests
const mockLogger = createMockLogger();

// Test logger (only logs errors)
const testLogger = createTestLogger(LogLevel.ERROR);
```

## Features

### ✅ Implemented

- **Logging & Telemetry Foundation** (Issue #11)
  - Structured JSON logging with Pino
  - OpenTelemetry integration
  - Automatic PII redaction
  - Trace context propagation
  - Metrics collection
  - Comprehensive test coverage

### 🚧 In Development

- Core type definitions
- Additional utility functions
- Configuration schemas

## Package Information

- **Version**: 0.1.0 (MVP)
- **License**: MIT
- **Dependencies**:
  - OpenTelemetry packages
  - Pino (logging)
- **Location**: `packages/core/`

## Documentation

- [Logging & Telemetry Guide](https://github.com/tydukes/reach/blob/main/packages/core/src/logging/README.md) - Complete logging documentation
- [API Reference](https://github.com/tydukes/reach/blob/main/packages/core/src/index.ts) - TypeScript definitions

## Examples

### Basic Logging

```typescript
import { createLogger, LogLevel } from '@reach/core';

const logger = createLogger({
  level: LogLevel.INFO,
  component: 'voice',
});

// Simple logging
logger.info('Service started');

// With metadata
logger.info('Processing audio', {
  duration: 1.5,
  sampleRate: 16000,
});

// Child logger with context
const requestLogger = logger.child({ requestId: '123' });
requestLogger.info('Handling request');
```

### PII Protection

```typescript
import { createLogger } from '@reach/core';

const logger = createLogger({
  redactPII: true,  // Enable PII redaction
});

logger.info('User registered', {
  email: 'user@example.com',  // Automatically redacted
  name: 'John Doe',            // Not PII, not redacted
  password: 'secret123',       // Automatically redacted
});
```

### Metrics Tracking

```typescript
import { metricsCollector } from '@reach/core';

// Track API requests
metricsCollector.recordCounter('api.requests', 1, {
  endpoint: '/api/stt',
  status: 'success',
});

// Monitor performance
const endTimer = metricsCollector.startTimer('voice.processing');
await processAudio();
endTimer({ model: 'whisper' });
```

## Next Steps

- [CLI Package](cli.md) - Command-line interface
- [Voice Package](voice.md) - Voice input/output
- [Architecture Overview](../architecture/overview.md) - System design
- [Contributing](../contributing/contributing.md) - Help build REACH
