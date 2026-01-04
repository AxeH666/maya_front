"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";

interface Message {
  sender: "user" | "maya";
  message: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || isTyping) return;

    // Add user message
    const newUserMessage: Message = { sender: "user", message: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call API
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const mayaMessage = data.text || "Hmm, something's not right...";

      // Simulate typing delay (600-900ms)
      const delay = Math.random() * 300 + 600;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Add MAYA's response
      const newMayaMessage: Message = { sender: "maya", message: mayaMessage };
      setMessages((prev) => [...prev, newMayaMessage]);
    } catch (error) {
      // Playful error message
      const errorMessage: Message = {
        sender: "maya",
        message: "Something's playing hard to get... try again?",
      };
      const delay = Math.random() * 300 + 600;
      await new Promise((resolve) => setTimeout(resolve, delay));
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="relative z-10 flex h-screen flex-col items-center justify-between px-4 py-6">
      {/* Header */}
      <header className="text-neonPink text-2xl font-semibold tracking-widest drop-shadow-[0_0_10px_#ff4ecd]">
        MAYA
      </header>

      {/* Chat area */}
      <section
        ref={chatAreaRef}
        className="flex-1 w-full max-w-2xl flex flex-col justify-end overflow-y-auto pb-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 && !isTyping ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="italic opacity-70">
              She's watching… waiting for you to speak.
            </span>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatBubble key={index} sender={msg.sender} message={msg.message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </section>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        disabled={isTyping}
      />
    </main>
  );
}
