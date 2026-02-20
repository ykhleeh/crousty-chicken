"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { updateOrderStatus } from "@/actions/admin-actions";
import type { Order, OrderStatus } from "@/types/order";

interface KitchenOrderCardProps {
  order: Order;
  onRefresh: () => void;
}

export default function KitchenOrderCard({
  order,
  onRefresh,
}: KitchenOrderCardProps) {
  const t = useTranslations("Kitchen");
  const [loading, setLoading] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const created = new Date(order.created_at).getTime();
      const now = Date.now();
      return Math.floor((now - created) / 60000);
    };

    setElapsedMinutes(calculateElapsed());
    const interval = setInterval(() => {
      setElapsedMinutes(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [order.created_at]);

  const getItemName = (item: Order["items"][0]) => {
    switch (item.type) {
      case "dish":
        const dishName = item.name || item.nameKey;
        return `${dishName} (${item.size})`;
      case "entry":
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
    onRefresh();
    if (!result.success && result.error) {
      console.error("Status change failed:", result.error);
    }
  };

  const isNew = order.status === "paid";
  const isPreparing = order.status === "preparing";
  const isLate = elapsedMinutes > 10;
  const isWarning = elapsedMinutes >= 5 && elapsedMinutes <= 10;

  const getTimerColor = () => {
    if (isLate) return "text-red-400";
    if (isWarning) return "text-orange-400";
    return "text-green-400";
  };

  const getBorderColor = () => {
    if (isNew) return "border-blue-500";
    if (isPreparing) return "border-orange-500";
    return "border-white/20";
  };

  const getBadgeStyle = () => {
    if (isNew) {
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
    return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  };

  return (
    <div
      className={`bg-dark rounded-2xl border-2 ${getBorderColor()} overflow-hidden transition-all ${
        isLate ? "animate-pulse-red" : ""
      }`}
    >
      {/* Header with status badge */}
      <div
        className={`px-5 py-3 ${
          isNew ? "bg-blue-500/10" : "bg-orange-500/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadgeStyle()}`}
          >
            {isNew ? t("statusNew") : t("statusPreparing")}
          </span>
          <div className="flex items-center gap-1">
            {order.order_type === "kiosk" ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                KIOSK
              </span>
            ) : (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                ONLINE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Order content */}
      <div className="p-5">
        {/* Order number and timer */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-black text-5xl">
            #{order.order_number}
          </span>
          <div className={`flex items-center gap-2 ${getTimerColor()}`}>
            <span className="text-2xl">⏱️</span>
            <span className="font-bold text-2xl">{elapsedMinutes} min</span>
          </div>
        </div>

        {/* Customer info */}
        {order.customer_name && (
          <p className="text-white/70 text-lg mb-4">{order.customer_name}</p>
        )}

        {/* Items list */}
        <div className="space-y-2 mb-6">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-white text-xl font-semibold"
            >
              <span className="text-golden font-bold min-w-[2rem]">
                {item.quantity}x
              </span>
              <span>{getItemName(item)}</span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <button
          onClick={() =>
            handleStatusChange(isNew ? "preparing" : "ready")
          }
          disabled={loading}
          className={`w-full font-bold py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-3 ${
            loading
              ? "bg-white/20 text-white/50 cursor-not-allowed"
              : isNew
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5"
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
          {loading
            ? t("updating")
            : isNew
            ? t("markPreparing")
            : t("markReady")}
        </button>
      </div>
    </div>
  );
}
