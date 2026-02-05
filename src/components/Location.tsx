import { useTranslations } from "next-intl";

export default function Location() {
  const t = useTranslations("Location");

  return (
    <section id="location" className="py-20 px-4 bg-darker">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-center text-golden mb-12">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">📍 Adresse</h3>
              <p className="text-white/70">{t("address")}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                🕐 {t("hoursTitle")}
              </h3>
              <p className="text-white/70">{t("hours")}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">📞 Contact</h3>
              <p className="text-white/70">{t("phone")}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 min-h-[300px] flex items-center justify-center">
            <div className="text-center text-white/30 p-8">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-sm">Google Maps Embed Placeholder</p>
              <p className="text-xs mt-1">Bruxelles, Belgique</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
