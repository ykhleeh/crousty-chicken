import { useTranslations } from "next-intl";

interface StepProps {
  title: string;
  description: string;
  options: string;
  note?: string;
  icon: string;
}

function Step({ title, description, options, note, icon }: StepProps) {
  return (
    <div className="bg-dark rounded-2xl p-6 border border-white/10 hover:border-golden/40 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-golden mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {options.split(/[,/]/).map((opt) => (
          <span
            key={opt.trim()}
            className="bg-golden/10 border border-golden/30 text-golden text-sm px-3 py-1 rounded-full"
          >
            {opt.trim()}
          </span>
        ))}
      </div>
      {note && (
        <p className="text-golden/70 text-xs mt-3 italic">* {note}</p>
      )}
    </div>
  );
}

export default function ComposeTonCrousty() {
  const t = useTranslations("Compose");

  const steps: (StepProps & { key: string })[] = [
    {
      key: "step1",
      title: t("step1Title"),
      description: t("step1Desc"),
      options: t("step1Options"),
      icon: "📏",
    },
    {
      key: "step2",
      title: t("step2Title"),
      description: t("step2Desc"),
      options: t("step2Options"),
      icon: "🍚",
    },
    {
      key: "step3",
      title: t("step3Title"),
      description: t("step3Desc"),
      options: t("step3Options"),
      note: t("step3Note"),
      icon: "🧀",
    },
    {
      key: "step4",
      title: t("step4Title"),
      description: t("step4Desc"),
      options: t("step4Options"),
      icon: "🍗",
    },
    {
      key: "step5",
      title: t("step5Title"),
      description: t("step5Desc"),
      options: t("step5Options"),
      icon: "🌶️",
    },
    {
      key: "step6",
      title: t("step6Title"),
      description: t("step6Desc"),
      options: t("step6Options"),
      icon: "🥗",
    },
  ];

  return (
    <section id="compose" className="py-20 px-4 bg-darker">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-center text-golden mb-4">
          {t("title")}
        </h2>
        <p className="text-center text-white/70 mb-4 text-lg">
          {t("subtitle")}
        </p>
        <p className="text-center text-golden/80 mb-12 text-sm font-medium">
          {t("pricing")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <Step
              key={step.key}
              title={step.title}
              description={step.description}
              options={step.options}
              note={step.note}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
