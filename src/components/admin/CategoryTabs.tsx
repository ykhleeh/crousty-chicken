"use client";

import { useTranslations } from "next-intl";
import type { ProductCategory } from "@/types/product";

interface CategoryTabsProps {
  selected: ProductCategory;
  onSelect: (category: ProductCategory) => void;
}

const categories: ProductCategory[] = ["dish", "entry", "drink", "dessert"];

export default function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const t = useTranslations("AdminMenu");

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
            selected === cat
              ? "bg-golden text-black"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          }`}
        >
          {t(`category_${cat}`)}
        </button>
      ))}
    </div>
  );
}
