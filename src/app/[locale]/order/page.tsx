import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAvailableProducts } from "@/actions/menu-actions";
import { checkClickCollectEnabled } from "@/actions/order-actions";
import {
  productToMenuItem,
  productToEntryItem,
  productToDrink,
  productToDessert,
} from "@/data/menu";
import OrderPageClient from "@/components/order/OrderPageClient";

interface OrderPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale } = await params;
  const t = await getTranslations("OrderPage");

  // Check if Click & Collect is enabled
  const enabled = await checkClickCollectEnabled();

  if (!enabled) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-extrabold text-golden mb-4">
            {t("unavailableTitle")}
          </h1>
          <p className="text-white/70 mb-8">{t("unavailableDesc")}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-golden hover:bg-golden-dark text-black font-bold px-6 py-3 rounded-full transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all available products
  const [dishes, entries, drinksData, dessertsData] = await Promise.all([
    getAvailableProducts("dish"),
    getAvailableProducts("entry"),
    getAvailableProducts("drink"),
    getAvailableProducts("dessert"),
  ]);

  // Convert to legacy interfaces
  const menuItems = dishes.map(productToMenuItem);
  const entryItems = entries.map(productToEntryItem);
  const drinks = drinksData.map(productToDrink);
  const desserts = dessertsData.map(productToDessert);

  return (
    <OrderPageClient
      menuItems={menuItems}
      entryItems={entryItems}
      drinks={drinks}
      desserts={desserts}
    />
  );
}
