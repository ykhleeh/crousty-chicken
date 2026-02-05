export interface MenuItem {
  id: number;
  nameKey: string;
  descriptionKey: string;
  image: string;
  prices: {
    M: number;
    L: number;
    XL: number;
  };
  singlePrice?: boolean;
}

export interface EntryItem {
  id: number;
  nameKey: string;
  small: { qty: number; price: number };
  large: { qty: number; price: number };
}

export interface Drink {
  id: number;
  name: string;
  price: number;
}

export interface Dessert {
  id: number;
  name: string;
  price: number;
}

export interface AddOn {
  name: string;
  price: number;
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    nameKey: "original",
    descriptionKey: "originalDesc",
    image: "/plats/plat-1.jpg",
    prices: { M: 9.0, L: 13.0, XL: 17.0 },
  },
  {
    id: 2,
    nameKey: "spicyFries",
    descriptionKey: "spicyFriesDesc",
    image: "/plats/plat-2.jpg",
    prices: { M: 9.5, L: 13.5, XL: 17.5 },
  },
  {
    id: 3,
    nameKey: "vegeFries",
    descriptionKey: "vegeFriesDesc",
    image: "/plats/plat-3.jpg",
    prices: { M: 9.5, L: 13.5, XL: 17.5 },
  },
  {
    id: 4,
    nameKey: "bbqLoverRice",
    descriptionKey: "bbqLoverRiceDesc",
    image: "/plats/plat-4.jpg",
    prices: { M: 9.5, L: 13.5, XL: 17.5 },
  },
  {
    id: 5,
    nameKey: "vegeRice",
    descriptionKey: "vegeRiceDesc",
    image: "/plats/plat-5.jpg",
    prices: { M: 9.0, L: 13.0, XL: 17.0 },
  },
  {
    id: 6,
    nameKey: "bbqLoverFries",
    descriptionKey: "bbqLoverFriesDesc",
    image: "/plats/plat-6.jpg",
    prices: { M: 9.5, L: 13.5, XL: 17.5 },
  },
  {
    id: 7,
    nameKey: "spicyRice",
    descriptionKey: "spicyRiceDesc",
    image: "/plats/plat-7.jpg",
    prices: { M: 9.5, L: 13.5, XL: 17.5 },
  },
  {
    id: 8,
    nameKey: "fiftyFiftyBox",
    descriptionKey: "fiftyFiftyBoxDesc",
    image: "/plats/plat-8.jpg",
    prices: { M: 17.0, L: 17.0, XL: 17.0 },
    singlePrice: true,
  },
];

export const entryItems: EntryItem[] = [
  {
    id: 1,
    nameKey: "mozzaSticks",
    small: { qty: 5, price: 5.5 },
    large: { qty: 10, price: 10.0 },
  },
  {
    id: 2,
    nameKey: "wings",
    small: { qty: 5, price: 5.5 },
    large: { qty: 10, price: 10.0 },
  },
  {
    id: 3,
    nameKey: "chiliCheese",
    small: { qty: 5, price: 5.5 },
    large: { qty: 10, price: 10.0 },
  },
  {
    id: 4,
    nameKey: "onionRings",
    small: { qty: 8, price: 5.5 },
    large: { qty: 16, price: 10.0 },
  },
  {
    id: 5,
    nameKey: "pouletKaraage",
    small: { qty: 5, price: 5.5 },
    large: { qty: 10, price: 10.0 },
  },
];

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

export const drinks: Drink[] = [
  { id: 1, name: "Coca-Cola", price: 2.5 },
  { id: 2, name: "Coca-Cola zéro", price: 2.5 },
  { id: 3, name: "Fuze tea pêche", price: 2.5 },
  { id: 4, name: "Cristaline", price: 2.5 },
  { id: 5, name: "Arizona", price: 2.5 },
  { id: 6, name: "Eau spa", price: 2.5 },
  { id: 7, name: "Fuze tea citron", price: 2.5 },
];

export const desserts: Dessert[] = [
  { id: 1, name: "Tiramisu", price: 4.5 },
  { id: 2, name: "Mousse au chocolat", price: 4.5 },
];

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
