"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <main className="relative z-10 flex h-screen flex-col items-center justify-center px-4">
      <div className="text-gray-400">Logging out...</div>
    </main>
  );
}


