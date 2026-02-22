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
  const decrementItem = useCartStore((s) => s.decrementItem);
  const items = useCartStore((s) => s.items);

  const getCartItem = (dessertId: string) => {
    return items.find((item) => item.type === "dessert" && item.dessertId === dessertId);
  };

  const handleAdd = (dessert: Dessert) => {
    addItem({
      type: "dessert",
      id: `dessert-${dessert.id}`,
      dessertId: dessert.id,
      name: dessert.name,
      price: dessert.price,
      quantity: 1,
    });
  };

  const handleRemove = (dessertId: string) => {
    const cartItem = getCartItem(dessertId);
    if (cartItem) {
      decrementItem(cartItem.id);
    }
  };

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("dessertsTitle")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {desserts.map((dessert) => {
          const cartItem = getCartItem(dessert.id);
          const qty = cartItem?.quantity || 0;

          return (
            <div
              key={dessert.id}
              className="bg-dark rounded-2xl p-4 border border-white/10 hover:border-golden/50 transition-colors text-center"
            >
              <p className="text-white font-medium mb-1">{dessert.name}</p>
              <p className="text-golden font-bold mb-3">
                {dessert.price.toFixed(2)}&euro;
              </p>

              {qty === 0 ? (
                <button
                  onClick={() => handleAdd(dessert)}
                  className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none mx-auto block"
                >
                  +
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleRemove(dessert.id)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none"
                  >
                    -
                  </button>
                  <span className="text-golden font-bold text-lg w-6">{qty}</span>
                  <button
                    onClick={() => handleAdd(dessert)}
                    className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
