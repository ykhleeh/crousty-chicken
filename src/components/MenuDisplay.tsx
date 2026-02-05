import { useTranslations } from "next-intl";
import {
  menuItems,
  entryItems,
  drinks,
  desserts,
  addOns,
  sauces,
  toppings,
  viandes,
} from "@/data/menu";

export default function MenuDisplay() {
  const t = useTranslations("Display");
  const tMenu = useTranslations("Menu");
  const tEntries = useTranslations("Entries");
  const tCompose = useTranslations("Compose");

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white flex flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-golden/40 py-3 px-6 text-center">
        <h1 className="font-heading text-3xl font-extrabold tracking-wide text-golden">
          {t("title")}
        </h1>
      </header>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-0 flex-1 min-h-0">
        {/* ===== LEFT COLUMN: NOS PLATS ===== */}
        <div className="border-r border-golden/30 px-5 py-3 overflow-hidden flex flex-col">
          <h2 className="font-heading text-lg font-bold text-golden border-b border-golden/30 pb-1.5 mb-2 tracking-wide">
            {t("dishesTitle")}
          </h2>
          <div className="flex flex-col gap-1.5 flex-1">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-white">
                    {tMenu(item.nameKey)}
                  </span>
                  <span className="text-xs text-white/50 ml-1.5">
                    {tMenu(item.descriptionKey)}
                  </span>
                </div>
                <div className="shrink-0 text-xs text-golden font-medium whitespace-nowrap">
                  {item.singlePrice ? (
                    <span>{item.prices.M.toFixed(2)}€</span>
                  ) : (
                    <>
                      <span className="text-white/40">M</span>{" "}
                      {item.prices.M.toFixed(2)}€{" "}
                      <span className="text-white/40">L</span>{" "}
                      {item.prices.L.toFixed(2)}€{" "}
                      <span className="text-white/40">XL</span>{" "}
                      {item.prices.XL.toFixed(2)}€
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MIDDLE COLUMN: ENTRÉES + COMPOSE ===== */}
        <div className="border-r border-golden/30 px-5 py-3 overflow-hidden flex flex-col">
          {/* Entrées */}
          <h2 className="font-heading text-lg font-bold text-golden border-b border-golden/30 pb-1.5 mb-2 tracking-wide">
            {t("entriesTitle")}
          </h2>
          <div className="flex flex-col gap-1.5 mb-4">
            {entryItems.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-white">
                  {tEntries(item.nameKey)}
                </span>
                <span className="shrink-0 text-xs text-golden font-medium whitespace-nowrap">
                  {item.small.qty} {tEntries("pieces")} {item.small.price.toFixed(2)}€
                  <span className="text-white/30 mx-1">·</span>
                  {item.large.qty} {tEntries("pieces")} {item.large.price.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          {/* Compose ton Crousty */}
          <h2 className="font-heading text-lg font-bold text-golden border-b border-golden/30 pb-1.5 mb-2 tracking-wide">
            {t("composeTitle")}
          </h2>
          <p className="text-golden/80 text-xs font-medium mb-2">
            {t("composePricing")}
          </p>
          <div className="flex flex-col gap-1.5 text-xs">
            <div>
              <span className="text-white/50">{t("composeBase")}</span>
            </div>
            <div>
              <span className="text-white/50">{t("composeBaseSauce")}</span>
            </div>
            <div>
              <span className="text-golden/70 font-semibold">{t("composeMeat")} : </span>
              <span className="text-white/70">
                {tCompose("step4Options")}
              </span>
            </div>
            <div>
              <span className="text-golden/70 font-semibold">{t("composeSauce")} : </span>
              <span className="text-white/70">
                {tCompose("step5Options")}
              </span>
            </div>
            <div>
              <span className="text-golden/70 font-semibold">{t("composeTopping")} : </span>
              <span className="text-white/70">
                {tCompose("step6Options")}
              </span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN: BOISSONS + DESSERTS + SUPPLÉMENTS ===== */}
        <div className="px-5 py-3 overflow-hidden flex flex-col">
          {/* Boissons */}
          <h2 className="font-heading text-lg font-bold text-golden border-b border-golden/30 pb-1.5 mb-2 tracking-wide">
            {t("drinksTitle")}
            <span className="text-xs font-normal text-golden/60 ml-2">
              ({drinks[0].price.toFixed(2)}€ {t("each")})
            </span>
          </h2>
          <div className="flex flex-col gap-1 mb-4">
            {drinks.map((drink) => (
              <div key={drink.id} className="flex items-baseline gap-2 text-sm">
                <span className="text-white/40">·</span>
                <span className="text-white/90">{drink.name}</span>
              </div>
            ))}
          </div>

          {/* Desserts */}
          <h2 className="font-heading text-lg font-bold text-golden border-b border-golden/30 pb-1.5 mb-2 tracking-wide">
            {t("dessertsTitle")}
            <span className="text-xs font-normal text-golden/60 ml-2">
              ({desserts[0].price.toFixed(2)}€ {t("eachM")})
            </span>
          </h2>
          <div className="flex flex-col gap-1 mb-4">
            {desserts.map((dessert) => (
              <div key={dessert.id} className="flex items-baseline gap-2 text-sm">
                <span className="text-white/40">·</span>
                <span className="text-white/90">{dessert.name}</span>
              </div>
            ))}
          </div>

          {/* Suppléments */}
          <h2 className="font-heading text-lg font-bold text-golden border-b border-golden/30 pb-1.5 mb-2 tracking-wide">
            {t("supplementsTitle")}
          </h2>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-white/90">
                <span className="text-white/40 mr-2">·</span>
                {t("extraToppings")}
              </span>
              <span className="text-golden text-xs font-medium">
                +{addOns.extraToppings.price.toFixed(2)}€
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-white/90">
                <span className="text-white/40 mr-2">·</span>
                {t("extraSauces")}
              </span>
              <span className="text-golden text-xs font-medium">
                +{addOns.extraSauces.price.toFixed(2)}€
              </span>
            </div>
            {addOns.supplements.map((supp) => (
              <div key={supp.name} className="flex items-baseline justify-between">
                <span className="text-white/90">
                  <span className="text-white/40 mr-2">·</span>
                  {supp.name}
                </span>
                <span className="text-golden text-xs font-medium">
                  +{supp.price.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
