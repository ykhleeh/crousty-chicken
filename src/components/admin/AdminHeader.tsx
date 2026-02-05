"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminHeader() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
  };

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-golden font-heading font-bold text-xl">
          {t("dashboardTitle")}
        </h1>
        <button
          onClick={handleLogout}
          className="text-white/50 hover:text-white transition-colors text-sm"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}
