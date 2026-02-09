import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getKioskTerminals } from "@/actions/kiosk-actions";
import KioskTokenSetup from "@/components/kiosk/KioskTokenSetup";

interface AdminKioskSetupProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminKioskSetupPage({
  params,
}: AdminKioskSetupProps) {
  const { locale } = await params;
  const t = await getTranslations("AdminKiosk");

  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch terminals
  const terminals = await getKioskTerminals();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-golden font-heading font-bold text-xl">
            {t("pageTitle")}
          </h1>
          <Link
            href={`/${locale}/admin/dashboard`}
            className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            <span>&larr;</span> {t("backToDashboard")}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <KioskTokenSetup initialTerminals={terminals} />
      </main>
    </div>
  );
}
