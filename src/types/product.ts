export type ProductCategory = "dish" | "entry" | "drink" | "dessert";

export interface Product {
  id: string;
  category: ProductCategory;
  name_fr: string;
  name_nl: string | null;
  name_en: string | null;
  description_fr: string | null;
  description_nl: string | null;
  description_en: string | null;
  image_url: string | null;
  price_m: number | null; // cents
  price_l: number | null; // cents
  price_xl: number | null; // cents
  price: number | null; // cents (for drinks, desserts)
  qty_small: number | null;
  qty_large: number | null;
  price_small: number | null; // cents
  price_large: number | null; // cents
  is_available: boolean;
  is_single_price: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  category: ProductCategory;
  name_fr: string;
  name_nl?: string | null;
  name_en?: string | null;
  description_fr?: string | null;
  description_nl?: string | null;
  description_en?: string | null;
  image_url?: string | null;
  price_m?: number | null;
  price_l?: number | null;
  price_xl?: number | null;
  price?: number | null;
  qty_small?: number | null;
  qty_large?: number | null;
  price_small?: number | null;
  price_large?: number | null;
  is_available?: boolean;
  is_single_price?: boolean;
  sort_order?: number;
}

export interface UpdateProductInput {
  category?: ProductCategory;
  name_fr?: string;
  name_nl?: string | null;
  name_en?: string | null;
  description_fr?: string | null;
  description_nl?: string | null;
  description_en?: string | null;
  image_url?: string | null;
  price_m?: number | null;
  price_l?: number | null;
  price_xl?: number | null;
  price?: number | null;
  qty_small?: number | null;
  qty_large?: number | null;
  price_small?: number | null;
  price_large?: number | null;
  is_available?: boolean;
  is_single_price?: boolean;
  sort_order?: number;
}

/**
 * Get the localized name for a product
 */
export function getLocalizedName(
  product: Product,
  locale: string
): string {
  if (locale === "nl" && product.name_nl) return product.name_nl;
  if (locale === "en" && product.name_en) return product.name_en;
  return product.name_fr;
}

/**
 * Get the localized description for a product
 */
export function getLocalizedDescription(
  product: Product,
  locale: string
): string | null {
  if (locale === "nl" && product.description_nl) return product.description_nl;
  if (locale === "en" && product.description_en) return product.description_en;
  return product.description_fr;
}

/**
 * Convert cents to euros for display
 */
export function centsToEuros(cents: number | null): number {
  return cents ? cents / 100 : 0;
}

/**
 * Convert euros to cents for storage
 */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}
