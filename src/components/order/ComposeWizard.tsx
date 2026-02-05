"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { bases, baseSauces, viandes, sauces, toppings, addOns } from "@/data/menu";
import { useCartStore } from "@/store/cart-store";
import type { DishSize } from "@/types/order";

interface ComposeWizardProps {
  onClose: () => void;
}

const COMPOSE_PRICES: Record<DishSize, number> = { M: 9, L: 13, XL: 17 };

export default function ComposeWizard({ onClose }: ComposeWizardProps) {
  const t = useTranslations("ComposeWizard");
  const addItem = useCartStore((s) => s.addItem);

  const [step, setStep] = useState(0);
  const [size, setSize] = useState<DishSize | null>(null);
  const [base, setBase] = useState<string | null>(null);
  const [baseSauce, setBaseSauce] = useState<string | null>(null);
  const [meat, setMeat] = useState<string | null>(null);
  const [chickenSauce, setChickenSauce] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);

  const totalSteps = 8;

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) => {
      if (prev.includes(topping)) return prev.filter((t) => t !== topping);
      if (prev.length >= 2) return prev;
      return [...prev, topping];
    });
  };

  const toggleSupplement = (name: string) => {
    setSupplements((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0: return size !== null;
      case 1: return base !== null;
      case 2: return baseSauce !== null;
      case 3: return meat !== null;
      case 4: return chickenSauce !== null;
      case 5: return selectedToppings.length === 2;
      case 6: return true; // supplements optional
      case 7: return true; // recap
      default: return false;
    }
  };

  const handleAddToCart = () => {
    if (!size || !base || !baseSauce || !meat || !chickenSauce) return;

    const suppPrice = supplements.reduce((sum, s) => {
      const supp = addOns.supplements.find((x) => x.name === s);
      return sum + (supp?.price ?? 0);
    }, 0);

    addItem({
      type: "compose",
      id: `compose-${Date.now()}`,
      size,
      base,
      baseSauce,
      meat,
      chickenSauce,
      toppings: selectedToppings as [string, string],
      price: COMPOSE_PRICES[size],
      quantity: 1,
      supplements,
      supplementsPrice: suppPrice,
    });

    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepLayout title={t("step1Title")} desc={t("step1Desc")}>
            <div className="flex flex-col gap-3">
              {(["M", "L", "XL"] as DishSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    size === s
                      ? "border-golden bg-golden/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="text-white font-bold text-lg">{s}</span>
                  <span className="text-golden ml-3 font-bold">
                    {COMPOSE_PRICES[s].toFixed(2)}&euro;
                  </span>
                </button>
              ))}
            </div>
          </StepLayout>
        );

      case 1:
        return (
          <StepLayout title={t("step2Title")} desc={t("step2Desc")}>
            <div className="flex flex-col gap-3">
              {bases.map((b) => (
                <OptionButton
                  key={b}
                  label={b}
                  selected={base === b}
                  onClick={() => setBase(b)}
                />
              ))}
            </div>
          </StepLayout>
        );

      case 2:
        return (
          <StepLayout title={t("step3Title")} desc={t("step3Desc")}>
            <div className="flex flex-col gap-3">
              {baseSauces.map((s) => (
                <OptionButton
                  key={s}
                  label={s}
                  selected={baseSauce === s}
                  onClick={() => setBaseSauce(s)}
                />
              ))}
            </div>
          </StepLayout>
        );

      case 3:
        return (
          <StepLayout title={t("step4Title")} desc={t("step4Desc")}>
            <div className="flex flex-col gap-3">
              {viandes.map((v) => (
                <OptionButton
                  key={v}
                  label={v}
                  selected={meat === v}
                  onClick={() => setMeat(v)}
                />
              ))}
            </div>
          </StepLayout>
        );

      case 4:
        return (
          <StepLayout title={t("step5Title")} desc={t("step5Desc")}>
            <div className="flex flex-col gap-3">
              {sauces.map((s) => (
                <OptionButton
                  key={s}
                  label={s}
                  selected={chickenSauce === s}
                  onClick={() => setChickenSauce(s)}
                />
              ))}
            </div>
          </StepLayout>
        );

      case 5:
        return (
          <StepLayout
            title={t("step6Title")}
            desc={t("step6Desc", { count: selectedToppings.length })}
          >
            <div className="flex flex-col gap-3">
              {toppings.map((top) => (
                <button
                  key={top}
                  onClick={() => toggleTopping(top)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    selectedToppings.includes(top)
                      ? "border-golden bg-golden/10"
                      : selectedToppings.length >= 2
                        ? "border-white/5 text-white/30 cursor-not-allowed"
                        : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="text-white font-medium">{top}</span>
                </button>
              ))}
            </div>
          </StepLayout>
        );

      case 6:
        return (
          <StepLayout title={t("step7Title")} desc={t("step7Desc")}>
            <div className="flex flex-col gap-3">
              {addOns.supplements.map((supp) => (
                <button
                  key={supp.name}
                  onClick={() => toggleSupplement(supp.name)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors flex justify-between ${
                    supplements.includes(supp.name)
                      ? "border-golden bg-golden/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="text-white font-medium">{supp.name}</span>
                  <span className="text-golden font-bold">
                    +{supp.price.toFixed(2)}&euro;
                  </span>
                </button>
              ))}
            </div>
          </StepLayout>
        );

      case 7: {
        const suppPrice = supplements.reduce((sum, s) => {
          const supp = addOns.supplements.find((x) => x.name === s);
          return sum + (supp?.price ?? 0);
        }, 0);
        const totalPrice = (size ? COMPOSE_PRICES[size] : 0) + suppPrice;

        return (
          <StepLayout title={t("step8Title")} desc={t("step8Desc")}>
            <div className="space-y-3">
              <RecapLine label={t("recapSize")} value={`${size} — ${size ? COMPOSE_PRICES[size].toFixed(2) : 0}&euro;`} />
              <RecapLine label={t("recapBase")} value={base ?? ""} />
              <RecapLine label={t("recapBaseSauce")} value={baseSauce ?? ""} />
              <RecapLine label={t("recapMeat")} value={meat ?? ""} />
              <RecapLine label={t("recapChickenSauce")} value={chickenSauce ?? ""} />
              <RecapLine label={t("recapToppings")} value={selectedToppings.join(", ")} />
              {supplements.length > 0 && (
                <RecapLine
                  label={t("recapSupplements")}
                  value={`${supplements.join(", ")} (+${suppPrice.toFixed(2)}&euro;)`}
                />
              )}
              <div className="border-t border-white/10 pt-3 mt-3">
                <RecapLine
                  label={t("recapTotal")}
                  value={`${totalPrice.toFixed(2)}&euro;`}
                  bold
                />
              </div>
            </div>
          </StepLayout>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-golden font-heading font-bold text-lg">
          {t("title")}
        </h2>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 py-3">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-golden" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="text-white/50 text-xs mt-2">
          {t("stepOf", { current: step + 1, total: totalSteps })}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">{renderStep()}</div>

      {/* Navigation */}
      <div className="p-4 border-t border-white/10 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white font-medium hover:border-white/40 transition-colors"
          >
            {t("back")}
          </button>
        )}
        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              canProceed()
                ? "bg-golden hover:bg-golden-dark text-black"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {t("next")}
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 rounded-xl bg-golden hover:bg-golden-dark text-black font-bold transition-colors"
          >
            {t("addToCart")}
          </button>
        )}
      </div>
    </div>
  );
}

function StepLayout({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-white/50 text-sm mb-6">{desc}</p>
      {children}
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-colors ${
        selected
          ? "border-golden bg-golden/10"
          : "border-white/10 hover:border-white/30"
      }`}
    >
      <span className="text-white font-medium">{label}</span>
    </button>
  );
}

function RecapLine({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-white/70 ${bold ? "font-bold text-white" : ""}`}>
        {label}
      </span>
      <span
        className={`${bold ? "text-golden font-bold text-lg" : "text-white"}`}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
