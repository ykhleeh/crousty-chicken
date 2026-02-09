"use client";

import { useTranslations } from "next-intl";

interface KioskTicketProps {
  orderNumber: number;
  total: number;
  onNewOrder: () => void;
}

export default function KioskTicket({
  orderNumber,
  total,
  onNewOrder,
}: KioskTicketProps) {
  const t = useTranslations("Kiosk");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-dark rounded-3xl p-8 md:p-12 max-w-md w-full text-center border border-white/10">
        <h1 className="font-heading text-3xl font-extrabold text-golden mb-6">
          {t("ticketTitle")}
        </h1>

        <div className="bg-golden/10 rounded-2xl p-8 mb-6">
          <p className="text-white/70 text-lg mb-2">{t("ticketNumber")}</p>
          <p className="font-heading text-7xl font-extrabold text-golden">
            #{orderNumber}
          </p>
        </div>

        <p className="text-white/70 text-lg mb-4">{t("ticketInstruction")}</p>
        <p className="text-white/50 text-sm mb-8">{t("ticketSubInstruction")}</p>

        <div className="border-t border-white/10 pt-6 mb-8">
          <p className="text-white/50 text-sm mb-1">{t("total")}</p>
          <p className="text-golden font-bold text-2xl">
            {(total / 100).toFixed(2)}&euro;
          </p>
        </div>

        <button
          onClick={onNewOrder}
          className="w-full bg-golden hover:bg-golden-dark text-black font-bold px-6 py-4 rounded-full transition-colors text-lg"
        >
          {t("newOrder")}
        </button>
      </div>
    </div>
  );
}
