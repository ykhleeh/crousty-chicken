"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import MenuSection from "@/components/order/MenuSection";
import EntrySection from "@/components/order/EntrySection";
import DrinkSection from "@/components/order/DrinkSection";
import DessertSection from "@/components/order/DessertSection";
import ComposeWizard from "@/components/order/ComposeWizard";
import CartDrawer from "@/components/cart/CartDrawer";
import CartIcon from "@/components/cart/CartIcon";
import { checkClickCollectEnabled } from "@/actions/order-actions";

export default function OrderPage() {
  const t = useTranslations("OrderPage");
  const locale = useLocale();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    checkClickCollectEnabled().then(setEnabled);
  }, []);

  if (enabled === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-golden text-xl">{t("loading")}</div>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-extrabold text-golden mb-4">
            {t("unavailableTitle")}
          </h1>
          <p className="text-white/70 mb-8">{t("unavailableDesc")}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-golden hover:bg-golden-dark text-black font-bold px-6 py-3 rounded-full transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-golden font-heading font-bold text-xl">
            Crousty Chicken
          </Link>
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

        <MenuSection />
        <EntrySection />
        <DrinkSection />
        <DessertSection />
      </main>

      {/* Compose Wizard Modal */}
      {showCompose && (
        <ComposeWizard onClose={() => setShowCompose(false)} />
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
