"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateOrderStatus, markOrderAsPaid } from "@/actions/admin-actions";
import StatusBadge from "@/components/confirmation/StatusBadge";
import type { Order, OrderStatus } from "@/types/order";

interface OrderCardProps {
  order: Order;
  onRefresh?: () => void;
}

export default function OrderCard({ order, onRefresh }: OrderCardProps) {
  const t = useTranslations("Admin");
  const [loading, setLoading] = useState(false);

  const getItemName = (item: Order["items"][0]) => {
    switch (item.type) {
      case "dish":
        // Use stored name if available, otherwise fallback to nameKey
        const dishName = item.name || item.nameKey;
        return `${dishName} (${item.size})`;
      case "entry":
        // Use stored name if available, otherwise fallback to nameKey
        const entryName = item.name || item.nameKey;
        return `${entryName} (${item.portion})`;
      case "drink":
        return item.name;
      case "dessert":
        return item.name;
      case "compose":
        return `Compose (${item.size}) - ${item.base}, ${item.meat}`;
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (loading) return;
    setLoading(true);
    const result = await updateOrderStatus(order.id, newStatus);
    setLoading(false);
    // Always refresh to sync UI with database
    if (onRefresh) onRefresh();
    if (!result.success && result.error) {
      console.error("Status change failed:", result.error);
    }
  };

  const handleMarkAsPaid = async () => {
    if (loading) return;
    setLoading(true);
    const result = await markOrderAsPaid(order.id);
    setLoading(false);
    // Always refresh to sync UI with database
    if (onRefresh) onRefresh();
    if (!result.success && result.error) {
      console.error("Mark as paid failed:", result.error);
    }
  };

  const nextStatus: Record<string, OrderStatus | null> = {
    pending_payment: null, // Handled separately with markAsPaid
    paid: "preparing",
    preparing: "ready",
    ready: null,
  };

  const next = nextStatus[order.status];
  const isKiosk = order.order_type === "kiosk";
  const isPendingPayment = order.status === "pending_payment";

  return (
    <div className="bg-dark rounded-2xl p-5 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-bold text-lg">
              #{order.order_number}
            </p>
            {isKiosk ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                KIOSK
              </span>
            ) : (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                ONLINE
              </span>
            )}
          </div>
          <p className="text-white font-medium">
            {order.customer_name}
          </p>
          {order.customer_phone && (
            <p className="text-white/50 text-sm">{order.customer_phone}</p>
          )}
          <p className="text-white/30 text-xs mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="space-y-1 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-white/70">
              {item.quantity}x {getItemName(item)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-golden font-bold">
          {(order.total_cents / 100).toFixed(2)}&euro;
        </span>
        <div className="flex gap-2">
          {isPendingPayment && (
            <button
              onClick={handleMarkAsPaid}
              disabled={loading}
              className={`font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2 ${
                loading
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? t("updating") : t("markAsPaid")}
            </button>
          )}
          {next && (
            <button
              onClick={() => handleStatusChange(next)}
              disabled={loading}
              className={`font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2 ${
                loading
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-golden hover:bg-golden-dark text-black"
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? t("updating") : t(`markAs_${next}`)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
