import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-dark"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      <div className="absolute inset-0 bg-[url('/plats/plat-1.jpg')] bg-cover bg-center opacity-30" />

      <div className="relative text-center px-4 max-w-3xl">
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-golden mb-4 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8">
          {t("subtitle")}
        </p>
        <a
          href="#order"
          className="inline-block bg-golden hover:bg-golden-dark text-black font-bold text-lg px-8 py-4 rounded-full transition-colors"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
