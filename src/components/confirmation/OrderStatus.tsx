"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderStatus as OrderStatusType, CartItem } from "@/types/order";
import StatusBadge from "./StatusBadge";

interface OrderStatusProps {
  order: Order;
}

const STEPS: OrderStatusType[] = ["paid", "preparing", "ready"];

export default function OrderStatus({ order: initialOrder }: OrderStatusProps) {
  const t = useTranslations("Confirmation");
  const tMenu = useTranslations("Menu");
  const tEntries = useTranslations("Entries");
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-${initialOrder.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${initialOrder.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new } as Order));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  const currentStepIndex = STEPS.indexOf(order.status as OrderStatusType);
  const isKiosk = order.order_type === "kiosk";
  const isPendingPayment = order.status === "pending_payment";

  // Get item name - use stored name or translate from key
  const getItemName = (item: CartItem) => {
    if (item.type === "dish") {
      return item.name || tMenu(item.nameKey);
    }
    if (item.type === "entry") {
      return item.name || tEntries(item.nameKey);
    }
    if (item.type === "drink" || item.type === "dessert") {
      return item.name;
    }
    if (item.type === "compose") {
      return item.name || t("composeItem");
    }
    return "Item";
  };

  // Format item details
  const formatItemDetails = (item: CartItem) => {
    if (item.type === "dish" || item.type === "compose") {
      return `(${item.size.toUpperCase()})`;
    }
    if (item.type === "entry") {
      return `(${item.portion === "small" ? t("sizeSmall") : t("sizeLarge")})`;
    }
    return "";
  };

  return (
    <div className="space-y-8">
      {/* Status badge */}
      <div className="text-center">
        <StatusBadge status={order.status} />
        {isKiosk && (
          <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            KIOSK
          </span>
        )}
      </div>

      {/* Progress steps - show different steps for kiosk pending payment */}
      {isPendingPayment ? (
        <div className="text-center">
          <p className="text-purple-400 text-lg">{t("pendingPaymentDesc")}</p>
        </div>
      ) : order.status !== "pending" && (
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  i <= currentStepIndex
                    ? "bg-golden border-golden text-black"
                    : "border-white/20 text-white/30"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-12 h-0.5 ${
                    i < currentStepIndex ? "bg-golden" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status descriptions */}
      <div className="text-center">
        {order.status === "paid" && (
          <p className="text-white/70">{t("paidDesc")}</p>
        )}
        {order.status === "preparing" && (
          <p className="text-white/70">{t("preparingDesc")}</p>
        )}
        {order.status === "ready" && (
          <p className="text-green-400 font-bold text-lg">{t("readyDesc")}</p>
        )}
      </div>

      {/* Order details */}
      <div className="bg-dark rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-bold mb-4">{t("orderDetails")}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">{t("orderNumber")}</span>
            <span className="text-white font-bold">#{order.order_number}</span>
          </div>
          {order.customer_name && (
            <div className="flex justify-between">
              <span className="text-white/50">{t("customerName")}</span>
              <span className="text-white">{order.customer_name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-white/50">{t("total")}</span>
            <span className="text-golden font-bold">
              {(order.total_cents / 100).toFixed(2)}&euro;
            </span>
          </div>
        </div>
      </div>

      {/* Order items */}
      {order.items && order.items.length > 0 && (
        <div className="bg-dark rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-4">{t("orderItems")}</h3>
          <div className="space-y-3">
            {order.items.map((item: CartItem, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-white">
                    {item.quantity}x {getItemName(item)} {formatItemDetails(item)}
                  </span>
                </div>
                <span className="text-white/70 ml-2">
                  {((item.price * item.quantity) / 100).toFixed(2)}&euro;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
