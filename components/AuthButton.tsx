"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn, logout } from "@/lib/auth";

export default function AuthButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    router.push("/logout");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute top-6 right-6 z-20">
      {loggedIn ? (
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

