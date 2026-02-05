"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${locale}/order`}
            className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            &larr; {t("backToMenu")}
          </Link>
          <span className="text-golden font-heading font-bold">
            Crousty Chicken
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-8">
          {t("title")}
        </h1>
        <CheckoutForm />
      </main>
    </div>
  );
}
