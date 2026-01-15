"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="relative z-10 flex h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Neon card */}
        <div className="rounded-2xl bg-black/60 border border-neonPurple/50 px-8 py-10 shadow-[0_0_40px_rgba(176,38,255,0.3)] backdrop-blur-sm">
          <h1 className="text-3xl font-semibold text-neonPink mb-2 text-center drop-shadow-[0_0_10px_#ff4ecd]">
            Sign Up
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Join the MAYA experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-neonPurple/30 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-neonPink focus:shadow-[0_0_20px_rgba(255,78,205,0.4)] transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-neonPurple/30 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-neonPink focus:shadow-[0_0_20px_rgba(255,78,205,0.4)] transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg px-6 py-3 bg-gradient-to-r from-neonPurple to-neonPink text-black font-medium shadow-[0_0_20px_rgba(255,78,205,0.6)] hover:shadow-[0_0_30px_rgba(255,78,205,0.8)] transition-all"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-neonPink hover:text-neonPurple transition-colors underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


