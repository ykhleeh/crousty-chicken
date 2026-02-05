"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Header");

  const navItems = [
    { label: t("menu"), href: "#menu" },
    { label: t("entries"), href: "#entries" },
    { label: t("compose"), href: "#compose" },
    { label: t("order"), href: "#order" },
    { label: t("location"), href: "#location" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#hero">
          <Image
            src="/logo.jpeg"
            alt="Crousty Chicken"
            width={48}
            height={48}
            className="rounded"
            priority
          />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-white hover:text-golden transition-colors text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
