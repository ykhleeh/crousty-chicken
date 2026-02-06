"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getOrders } from "@/actions/admin-actions";
import OrderCard from "./OrderCard";
import type { Order, OrderStatus } from "@/types/order";

const FILTERS: (OrderStatus | "all")[] = ["all", "paid", "preparing", "ready"];

export default function OrderList() {
  const t = useTranslations("Admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const data = await getOrders(filter === "all" ? undefined : filter);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Realtime event received:", payload);
          // Refetch on any change
          fetchOrders();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setLoading(true);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === f
                ? "bg-golden text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {t(`filter_${f}`)}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <p className="text-white/50 text-center py-8">{t("loading")}</p>
      ) : orders.length === 0 ? (
        <p className="text-white/50 text-center py-8">{t("noOrders")}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
