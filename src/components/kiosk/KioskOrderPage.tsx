"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import MenuSection from "@/components/order/MenuSection";
import EntrySection from "@/components/order/EntrySection";
import DrinkSection from "@/components/order/DrinkSection";
import DessertSection from "@/components/order/DessertSection";
import ComposeWizard from "@/components/order/ComposeWizard";
import CartDrawer from "@/components/cart/CartDrawer";
import CartIcon from "@/components/cart/CartIcon";
import KioskTicket from "./KioskTicket";
import KioskFullscreenWrapper from "./KioskFullscreenWrapper";
import { useCartStore } from "@/store/cart-store";
import { createKioskOrder } from "@/actions/kiosk-actions";
import type { MenuItem, EntryItem, Drink, Dessert } from "@/data/menu";

interface KioskOrderPageProps {
  menuItems: MenuItem[];
  entryItems: EntryItem[];
  drinks: Drink[];
  desserts: Dessert[];
  kioskToken: string;
}

export default function KioskOrderPage({
  menuItems,
  entryItems,
  drinks,
  desserts,
  kioskToken,
}: KioskOrderPageProps) {
  const t = useTranslations("Kiosk");
  const locale = useLocale();
  const [showCompose, setShowCompose] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: number;
    total: number;
  } | null>(null);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice);

  const handleSubmitOrder = async () => {
    if (items.length === 0 || submitting) return;

    setSubmitting(true);
    setError(null);

    const result = await createKioskOrder(items, kioskToken, locale);

    if ("error" in result) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    // Success: show ticket (convert euros to cents for display)
    setOrderResult({
      orderNumber: result.orderNumber,
      total: Math.round(totalPrice() * 100),
    });
    clearCart();
    setSubmitting(false);
    setCartOpen(false);
  };

  const handleNewOrder = () => {
    setOrderResult(null);
    setError(null);
  };

  // Show ticket if order was submitted
  if (orderResult) {
    return (
      <KioskFullscreenWrapper>
        <KioskTicket
          orderNumber={orderResult.orderNumber}
          total={orderResult.total}
          onNewOrder={handleNewOrder}
        />
      </KioskFullscreenWrapper>
    );
  }

  return (
    <KioskFullscreenWrapper>
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-golden/20 text-golden text-xs font-bold px-2 py-1 rounded">
              KIOSK
            </span>
            <span className="text-golden font-heading font-bold text-xl">
              Crousty Chicken
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCompose(true)}
              className="bg-golden hover:bg-golden-dark text-black font-bold px-4 py-2 rounded-full transition-colors text-sm"
            >
              {t("composeCta")}
            </button>
            <CartIcon onClick={() => setCartOpen(true)} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-golden mb-2">
          {t("title")}
        </h1>
        <p className="text-white/70 mb-10">{t("subtitle")}</p>

        <MenuSection menuItems={menuItems} />
        <EntrySection entryItems={entryItems} />
        <DrinkSection drinks={drinks} />
        <DessertSection desserts={desserts} />
      </main>

      {/* Compose Wizard Modal */}
      {showCompose && <ComposeWizard onClose={() => setShowCompose(false)} />}

      {/* Cart Drawer with custom checkout button */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        customCheckout={
          <div className="space-y-3">
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              onClick={handleSubmitOrder}
              disabled={submitting || items.length === 0}
              className={`w-full font-bold px-6 py-4 rounded-full transition-colors text-lg flex items-center justify-center gap-2 ${
                submitting || items.length === 0
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-golden hover:bg-golden-dark text-black"
              }`}
            >
              {submitting && (
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
              {submitting ? t("submitting") : t("placeOrder")}
            </button>
          </div>
        }
      />
    </div>
    </KioskFullscreenWrapper>
  );
}
