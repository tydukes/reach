# @reach/mcp-client

Model Context Protocol (MCP) client for AI agent orchestration and communication.

## Overview

The MCP client package integrates REACH with AI agents using the Model Context Protocol standard, enabling:

- Standardized agent communication
- Tool and resource sharing
- Multi-agent coordination
- Extensible AI capabilities

## Installation

```bash
npm install @reach/mcp-client
```

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard for connecting AI assistants to external tools and data sources. It provides:

- Unified interface for AI agents
- Secure tool execution
- Resource management
- Context sharing

## Architecture

```
┌────────────────────────────────────────────┐
│         MCP Client Package                 │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │       MCP Protocol Handler           │ │
│  │  - Connection management             │ │
│  │  - Message serialization             │ │
│  └────────────┬─────────────────────────┘ │
│               │                            │
│  ┌────────────▼─────────────────────────┐ │
│  │         Tool Registry                │ │
│  │  - Available tools                   │ │
│  │  - Capability negotiation            │ │
│  └────────────┬─────────────────────────┘ │
│               │                            │
│  ┌────────────▼─────────────────────────┐ │
│  │      Agent Orchestrator              │ │
│  │  - Task routing                      │ │
│  │  - Multi-agent coordination          │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

## Features

### Agent Communication

- Bidirectional messaging with AI agents
- Request/response handling
- Event streaming

### Tool Management

- Register custom tools
- Expose REACH capabilities to agents
- Execute tool calls safely

### Context Sharing

- Provide conversation history to agents
- Share user preferences and settings
- Manage context windows

## Status

🚧 **Planned for M2** - Core CLI & MCP Integration (Weeks 3-5)

## Package Information

- **Version**: 0.1.0 (MVP)
- **License**: MIT
- **Dependencies**: `@reach/core`, `@reach/memory`
- **Location**: `packages/mcp-client/`

## Next Steps

- [CLI Package](cli.md) - Command-line interface
- [Memory Package](memory.md) - Context management
- [Architecture Overview](../architecture/overview.md) - System design
- [Contributing](../contributing/contributing.md) - Help build REACH
