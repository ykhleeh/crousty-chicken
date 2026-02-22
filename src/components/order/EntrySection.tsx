"use client";

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
  const decrementItem = useCartStore((s) => s.decrementItem);
  const items = useCartStore((s) => s.items);

  const getCartItem = (entryId: string, portion: EntryPortion) => {
    return items.find(
      (item) =>
        item.type === "entry" &&
        item.entryItemId === entryId &&
        item.portion === portion
    );
  };

  const handleAdd = (entry: EntryItem, portion: EntryPortion) => {
    const price = portion === "small" ? entry.small.price : entry.large.price;
    addItem({
      type: "entry",
      id: `entry-${entry.id}-${portion}`,
      entryItemId: entry.id,
      nameKey: entry.nameKey,
      name: getLocalizedName(entry),
      portion,
      price,
      quantity: 1,
    });
  };

  const handleRemove = (entryId: string, portion: EntryPortion) => {
    const cartItem = getCartItem(entryId, portion);
    if (cartItem) {
      decrementItem(cartItem.id);
    }
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
          const smallItem = getCartItem(entry.id, "small");
          const largeItem = getCartItem(entry.id, "large");
          const smallQty = smallItem?.quantity || 0;
          const largeQty = largeItem?.quantity || 0;

          return (
            <div
              key={entry.id}
              className="bg-dark rounded-2xl p-5 border border-white/10 hover:border-golden/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                {getLocalizedName(entry)}
              </h3>
              <div className="space-y-2">
                {/* Small portion */}
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-white/70 text-sm">
                      {entry.small.qty} {t("pieces")}
                    </span>
                    <span className="text-golden font-bold text-sm">
                      {entry.small.price.toFixed(2)}&euro;
                    </span>
                  </div>
                  {smallQty === 0 ? (
                    <button
                      onClick={() => handleAdd(entry, "small")}
                      className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRemove(entry.id, "small")}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold w-7 h-7 rounded-lg transition-colors text-sm leading-none"
                      >
                        -
                      </button>
                      <span className="text-golden font-bold text-sm w-5 text-center">{smallQty}</span>
                      <button
                        onClick={() => handleAdd(entry, "small")}
                        className="bg-golden hover:bg-golden-dark text-black font-bold w-7 h-7 rounded-lg transition-colors text-sm leading-none"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Large portion */}
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-white/70 text-sm">
                      {entry.large.qty} {t("pieces")}
                    </span>
                    <span className="text-golden font-bold text-sm">
                      {entry.large.price.toFixed(2)}&euro;
                    </span>
                  </div>
                  {largeQty === 0 ? (
                    <button
                      onClick={() => handleAdd(entry, "large")}
                      className="bg-golden hover:bg-golden-dark text-black font-bold w-8 h-8 rounded-lg transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRemove(entry.id, "large")}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold w-7 h-7 rounded-lg transition-colors text-sm leading-none"
                      >
                        -
                      </button>
                      <span className="text-golden font-bold text-sm w-5 text-center">{largeQty}</span>
                      <button
                        onClick={() => handleAdd(entry, "large")}
                        className="bg-golden hover:bg-golden-dark text-black font-bold w-7 h-7 rounded-lg transition-colors text-sm leading-none"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
