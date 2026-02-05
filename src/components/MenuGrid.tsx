import { useTranslations } from "next-intl";
import { menuItems } from "@/data/menu";
import MenuCard from "./MenuCard";

export default function MenuGrid() {
  const t = useTranslations("Menu");

  return (
    <section id="menu" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-center text-golden mb-12">
          {t("title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
