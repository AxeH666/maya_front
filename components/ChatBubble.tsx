import VideoPlayer from "./VideoPlayer";

interface ChatBubbleProps {
  sender: "user" | "maya";
  message: string;
  videoUrl?: string;
  videoStatus?: "pending" | "processing" | "ready" | "failed";
}

export default function ChatBubble({ sender, message, videoUrl, videoStatus }: ChatBubbleProps) {
  if (sender === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] rounded-2xl bg-black/40 border border-neonPurple/30 px-4 py-2.5 text-white text-sm">
          {message}
        </div>
      </div>
    );
  }

  const isGenerating = videoStatus === "pending" || videoStatus === "processing";
  const hasFailed = videoStatus === "failed";

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[75%] rounded-2xl bg-black/60 border border-neonPink/40 px-4 py-2.5 text-neonPink text-sm shadow-[0_0_15px_rgba(255,78,205,0.3)]">
        {message}
        {isGenerating && (
          <div className="mt-2 text-xs text-gray-400 italic">
            Generating video…
          </div>
        )}
        {hasFailed && (
          <div className="mt-2 text-xs text-red-400">
            Video generation failed
          </div>
        )}
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      </div>
    </div>
  );
}



