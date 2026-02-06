import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  console.log("=== STRIPE WEBHOOK RECEIVED ===");

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("No stripe signature in request");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook signature verified, event type:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    console.log("checkout.session.completed - order_id:", orderId);
    console.log("Session metadata:", session.metadata);

    if (orderId) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
      } else {
        console.log("Order updated successfully:", data);
      }
    } else {
      console.error("No order_id in session metadata!");
    }
  }

  return NextResponse.json({ received: true });
}
