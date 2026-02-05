import { useTranslations } from "next-intl";
import { drinks, desserts } from "@/data/menu";

export default function DrinksAndDesserts() {
  const t = useTranslations("DrinksAndDesserts");

  return (
    <section id="drinks-desserts" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Drinks */}
        <div className="mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-center text-golden mb-2">
            {t("drinksTitle")}
          </h2>
          <p className="text-center text-white/50 mb-10 text-sm">
            {t("drinksPrice")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {drinks.map((drink) => (
              <div
                key={drink.id}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)] bg-dark rounded-2xl p-4 border border-white/10 hover:border-golden/50 transition-colors text-center"
              >
                <p className="text-white font-medium">{drink.name}</p>
                <p className="text-golden font-bold mt-1">
                  {drink.price.toFixed(2)}€
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desserts */}
        <div>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-center text-golden mb-2">
            {t("dessertsTitle")}
          </h2>
          <p className="text-center text-white/50 mb-10 text-sm">
            {t("dessertsPrice")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {desserts.map((dessert) => (
              <div
                key={dessert.id}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)] bg-dark rounded-2xl p-4 border border-white/10 hover:border-golden/50 transition-colors text-center"
              >
                <p className="text-white font-medium">{dessert.name}</p>
                <p className="text-golden font-bold mt-1">
                  {dessert.price.toFixed(2)}€
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
