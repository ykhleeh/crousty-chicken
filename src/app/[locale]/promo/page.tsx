"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

// Splatter effect for grunge look
const Splatter = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="30" fill="#F5A623" opacity="0.8" />
    <circle cx="25" cy="35" r="8" fill="#F5A623" opacity="0.6" />
    <circle cx="75" cy="30" r="6" fill="#F5A623" opacity="0.5" />
    <circle cx="70" cy="70" r="10" fill="#F5A623" opacity="0.7" />
    <circle cx="30" cy="75" r="5" fill="#F5A623" opacity="0.4" />
    <circle cx="15" cy="55" r="4" fill="#F5A623" opacity="0.5" />
    <circle cx="85" cy="50" r="7" fill="#F5A623" opacity="0.6" />
    <ellipse cx="50" cy="50" rx="35" ry="25" fill="#F5A623" opacity="0.3" />
  </svg>
);

// Stamp badge style
const StampBadge = ({ children, className = "", rotate = -3 }: { children: React.ReactNode; className?: string; rotate?: number }) => (
  <div
    className={`relative inline-block ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <div className="bg-[#F5A623] text-black font-black uppercase px-4 py-1.5 text-sm tracking-wider
                    border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {children}
    </div>
  </div>
);

// Diagonal stripe background
const DiagonalStripes = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs>
      <pattern id="diag-stripes" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="20" stroke="#F5A623" strokeWidth="8" opacity="0.15" />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#diag-stripes)" />
  </svg>
);

// Menu data for back side - REAL PRODUCTS
const menuData = {
  bowls: [
    { name: "L'ORIGINAL", prices: { M: 9, L: 13, XL: 17 } },
    { name: "SPICY RICE", prices: { M: 9.5, L: 13.5, XL: 17.5 } },
    { name: "BBQ LOVER RICE", prices: { M: 9.5, L: 13.5, XL: 17.5 } },
    { name: "VEGE RICE", prices: { M: 9, L: 13, XL: 17 } },
    { name: "SPICY FRIES", prices: { M: 9.5, L: 13.5, XL: 17.5 } },
    { name: "BBQ LOVER FRIES", prices: { M: 9.5, L: 13.5, XL: 17.5 } },
    { name: "VEGE FRIES", prices: { M: 9.5, L: 13.5, XL: 17.5 } },
  ],
  entries: [
    { name: "Mozza sticks", small: "5 pcs", large: "10 pcs" },
    { name: "Wings", small: "5 pcs", large: "10 pcs" },
    { name: "Chili cheese", small: "5 pcs", large: "10 pcs" },
    { name: "Onion rings", small: "8 pcs", large: "16 pcs" },
    { name: "Poulet karaage", small: "5 pcs", large: "10 pcs" },
  ],
  entryPrices: { small: 5.5, large: 10 },
  drinks: ["Coca-Cola", "Coca-Cola zéro", "Fuze tea pêche", "Fuze tea citron", "Arizona", "Cristaline", "Eau spa"],
  drinkPrice: 2.5,
  desserts: ["Tiramisu", "Mousse au chocolat"],
  dessertPrice: 4.5,
  sauces: ["Hot Shot", "Aigre-Douce", "Sweety Sweet", "Dracula Killer", "Sauce Maison", "Cheddar"],
};

export default function PromoPage() {
  const locale = useLocale();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://croustychicken.be";
  const orderUrl = `${baseUrl}/${locale}/order`;

  return (
    <>
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html, body {
            width: 210mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .promo-wrapper {
            display: block !important;
            padding: 0 !important;
            background: black !important;
          }
          .promo-container {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .promo-container:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .screen-only { display: none !important; }
        }
        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>

      <div className="promo-wrapper min-h-screen bg-neutral-900 flex flex-col items-center justify-start p-4 print:p-0 print:bg-black">
        {/* A4 Container - 210mm x 297mm */}
        <div className="promo-container relative bg-black overflow-hidden shadow-2xl print:shadow-none"
             style={{ width: '210mm', minHeight: '297mm', aspectRatio: '210/297' }}>

          {/* Diagonal stripes background */}
          <DiagonalStripes className="absolute inset-0 w-full h-full" />

          {/* Splatter effects */}
          <Splatter className="absolute -top-10 -left-10 w-48 h-48 opacity-30 blur-[2px]" />
          <Splatter className="absolute top-1/3 -right-16 w-56 h-56 opacity-20 blur-[3px]" />
          <Splatter className="absolute bottom-20 -left-12 w-40 h-40 opacity-25 blur-[2px]" />

          {/* Bold border frame */}
          <div className="absolute inset-4 border-4 border-[#F5A623] pointer-events-none" />
          <div className="absolute inset-6 border border-[#F5A623]/30 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center h-full py-10 px-10" style={{ minHeight: '297mm' }}>

            {/* Top badge */}
            <StampBadge rotate={-2} className="mb-4">
              🔥 NOUVEAU À EVERE 🔥
            </StampBadge>

            {/* Logo */}
            <div className="mb-2">
              <Image
                src="/logo.png"
                alt="Crousty Chicken"
                width={130}
                height={130}
                className="drop-shadow-[0_0_30px_rgba(245,166,35,0.5)]"
                priority
              />
            </div>

            {/* Main tagline - AGGRESSIVE */}
            <div className="text-center mb-2">
              <h1 className="font-heading text-[3.2rem] font-black text-white tracking-tight leading-[0.95] uppercase"
                  style={{ textShadow: '4px 4px 0px #F5A623, 6px 6px 0px rgba(0,0,0,0.5)' }}>
                LE POULET
              </h1>
              <h1 className="font-heading text-[3.2rem] font-black text-[#F5A623] tracking-tight leading-[0.95] uppercase"
                  style={{ textShadow: '4px 4px 0px #000, -2px -2px 0px #000' }}>
                CROUSTILLANT
              </h1>
            </div>

            {/* Tilted accent phrase */}
            <div className="relative -rotate-2 mb-4">
              <div className="bg-[#F5A623] text-black font-black text-2xl uppercase px-6 py-2 tracking-wide"
                   style={{ clipPath: 'polygon(2% 0%, 100% 5%, 98% 100%, 0% 95%)' }}>
                QUI REND ACCRO ! 🔥
              </div>
            </div>

            {/* Dish Image with glow */}
            <div className="relative my-2 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-radial from-[#F5A623]/60 via-[#F5A623]/20 to-transparent rounded-full blur-[50px] scale-110" />
              <Image
                src="/plat-promo.png"
                alt="Crousty Chicken Bowl"
                width={300}
                height={225}
                className="relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                priority
              />
            </div>

            {/* Features - Bold style */}
            <div className="w-full max-w-[340px] my-3">
              <div className="space-y-2">
                {[
                  "⚡ PRÊT EN 10 MINUTES",
                  "📱 COMMANDE EN LIGNE",
                  "🎯 CLICK & COLLECT",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="bg-black/80 border-2 border-[#F5A623] text-white font-bold text-lg text-center py-2 uppercase tracking-wide"
                    style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* QR Code Section - Fixed sizing */}
            <div className="flex items-center justify-center gap-8 mb-4">
              {/* QR Box - tight */}
              <div className="bg-white p-2 border-4 border-[#F5A623] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                   style={{ transform: 'rotate(2deg)' }}>
                <QRCodeSVG
                  value={orderUrl}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>

              {/* CTA text */}
              <div className="text-left" style={{ transform: 'rotate(-1deg)' }}>
                <p className="text-[#F5A623] font-black text-xl uppercase tracking-wide">
                  SCANNE
                </p>
                <p className="text-white font-black text-2xl uppercase leading-tight">
                  POUR<br />COMMANDER
                </p>
                <p className="text-[#F5A623] font-bold text-sm mt-1">
                  → croustychicken.be
                </p>
              </div>
            </div>

            {/* Contact - Bold style */}
            <div className="w-full bg-[#F5A623] py-3 -mx-10 px-10 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-black font-bold">
                <span className="text-xl">📞</span>
                <span className="text-lg">0494 19 60 43</span>
              </div>
              <div className="w-px h-6 bg-black/30" />
              <div className="flex items-center gap-2 text-black font-bold">
                <span className="text-xl">📍</span>
                <span>Rue du Tilleul 55, 1140 Evere</span>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================ */}
        {/* VERSO - MENU SIDE */}
        {/* ============================================ */}
        <div className="promo-container relative bg-[#0a0a0a] overflow-hidden shadow-2xl print:shadow-none mt-8 print:mt-0"
             style={{ width: '210mm', minHeight: '297mm', aspectRatio: '210/297' }}>

          {/* Subtle diagonal stripes */}
          <DiagonalStripes className="absolute inset-0 w-full h-full opacity-50" />

          {/* Border frame */}
          <div className="absolute inset-4 border-2 border-[#F5A623]/60 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full py-6 px-8" style={{ minHeight: '297mm' }}>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-4 mb-1">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#F5A623]" />
                <Image
                  src="/logo.png"
                  alt="Crousty Chicken"
                  width={50}
                  height={50}
                  priority
                />
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#F5A623]" />
              </div>
              <h2 className="font-heading text-3xl font-black text-white uppercase tracking-wider">
                NOTRE <span className="text-[#F5A623]">MENU</span>
              </h2>
            </div>

            {/* BOWLS Section - Compact */}
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-2">
                <StampBadge rotate={-1}>🍗 BOWLS</StampBadge>
                <div className="flex-1 h-[1px] bg-[#F5A623]/30" />
                <div className="text-[#F5A623]/60 text-[10px] font-bold uppercase">M / L / XL</div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm">
                {menuData.bowls.map((bowl, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-white font-semibold">{bowl.name}</span>
                    <span className="text-[#F5A623] font-bold text-xs">
                      {bowl.prices.M}€ / {bowl.prices.L}€ / {bowl.prices.XL}€
                    </span>
                  </div>
                ))}
                {/* 50/50 Box inline */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-white font-semibold">50/50 BOX 🔥</span>
                  <span className="text-[#F5A623] font-bold text-xs">17€</span>
                </div>
              </div>
            </div>

            {/* ENTRÉES Section */}
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-2">
                <StampBadge rotate={1}>🔥 ENTRÉES</StampBadge>
                <div className="flex-1 h-[1px] bg-[#F5A623]/30" />
                <div className="text-[#F5A623]/60 text-[10px] font-bold uppercase">5,50€ / 10€</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {menuData.entries.map((entry, i) => (
                  <div key={i} className="bg-white/5 rounded-lg px-3 py-1.5 text-sm">
                    <span className="text-white font-semibold">{entry.name}</span>
                    <span className="text-white/50 text-xs ml-1">({entry.small} / {entry.large})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BOISSONS + DESSERTS - Compact row */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <StampBadge rotate={0}>🥤 BOISSONS</StampBadge>
                  <span className="text-[#F5A623] font-bold text-xs">2,50€</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {menuData.drinks.map((drink, i) => (
                    <span key={i} className="text-white/70 text-xs">{drink}{i < menuData.drinks.length - 1 ? " •" : ""}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <StampBadge rotate={-1}>🍰 DESSERTS</StampBadge>
                  <span className="text-[#F5A623] font-bold text-xs">4,50€</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {menuData.desserts.map((dessert, i) => (
                    <span key={i} className="text-white/70 text-xs">{dessert}{i < menuData.desserts.length - 1 ? " •" : ""}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* COMPOSE + SAUCES */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Compose */}
              <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-lg p-2.5">
                <p className="text-[#F5A623] font-bold text-sm mb-1">🎨 COMPOSE TON CROUSTY</p>
                <p className="text-white/60 text-xs leading-tight">
                  Base (Riz/Frites) + Viande (Poulet/Hot/Falafel) + 5 toppings + Sauces
                </p>
              </div>
              {/* Sauces */}
              <div>
                <p className="text-white font-bold text-sm mb-1.5">🌶️ Nos sauces maison</p>
                <div className="flex flex-wrap gap-1">
                  {menuData.sauces.map((sauce, i) => (
                    <span key={i} className="bg-[#F5A623]/20 text-[#F5A623] font-medium px-2 py-0.5 rounded-full text-[10px] border border-[#F5A623]/30">
                      {sauce}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* PROMO + QR CODE Section */}
            <div className="flex items-center justify-center gap-6 my-4 py-4 border-y border-[#F5A623]/20">
              {/* Promo offer */}
              <div className="text-center" style={{ transform: 'rotate(-1deg)' }}>
                <div className="bg-[#F5A623] text-black font-black text-lg uppercase px-4 py-1 mb-2 inline-block"
                     style={{ clipPath: 'polygon(3% 0%, 100% 5%, 97% 100%, 0% 95%)' }}>
                  OFFRE SPÉCIALE
                </div>
                <p className="text-white font-black text-3xl leading-tight">-10%</p>
                <p className="text-white/80 text-sm">sur ta 1ère commande</p>
                <p className="text-[#F5A623] font-bold text-lg mt-1">Code : CROUSTY10</p>
              </div>

              {/* Divider */}
              <div className="h-24 w-px bg-[#F5A623]/30" />

              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white p-2 rounded-lg shadow-[4px_4px_0px_0px_#F5A623] inline-block mb-2"
                     style={{ transform: 'rotate(2deg)' }}>
                  <QRCodeSVG
                    value={orderUrl}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>
                <p className="text-white font-bold text-sm">Scanne & Commande</p>
                <p className="text-[#F5A623] text-xs">croustychicken.be</p>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Bottom CTA */}
            <div className="text-center mb-3">
              <div className="inline-block bg-black border-3 border-[#F5A623] px-6 py-3 shadow-[4px_4px_0px_0px_#F5A623]"
                   style={{ transform: 'rotate(-1deg)' }}>
                <p className="text-white font-black text-lg uppercase mb-0.5">
                  Commande en ligne
                </p>
                <p className="text-[#F5A623] font-bold text-xl">
                  CROUSTYCHICKEN.BE
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#F5A623]/20 flex items-center justify-between text-white/50 text-xs">
              <span>Ouvert du Mardi au Dimanche</span>
              <span>12h - 14h • 18h - 22h</span>
              <span>📍 Rue du Tilleul 55, Evere</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
