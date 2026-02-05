import { useTranslations } from "next-intl";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const t = useTranslations("Menu");

  return (
    <div className="bg-dark rounded-2xl overflow-hidden border border-white/10 hover:border-golden/50 transition-colors group">
      <div className="relative h-48 bg-white/5">
        <Image
          src={item.image}
          alt={t(item.nameKey)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{t(item.nameKey)}</h3>
        <p className="text-white/50 text-xs mb-3">{t(item.descriptionKey)}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {item.singlePrice ? (
            <span className="bg-white/10 rounded-lg px-3 py-1">
              <span className="text-white">{item.prices.M.toFixed(2)}€</span>
            </span>
          ) : (
            <>
              <span className="bg-white/10 rounded-lg px-3 py-1">
                <span className="text-golden font-bold">{t("sizeM")}</span>{" "}
                <span className="text-white">{item.prices.M.toFixed(2)}€</span>
              </span>
              <span className="bg-white/10 rounded-lg px-3 py-1">
                <span className="text-golden font-bold">{t("sizeL")}</span>{" "}
                <span className="text-white">{item.prices.L.toFixed(2)}€</span>
              </span>
              <span className="bg-white/10 rounded-lg px-3 py-1">
                <span className="text-golden font-bold">{t("sizeXL")}</span>{" "}
                <span className="text-white">{item.prices.XL.toFixed(2)}€</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
