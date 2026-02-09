"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import type { CartItem as CartItemType } from "@/types/order";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const tCart = useTranslations("Cart");
  const { updateQuantity, removeItem } = useCartStore();

  const getName = () => {
    switch (item.type) {
      case "dish":
        // Use stored name if available, otherwise fallback to nameKey (may be UUID from old cart items)
        const dishName = item.name || item.nameKey;
        return `${dishName} (${item.size})`;
      case "entry":
        // Use stored name if available, otherwise fallback to nameKey
        const entryName = item.name || item.nameKey;
        return `${entryName} (${item.portion === "small" ? tCart("small") : tCart("large")})`;
      case "drink":
        return item.name;
      case "dessert":
        return item.name;
      case "compose":
        return `Compose (${item.size})`;
    }
  };

  const getSubtitle = () => {
    if (item.type === "compose") {
      const parts = [item.base, item.meat, item.chickenSauce];
      if (item.supplements.length > 0) {
        parts.push(`+ ${item.supplements.join(", ")}`);
      }
      return parts.join(", ");
    }
    if (item.type === "dish" && item.supplements.length > 0) {
      return `+ ${item.supplements.join(", ")}`;
    }
    return null;
  };

  const unitPrice =
    item.type === "dish" || item.type === "compose"
      ? item.price + item.supplementsPrice
      : item.price;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/10 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{getName()}</p>
        {getSubtitle() && (
          <p className="text-white/50 text-xs truncate">{getSubtitle()}</p>
        )}
        <p className="text-golden text-sm font-bold mt-1">
          {(unitPrice * item.quantity).toFixed(2)}&euro;
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-bold"
        >
          -
        </button>
        <span className="text-white text-sm w-5 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-bold"
        >
          +
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
