"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getProducts } from "@/actions/menu-actions";
import type { Product, ProductCategory } from "@/types/product";
import CategoryTabs from "./CategoryTabs";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export default function MenuManager() {
  const t = useTranslations("AdminMenu");
  const [category, setCategory] = useState<ProductCategory>("dish");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts(category);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadProducts();
  };

  const handleProductUpdate = () => {
    loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header with tabs and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CategoryTabs selected={category} onSelect={setCategory} />
        <button
          onClick={handleAdd}
          className="bg-golden hover:bg-golden-dark text-black font-bold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          + {t("addProduct")}
        </button>
      </div>

      {/* Product list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-golden">{t("loading")}</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50">{t("noProducts")}</p>
        </div>
      ) : (
        <ProductList
          products={products}
          category={category}
          onEdit={handleEdit}
          onUpdate={handleProductUpdate}
        />
      )}

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          category={category}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
