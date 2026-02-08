"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  toggleProductAvailability,
  deleteProduct,
} from "@/actions/menu-actions";
import type { Product, ProductCategory } from "@/types/product";
import { centsToEuros } from "@/types/product";

interface ProductCardProps {
  product: Product;
  category: ProductCategory;
  onEdit: () => void;
  onUpdate: () => void;
}

export default function ProductCard({
  product,
  category,
  onEdit,
  onUpdate,
}: ProductCardProps) {
  const t = useTranslations("AdminMenu");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleAvailability = async () => {
    setLoading(true);
    await toggleProductAvailability(product.id);
    onUpdate();
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteProduct(product.id);
    onUpdate();
    setLoading(false);
    setShowDeleteConfirm(false);
  };

  const getPriceDisplay = () => {
    switch (category) {
      case "dish":
        if (product.is_single_price) {
          return `${centsToEuros(product.price_m).toFixed(2)}€`;
        }
        return `M: ${centsToEuros(product.price_m).toFixed(2)}€ | L: ${centsToEuros(product.price_l).toFixed(2)}€ | XL: ${centsToEuros(product.price_xl).toFixed(2)}€`;
      case "entry":
        return `${product.qty_small}pcs: ${centsToEuros(product.price_small).toFixed(2)}€ | ${product.qty_large}pcs: ${centsToEuros(product.price_large).toFixed(2)}€`;
      case "drink":
      case "dessert":
        return `${centsToEuros(product.price).toFixed(2)}€`;
      default:
        return "";
    }
  };

  return (
    <div
      className={`bg-dark rounded-xl p-4 border transition-colors ${
        product.is_available
          ? "border-white/10 hover:border-golden/50"
          : "border-red-500/30 bg-red-900/10"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Image */}
        {product.image_url && category === "dish" && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
            <Image
              src={product.image_url}
              alt={product.name_fr}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full ${
                product.is_available ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <h3 className="text-white font-bold truncate">{product.name_fr}</h3>
            {!product.is_available && (
              <span className="text-xs text-red-400">({t("unavailable")})</span>
            )}
          </div>
          {product.description_fr && category === "dish" && (
            <p className="text-white/50 text-xs mb-2 line-clamp-1">
              {product.description_fr}
            </p>
          )}
          <p className="text-golden text-sm font-medium">{getPriceDisplay()}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            disabled={loading}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={t("edit")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleToggleAvailability}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              product.is_available
                ? "text-green-500 hover:bg-green-500/10"
                : "text-red-500 hover:bg-red-500/10"
            }`}
            title={product.is_available ? t("markUnavailable") : t("markAvailable")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {product.is_available ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              )}
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            title={t("delete")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          <p className="text-white text-sm mb-3">{t("deleteConfirm")}</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              {loading ? t("deleting") : t("confirmDelete")}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={loading}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
