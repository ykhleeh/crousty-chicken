-- ============================================
-- Seed Products Data
-- Migrate from src/data/menu.ts
-- Prices are in CENTS
-- ============================================

-- Plats principaux (dishes)
INSERT INTO products (category, name_fr, name_nl, name_en, description_fr, description_nl, description_en, image_url, price_m, price_l, price_xl, is_single_price, sort_order) VALUES
('dish', 'L''Original', 'The Original', 'The Original',
  'Riz chaud avec sauce maison, poulet nature, sauce Aigre Douce et oignons frits. Le classique simple et efficace.',
  'Warme rijst met huissaus, naturel kip, zoetzure saus en gebakken uien. De eenvoudige en doeltreffende klassieker.',
  'Warm rice with house sauce, plain chicken, Sweet & Sour sauce and fried onions. The simple and effective classic.',
  '/plats/plat-1.jpg', 900, 1300, 1700, false, 1),

('dish', 'Spicy fries', 'Spicy fries', 'Spicy fries',
  'Frites cheddar généreuses, poulet hot crousti-tendre, combo Sriracha Mayo + Hot Shot. Jalapeños frais, oignon jeune et oignon frits en topping. Une vraie explosion spicy !',
  'Royale cheddar frietjes, krokant-malse hot kip, Sriracha Mayo + Hot Shot combo. Verse jalapeños, lente-uitjes en gebakken uien als topping. Een echte pittige explosie!',
  'Generous cheddar fries, crispy-tender hot chicken, Sriracha Mayo + Hot Shot combo. Fresh jalapeños, spring onions and fried onions on top. A real spicy explosion!',
  '/plats/plat-2.jpg', 950, 1350, 1750, false, 2),

('dish', 'Vege fries', 'Vege fries', 'Vege fries',
  'Frites croustillantes avec cheddar fondant, falafels (vegan), double sauce à l''ail + Aigre Douce. Poivrons, oignons jeunes et oignons frits. Une option végétarienne généreuse et pleine de saveurs.',
  'Krokante frietjes met gesmolten cheddar, falafels (vegan), dubbele knoflooksaus + zoetzuur. Paprika, lente-uitjes en gebakken uien. Een royale vegetarische optie vol smaak.',
  'Crispy fries with melted cheddar, falafels (vegan), double garlic sauce + Sweet & Sour. Peppers, spring onions and fried onions. A generous vegetarian option full of flavour.',
  '/plats/plat-3.jpg', 950, 1350, 1750, false, 3),

('dish', 'BBQ Lover rice', 'BBQ Lover rice', 'BBQ Lover rice',
  'Riz chaud nappé de sauce maison, poulet (hot ou nature) avec sauce BBQ. Oignon frits et oignon jeunes. Un plat généreux et réconfortant aux saveurs BBQ.',
  'Warme rijst met huissaus, kip (hot of naturel) met BBQ-saus. Gebakken uien en lente-uitjes. Een royaal en troostrijk gerecht met BBQ-smaken.',
  'Warm rice topped with house sauce, chicken (hot or plain) with BBQ sauce. Fried onions and spring onions. A generous and comforting dish with BBQ flavours.',
  '/plats/plat-4.jpg', 950, 1350, 1750, false, 4),

('dish', 'Vege rice', 'Vege rice', 'Vege rice',
  'Riz chaud nappé de sauce maison, falafels (vege), double sauce à l''ail + Aigre Douce, poivrons, oignons jeunes et oignons frits. Un plat végétarien savoureux et bien équilibré.',
  'Warme rijst met huissaus, falafels (vege), dubbele knoflooksaus + zoetzuur, paprika, lente-uitjes en gebakken uien. Een smakelijk en evenwichtig vegetarisch gerecht.',
  'Warm rice topped with house sauce, falafels (vege), double garlic sauce + Sweet & Sour, peppers, spring onions and fried onions. A tasty and well-balanced vegetarian dish.',
  '/plats/plat-5.jpg', 900, 1300, 1700, false, 5),

('dish', 'BBQ Lover fries', 'BBQ Lover fries', 'BBQ Lover fries',
  'Frites croustillantes avec cheddar fondant, poulet (hot ou nature) nappé de sauce BBQ. Oignons frits, oignons jeunes et maïs. Un combo gourmand pour les amateurs de BBQ.',
  'Krokante frietjes met gesmolten cheddar, kip (hot of naturel) met BBQ-saus. Gebakken uien, lente-uitjes en maïs. Een gastronomische combo voor BBQ-liefhebbers.',
  'Crispy fries with melted cheddar, chicken (hot or plain) topped with BBQ sauce. Fried onions, spring onions and corn. A gourmet combo for BBQ lovers.',
  '/plats/plat-6.jpg', 950, 1350, 1750, false, 6),

('dish', 'Spicy rice', 'Spicy rice', 'Spicy rice',
  'Riz chaud, poulet hot, duo de sauces épicées (Sriracha Mayo + Hot Shot). Oignon frits, oignon jeunes et jalapeños. Un bol relevé et savoureux pour les amateurs de spicy.',
  'Warme rijst, hot kip, duo van pittige sauzen (Sriracha Mayo + Hot Shot). Gebakken uien, lente-uitjes en jalapeños. Een pittige en smaakvolle bowl voor liefhebbers van spicy.',
  'Warm rice, hot chicken, duo of spicy sauces (Sriracha Mayo + Hot Shot). Fried onions, spring onions and jalapeños. A bold and flavourful bowl for spicy lovers.',
  '/plats/plat-7.jpg', 950, 1350, 1750, false, 7),

('dish', '50/50 Box', '50/50 Box', '50/50 Box',
  '50% frites cheddar, 50% riz sauce maison, Poulet (hot ou nature), sauces SweetySweet + Aigre Douce. Oignon frits, oignon jeunes et maïs. Le combo parfait pour les indécis.',
  '50% cheddar frietjes, 50% rijst met huissaus, kip (hot of naturel), SweetySweet + zoetzure sauzen. Gebakken uien, lente-uitjes en maïs. De perfecte combo voor twijfelaars.',
  '50% cheddar fries, 50% rice with house sauce, chicken (hot or plain), SweetySweet + Sweet & Sour sauces. Fried onions, spring onions and corn. The perfect combo for the undecided.',
  '/plats/plat-8.jpg', 1700, 1700, 1700, true, 8);

-- Entrées (entries)
INSERT INTO products (category, name_fr, name_nl, name_en, qty_small, price_small, qty_large, price_large, sort_order) VALUES
('entry', 'Mozza sticks', 'Mozza sticks', 'Mozza sticks', 5, 550, 10, 1000, 1),
('entry', 'Wings', 'Wings', 'Wings', 5, 550, 10, 1000, 2),
('entry', 'Chili cheese', 'Chili cheese', 'Chili cheese', 5, 550, 10, 1000, 3),
('entry', 'Onion rings', 'Onion rings', 'Onion rings', 8, 550, 16, 1000, 4),
('entry', 'Poulet karaage', 'Kip karaage', 'Chicken karaage', 5, 550, 10, 1000, 5);

-- Boissons (drinks)
INSERT INTO products (category, name_fr, price, sort_order) VALUES
('drink', 'Coca-Cola', 250, 1),
('drink', 'Coca-Cola zéro', 250, 2),
('drink', 'Fuze tea pêche', 250, 3),
('drink', 'Cristaline', 250, 4),
('drink', 'Arizona', 250, 5),
('drink', 'Eau spa', 250, 6),
('drink', 'Fuze tea citron', 250, 7);

-- Desserts
INSERT INTO products (category, name_fr, price, sort_order) VALUES
('dessert', 'Tiramisu', 450, 1),
('dessert', 'Mousse au chocolat', 450, 2);
