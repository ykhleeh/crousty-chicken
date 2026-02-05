"use client";

import { useTranslations } from "next-intl";
import { updateOrderStatus } from "@/actions/admin-actions";
import StatusBadge from "@/components/confirmation/StatusBadge";
import type { Order, OrderStatus } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations("Admin");
  const tMenu = useTranslations("Menu");
  const tEntries = useTranslations("Entries");

  const getItemName = (item: Order["items"][0]) => {
    switch (item.type) {
      case "dish":
        return `${tMenu(item.nameKey)} (${item.size})`;
      case "entry":
        return `${tEntries(item.nameKey)} (${item.portion})`;
      case "drink":
        return item.name;
      case "dessert":
        return item.name;
      case "compose":
        return `Compose (${item.size}) - ${item.base}, ${item.meat}`;
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await updateOrderStatus(order.id, newStatus);
  };

  const nextStatus: Record<string, OrderStatus | null> = {
    paid: "preparing",
    preparing: "ready",
    ready: null,
  };

  const next = nextStatus[order.status];

  return (
    <div className="bg-dark rounded-2xl p-5 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white font-bold text-lg">
            #{order.order_number} — {order.customer_name}
          </p>
          <p className="text-white/50 text-sm">{order.customer_phone}</p>
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
        {next && (
          <button
            onClick={() => handleStatusChange(next)}
            className="bg-golden hover:bg-golden-dark text-black font-bold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            {t(`markAs_${next}`)}
          </button>
        )}
      </div>
    </div>
  );
}
