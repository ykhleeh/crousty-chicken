"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import type { Drink } from "@/data/menu";

interface DrinkSectionProps {
  drinks: Drink[];
}

export default function DrinkSection({ drinks }: DrinkSectionProps) {
  const t = useTranslations("DrinksAndDesserts");
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (drink: Drink) => {
    addItem({
      type: "drink",
      id: `drink-${drink.id}-${Date.now()}`,
      drinkId: drink.id,
      name: drink.name,
      price: drink.price,
      quantity: 1,
    });
  };

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("drinksTitle")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {drinks.map((drink) => (
          <div
            key={drink.id}
            className="bg-dark rounded-2xl p-4 border border-white/10 hover:border-golden/50 transition-colors text-center"
          >
            <p className="text-white font-medium mb-1">{drink.name}</p>
            <p className="text-golden font-bold mb-3">
              {drink.price.toFixed(2)}&euro;
            </p>
            <button
              onClick={() => handleAdd(drink)}
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
