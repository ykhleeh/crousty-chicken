"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Test raw fetch first
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
      const testKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

      // Test 1: Simple GET without auth
      console.log("Test 1: Simple fetch to google...");
      const test1 = await fetch("https://www.google.com", { method: "HEAD", mode: "no-cors" });
      console.log("Test 1 passed");

      // Test 2: Fetch with just Content-Type header
      console.log("Test 2: Fetch with Content-Type only...");
      const test2 = await fetch(baseUrl + "/rest/v1/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("Test 2 status:", test2.status);

      // Test 3: Fetch with Authorization header instead of apikey
      console.log("Test 3: Fetch with Authorization header...");
      const test3 = await fetch(baseUrl + "/rest/v1/settings?select=key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + testKey,
        },
      });
      console.log("Test 3 status:", test3.status);

      // Test 4: Try with Headers object
      console.log("Test 4: Fetch with Headers object and apikey...");
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      headers.set("apikey", testKey);
      const test4 = await fetch(baseUrl + "/rest/v1/settings?select=key", {
        method: "GET",
        headers: headers,
      });
      console.log("Test 4 status:", test4.status);

    } catch (fetchError) {
      console.error("Fetch test failed:", fetchError);
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t("loginError"));
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin/dashboard`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golden focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("password")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golden focus:outline-none transition-colors"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold transition-colors ${
          loading
            ? "bg-white/10 text-white/30 cursor-not-allowed"
            : "bg-golden hover:bg-golden-dark text-black"
        }`}
      >
        {loading ? t("loggingIn") : t("login")}
      </button>
    </form>
  );
}
