"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createProduct, updateProduct } from "@/actions/menu-actions";
import type { Product, ProductCategory } from "@/types/product";
import { centsToEuros, eurosToCents } from "@/types/product";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  product: Product | null;
  category: ProductCategory;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({
  product,
  category,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const t = useTranslations("AdminMenu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [nameFr, setNameFr] = useState(product?.name_fr || "");
  const [nameNl, setNameNl] = useState(product?.name_nl || "");
  const [nameEn, setNameEn] = useState(product?.name_en || "");
  const [descriptionFr, setDescriptionFr] = useState(product?.description_fr || "");
  const [descriptionNl, setDescriptionNl] = useState(product?.description_nl || "");
  const [descriptionEn, setDescriptionEn] = useState(product?.description_en || "");
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [priceM, setPriceM] = useState(
    product?.price_m ? centsToEuros(product.price_m).toFixed(2) : ""
  );
  const [priceL, setPriceL] = useState(
    product?.price_l ? centsToEuros(product.price_l).toFixed(2) : ""
  );
  const [priceXl, setPriceXl] = useState(
    product?.price_xl ? centsToEuros(product.price_xl).toFixed(2) : ""
  );
  const [price, setPrice] = useState(
    product?.price ? centsToEuros(product.price).toFixed(2) : ""
  );
  const [qtySmall, setQtySmall] = useState(product?.qty_small?.toString() || "5");
  const [qtyLarge, setQtyLarge] = useState(product?.qty_large?.toString() || "10");
  const [priceSmall, setPriceSmall] = useState(
    product?.price_small ? centsToEuros(product.price_small).toFixed(2) : ""
  );
  const [priceLarge, setPriceLarge] = useState(
    product?.price_large ? centsToEuros(product.price_large).toFixed(2) : ""
  );
  const [isSinglePrice, setIsSinglePrice] = useState(product?.is_single_price || false);
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data: Record<string, unknown> = {
        category,
        name_fr: nameFr,
        name_nl: nameNl || null,
        name_en: nameEn || null,
        is_available: isAvailable,
      };

      // Category-specific fields
      if (category === "dish") {
        data.description_fr = descriptionFr || null;
        data.description_nl = descriptionNl || null;
        data.description_en = descriptionEn || null;
        data.image_url = imageUrl || null;
        data.price_m = priceM ? eurosToCents(parseFloat(priceM)) : null;
        data.price_l = priceL ? eurosToCents(parseFloat(priceL)) : null;
        data.price_xl = priceXl ? eurosToCents(parseFloat(priceXl)) : null;
        data.is_single_price = isSinglePrice;
      } else if (category === "entry") {
        data.qty_small = qtySmall ? parseInt(qtySmall) : null;
        data.qty_large = qtyLarge ? parseInt(qtyLarge) : null;
        data.price_small = priceSmall ? eurosToCents(parseFloat(priceSmall)) : null;
        data.price_large = priceLarge ? eurosToCents(parseFloat(priceLarge)) : null;
      } else {
        data.price = price ? eurosToCents(parseFloat(price)) : null;
      }

      if (product) {
        const result = await updateProduct(product.id, data);
        if (result.error) {
          setError(result.error);
          return;
        }
      } else {
        const result = await createProduct(data as unknown as Parameters<typeof createProduct>[0]);
        if (result.error) {
          setError(result.error);
          return;
        }
      }

      onSuccess();
    } catch {
      setError(t("saveError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-dark rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {product ? t("editProduct") : t("addProduct")}
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Image (dishes only) */}
          {category === "dish" && (
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
            />
          )}

          {/* Names */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1">
                {t("nameFr")} *
              </label>
              <input
                type="text"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("nameNl")}
                </label>
                <input
                  type="text"
                  value={nameNl}
                  onChange={(e) => setNameNl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("nameEn")}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Descriptions (dishes only) */}
          {category === "dish" && (
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("descriptionFr")}
                </label>
                <textarea
                  value={descriptionFr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    {t("descriptionNl")}
                  </label>
                  <textarea
                    value={descriptionNl}
                    onChange={(e) => setDescriptionNl(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    {t("descriptionEn")}
                  </label>
                  <textarea
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Prices */}
          {category === "dish" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="singlePrice"
                  checked={isSinglePrice}
                  onChange={(e) => setIsSinglePrice(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="singlePrice" className="text-white/70 text-sm">
                  {t("singlePriceLabel")}
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    {t("priceM")} (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceM}
                    onChange={(e) => setPriceM(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                  />
                </div>
                {!isSinglePrice && (
                  <>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">
                        {t("priceL")} (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={priceL}
                        onChange={(e) => setPriceL(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">
                        {t("priceXl")} (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={priceXl}
                        onChange={(e) => setPriceXl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {category === "entry" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("qtySmall")}
                </label>
                <input
                  type="number"
                  value={qtySmall}
                  onChange={(e) => setQtySmall(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("priceSmall")} (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priceSmall}
                  onChange={(e) => setPriceSmall(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("qtyLarge")}
                </label>
                <input
                  type="number"
                  value={qtyLarge}
                  onChange={(e) => setQtyLarge(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  {t("priceLarge")} (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priceLarge}
                  onChange={(e) => setPriceLarge(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
                />
              </div>
            </div>
          )}

          {(category === "drink" || category === "dessert") && (
            <div>
              <label className="block text-white/70 text-sm mb-1">
                {t("price")} (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-golden focus:outline-none"
              />
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="available" className="text-white/70 text-sm">
              {t("availableLabel")}
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-golden hover:bg-golden-dark text-black font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
