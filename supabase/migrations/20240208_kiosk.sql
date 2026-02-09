-- ============================================
-- Kiosk Mode Migration
-- Terminal kiosk pour commandes en magasin
-- ============================================

-- ============================================
-- Table: kiosk_tokens
-- Gère les tokens d'authentification des terminaux kiosk
-- ============================================

CREATE TABLE kiosk_tokens (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,           -- "Tablette 1", "Tablette entrée"
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  last_used_at  TIMESTAMPTZ
);

-- Index pour recherche rapide par token
CREATE INDEX idx_kiosk_tokens_token ON kiosk_tokens(token);
CREATE INDEX idx_kiosk_tokens_active ON kiosk_tokens(is_active);

-- RLS
ALTER TABLE kiosk_tokens ENABLE ROW LEVEL SECURITY;

-- Admin (authenticated) peut tout faire
CREATE POLICY "Admin full access" ON kiosk_tokens FOR ALL TO authenticated USING (true);

-- Public peut vérifier un token (lecture seule)
CREATE POLICY "Public can verify token" ON kiosk_tokens FOR SELECT TO anon USING (true);

-- ============================================
-- Modifications table orders
-- Ajout colonnes pour distinguer kiosk/online
-- ============================================

-- Type de commande: online (paiement Stripe) ou kiosk (paiement comptoir)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'online'
  CHECK (order_type IN ('online', 'kiosk'));

-- Référence au terminal kiosk (si applicable)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS kiosk_token_id UUID REFERENCES kiosk_tokens(id);

-- Mettre à jour la contrainte de statut pour inclure pending_payment
-- D'abord, supprimer l'ancienne contrainte si elle existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
    ALTER TABLE orders DROP CONSTRAINT orders_status_check;
  END IF;
END $$;

-- Ajouter la nouvelle contrainte avec pending_payment
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'pending_payment', 'paid', 'preparing', 'ready'));

-- Index pour filtrer par type
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
