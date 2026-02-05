"use client";

import { useTranslations } from "next-intl";
import { entryItems } from "@/data/menu";
import { useCartStore } from "@/store/cart-store";
import type { EntryPortion } from "@/types/order";

export default function EntrySection() {
  const t = useTranslations("Entries");
  const tOrder = useTranslations("OrderPage");
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (
    entry: (typeof entryItems)[0],
    portion: EntryPortion
  ) => {
    const price = portion === "small" ? entry.small.price : entry.large.price;
    addItem({
      type: "entry",
      id: `entry-${entry.id}-${portion}-${Date.now()}`,
      entryItemId: entry.id,
      nameKey: entry.nameKey,
      portion,
      price,
      quantity: 1,
    });
  };

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entryItems.map((entry) => (
          <div
            key={entry.id}
            className="bg-dark rounded-2xl p-5 border border-white/10 hover:border-golden/50 transition-colors"
          >
            <h3 className="text-lg font-bold text-white mb-4">
              {t(entry.nameKey)}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                <span className="text-white/70 text-sm">
                  {entry.small.qty} {t("pieces")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-golden font-bold text-sm">
                    {entry.small.price.toFixed(2)}&euro;
                  </span>
                  <button
                    onClick={() => handleAdd(entry, "small")}
                    className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                <span className="text-white/70 text-sm">
                  {entry.large.qty} {t("pieces")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-golden font-bold text-sm">
                    {entry.large.price.toFixed(2)}&euro;
                  </span>
                  <button
                    onClick={() => handleAdd(entry, "large")}
                    className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
