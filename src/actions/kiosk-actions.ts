"use server";

import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/actions/menu-actions";
import { addOns } from "@/data/menu";
import type { CartItem, DishSize, KioskToken } from "@/types/order";
import type { Product } from "@/types/product";
import crypto from "crypto";

const COMPOSE_PRICES: Record<DishSize, number> = { M: 9, L: 13, XL: 17 };

// ============================================
// Token Verification (called by /kiosk page)
// ============================================

export async function verifyKioskToken(token: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kiosk_tokens")
      .select("id, is_active")
      .eq("token", token)
      .single();

    if (error || !data) return false;
    if (!data.is_active) return false;

    // Update last_used_at
    await supabase
      .from("kiosk_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", data.id);

    return true;
  } catch {
    return false;
  }
}

// ============================================
// Create Kiosk Order (no payment)
// ============================================

async function recalculateItemPrice(
  item: CartItem,
  products: Product[]
): Promise<number> {
  switch (item.type) {
    case "dish": {
      const product = products.find((p) => p.id === item.menuItemId);
      if (!product) throw new Error(`Invalid menu item: ${item.menuItemId}`);
      const priceKey = `price_${item.size.toLowerCase()}` as keyof Product;
      const baseCents = (product[priceKey] as number) || 0;
      const base = baseCents / 100;
      const supp = item.supplements.reduce((sum, s) => {
        const found = addOns.supplements.find((x) => x.name === s);
        return sum + (found?.price ?? 0);
      }, 0);
      return (base + supp) * item.quantity;
    }
    case "entry": {
      const product = products.find((p) => p.id === item.entryItemId);
      if (!product) throw new Error(`Invalid entry: ${item.entryItemId}`);
      const priceCents =
        item.portion === "small" ? product.price_small : product.price_large;
      const price = (priceCents || 0) / 100;
      return price * item.quantity;
    }
    case "drink": {
      const product = products.find((p) => p.id === item.drinkId);
      if (!product) throw new Error(`Invalid drink: ${item.drinkId}`);
      const price = (product.price || 0) / 100;
      return price * item.quantity;
    }
    case "dessert": {
      const product = products.find((p) => p.id === item.dessertId);
      if (!product) throw new Error(`Invalid dessert: ${item.dessertId}`);
      const price = (product.price || 0) / 100;
      return price * item.quantity;
    }
    case "compose": {
      const base = COMPOSE_PRICES[item.size];
      const supp = item.supplements.reduce((sum, s) => {
        const found = addOns.supplements.find((x) => x.name === s);
        return sum + (found?.price ?? 0);
      }, 0);
      return (base + supp) * item.quantity;
    }
  }
}

export async function createKioskOrder(
  items: CartItem[],
  kioskToken: string,
  locale: string
): Promise<{ orderId: string; orderNumber: number } | { error: string }> {
  try {
    if (!items.length) {
      return { error: "Cart is empty" };
    }

    const supabase = await createClient();

    // Verify kiosk token
    const { data: tokenData } = await supabase
      .from("kiosk_tokens")
      .select("id, is_active")
      .eq("token", kioskToken)
      .single();

    if (!tokenData || !tokenData.is_active) {
      return { error: "Invalid or inactive kiosk token" };
    }

    // Fetch all products from DB for price validation
    const products = await getProducts();

    // Recalculate total server-side
    let totalCents = 0;
    for (const item of items) {
      totalCents += Math.round((await recalculateItemPrice(item, products)) * 100);
    }

    // Create order in Supabase with pending_payment status
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        customer_name: "Kiosk",
        customer_phone: "",
        items,
        total_cents: totalCents,
        status: "pending_payment",
        order_type: "kiosk",
        kiosk_token_id: tokenData.id,
        locale,
      })
      .select("id, order_number")
      .single();

    if (dbError || !order) {
      console.error("DB error:", dbError);
      return { error: "Failed to create order" };
    }

    // Update kiosk token last_used_at
    await supabase
      .from("kiosk_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", tokenData.id);

    return { orderId: order.id, orderNumber: order.order_number };
  } catch (error) {
    console.error("Kiosk order error:", error);
    return { error: "Failed to create order" };
  }
}

// ============================================
// Admin: Activate new terminal
// ============================================

export async function activateKioskTerminal(
  name: string
): Promise<{ token: string } | { error: string }> {
  try {
    const supabase = await createClient();

    // Check if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    const { error: dbError } = await supabase.from("kiosk_tokens").insert({
      token,
      name,
      is_active: true,
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return { error: "Failed to activate terminal" };
    }

    return { token };
  } catch {
    return { error: "Service unavailable" };
  }
}

// ============================================
// Admin: List terminals
// ============================================

export async function getKioskTerminals(): Promise<KioskToken[]> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("kiosk_tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as KioskToken[];
  } catch {
    return [];
  }
}

// ============================================
// Admin: Toggle terminal active state
// ============================================

export async function toggleKioskTerminal(
  id: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("kiosk_tokens")
      .update({ is_active: active })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Service unavailable" };
  }
}

// ============================================
// Admin: Delete terminal
// ============================================

export async function deleteKioskTerminal(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("kiosk_tokens")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Service unavailable" };
  }
}
