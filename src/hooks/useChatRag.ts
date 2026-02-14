/**
 * useChatRag Hook
 *
 * Encapsulates conversation state and the RAG pipeline execution.
 * Provides messages, loading state, error handling, and actions.
 */

import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types/chat';
import { executeRagPipeline } from '@/services/rag';

interface UseChatRagReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (input: string) => Promise<void>;
  clearChat: () => void;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChatRag(): UseChatRagReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await executeRagPipeline(trimmed);

      const assistantMsg: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';

      setError(errorMessage);

      const errorMsg: ChatMessage = {
        id: createId(),
        role: 'error',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
