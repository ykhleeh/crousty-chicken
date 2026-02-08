"use client";

import type { Product, ProductCategory } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  category: ProductCategory;
  onEdit: (product: Product) => void;
  onUpdate: () => void;
}

export default function ProductList({
  products,
  category,
  onEdit,
  onUpdate,
}: ProductListProps) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={category}
          onEdit={() => onEdit(product)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
