import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAvailableProducts } from "@/actions/menu-actions";
import { verifyKioskToken } from "@/actions/kiosk-actions";
import {
  productToMenuItem,
  productToEntryItem,
  productToDrink,
  productToDessert,
} from "@/data/menu";
import KioskOrderPage from "@/components/kiosk/KioskOrderPage";

interface KioskPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function KioskPage({ params, searchParams }: KioskPageProps) {
  const { locale } = await params;
  const { token: queryToken } = await searchParams;
  const t = await getTranslations("Kiosk");

  // Get token from query param (for initial activation) or cookie
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("kiosk_token")?.value;
  const token = queryToken || cookieToken;

  // If no token at all, show access denied
  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-extrabold text-red-500 mb-4">
            {t("accessDenied")}
          </h1>
          <p className="text-white/70 mb-8">{t("accessDeniedDesc")}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  // Verify token
  const isValid = await verifyKioskToken(token);

  if (!isValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-extrabold text-red-500 mb-4">
            {t("invalidToken")}
          </h1>
          <p className="text-white/70 mb-8">{t("invalidTokenDesc")}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full transition-colors"
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
    <KioskOrderPage
      menuItems={menuItems}
      entryItems={entryItems}
      drinks={drinks}
      desserts={desserts}
      kioskToken={token}
    />
  );
}
