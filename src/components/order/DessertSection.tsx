"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import type { Dessert } from "@/data/menu";

interface DessertSectionProps {
  desserts: Dessert[];
}

export default function DessertSection({ desserts }: DessertSectionProps) {
  const t = useTranslations("DrinksAndDesserts");
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const getQuantityInCart = (dessertId: string) => {
    return items
      .filter((item) => item.type === "dessert" && item.dessertId === dessertId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAdd = (dessert: Dessert) => {
    addItem({
      type: "dessert",
      id: `dessert-${dessert.id}-${Date.now()}`,
      dessertId: dessert.id,
      name: dessert.name,
      price: dessert.price,
      quantity: 1,
    });

    setJustAdded(dessert.id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("dessertsTitle")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {desserts.map((dessert) => {
          const qty = getQuantityInCart(dessert.id);
          const isJustAdded = justAdded === dessert.id;

          return (
            <div
              key={dessert.id}
              className="bg-dark rounded-2xl p-4 border border-white/10 hover:border-golden/50 transition-colors text-center relative"
            >
              {qty > 0 && (
                <span className="absolute -top-2 -right-2 bg-golden text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {qty}
                </span>
              )}
              <p className="text-white font-medium mb-1">{dessert.name}</p>
              <p className="text-golden font-bold mb-3">
                {dessert.price.toFixed(2)}&euro;
              </p>
              <button
                onClick={() => handleAdd(dessert)}
                className={`font-bold w-8 h-8 rounded-lg transition-all text-lg leading-none mx-auto block ${
                  isJustAdded
                    ? "bg-green-500 text-white scale-110"
                    : "bg-golden hover:bg-golden-dark text-black"
                }`}
              >
                {isJustAdded ? "✓" : "+"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
