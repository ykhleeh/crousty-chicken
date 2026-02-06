import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// TEMPORARY: Hardcoded for testing bundling issue
const HARDCODED_URL = "https://qtudltadflhrapclyfvz.supabase.co";
const HARDCODED_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dWRsdGFkZmxocmFwY2x5ZnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDE0NjEsImV4cCI6MjA4NTg3NzQ2MX0.RZ5g1H-M5v_7P4ietWZA09GQbpSxTX0fzC0c2PeDFfE";

export function createClient() {
  console.log("Using hardcoded Supabase credentials for testing");

  return createSupabaseClient(HARDCODED_URL, HARDCODED_KEY);
}
