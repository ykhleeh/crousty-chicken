"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import CartItemComponent from "./CartItem";
import CartSummary from "./CartSummary";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark border-l border-white/10 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-white font-bold text-lg">{t("title")}</h2>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-white/50 text-center py-8">{t("empty")}</p>
            ) : (
              items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <CartSummary />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={clearCart}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm font-medium"
                >
                  {t("clear")}
                </button>
                <Link
                  href={`/${locale}/order/checkout`}
                  onClick={onClose}
                  className="flex-1 bg-golden hover:bg-golden-dark text-black font-bold py-3 rounded-xl transition-colors text-sm text-center"
                >
                  {t("checkout")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
