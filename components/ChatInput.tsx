"use client";

import { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (wantVideo?: boolean) => void;
  disabled?: boolean;
  allowVideo?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  allowVideo = false,
}: ChatInputProps) {
  const [wantVideo, setWantVideo] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled && value.trim()) {
      e.preventDefault();
      onSubmit(wantVideo && allowVideo);
      setWantVideo(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {allowVideo && (
        <div className="mb-2 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={wantVideo}
              onChange={(e) => setWantVideo(e.target.checked)}
              disabled={disabled}
              className="rounded border-neonPurple/50 bg-black/40 text-neonPink focus:ring-neonPink focus:ring-offset-0 disabled:opacity-50"
            />
            <span>Generate video</span>
          </label>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled && value.trim()) {
            onSubmit(wantVideo && allowVideo);
            setWantVideo(false);
          }
        }}
        className="flex gap-2"
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say something…"
          disabled={disabled}
          className="flex-1 rounded-full bg-black/60 border border-neonPurple/50 px-5 py-3 text-white outline-none placeholder:text-gray-500 focus:border-neonPink focus:shadow-[0_0_20px_rgba(255,78,205,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-full px-6 py-3 bg-neonPink text-black font-medium shadow-[0_0_20px_rgba(255,78,205,0.6)] hover:shadow-[0_0_30px_rgba(255,78,205,0.8)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_20px_rgba(255,78,205,0.6)]"
        >
          Send
        </button>
      </form>
    </div>
  );
}



