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
  const ordersRef = useRef<Order[]>([]);

  const fetchOrders = useCallback(async () => {
    console.log("[Kitchen] Fetching orders...");
    const data = await getKitchenOrders();
    console.log("[Kitchen] Fetched orders:", data.length);
    ordersRef.current = data;
    setOrders(data);
    setLoading(false);
    return data;
  }, []);

  // Play beep sound
  const playBeep = useCallback((frequency: number = 800, duration: number = 0.5) => {
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) {
        console.log("[Kitchen] No audio context");
        return;
      }

      // Resume context if suspended
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      console.log("[Kitchen] Beep played at", frequency, "Hz");
    } catch (e) {
      console.error("[Kitchen] Beep error:", e);
    }
  }, []);

  // Unlock audio on user interaction
  const unlockSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Resume if needed
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      // Play an audible confirmation beep
      setTimeout(() => {
        playBeep(600, 0.15);
        setTimeout(() => playBeep(800, 0.15), 150);
        setTimeout(() => playBeep(1000, 0.2), 300);
      }, 100);

      setSoundUnlocked(true);
      console.log("[Kitchen] Sound unlocked! State:", audioContextRef.current.state);
    } catch (e) {
      console.error("[Kitchen] Failed to unlock sound:", e);
    }
  }, [playBeep]);

  const playNotificationSound = useCallback(() => {
    console.log("[Kitchen] playNotificationSound called - enabled:", soundEnabled, "unlocked:", soundUnlocked);

    if (!soundEnabled || !soundUnlocked) {
      return;
    }

    // Play a "ding-dong" notification
    playBeep(880, 0.2);
    setTimeout(() => playBeep(1100, 0.3), 200);
  }, [soundEnabled, soundUnlocked, playBeep]);

  // Initial fetch
  useEffect(() => {
    fetchOrders().then((data) => {
      // Initialize previous order IDs
      previousOrderIdsRef.current = new Set(data.map((o) => o.id));
    });
  }, [fetchOrders]);

  // Realtime subscription with reconnection
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupSubscription = () => {
      console.log("[Kitchen] Setting up realtime subscription...");

      channel = supabase
        .channel("kitchen-orders-" + Date.now())
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          async (payload) => {
            console.log("[Kitchen] Realtime event:", payload.eventType, payload);

            // Get current orders before fetch to detect new ones
            const prevOrderIds = new Set(ordersRef.current.map(o => o.id));
            const newOrders = await fetchOrders();

            // Check for new paid orders
            const newPaidOrders = newOrders.filter(
              o => o.status === "paid" && !prevOrderIds.has(o.id)
            );

            // Check for orders that just became paid
            if (payload.eventType === "UPDATE") {
              const updated = payload.new as Order;
              const old = payload.old as Partial<Order>;
              if (updated.status === "paid" && old.status !== "paid") {
                console.log("[Kitchen] Order became paid, playing sound");
                playNotificationSound();
              }
            }

            // Play sound for new paid orders
            if (newPaidOrders.length > 0) {
              console.log("[Kitchen] New paid orders detected:", newPaidOrders.length);
              playNotificationSound();
            }
          }
        )
        .subscribe((status) => {
          console.log("[Kitchen] Realtime status:", status);
          setRealtimeStatus(status);

          // Try to reconnect on error or timeout
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.log("[Kitchen] Connection lost, will reconnect...");
            setTimeout(() => {
              if (channel) {
                supabase.removeChannel(channel);
              }
              setupSubscription();
            }, 2000);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []); // Empty deps - setup once

  // Polling fallback - refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("[Kitchen] Polling refresh...");
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

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
        onTestSound={playNotificationSound}
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
