"use client";

import { addOns } from "@/data/menu";

interface SupplementSelectorProps {
  selected: string[];
  onToggle: (supplement: string) => void;
}

export default function SupplementSelector({
  selected,
  onToggle,
}: SupplementSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {addOns.supplements.map((supp) => (
        <button
          key={supp.name}
          onClick={() => onToggle(supp.name)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selected.includes(supp.name)
              ? "bg-golden text-black font-bold"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {supp.name} +{supp.price.toFixed(2)}&euro;
        </button>
      ))}
    </div>
  );
}
