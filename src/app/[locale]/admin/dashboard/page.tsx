"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminHeader from "@/components/admin/AdminHeader";
import OrderList from "@/components/admin/OrderList";
import ToggleClickCollect from "@/components/admin/ToggleClickCollect";

export default function AdminDashboardPage() {
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

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <ToggleClickCollect />
        <OrderList />
      </main>
    </div>
  );
}
