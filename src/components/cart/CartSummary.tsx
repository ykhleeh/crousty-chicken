"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

export default function CartSummary() {
  const t = useTranslations("Cart");
  const totalPrice = useCartStore((s) => s.totalPrice);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(totalPrice());
  });

  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-white font-bold text-lg">{t("total")}</span>
        <span className="text-golden font-bold text-xl">
          {total.toFixed(2)}&euro;
        </span>
      </div>
    </div>
  );
}
