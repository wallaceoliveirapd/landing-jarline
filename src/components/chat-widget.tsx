"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";

// Renderiza markdown simples: **bold**, *italic*, quebras de linha
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let last = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) {
        parts.push(line.slice(last, match.index));
      }
      if (match[0].startsWith("**")) {
        parts.push(<strong key={key++}>{match[2]}</strong>);
      } else {
        parts.push(<em key={key++}>{match[3]}</em>);
      }
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return (
      <span key={li}>
        {parts}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

interface ChatWidgetProps {
  config?: any;
  initialMessage?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChatWidget({ config, initialMessage, isOpen: externalIsOpen, onOpenChange }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [showInitial, setShowInitial] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    messagesEndRef
  } = useChat({
    apiEndpoint: "/api/chat",
    onMessageStart: () => setShowInitial(false),
  });

  // Sync with external isOpen if provided
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Handle initial message from props
  useEffect(() => {
    if (isOpen && initialMessage) {
      sendMessage(initialMessage, config);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue, config);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question, config);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        aria-label="Abrir chat"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 md:w-[380px] md:h-[520px] w-full h-full md:rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/assets/images/img-ia.png"
              alt="Jal - Assistente Virtual"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Jal</h3>
            <p className="text-white/70 text-xs">Arquitetura & Interiores</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#585947" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-zinc-600 text-sm mb-4">Olá! Como posso ajudar com seu projeto?</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleQuickQuestion("Quero fazer uma consultoria")}
                className="text-left text-xs bg-white p-3 rounded-xl border border-zinc-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                📋 Quero fazer uma consultoria
              </button>
              <button
                onClick={() => handleQuickQuestion("Me conta sobre projetos")}
                className="text-left text-xs bg-white p-3 rounded-xl border border-zinc-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                🏠 Me conta sobre projetos
              </button>
              <button
                onClick={() => handleQuickQuestion("Quanto custa um projeto?")}
                className="text-left text-xs bg-white p-3 rounded-xl border border-zinc-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                💰 Quanto custa um projeto?
              </button>
              {config?.whatsapp || config?.whatsappNumber ? (
                <a
                  href={`https://wa.me/${(config.whatsapp || config.whatsappNumber || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left text-xs bg-green-50 border border-green-200 hover:border-green-400 hover:shadow-md p-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-green-700 font-medium">Falar direto no WhatsApp</span>
                </a>
              ) : null}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-200`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-white border border-zinc-100 text-zinc-700 rounded-bl-md shadow-sm"
                }`}
            >
              <p className="text-sm leading-relaxed">{renderMarkdown(message.content)}</p>
              
              {message.options && message.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(option)}
                      className="text-left text-xs bg-zinc-50 hover:bg-primary/10 hover:border-primary/30 border border-zinc-100 px-3 py-2 rounded-lg transition-all cursor-pointer"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {message.whatsappLink && (
                <a
                  href={message.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
              )}
              <span className={`text-[10px] mt-1 block ${message.role === "user" ? "text-white/60" : "text-zinc-400"}`}>
                {new Date(message.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-200">
            <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-zinc-100 shrink-0">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm resize-none focus:outline-none focus:border-primary/30 focus:bg-white transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}