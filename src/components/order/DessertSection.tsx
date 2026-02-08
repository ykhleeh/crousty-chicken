"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import type { Dessert } from "@/data/menu";

interface DessertSectionProps {
  desserts: Dessert[];
}

export default function DessertSection({ desserts }: DessertSectionProps) {
  const t = useTranslations("DrinksAndDesserts");
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (dessert: Dessert) => {
    addItem({
      type: "dessert",
      id: `dessert-${dessert.id}-${Date.now()}`,
      dessertId: dessert.id,
      name: dessert.name,
      price: dessert.price,
      quantity: 1,
    });
  };

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("dessertsTitle")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {desserts.map((dessert) => (
          <div
            key={dessert.id}
            className="bg-dark rounded-2xl p-4 border border-white/10 hover:border-golden/50 transition-colors text-center"
          >
            <p className="text-white font-medium mb-1">{dessert.name}</p>
            <p className="text-golden font-bold mb-3">
              {dessert.price.toFixed(2)}&euro;
            </p>
            <button
              onClick={() => handleAdd(dessert)}
              className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none mx-auto block"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
