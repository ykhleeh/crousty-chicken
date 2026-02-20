import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Crousty Chicken - Le meilleur poulet croustillant de Bruxelles",
  description:
    "Crousty Chicken - Poulet croustillant, frites, riz et sauces maison à Bruxelles. Commandez en ligne via UberEats, Just Eat ou Deliveroo.",
  openGraph: {
    title: "Crousty Chicken",
    description: "Le meilleur poulet croustillant de Bruxelles",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
