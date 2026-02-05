import { getOrderById } from "@/actions/order-actions";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderStatusComponent from "@/components/confirmation/OrderStatus";

interface ConfirmationPageProps {
  params: Promise<{ locale: string; orderId: string }>;
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { locale, orderId } = await params;
  const t = await getTranslations("Confirmation");

  const order = await getOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-golden font-heading font-bold text-xl"
          >
            Crousty Chicken
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-golden mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-white/70 text-center mb-8">{t("subtitle")}</p>

        <OrderStatusComponent order={order} />

        <div className="text-center mt-8">
          <Link
            href={`/${locale}`}
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-full transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
