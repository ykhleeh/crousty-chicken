"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { menuItems, addOns } from "@/data/menu";
import { useCartStore } from "@/store/cart-store";
import type { DishSize } from "@/types/order";
import SizeSelector from "./SizeSelector";
import SupplementSelector from "./SupplementSelector";

export default function MenuSection() {
  const t = useTranslations("Menu");
  const tOrder = useTranslations("OrderPage");
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="mb-12">
      <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            tMenu={t}
            tOrder={tOrder}
            onAdd={(size, supplements) => {
              const suppPrice = supplements.reduce((sum, s) => {
                const supp = addOns.supplements.find((x) => x.name === s);
                return sum + (supp?.price ?? 0);
              }, 0);
              addItem({
                type: "dish",
                id: `dish-${item.id}-${size}-${Date.now()}`,
                menuItemId: item.id,
                nameKey: item.nameKey,
                size,
                price: item.prices[size],
                quantity: 1,
                supplements,
                supplementsPrice: suppPrice,
              });
            }}
          />
        ))}
      </div>
    </section>
  );
}

function MenuItemCard({
  item,
  tMenu,
  tOrder,
  onAdd,
}: {
  item: (typeof menuItems)[0];
  tMenu: ReturnType<typeof useTranslations>;
  tOrder: ReturnType<typeof useTranslations>;
  onAdd: (size: DishSize, supplements: string[]) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<DishSize | null>(
    item.singlePrice ? "M" : null
  );
  const [supplements, setSupplements] = useState<string[]>([]);
  const [showSupplements, setShowSupplements] = useState(false);

  const toggleSupplement = (name: string) => {
    setSupplements((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleAdd = () => {
    if (!selectedSize) return;
    onAdd(selectedSize, supplements);
    setSelectedSize(item.singlePrice ? "M" : null);
    setSupplements([]);
    setShowSupplements(false);
  };

  return (
    <div className="bg-dark rounded-2xl overflow-hidden border border-white/10 hover:border-golden/50 transition-colors flex flex-col">
      <div className="relative h-40 bg-white/5">
        <Image
          src={item.image}
          alt={tMenu(item.nameKey)}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-1">
          {tMenu(item.nameKey)}
        </h3>
        <p className="text-white/50 text-xs mb-3 line-clamp-2">
          {tMenu(item.descriptionKey)}
        </p>
        <div className="mt-auto space-y-3">
          <SizeSelector
            prices={item.prices}
            selected={selectedSize}
            onSelect={setSelectedSize}
            singlePrice={item.singlePrice}
          />
          {selectedSize && (
            <>
              <button
                onClick={() => setShowSupplements(!showSupplements)}
                className="text-xs text-golden/70 hover:text-golden transition-colors"
              >
                {showSupplements
                  ? tOrder("hideSupplements")
                  : tOrder("addSupplements")}
              </button>
              {showSupplements && (
                <SupplementSelector
                  selected={supplements}
                  onToggle={toggleSupplement}
                />
              )}
              <button
                onClick={handleAdd}
                className="w-full bg-golden hover:bg-golden-dark text-black font-bold py-2 rounded-xl transition-colors text-sm"
              >
                {tOrder("addToCart")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
