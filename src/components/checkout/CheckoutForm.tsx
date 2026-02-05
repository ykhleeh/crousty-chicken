"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { createCheckoutSession } from "@/actions/checkout-actions";
import CartSummary from "@/components/cart/CartSummary";

export default function CheckoutForm() {
  const t = useTranslations("Checkout");
  const tMenu = useTranslations("Menu");
  const tEntries = useTranslations("Entries");
  const tCart = useTranslations("Cart");
  const locale = useLocale();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getItemName = (item: (typeof items)[0]) => {
    switch (item.type) {
      case "dish":
        return `${tMenu(item.nameKey)} (${item.size})`;
      case "entry":
        return `${tEntries(item.nameKey)} (${item.portion === "small" ? tCart("small") : tCart("large")})`;
      case "drink":
        return item.name;
      case "dessert":
        return item.name;
      case "compose":
        return `Compose (${item.size}) - ${item.base}, ${item.meat}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    setError(null);

    const { url, error: checkoutError } = await createCheckoutSession(
      items,
      name.trim(),
      phone.trim(),
      locale
    );

    if (checkoutError || !url) {
      setError(checkoutError || t("error"));
      setLoading(false);
      return;
    }

    clearCart();
    window.location.href = url;
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50 text-lg">{t("emptyCart")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order summary */}
      <div className="bg-dark rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-bold text-lg mb-4">{t("summary")}</h3>
        <div className="space-y-3">
          {items.map((item) => {
            const unitPrice =
              item.type === "dish" || item.type === "compose"
                ? item.price + item.supplementsPrice
                : item.price;
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-white/70">
                  {item.quantity}x {getItemName(item)}
                </span>
                <span className="text-golden font-bold">
                  {(unitPrice * item.quantity).toFixed(2)}&euro;
                </span>
              </div>
            );
          })}
        </div>
        <CartSummary />
      </div>

      {/* Customer info */}
      <div className="bg-dark rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-white font-bold text-lg">{t("yourInfo")}</h3>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            {t("name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golden focus:outline-none transition-colors"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            {t("phone")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-golden focus:outline-none transition-colors"
            placeholder={t("phonePlaceholder")}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || !phone.trim()}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
          loading
            ? "bg-white/10 text-white/30 cursor-not-allowed"
            : "bg-golden hover:bg-golden-dark text-black"
        }`}
      >
        {loading ? t("processing") : t("pay")}
      </button>
    </form>
  );
}
