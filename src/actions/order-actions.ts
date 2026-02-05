"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !data) return null;
    return data as Order;
  } catch {
    return null;
  }
}

export async function checkClickCollectEnabled(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "click_collect_enabled")
      .single();

    if (error || !data) return true;
    return data.value === true || data.value === "true";
  } catch {
    // Supabase not configured yet — default to enabled
    return true;
  }
}
