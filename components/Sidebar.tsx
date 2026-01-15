"use client";

import { useState } from "react";

interface ChatHistoryItem {
  id: string;
  title: string;
}

interface SidebarProps {
  activeChatId?: string;
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
}

export default function Sidebar({
  activeChatId,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  const [chatHistory] = useState<ChatHistoryItem[]>([
    { id: "1", title: "First conversation" },
    { id: "2", title: "Another chat" },
    { id: "3", title: "Quick question" },
  ]);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/40 border-r border-neonPurple/30 backdrop-blur-sm z-10 flex flex-col max-md:hidden">
      {/* New Chat Button */}
      <div className="p-4 border-b border-neonPurple/20">
        <button
          onClick={onNewChat}
          className="w-full rounded-lg px-4 py-3 bg-gradient-to-r from-neonPurple/30 to-neonPink/30 border border-neonPurple/50 text-neonPink hover:border-neonPink hover:shadow-[0_0_20px_rgba(255,78,205,0.4)] transition-all text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>+</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-gray-500 px-2 py-2 uppercase tracking-wider">
          Recent
        </div>
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat?.(chat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeChatId === chat.id
                  ? "bg-neonPurple/20 border border-neonPink/50 text-neonPink shadow-[0_0_15px_rgba(255,78,205,0.3)]"
                  : "text-gray-300 hover:bg-black/40 hover:border hover:border-neonPurple/30 border border-transparent"
              }`}
            >
              <div className="truncate">{chat.title}</div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

