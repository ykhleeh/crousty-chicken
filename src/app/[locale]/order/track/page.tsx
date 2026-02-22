"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/actions/order-actions";

export default function TrackOrderPage() {
  const t = useTranslations("Track");
  const locale = useLocale();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const num = parseInt(orderNumber, 10);
    if (isNaN(num) || num <= 0) {
      setError(t("invalidNumber"));
      return;
    }

    setLoading(true);
    const order = await getOrderByNumber(num);
    setLoading(false);

    if (!order) {
      setError(t("notFound"));
      return;
    }

    // Redirect to order confirmation page
    router.push(`/${locale}/order/confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-golden font-heading font-bold text-xl"
          >
            Crousty Chicken
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-white/70 text-center mb-8">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="orderNumber" className="block text-white/70 mb-2">
              {t("orderNumberLabel")}
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.replace(/\D/g, ""))}
              placeholder={t("orderNumberPlaceholder")}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold placeholder:text-white/30 focus:border-golden focus:outline-none"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !orderNumber}
            className={`w-full font-bold px-6 py-4 rounded-full transition-colors text-lg flex items-center justify-center gap-2 ${
              loading || !orderNumber
                ? "bg-white/20 text-white/50 cursor-not-allowed"
                : "bg-golden hover:bg-golden-dark text-black"
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
            {loading ? t("searching") : t("search")}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            href={`/${locale}`}
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
