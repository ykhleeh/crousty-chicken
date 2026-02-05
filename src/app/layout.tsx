import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crousty Chicken - Le meilleur poulet croustillant de Bruxelles",
  description:
    "Crousty Chicken - Poulet croustillant, frites, riz et sauces maison à Bruxelles. Commandez en ligne via UberEats, Just Eat ou Deliveroo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
