"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import type { EntryPortion } from "@/types/order";
import type { EntryItem } from "@/data/menu";

interface EntrySectionProps {
  entryItems: EntryItem[];
}

export default function EntrySection({ entryItems }: EntrySectionProps) {
  const t = useTranslations("Entries");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const getQuantityInCart = (entryId: string, portion: EntryPortion) => {
    return items
      .filter(
        (item) =>
          item.type === "entry" &&
          item.entryItemId === entryId &&
          item.portion === portion
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalQuantityInCart = (entryId: string) => {
    return items
      .filter((item) => item.type === "entry" && item.entryItemId === entryId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAdd = (entry: EntryItem, portion: EntryPortion) => {
    const price = portion === "small" ? entry.small.price : entry.large.price;
    addItem({
      type: "entry",
      id: `entry-${entry.id}-${portion}-${Date.now()}`,
      entryItemId: entry.id,
      nameKey: entry.nameKey,
      name: getLocalizedName(entry),
      portion,
      price,
      quantity: 1,
    });

    const key = `${entry.id}-${portion}`;
    setJustAdded(key);
    setTimeout(() => setJustAdded(null), 1500);
  };

  const getLocalizedName = (entry: EntryItem) => {
    if (locale === "nl" && entry.name_nl) return entry.name_nl;
    if (locale === "en" && entry.name_en) return entry.name_en;
    return entry.name_fr;
  };

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entryItems.map((entry) => {
          const totalQty = getTotalQuantityInCart(entry.id);
          const smallQty = getQuantityInCart(entry.id, "small");
          const largeQty = getQuantityInCart(entry.id, "large");
          const isSmallJustAdded = justAdded === `${entry.id}-small`;
          const isLargeJustAdded = justAdded === `${entry.id}-large`;

          return (
            <div
              key={entry.id}
              className="bg-dark rounded-2xl p-5 border border-white/10 hover:border-golden/50 transition-colors relative"
            >
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-golden text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
              <h3 className="text-lg font-bold text-white mb-4">
                {getLocalizedName(entry)}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                  <span className="text-white/70 text-sm">
                    {entry.small.qty} {t("pieces")}
                    {smallQty > 0 && (
                      <span className="text-golden ml-2">(×{smallQty})</span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-golden font-bold text-sm">
                      {entry.small.price.toFixed(2)}&euro;
                    </span>
                    <button
                      onClick={() => handleAdd(entry, "small")}
                      className={`font-bold w-8 h-8 rounded-lg transition-all text-lg leading-none ${
                        isSmallJustAdded
                          ? "bg-green-500 text-white scale-110"
                          : "bg-golden hover:bg-golden-dark text-black"
                      }`}
                    >
                      {isSmallJustAdded ? "✓" : "+"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                  <span className="text-white/70 text-sm">
                    {entry.large.qty} {t("pieces")}
                    {largeQty > 0 && (
                      <span className="text-golden ml-2">(×{largeQty})</span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-golden font-bold text-sm">
                      {entry.large.price.toFixed(2)}&euro;
                    </span>
                    <button
                      onClick={() => handleAdd(entry, "large")}
                      className={`font-bold w-8 h-8 rounded-lg transition-all text-lg leading-none ${
                        isLargeJustAdded
                          ? "bg-green-500 text-white scale-110"
                          : "bg-golden hover:bg-golden-dark text-black"
                      }`}
                    >
                      {isLargeJustAdded ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
