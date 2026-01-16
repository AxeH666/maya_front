"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Message {
  sender: "user" | "maya";
  message: string;
  videoUrl?: string;
  videoJobId?: string;
  videoStatus?: "pending" | "processing" | "ready" | "failed";
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const pollingIntervalsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Cleanup polling intervals on unmount
  useEffect(() => {
    return () => {
      pollingIntervalsRef.current.forEach((interval) => clearInterval(interval));
      pollingIntervalsRef.current.clear();
    };
  }, []);

  const handleNewChat = () => {
    // Clear all polling intervals
    pollingIntervalsRef.current.forEach((interval) => clearInterval(interval));
    pollingIntervalsRef.current.clear();
    setMessages([]);
    setInput("");
    setActiveChatId(undefined);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const pollVideoStatus = async (messageIndex: number, jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getVideo(jobId);

        if (data.status === "ready" && data.video_url) {
          // Video is ready, update the message
          setMessages((prev) => {
            const updated = [...prev];
            if (updated[messageIndex]) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                videoUrl: data.video_url,
                videoStatus: "ready",
                videoJobId: undefined,
              };
            }
            return updated;
          });

          // Stop polling
          clearInterval(interval);
          pollingIntervalsRef.current.delete(messageIndex);
        } else if (data.status === "failed") {
          // Video generation failed
          setMessages((prev) => {
            const updated = [...prev];
            if (updated[messageIndex]) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                videoStatus: "failed",
                videoJobId: undefined,
              };
            }
            return updated;
          });

          // Stop polling
          clearInterval(interval);
          pollingIntervalsRef.current.delete(messageIndex);
        } else {
          // Update status (pending or processing)
          setMessages((prev) => {
            const updated = [...prev];
            if (updated[messageIndex]) {
              updated[messageIndex] = {
                ...updated[messageIndex],
                videoStatus: data.status,
              };
            }
            return updated;
          });
          // Continue polling for "pending" or "processing"
        }
      } catch (error) {
        // Error polling, mark as failed and stop
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[messageIndex]) {
            updated[messageIndex] = {
              ...updated[messageIndex],
              videoStatus: "failed",
              videoJobId: undefined,
            };
          }
          return updated;
        });
        clearInterval(interval);
        pollingIntervalsRef.current.delete(messageIndex);
      }
    }, 2000); // Poll every 2 seconds

    pollingIntervalsRef.current.set(messageIndex, interval);
  };

  const handleSend = async (wantVideo: boolean = false) => {
    const userMessage = input.trim();
    if (!userMessage || isTyping) return;

    // Add user message immediately (optimistic UI)
    const newUserMessage: Message = { sender: "user", message: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call API
      const data = await api.chat(userMessage, wantVideo && isAuthenticated);
      const mayaMessage = data.text || "Hmm, something's not right...";

      // Simulate typing delay (600-900ms)
      const delay = Math.random() * 300 + 600;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Add MAYA's response
      const newMayaMessage: Message = {
        sender: "maya",
        message: mayaMessage,
      };

      // If video_job_id is returned, start polling
      if (data.video_job_id) {
        newMayaMessage.videoJobId = data.video_job_id;
        newMayaMessage.videoStatus = "pending";
        setMessages((prev) => {
          const updated = [...prev, newMayaMessage];
          const messageIndex = updated.length - 1;
          // Start polling for video status immediately
          setTimeout(() => {
            pollVideoStatus(messageIndex, data.video_job_id);
          }, 100);
          return updated;
        });
      } else {
        setMessages((prev) => [...prev, newMayaMessage]);
      }
    } catch (error) {
      // User-safe error message
      const errorMessage: Message = {
        sender: "maya",
        message: error instanceof Error ? error.message : "Something's playing hard to get... try again?",
      };
      const delay = Math.random() * 300 + 600;
      await new Promise((resolve) => setTimeout(resolve, delay));
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

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

        {/* Free Mode Banner */}
        {!isAuthenticated && (
          <div className="w-full max-w-2xl mb-2 px-4 py-2 rounded-lg bg-black/40 border border-neonPurple/30 text-center">
            <span className="text-sm text-gray-400">
              Login to unlock video generation.{" "}
              <Link href="/login" className="text-neonPink hover:text-neonPurple transition-colors underline">
                Sign in
              </Link>
            </span>
          </div>
        )}

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
                <ChatBubble
                  key={index}
                  sender={msg.sender}
                  message={msg.message}
                  videoUrl={msg.videoUrl}
                  videoStatus={msg.videoStatus}
                />
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
          allowVideo={isAuthenticated}
        />
      </main>
    </>
  );
}
