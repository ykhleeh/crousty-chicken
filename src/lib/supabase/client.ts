import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  console.log("Supabase config:", {
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + "..." : "MISSING",
    keyLength: supabaseAnonKey?.length || 0,
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
