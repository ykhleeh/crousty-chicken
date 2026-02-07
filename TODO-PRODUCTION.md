# TODO - Production Ready

## Priorité 1 (Obligatoire avant lancement)

- [ ] **Stripe Live Mode**
  - Basculer sur le compte de production dans Stripe Dashboard
  - Créer un nouveau webhook en mode live : `https://croustychicken.be/api/webhooks/stripe`
  - Mettre à jour sur Vercel :
    - `STRIPE_SECRET_KEY` → clé live (`sk_live_...`)
    - `STRIPE_WEBHOOK_SECRET` → nouveau secret webhook live (`whsec_...`)

- [ ] **Son nouvelles commandes**
  - Ajouter une alerte sonore sur le dashboard quand une nouvelle commande arrive
  - Sinon la cuisine risque de rater des commandes

## Priorité 2 (Recommandé)

- [ ] **Notifications client**
  - Email ou SMS quand la commande passe à "Prête"
  - Utiliser Resend, SendGrid, ou Twilio

- [ ] **Sécurité admin**
  - Restreindre l'accès au dashboard à des emails spécifiques
  - Actuellement tout utilisateur Supabase authentifié peut y accéder

- [ ] **Impression tickets**
  - Bouton "Imprimer" sur chaque commande pour la cuisine

## Priorité 3 (Légal / Compliance)

- [ ] **CGV** (Conditions Générales de Vente)
  - Page `/cgv` avec les conditions

- [ ] **Politique de confidentialité** (RGPD)
  - Page `/confidentialite`
  - Expliquer quelles données sont collectées

- [ ] **Checkbox obligatoire**
  - Avant paiement : "J'accepte les CGV et la politique de confidentialité"

## Priorité 4 (Nice to have)

- [ ] **Monitoring erreurs**
  - Intégrer Sentry pour tracker les erreurs en production

- [ ] **Vue cuisine simplifiée**
  - Gros texte, moins de détails, optimisé pour écran cuisine

- [ ] **Analytics**
  - Tracker le nombre de commandes, revenus, plats populaires

- [ ] **Timeout commandes**
  - Que faire des commandes non récupérées après X heures ?
