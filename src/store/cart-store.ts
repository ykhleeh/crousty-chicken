"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/order";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  decrementItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const state = get();
        // For drinks, desserts, entries: check if already exists and increment
        let existingIndex = -1;

        if (item.type === "drink") {
          existingIndex = state.items.findIndex(
            (i) => i.type === "drink" && i.drinkId === item.drinkId
          );
        } else if (item.type === "dessert") {
          existingIndex = state.items.findIndex(
            (i) => i.type === "dessert" && i.dessertId === item.dessertId
          );
        } else if (item.type === "entry") {
          existingIndex = state.items.findIndex(
            (i) =>
              i.type === "entry" &&
              i.entryItemId === item.entryItemId &&
              i.portion === item.portion
          );
        }

        if (existingIndex >= 0) {
          // Increment quantity
          set((state) => ({
            items: state.items.map((i, idx) =>
              idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          // Add new item
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      decrementItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          if (item.quantity <= 1) {
            get().removeItem(id);
          } else {
            get().updateQuantity(id, item.quantity - 1);
          }
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => {
          const itemTotal = item.price * item.quantity;
          if (
            (item.type === "dish" || item.type === "compose") &&
            item.supplementsPrice
          ) {
            return sum + itemTotal + item.supplementsPrice * item.quantity;
          }
          return sum + itemTotal;
        }, 0);
      },
    }),
    {
      name: "crousty-cart",
    }
  )
);
