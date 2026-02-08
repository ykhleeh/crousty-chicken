import type { Product } from "@/types/product";

export interface MenuItem {
  id: string;
  nameKey: string;
  descriptionKey: string;
  image: string;
  prices: {
    M: number;
    L: number;
    XL: number;
  };
  singlePrice?: boolean;
  // Localized names for direct display
  name_fr: string;
  name_nl: string | null;
  name_en: string | null;
  description_fr: string | null;
  description_nl: string | null;
  description_en: string | null;
}

export interface EntryItem {
  id: string;
  nameKey: string;
  small: { qty: number; price: number };
  large: { qty: number; price: number };
  // Localized names
  name_fr: string;
  name_nl: string | null;
  name_en: string | null;
}

export interface Drink {
  id: string;
  name: string;
  price: number;
}

export interface Dessert {
  id: string;
  name: string;
  price: number;
}

export interface AddOn {
  name: string;
  price: number;
}

// ============================================
// Convert DB Products to Legacy Interfaces
// ============================================

export function productToMenuItem(product: Product): MenuItem {
  return {
    id: product.id,
    nameKey: product.id,
    descriptionKey: product.id,
    image: product.image_url || "/plats/plat-1.jpg",
    prices: {
      M: (product.price_m || 0) / 100,
      L: (product.price_l || 0) / 100,
      XL: (product.price_xl || 0) / 100,
    },
    singlePrice: product.is_single_price,
    name_fr: product.name_fr,
    name_nl: product.name_nl,
    name_en: product.name_en,
    description_fr: product.description_fr,
    description_nl: product.description_nl,
    description_en: product.description_en,
  };
}

export function productToEntryItem(product: Product): EntryItem {
  return {
    id: product.id,
    nameKey: product.id,
    small: {
      qty: product.qty_small || 5,
      price: (product.price_small || 0) / 100,
    },
    large: {
      qty: product.qty_large || 10,
      price: (product.price_large || 0) / 100,
    },
    name_fr: product.name_fr,
    name_nl: product.name_nl,
    name_en: product.name_en,
  };
}

export function productToDrink(product: Product): Drink {
  return {
    id: product.id,
    name: product.name_fr,
    price: (product.price || 0) / 100,
  };
}

export function productToDessert(product: Product): Dessert {
  return {
    id: product.id,
    name: product.name_fr,
    price: (product.price || 0) / 100,
  };
}

// ============================================
// Static data (Compose wizard options - remain static)
// ============================================

export const bases = ["Riz", "Frites"];

export const sauces = ["Hot shot", "Aigre-douce", "Sweety sweet", "Dracula killer"];

export const toppings = [
  "Oignons frits",
  "Oignons jeunes",
  "Jalapeños",
  "Poivrons",
  "Maïs",
];

export const baseSauces = ["Sauce maison", "Cheddar"];

export const viandes = ["Poulet nature", "Poulet hot", "Falafel"];

export const addOns: {
  extraToppings: AddOn;
  extraSauces: AddOn;
  supplements: AddOn[];
} = {
  extraToppings: { name: "Extra toppings", price: 0.75 },
  extraSauces: { name: "Extra sauces", price: 1.0 },
  supplements: [
    { name: "Cheddar", price: 2.9 },
    { name: "Poulet", price: 3.9 },
    { name: "Bacon", price: 1.5 },
  ],
};
