export type DishSize = "M" | "L" | "XL";
export type EntryPortion = "small" | "large";
export type OrderStatus = "pending" | "pending_payment" | "paid" | "preparing" | "ready";
export type OrderType = "online" | "kiosk";

export type CartItem =
  | {
      type: "dish";
      id: string;
      menuItemId: string;
      nameKey: string;
      name?: string; // Localized display name
      size: DishSize;
      price: number;
      quantity: number;
      supplements: string[];
      supplementsPrice: number;
    }
  | {
      type: "entry";
      id: string;
      entryItemId: string;
      nameKey: string;
      name?: string; // Localized display name
      portion: EntryPortion;
      price: number;
      quantity: number;
    }
  | {
      type: "drink";
      id: string;
      drinkId: string;
      name: string;
      price: number;
      quantity: number;
    }
  | {
      type: "dessert";
      id: string;
      dessertId: string;
      name: string;
      price: number;
      quantity: number;
    }
  | {
      type: "compose";
      id: string;
      size: DishSize;
      base: string;
      baseSauce: string;
      meat: string;
      chickenSauce: string;
      toppings: [string, string];
      price: number;
      quantity: number;
      supplements: string[];
      supplementsPrice: number;
    };

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  items: CartItem[];
  total_cents: number;
  status: OrderStatus;
  order_type: OrderType;
  kiosk_token_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface KioskToken {
  id: string;
  token: string;
  name: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}
