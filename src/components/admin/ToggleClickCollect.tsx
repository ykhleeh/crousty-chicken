"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toggleClickCollect } from "@/actions/admin-actions";
import { checkClickCollectEnabled } from "@/actions/order-actions";

export default function ToggleClickCollect() {
  const t = useTranslations("Admin");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkClickCollectEnabled().then((val) => {
      setEnabled(val);
      setLoading(false);
    });
  }, []);

  const handleToggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    await toggleClickCollect(newValue);
  };

  if (loading) return null;

  return (
    <div className="bg-dark rounded-2xl p-5 border border-white/10 flex items-center justify-between">
      <div>
        <p className="text-white font-bold">{t("clickCollectToggle")}</p>
        <p className="text-white/50 text-sm">{t("clickCollectDesc")}</p>
      </div>
      <button
        onClick={handleToggle}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          enabled ? "bg-golden" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
