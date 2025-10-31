// @module: @reach/core

/**
 * REACH Core Library
 *
 * Provides core interfaces and base classes for the REACH framework.
 * REACH (Responsive Empowering Accessible Computing Helper) enables users
 * with disabilities to interact with computers through natural voice conversation.
 *
 * @packageDocumentation
 */

/**
 * Current version of the REACH core library.
 */
export const version = '0.1.0';

/**
 * Session management interface.
 *
 * Manages user sessions, including session lifecycle, state persistence,
 * and context tracking across multiple interactions.
 *
 * @remarks
 * Sessions provide the boundary for user interactions and maintain state
 * across voice commands. Each session has associated memory scopes (global,
 * project, session) and tracks the conversation history.
 *
 * @example
 * ```typescript
 * const session = await sessionManager.create({
 *   userId: 'user-123',
 *   projectId: 'project-456'
 * });
 * ```
 */
export interface ISession {
  /** Unique identifier for the session */
  id: string;

  /** User ID associated with this session */
  userId: string;

  /** Optional project ID for project-scoped memory */
  projectId?: string;

  /** Timestamp when the session was created */
  createdAt: Date;

  /** Timestamp of the last activity in this session */
  lastActivityAt: Date;

  /** Whether the session is currently active */
  isActive: boolean;
}

/**
 * Memory operations interface.
 *
 * Provides storage and retrieval of user data, conversation history,
 * and learned preferences across different memory scopes.
 *
 * @remarks
 * Memory is organized into three scopes:
 * - **Global**: User-wide settings and preferences
 * - **Project**: Project-specific context and history
 * - **Session**: Temporary conversation state
 *
 * Uses LevelDB for storage with semantic search via local embeddings.
 *
 * @example
 * ```typescript
 * await memory.store('session', sessionId, {
 *   key: 'last_command',
 *   value: 'create new file'
 * });
 *
 * const results = await memory.search('global', 'user preferences');
 * ```
 */
export interface IMemory {
  /**
   * Store data in the specified memory scope.
   *
   * @param scope - The memory scope (global, project, or session)
   * @param scopeId - The identifier for the scope
   * @param data - The data to store
   */
  store(scope: 'global' | 'project' | 'session', scopeId: string, data: unknown): Promise<void>;

  /**
   * Retrieve data from the specified memory scope.
   *
   * @param scope - The memory scope (global, project, or session)
   * @param scopeId - The identifier for the scope
   * @param key - The key to retrieve
   */
  retrieve(scope: 'global' | 'project' | 'session', scopeId: string, key: string): Promise<unknown>;

  /**
   * Perform semantic search across the specified memory scope.
   *
   * @param scope - The memory scope to search
   * @param query - The search query
   * @param limit - Maximum number of results to return
   */
  search(scope: 'global' | 'project' | 'session', query: string, limit?: number): Promise<unknown[]>;
}

/**
 * Voice input/output abstraction interface.
 *
 * Handles all voice interaction, including wake word detection,
 * speech-to-text (STT), text-to-speech (TTS), and voice activity detection (VAD).
 *
 * @remarks
 * The voice pipeline supports:
 * - **Wake Word**: Picovoice Porcupine for always-listening activation
 * - **STT**: OpenAI Whisper API (primary) with OS native fallback
 * - **TTS**: Open source (Coqui/Piper) with optional ElevenLabs premium
 * - **VAD**: Silero VAD for detecting speech boundaries
 *
 * @example
 * ```typescript
 * voice.on('wakeWordDetected', () => {
 *   console.log('User said wake word');
 * });
 *
 * const transcript = await voice.listenForSpeech();
 * await voice.speak('Hello, how can I help you?');
 * ```
 */
export interface IVoice {
  /**
   * Start listening for the wake word.
   */
  startWakeWordDetection(): Promise<void>;

  /**
   * Stop listening for the wake word.
   */
  stopWakeWordDetection(): Promise<void>;

  /**
   * Listen for speech and return the transcribed text.
   *
   * @returns The transcribed text
   */
  listenForSpeech(): Promise<string>;

  /**
   * Convert text to speech and play it.
   *
   * @param text - The text to speak
   * @param options - Optional TTS configuration
   */
  speak(text: string, options?: { voice?: string; speed?: number }): Promise<void>;

  /**
   * Register an event listener for voice events.
   *
   * @param event - The event type
   * @param handler - The event handler function
   */
  on(event: 'wakeWordDetected' | 'speechStarted' | 'speechEnded', handler: () => void): void;
}

/**
 * AI/LLM provider abstraction interface.
 *
 * Provides integration with Large Language Models through the Model Context
 * Protocol (MCP), enabling natural language understanding and AI-powered responses.
 *
 * @remarks
 * Uses the Model Context Protocol (MCP) to communicate with Claude and other
 * LLM providers. Supports streaming responses for real-time user feedback.
 *
 * @example
 * ```typescript
 * const response = await ai.sendMessage('Create a new file called test.txt', {
 *   sessionId: session.id,
 *   stream: true
 * });
 *
 * for await (const chunk of response) {
 *   console.log(chunk.content);
 * }
 * ```
 */
export interface IAI {
  /**
   * Send a message to the AI and get a response.
   *
   * @param message - The user's message
   * @param options - Optional configuration for the request
   * @returns The AI's response (streaming or complete)
   */
  sendMessage(
    message: string,
    options?: {
      sessionId?: string;
      stream?: boolean;
      context?: unknown;
    }
  ): Promise<AsyncIterable<{ content: string }> | { content: string }>;

  /**
   * Get the current token usage for the session.
   *
   * @param sessionId - The session to check
   * @returns Token usage statistics
   */
  getTokenUsage(sessionId: string): Promise<{
    used: number;
    limit: number;
    percentage: number;
  }>;
}

/**
 * Safety and security guardrails interface.
 *
 * Implements safety checks and user confirmations before executing
 * potentially dangerous operations.
 *
 * @remarks
 * Guardrails use a hybrid approach:
 * - **Rule-based**: Blocks obviously dangerous operations
 * - **Risk scoring**: Assigns risk levels to operations
 * - **User confirmation**: Requires explicit approval for high-risk actions
 *
 * Examples of protected operations:
 * - File deletion
 * - System modifications
 * - Network requests
 * - Code execution
 *
 * @example
 * ```typescript
 * const result = await guardrails.checkOperation({
 *   type: 'file_delete',
 *   path: '/important/file.txt'
 * });
 *
 * if (result.requiresConfirmation) {
 *   const confirmed = await getUserConfirmation(result.message);
 *   if (!confirmed) {
 *     throw new Error('Operation cancelled by user');
 *   }
 * }
 * ```
 */
export interface IGuardrails {
  /**
   * Check if an operation is safe to execute.
   *
   * @param operation - The operation to check
   * @returns Safety check result with risk level and confirmation requirements
   */
  checkOperation(operation: {
    type: string;
    [key: string]: unknown;
  }): Promise<{
    allowed: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    requiresConfirmation: boolean;
    message?: string;
  }>;

  /**
   * Record a user's confirmation for an operation.
   *
   * @param operationId - The unique identifier for the operation
   * @param confirmed - Whether the user confirmed the operation
   */
  recordConfirmation(operationId: string, confirmed: boolean): Promise<void>;
}
