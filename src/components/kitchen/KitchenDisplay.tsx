"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getKitchenOrders } from "@/actions/admin-actions";
import KitchenHeader from "./KitchenHeader";
import KitchenOrderCard from "./KitchenOrderCard";
import type { Order } from "@/types/order";

export default function KitchenDisplay() {
  const t = useTranslations("Kitchen");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    const data = await getKitchenOrders();
    setOrders(data);
    setLoading(false);
    return data;
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    // Try to play the audio file first
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Fallback to Web Audio API if file doesn't exist
        try {
          const audioContext = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800;
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
          console.log("Could not play notification sound:", e);
        }
      });
    }
  }, [soundEnabled]);

  // Initial fetch
  useEffect(() => {
    fetchOrders().then((data) => {
      // Initialize previous order IDs
      previousOrderIdsRef.current = new Set(data.map((o) => o.id));
    });
  }, [fetchOrders]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("New order inserted:", payload);
          const newOrder = payload.new as Order;

          // Play sound for new paid orders
          if (newOrder.status === "paid") {
            playNotificationSound();
          }

          await fetchOrders();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("Order updated:", payload);
          const updatedOrder = payload.new as Order;
          const oldOrder = payload.old as Partial<Order>;

          // Play sound when order becomes paid (from pending or pending_payment)
          if (
            updatedOrder.status === "paid" &&
            oldOrder.status !== "paid"
          ) {
            playNotificationSound();
          }

          await fetchOrders();
        }
      )
      .subscribe((status) => {
        console.log("Kitchen realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, playNotificationSound]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Separate orders by status
  const newOrders = orders.filter((o) => o.status === "paid");
  const preparingOrders = orders.filter((o) => o.status === "preparing");

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-golden text-xl">
          {t("loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hidden audio element for notification sound */}
      <audio
        ref={audioRef}
        src="/sounds/notification.mp3"
        preload="auto"
      />

      <KitchenHeader
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="p-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-white/50">
            <span className="text-6xl mb-4">✨</span>
            <p className="text-2xl">{t("noOrders")}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* New orders section */}
            {newOrders.length > 0 && (
              <section>
                <h2 className="text-blue-400 font-bold text-xl mb-4 flex items-center gap-2">
                  <span>🆕</span>
                  {t("sectionNew")} ({newOrders.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {newOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onRefresh={fetchOrders}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Preparing orders section */}
            {preparingOrders.length > 0 && (
              <section>
                <h2 className="text-orange-400 font-bold text-xl mb-4 flex items-center gap-2">
                  <span>🔥</span>
                  {t("sectionPreparing")} ({preparingOrders.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {preparingOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      onRefresh={fetchOrders}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes pulse-red {
          0%,
          100% {
            background-color: rgba(239, 68, 68, 0.1);
          }
          50% {
            background-color: rgba(239, 68, 68, 0.25);
          }
        }

        .animate-pulse-red {
          animation: pulse-red 1s infinite;
        }
      `}</style>
    </div>
  );
}
