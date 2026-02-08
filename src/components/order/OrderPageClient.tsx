"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import MenuSection from "@/components/order/MenuSection";
import EntrySection from "@/components/order/EntrySection";
import DrinkSection from "@/components/order/DrinkSection";
import DessertSection from "@/components/order/DessertSection";
import ComposeWizard from "@/components/order/ComposeWizard";
import CartDrawer from "@/components/cart/CartDrawer";
import CartIcon from "@/components/cart/CartIcon";
import type { MenuItem, EntryItem, Drink, Dessert } from "@/data/menu";

interface OrderPageClientProps {
  menuItems: MenuItem[];
  entryItems: EntryItem[];
  drinks: Drink[];
  desserts: Dessert[];
}

export default function OrderPageClient({
  menuItems,
  entryItems,
  drinks,
  desserts,
}: OrderPageClientProps) {
  const t = useTranslations("OrderPage");
  const locale = useLocale();
  const [showCompose, setShowCompose] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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

        <MenuSection menuItems={menuItems} />
        <EntrySection entryItems={entryItems} />
        <DrinkSection drinks={drinks} />
        <DessertSection desserts={desserts} />
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
