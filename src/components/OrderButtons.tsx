import { useTranslations } from "next-intl";

export default function OrderButtons() {
  const t = useTranslations("Order");

  const platforms = [
    {
      name: "UberEats",
      label: t("uberEats"),
      href: "#",
      color: "bg-[#06C167]",
      hoverColor: "hover:bg-[#05a557]",
    },
    {
      name: "JustEat",
      label: t("justEat"),
      href: "#",
      color: "bg-[#FF8000]",
      hoverColor: "hover:bg-[#e67300]",
    },
    {
      name: "Deliveroo",
      label: t("deliveroo"),
      href: "#",
      color: "bg-[#00CCBC]",
      hoverColor: "hover:bg-[#00b8a9]",
    },
  ];

  return (
    <section id="order" className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-golden mb-4">
          {t("title")}
        </h2>
        <p className="text-white/70 mb-10 text-lg">{t("subtitle")}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${platform.color} ${platform.hoverColor} text-white font-bold text-lg px-8 py-4 rounded-full transition-colors inline-block`}
            >
              {platform.label}
            </a>
          ))}
        </div>

        <p className="text-white/40 text-sm mt-8">{t("comingSoon")}</p>
      </div>
    </section>
  );
}
