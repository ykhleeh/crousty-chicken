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
              <p className="text-white/70 whitespace-pre-line">{t("hours")}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">📞 Contact</h3>
              <p className="text-white/70">{t("phone")}</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.5698451229628!2d4.390031776369791!3d50.87616277167666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c3695d0ed1f5%3A0xb21d4fa0756fb41c!2sCrousty%20Chicken!5e0!3m2!1sfr!2sbe!4v1770599169582!5m2!1sfr!2sbe"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Crousty Chicken - Google Maps"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
