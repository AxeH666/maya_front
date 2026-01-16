interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-neonPink/30 bg-black/40">
      <video
        src={videoUrl}
        controls
        autoPlay={false}
        loop={false}
        className="w-full max-w-full"
        style={{ maxHeight: "400px" }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}


