"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import KitchenDisplay from "@/components/kitchen/KitchenDisplay";

export default function KitchenPage() {
  const locale = useLocale();
  const router = useRouter();
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

  return <KitchenDisplay />;
}
