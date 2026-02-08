import { getTranslations, getLocale } from "next-intl/server";
import { getAvailableProducts } from "@/actions/menu-actions";
import { productToEntryItem } from "@/data/menu";

export default async function Entries() {
  const t = await getTranslations("Entries");
  const locale = await getLocale();

  // Fetch entries from database
  const entries = await getAvailableProducts("entry");
  const entryItems = entries.map(productToEntryItem);

  const getLocalizedName = (entry: ReturnType<typeof productToEntryItem>) => {
    if (locale === "nl" && entry.name_nl) return entry.name_nl;
    if (locale === "en" && entry.name_en) return entry.name_en;
    return entry.name_fr;
  };

  return (
    <section id="entries" className="py-20 px-4 bg-darker">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-center text-golden mb-12">
          {t("title")}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {entryItems.map((entry) => (
            <div
              key={entry.id}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-dark rounded-2xl p-6 border border-white/10 hover:border-golden/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                {getLocalizedName(entry)}
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                  <span className="text-white/70">
                    {entry.small.qty} {t("pieces")}
                  </span>
                  <span className="text-golden font-bold">
                    {entry.small.price.toFixed(2)}€
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                  <span className="text-white/70">
                    {entry.large.qty} {t("pieces")}
                  </span>
                  <span className="text-golden font-bold">
                    {entry.large.price.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
