import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/[^\x20-\x7E]/g, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/[^\x20-\x7E]/g, "");

  return createClient(supabaseUrl, serviceRoleKey);
}
