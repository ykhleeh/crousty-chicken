"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface KitchenHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  realtimeStatus?: string;
}

export default function KitchenHeader({
  soundEnabled,
  onToggleSound,
  realtimeStatus,
}: KitchenHeaderProps) {
  const t = useTranslations("Kitchen");
  const locale = useLocale();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-golden font-heading font-bold text-2xl flex items-center gap-3">
            <span className="text-3xl">🍳</span>
            {t("title")}
          </h1>
          <Link
            href={`/${locale}/admin/dashboard`}
            className="text-white/50 hover:text-white transition-colors text-sm ml-4"
          >
            {t("backToDashboard")}
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {/* Realtime status indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                realtimeStatus === "SUBSCRIBED"
                  ? "bg-green-500"
                  : realtimeStatus === "CHANNEL_ERROR"
                  ? "bg-red-500"
                  : "bg-yellow-500 animate-pulse"
              }`}
            />
            <span className="text-white/50 text-sm">
              {realtimeStatus === "SUBSCRIBED" ? "Live" : realtimeStatus}
            </span>
          </div>

          <span className="text-white/70 font-mono text-lg">{currentTime}</span>

          <button
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              soundEnabled
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white/10 text-white/50 border border-white/10"
            }`}
          >
            <span className="text-xl">{soundEnabled ? "🔊" : "🔇"}</span>
            <span className="text-sm font-medium">
              {t("sound")}: {soundEnabled ? "ON" : "OFF"}
            </span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors border border-white/10"
          >
            <span className="text-xl">{isFullscreen ? "⛶" : "⛶"}</span>
            <span className="text-sm font-medium">{t("fullscreen")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
