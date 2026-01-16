"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthButton() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/logout");
  };

  return (
    <div className="absolute top-6 right-6 z-20">
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-black/60 border border-neonPurple/50 text-neonPink hover:border-neonPink hover:shadow-[0_0_20px_rgba(255,78,205,0.4)] transition-all text-sm font-medium"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-black/60 border border-neonPurple/50 text-neonPink hover:border-neonPink hover:shadow-[0_0_20px_rgba(255,78,205,0.4)] transition-all text-sm font-medium"
        >
          Login
        </Link>
      )}
    </div>
  );
}

