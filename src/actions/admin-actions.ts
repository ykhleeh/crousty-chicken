"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/types/order";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ["paid"],
  paid: ["preparing"],
  preparing: ["ready"],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(newStatus)) {
      return {
        success: false,
        error: `Cannot transition from ${order.status} to ${newStatus}`,
      };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Service unavailable" };
  }
}

export async function getOrders(
  statusFilter?: OrderStatus
): Promise<Order[]> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("getOrders - user:", user?.email || "NO USER");

    if (!user) {
      console.log("getOrders - returning empty (no user)");
      return [];
    }

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    } else {
      // Show all orders except pending (online orders waiting for Stripe)
      query = query.not("status", "eq", "pending");
    }

    const { data, error } = await query;

    console.log("getOrders - query result:", { count: data?.length, error });

    return (data as Order[]) || [];
  } catch (e) {
    console.error("getOrders - error:", e);
    return [];
  }
}

export async function toggleClickCollect(
  enabled: boolean
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "click_collect_enabled", value: enabled });

    return { success: !error };
  } catch {
    return { success: false };
  }
}

export async function markOrderAsPaid(
  orderId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check order exists and is pending_payment
    const { data: order } = await supabase
      .from("orders")
      .select("status, order_type")
      .eq("id", orderId)
      .single();

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status !== "pending_payment") {
      return {
        success: false,
        error: `Cannot mark as paid: order status is ${order.status}`,
      };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Service unavailable" };
  }
}
