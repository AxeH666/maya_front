"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import Sidebar from "@/components/Sidebar";
import { isLoggedIn } from "@/lib/auth";

interface Message {
  sender: "user" | "maya";
  message: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isLoggedIn());

    // Update on route changes
    const checkAuth = () => {
      setLoggedIn(isLoggedIn());
    };

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for custom auth change events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authchange", handleAuthChange);
    checkAuth();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authchange", handleAuthChange);
    };
  }, [pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const userMessageCount = messages.filter((msg) => msg.sender === "user").length;
  const shouldGate = !loggedIn && userMessageCount >= 3;

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChatId(undefined);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    // In a real app, this would load the chat history
    // For now, we'll just highlight it
  };

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || isTyping || shouldGate) return;

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

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Sidebar 
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <main className="relative z-10 flex h-screen flex-col items-center justify-between px-4 py-6 ml-64 max-md:ml-0">
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
                i am waiting for you honey, speak to me
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
          disabled={isTyping || shouldGate}
        />

        {/* Gate Overlay */}
        {shouldGate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center">
            <div className="rounded-2xl bg-black/80 border border-neonPurple/50 px-8 py-10 shadow-[0_0_40px_rgba(176,38,255,0.5)] backdrop-blur-sm max-w-md mx-4">
              <h2 className="text-2xl font-semibold text-neonPink mb-4 text-center drop-shadow-[0_0_10px_#ff4ecd]">
                Sign in to continue with Maya
              </h2>
              <p className="text-gray-400 text-center mb-6 text-sm">
                You've reached the free message limit. Sign in to keep chatting.
              </p>
              <Link
                href="/login"
                className="block w-full rounded-lg px-6 py-3 bg-gradient-to-r from-neonPurple to-neonPink text-black font-medium shadow-[0_0_20px_rgba(255,78,205,0.6)] hover:shadow-[0_0_30px_rgba(255,78,205,0.8)] transition-all text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
