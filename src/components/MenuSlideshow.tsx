"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { menuItems, entryItems } from "@/data/menu";

const SLIDE_DURATION = 8000;
const TOTAL_SLIDES = 10;

const DISH_TAG_KEYS: Record<string, string> = {
  original: "originalTags",
  spicyFries: "spicyFriesTags",
  vegeFries: "vegeFriesTags",
  bbqLoverRice: "bbqLoverRiceTags",
  vegeRice: "vegeRiceTags",
  bbqLoverFries: "bbqLoverFriesTags",
  spicyRice: "spicyRiceTags",
  fiftyFiftyBox: "fiftyFiftyBoxTags",
};

function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + "€";
}

/* ─── Dish Slide (slides 1-8) ─── */
function DishSlide({ index, active }: { index: number; active: boolean }) {
  const tMenu = useTranslations("Menu");
  const tSlideshow = useTranslations("Slideshow");
  const item = menuItems[index];

  const tagsKey = DISH_TAG_KEYS[item.nameKey];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagsString = tSlideshow(tagsKey as any) as string;
  const tags = tagsString.split(",").map((t) => t.trim());

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
        active
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex w-full h-full max-w-[1800px] mx-auto items-center px-12 gap-12">
        {/* Photo */}
        <div className="relative w-[55%] h-[70%] rounded-3xl overflow-hidden shadow-2xl shrink-0">
          <Image
            src={item.image}
            alt={tMenu(item.nameKey)}
            fill
            className="object-cover"
            sizes="55vw"
            priority={index === 0}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h2 className="font-heading text-5xl xl:text-6xl font-extrabold text-golden mb-6 leading-tight">
            {tMenu(item.nameKey)}
          </h2>
          <p className="text-xl xl:text-2xl text-white/80 leading-relaxed mb-8">
            {tMenu(item.descriptionKey)}
          </p>

          {/* Prices */}
          {item.singlePrice ? (
            <div className="mb-8">
              <span className="text-3xl xl:text-4xl font-bold text-golden">
                {formatPrice(item.prices.M)}
              </span>
            </div>
          ) : (
            <div className="flex gap-6 mb-8">
              {(["M", "L", "XL"] as const).map((size) => (
                <div key={size} className="flex flex-col items-center">
                  <span className="text-lg text-white/50 font-medium mb-1">
                    {size}
                  </span>
                  <span className="text-3xl xl:text-4xl font-bold text-golden">
                    {formatPrice(item.prices[size])}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-golden/15 border border-golden/40 text-golden text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Entries Slide (slide 9) ─── */
function EntriesSlide({ active }: { active: boolean }) {
  const tEntries = useTranslations("Entries");
  const tSlideshow = useTranslations("Slideshow");

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out px-12 ${
        active
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <h2 className="font-heading text-5xl xl:text-6xl font-extrabold text-golden mb-12">
        {tSlideshow("entriesTitle")}
      </h2>

      <div className="flex flex-wrap justify-center gap-6 max-w-[1400px]">
        {entryItems.map((entry) => (
          <div
            key={entry.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 w-[260px] flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold text-white mb-1 text-center">
              {tEntries(entry.nameKey)}
            </h3>
            {tEntries(entry.nameKey + "Desc") && (
              <p className="text-white/50 text-sm mb-4 text-center">
                {tEntries(entry.nameKey + "Desc")}
              </p>
            )}
            {!tEntries(entry.nameKey + "Desc") && <div className="mb-4" />}

            <div className="w-full space-y-2">
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2">
                <span className="text-white/70 text-lg">
                  {entry.small.qty} {tEntries("pieces")}
                </span>
                <span className="text-golden font-bold text-xl">
                  {formatPrice(entry.small.price)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2">
                <span className="text-white/70 text-lg">
                  {entry.large.qty} {tEntries("pieces")}
                </span>
                <span className="text-golden font-bold text-xl">
                  {formatPrice(entry.large.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Compose Slide (slide 10) ─── */
function ComposeSlide({ active }: { active: boolean }) {
  const t = useTranslations("Slideshow");

  const steps = [
    { num: 1, title: t("composeStep1"), options: t("composeStep1Options"), icon: "📏" },
    { num: 2, title: t("composeStep2"), options: t("composeStep2Options"), icon: "🍚" },
    { num: 3, title: t("composeStep3"), options: t("composeStep3Options"), icon: "🧀" },
    { num: 4, title: t("composeStep4"), options: t("composeStep4Options"), icon: "🍗" },
    { num: 5, title: t("composeStep5"), options: t("composeStep5Options"), icon: "🌶️" },
    { num: 6, title: t("composeStep6"), options: t("composeStep6Options"), icon: "🥗" },
  ];

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out px-12 ${
        active
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <h2 className="font-heading text-5xl xl:text-6xl font-extrabold text-golden mb-3">
        {t("composeTitle")}
      </h2>
      <p className="text-2xl text-white/70 mb-10">
        {t("composePricing")}
      </p>

      <div className="grid grid-cols-3 gap-6 max-w-[1400px] w-full">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{step.icon}</span>
              <h3 className="text-xl font-bold text-golden">
                {step.num}. {step.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {step.options.split(/[,/]/).map((opt) => (
                <span
                  key={opt.trim()}
                  className="bg-golden/10 border border-golden/30 text-golden text-base px-3 py-1 rounded-full"
                >
                  {opt.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Progress Bar ─── */
function ProgressBar({ slideIndex }: { slideIndex: number }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
      <div
        key={slideIndex}
        className="h-full bg-golden animate-progress"
        style={{ animationDuration: `${SLIDE_DURATION}ms` }}
      />
    </div>
  );
}

/* ─── Main Slideshow ─── */
export default function MenuSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const advance = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  }, []);

  useEffect(() => {
    const interval = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [advance]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <style jsx global>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress linear forwards;
        }
      `}</style>

      {/* Dish slides (0-7) */}
      {menuItems.map((_, i) => (
        <DishSlide key={i} index={i} active={currentSlide === i} />
      ))}

      {/* Entries slide (8) */}
      <EntriesSlide active={currentSlide === 8} />

      {/* Compose slide (9) */}
      <ComposeSlide active={currentSlide === 9} />

      {/* Progress bar */}
      <ProgressBar key={currentSlide} slideIndex={currentSlide} />
    </div>
  );
}
