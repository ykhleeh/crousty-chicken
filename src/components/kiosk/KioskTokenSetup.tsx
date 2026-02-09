"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  activateKioskTerminal,
  toggleKioskTerminal,
  deleteKioskTerminal,
} from "@/actions/kiosk-actions";
import type { KioskToken } from "@/types/order";

interface KioskTokenSetupProps {
  initialTerminals: KioskToken[];
}

export default function KioskTokenSetup({
  initialTerminals,
}: KioskTokenSetupProps) {
  const t = useTranslations("AdminKiosk");
  const locale = useLocale();
  const [terminals, setTerminals] = useState<KioskToken[]>(initialTerminals);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await activateKioskTerminal(name.trim());

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Store token in localStorage
    localStorage.setItem("kiosk_token", result.token);

    // Also set as cookie for server-side reading
    document.cookie = `kiosk_token=${result.token}; path=/; max-age=31536000; SameSite=Lax`;

    setSuccess(t("activationSuccess"));
    setName("");
    setLoading(false);

    // Refresh terminals list
    window.location.reload();
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    const result = await toggleKioskTerminal(id, !currentActive);
    if (result.success) {
      setTerminals((prev) =>
        prev.map((term) =>
          term.id === id ? { ...term, is_active: !currentActive } : term
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    const result = await deleteKioskTerminal(id);
    if (result.success) {
      setTerminals((prev) => prev.filter((term) => term.id !== id));
    }
  };

  const formatLastUsed = (lastUsed: string | null) => {
    if (!lastUsed) return t("neverUsed");
    const date = new Date(lastUsed);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return t("minutesAgo", { count: diffMins });
    if (diffMins < 1440)
      return t("hoursAgo", { count: Math.floor(diffMins / 60) });
    return t("daysAgo", { count: Math.floor(diffMins / 1440) });
  };

  const openKioskOnThisDevice = () => {
    const token = localStorage.getItem("kiosk_token");
    if (token) {
      window.open(`/${locale}/kiosk?token=${token}`, "_blank");
    }
  };

  return (
    <div className="space-y-8">
      {/* Terminals List */}
      <div className="space-y-4">
        <h2 className="text-white font-bold text-lg">{t("terminalsTitle")}</h2>
        {terminals.length === 0 ? (
          <p className="text-white/50">{t("noTerminals")}</p>
        ) : (
          terminals.map((terminal) => (
            <div
              key={terminal.id}
              className="bg-dark rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white font-bold">{terminal.name}</p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        terminal.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {terminal.is_active ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">
                    {t("lastUsed")}: {formatLastUsed(terminal.last_used_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(terminal.id, terminal.is_active)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      terminal.is_active
                        ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }`}
                  >
                    {terminal.is_active ? t("deactivate") : t("activate")}
                  </button>
                  <button
                    onClick={() => handleDelete(terminal.id)}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Activate New Terminal */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">
          {t("activateTitle")}
        </h2>
        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">
              {t("terminalName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("terminalNamePlaceholder")}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-golden"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className={`font-bold px-6 py-3 rounded-xl transition-colors ${
              !name.trim() || loading
                ? "bg-white/20 text-white/50 cursor-not-allowed"
                : "bg-golden hover:bg-golden-dark text-black"
            }`}
          >
            {loading ? t("activating") : t("activateButton")}
          </button>

          <p className="text-white/50 text-sm">{t("activateNote")}</p>
        </form>
      </div>

      {/* Open Kiosk on this device */}
      {typeof window !== "undefined" &&
        localStorage.getItem("kiosk_token") && (
          <div className="border-t border-white/10 pt-6">
            <button
              onClick={openKioskOnThisDevice}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {t("openKiosk")}
            </button>
          </div>
        )}
    </div>
  );
}
