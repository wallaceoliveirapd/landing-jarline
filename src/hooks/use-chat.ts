"use client";

import { useState, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  whatsappLink?: string;
  options?: string[];
  isComplete?: boolean;
}

interface UseChatOptions {
  apiEndpoint?: string;
  onMessageStart?: () => void;
  onMessageEnd?: () => void;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Briefing acumulado — persiste entre mensagens
  const briefingRef = useRef<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  interface ChatConfig {
  formSlug?: string;
  [key: string]: unknown;
}

const sendMessage = async (content: string, config?: ChatConfig) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    let currentMessages: ChatMessage[] = [];
    setMessages((prev) => {
      currentMessages = [...prev, userMessage];
      return currentMessages;
    });

    setIsLoading(true);
    setError(null);
    options.onMessageStart?.();

    try {
      // Histórico sem a mensagem atual
      const historyForAPI = currentMessages
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(options.apiEndpoint || "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history: historyForAPI,
          config,
          // Envia o briefing acumulado para o servidor não precisar re-extrair tudo
          briefing: briefingRef.current,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.error && !data.response) throw new Error(data.error);

      // Atualiza o briefing acumulado com o que o servidor extraiu
      if (data.briefing && Object.keys(data.briefing).length > 0) {
        briefingRef.current = { ...briefingRef.current, ...data.briefing };
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Desculpe, não consegui processar sua mensagem.",
        timestamp: Date.now(),
        whatsappLink: data.whatsappLink,
        options: data.options,
        isComplete: data.isComplete,
      };

      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        setTimeout(scrollToBottom, 50);
        return updated;
      });
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao enviar mensagem";
      setError(errorMessage);

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, estou tendo dificuldades. Que tal falarmos pelo WhatsApp?",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
      options.onMessageEnd?.();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    briefingRef.current = {};
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    messagesEndRef,
  };
}
