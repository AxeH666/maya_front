import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-darkBg overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-neonPurple opacity-20 blur-[140px] -translate-x-1/2" />
          <div className="absolute bottom-1/4 right-1/2 w-[400px] h-[400px] bg-neonPink opacity-20 blur-[120px] translate-x-1/2" />
        </div>

        {children}
      </body>
    </html>
  );
}
