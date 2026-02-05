import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-golden font-bold text-lg mb-4">
              Crousty Chicken
            </h3>
            <p className="text-white/50 text-sm">
              Le meilleur poulet croustillant de Bruxelles.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t("followUs")}</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white/50 hover:text-golden transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-golden transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-golden transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">{t("contact")}</h3>
            <a
              href="mailto:info@croustychicken.be"
              className="text-white/50 hover:text-golden transition-colors text-sm"
            >
              {t("email")}
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/30 text-sm">{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
