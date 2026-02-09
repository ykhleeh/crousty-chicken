"use client";

import { useTranslations } from "next-intl";
import type { OrderStatus } from "@/types/order";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pending_payment: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations("Confirmation");

  return (
    <span
      className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${STATUS_STYLES[status]}`}
    >
      {t(`status_${status}`)}
    </span>
  );
}
