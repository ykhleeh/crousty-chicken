"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import {
  menuItems,
  entryItems,
  drinks,
  desserts,
  addOns,
} from "@/data/menu";
import type { CartItem, DishSize } from "@/types/order";

const COMPOSE_PRICES: Record<DishSize, number> = { M: 9, L: 13, XL: 17 };

function recalculateItemPrice(item: CartItem): number {
  switch (item.type) {
    case "dish": {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId);
      if (!menuItem) throw new Error(`Invalid menu item: ${item.menuItemId}`);
      const base = menuItem.prices[item.size];
      const supp = item.supplements.reduce((sum, s) => {
        const found = addOns.supplements.find((x) => x.name === s);
        return sum + (found?.price ?? 0);
      }, 0);
      return (base + supp) * item.quantity;
    }
    case "entry": {
      const entry = entryItems.find((e) => e.id === item.entryItemId);
      if (!entry) throw new Error(`Invalid entry: ${item.entryItemId}`);
      const price =
        item.portion === "small" ? entry.small.price : entry.large.price;
      return price * item.quantity;
    }
    case "drink": {
      const drink = drinks.find((d) => d.id === item.drinkId);
      if (!drink) throw new Error(`Invalid drink: ${item.drinkId}`);
      return drink.price * item.quantity;
    }
    case "dessert": {
      const dessert = desserts.find((d) => d.id === item.dessertId);
      if (!dessert) throw new Error(`Invalid dessert: ${item.dessertId}`);
      return dessert.price * item.quantity;
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

export async function createCheckoutSession(
  items: CartItem[],
  customerName: string,
  customerPhone: string,
  locale: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    if (!items.length) {
      return { url: null, error: "Cart is empty" };
    }

    // Recalculate total server-side
    let totalCents = 0;
    for (const item of items) {
      totalCents += Math.round(recalculateItemPrice(item) * 100);
    }

    // Create order in Supabase
    const supabase = await createClient();
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        items,
        total_cents: totalCents,
        status: "pending",
        locale,
      })
      .select("id")
      .single();

    if (dbError || !order) {
      console.error("DB error:", dbError);
      return { url: null, error: "Failed to create order" };
    }

    // Build Stripe line items
    const lineItems = items.map((item) => {
      const unitAmount = Math.round(
        (recalculateItemPrice(item) / item.quantity) * 100
      );
      let name = "";
      switch (item.type) {
        case "dish":
          name = `${item.nameKey} (${item.size})`;
          if (item.supplements.length)
            name += ` + ${item.supplements.join(", ")}`;
          break;
        case "entry":
          name = `${item.nameKey} (${item.portion})`;
          break;
        case "drink":
          name = item.name;
          break;
        case "dessert":
          name = item.name;
          break;
        case "compose":
          name = `Compose (${item.size}) - ${item.base}, ${item.meat}`;
          if (item.supplements.length)
            name += ` + ${item.supplements.join(", ")}`;
          break;
      }

      return {
        price_data: {
          currency: "eur",
          product_data: { name },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").trim().replace(/[^\x20-\x7E]/g, "");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/${locale}/order/confirmation/${order.id}`,
      cancel_url: `${baseUrl}/${locale}/order/checkout`,
      metadata: {
        order_id: order.id,
      },
    });

    // Update order with stripe session id
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return { url: session.url, error: null };
  } catch (error) {
    console.error("Checkout error:", error);
    return { url: null, error: "Failed to create checkout session" };
  }
}
