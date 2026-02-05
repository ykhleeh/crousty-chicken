"use client";

import { useTranslations } from "next-intl";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  const t = useTranslations("Admin");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl font-extrabold text-golden mb-8 text-center">
          {t("loginTitle")}
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
