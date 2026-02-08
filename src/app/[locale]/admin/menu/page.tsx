"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import MenuManager from "@/components/admin/MenuManager";

export default function AdminMenuPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push(`/${locale}/admin/login`);
      } else {
        setLoading(false);
      }
    });
  }, [locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-golden text-xl">...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/admin/dashboard`}
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              &larr; {t("backToOrders")}
            </Link>
            <h1 className="text-golden font-heading font-bold text-xl">
              {t("menuTitle")}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <MenuManager />
      </main>
    </div>
  );
}
