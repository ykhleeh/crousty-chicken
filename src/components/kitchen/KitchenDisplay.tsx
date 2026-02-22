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
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<string>("connecting");
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    console.log("[Kitchen] Fetching orders...");
    const data = await getKitchenOrders();
    console.log("[Kitchen] Fetched orders:", data.length);
    setOrders(data);
    setLoading(false);
    return data;
  }, []);

  // Unlock audio on user interaction
  const unlockSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Play a silent sound to unlock audio
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0;
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);

      setSoundUnlocked(true);
      console.log("[Kitchen] Sound unlocked!");
    } catch (e) {
      console.error("[Kitchen] Failed to unlock sound:", e);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || !soundUnlocked) {
      console.log("[Kitchen] Sound skipped - enabled:", soundEnabled, "unlocked:", soundUnlocked);
      return;
    }

    try {
      const AudioContextClass = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = audioContextRef.current || new AudioContextClass();

      // Create a beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      console.log("[Kitchen] Sound played!");
    } catch (e) {
      console.error("[Kitchen] Could not play notification sound:", e);
    }
  }, [soundEnabled, soundUnlocked]);

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
        console.log("[Kitchen] Realtime subscription status:", status);
        setRealtimeStatus(status);
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

  // Show unlock modal if sound not unlocked
  if (!soundUnlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-golden text-4xl font-bold mb-6">
            {t("title")}
          </h1>
          <button
            onClick={unlockSound}
            className="bg-golden hover:bg-golden-dark text-black font-bold text-2xl px-12 py-6 rounded-2xl transition-colors"
          >
            {t("clickToStart")}
          </button>
          <p className="text-white/50 mt-4 text-lg">
            {t("clickToStartDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <KitchenHeader
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        realtimeStatus={realtimeStatus}
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
