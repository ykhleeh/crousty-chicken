"use client";

import type { DishSize } from "@/types/order";

interface SizeSelectorProps {
  prices: { M: number; L: number; XL: number };
  selected: DishSize | null;
  onSelect: (size: DishSize) => void;
  singlePrice?: boolean;
}

const sizes: DishSize[] = ["M", "L", "XL"];

export default function SizeSelector({
  prices,
  selected,
  onSelect,
  singlePrice,
}: SizeSelectorProps) {
  if (singlePrice) {
    return (
      <span className="text-golden font-bold">{prices.M.toFixed(2)}&euro;</span>
    );
  }

  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
            selected === size
              ? "bg-golden text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {size} — {prices[size].toFixed(2)}&euro;
        </button>
      ))}
    </div>
  );
}
