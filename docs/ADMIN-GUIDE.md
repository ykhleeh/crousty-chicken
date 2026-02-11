# Guide d'Administration - Crousty Chicken

## Table des matières
1. [Accès au Dashboard](#accès-au-dashboard)
2. [Gestion des Commandes](#gestion-des-commandes)
3. [Gestion du Menu](#gestion-du-menu)
4. [Mode Kiosk](#mode-kiosk)
5. [Click & Collect](#click--collect)
6. [Procédures Quotidiennes](#procédures-quotidiennes)
7. [Résolution des Problèmes](#résolution-des-problèmes)

---

## Accès au Dashboard

### URL d'accès
- **Production** : `https://[votre-domaine]/fr/admin/login`
- **Local** : `http://localhost:3000/fr/admin/login`

### Connexion
1. Entrez votre email administrateur
2. Entrez votre mot de passe
3. Cliquez sur "Se connecter"

> **Note** : Les identifiants sont gérés via Supabase Authentication. Contactez le développeur pour créer de nouveaux comptes admin.

---

## Gestion des Commandes

### Vue d'ensemble du Dashboard
Le dashboard affiche toutes les commandes avec les filtres suivants :
- **Toutes** : Affiche toutes les commandes actives
- **En attente paiement** : Commandes kiosk en attente d'encaissement
- **Payées** : Commandes payées, prêtes à être préparées
- **En préparation** : Commandes en cours de préparation
- **Prêtes** : Commandes terminées, prêtes à être récupérées

### Types de Commandes

#### Commandes ONLINE (Click & Collect)
- Badge bleu **[ONLINE]**
- Paiement effectué via Stripe (carte bancaire)
- Flow : `Payée` → `En préparation` → `Prête`

#### Commandes KIOSK (Tablette en magasin)
- Badge violet **[KIOSK]**
- Paiement au comptoir (cash ou carte)
- Flow : `En attente paiement` → `Payée` → `En préparation` → `Prête`

### Actions sur les Commandes

| Statut actuel | Action disponible | Résultat |
|---------------|-------------------|----------|
| En attente paiement | **Encaissé** (vert) | Passe à "Payée" |
| Payée | **En préparation** | Passe à "En préparation" |
| En préparation | **Prête** | Passe à "Prête" |
| Prête | - | Aucune action (commande terminée) |

### Procédure pour une Commande Kiosk
1. Le client commande sur la tablette kiosk
2. Le client présente son numéro de ticket au comptoir
3. Encaissez le paiement (cash ou carte)
4. Cliquez sur **Encaissé** dans le dashboard
5. Préparez la commande
6. Cliquez sur **En préparation**
7. Une fois prête, cliquez sur **Prête**

---

## Gestion du Menu

### Accès
Dashboard → **Gestion du Menu** (dans la navigation)

### Catégories
- **Plats** : Les plats principaux (L'Original, Spicy Fries, etc.)
- **Entrées** : Wings, Mozza sticks, etc.
- **Boissons** : Coca-Cola, Fanta, etc.
- **Desserts** : Tiramisu, etc.

### Ajouter un Produit
1. Sélectionnez la catégorie
2. Cliquez sur **Ajouter**
3. Remplissez les champs :
   - Nom (FR, NL, EN)
   - Description (FR, NL, EN)
   - Prix selon la catégorie
   - Image (optionnel)
4. Cliquez sur **Enregistrer**

### Modifier un Produit
1. Trouvez le produit dans la liste
2. Cliquez sur **Modifier**
3. Modifiez les champs souhaités
4. Cliquez sur **Enregistrer**

### Marquer un Produit Indisponible
Si un produit est en rupture de stock :
1. Trouvez le produit
2. Cliquez sur **Marquer indisponible**
3. Le produit n'apparaîtra plus sur le site de commande

> **Important** : N'oubliez pas de remettre le produit disponible une fois le stock reconstitué !

### Supprimer un Produit
1. Cliquez sur **Supprimer**
2. Confirmez la suppression

> **Attention** : Cette action est irréversible.

---

## Mode Kiosk

### Concept
Le mode kiosk permet aux clients de commander sur une tablette en magasin, puis de payer au comptoir.

### Configuration d'une Tablette Kiosk

#### Étape 1 : Activer le Terminal
1. Sur la tablette, allez sur `https://[votre-domaine]/fr/admin/kiosk/setup`
2. Connectez-vous avec un compte admin
3. Dans "Activer ce terminal", entrez un nom (ex: "Tablette 1")
4. Cliquez sur **Activer**
5. Le token est automatiquement stocké dans le navigateur

#### Étape 2 : Accéder au Mode Kiosk
1. Allez sur `https://[votre-domaine]/fr/kiosk`
2. Touchez l'écran pour passer en plein écran
3. La tablette est prête pour les commandes

### Gestion des Terminals
Accès : Dashboard → **Terminals Kiosk**

- **Voir tous les terminals** : Liste avec statut actif/inactif
- **Dernière utilisation** : Voir quand chaque terminal a été utilisé
- **Désactiver** : Suspendre temporairement un terminal
- **Supprimer** : Retirer définitivement un terminal

### Sortie du Mode Kiosk (Staff uniquement)
Pour sortir du plein écran et accéder aux paramètres :
1. **Tapez 5 fois rapidement** dans le coin supérieur gauche de l'écran
2. Le mode plein écran se désactive
3. Vous pouvez maintenant accéder au navigateur

---

## Click & Collect

### Activer/Désactiver le Service
1. Dans le Dashboard, trouvez le toggle **Click & Collect**
2. Activez ou désactivez selon les besoins

> **Cas d'utilisation** : Désactivez pendant les heures de pointe si la cuisine est débordée.

### Flow d'une Commande Click & Collect
1. Client commande sur le site web
2. Client paie par carte via Stripe
3. Commande apparaît dans le dashboard avec statut "Payée"
4. Préparez la commande → cliquez **En préparation**
5. Commande prête → cliquez **Prête**
6. Client récupère sa commande

---

## Procédures Quotidiennes

### Ouverture
1. [ ] Allumer les tablettes kiosk
2. [ ] Vérifier que le Click & Collect est activé
3. [ ] Vérifier le dashboard pour d'éventuelles commandes en attente
4. [ ] Vérifier la disponibilité des produits dans le menu

### Fermeture
1. [ ] Vérifier qu'il n'y a pas de commandes en attente
2. [ ] Désactiver le Click & Collect (optionnel)
3. [ ] Éteindre les tablettes kiosk
4. [ ] Se déconnecter du dashboard

### Hebdomadaire
1. [ ] Vérifier les terminals kiosk (dernière utilisation)
2. [ ] Mettre à jour les produits indisponibles
3. [ ] Vérifier les prix du menu

---

## Résolution des Problèmes

### Le dashboard ne se charge pas
1. Vérifiez votre connexion internet
2. Essayez de rafraîchir la page (F5 ou Ctrl+R)
3. Videz le cache du navigateur
4. Essayez un autre navigateur

### Une commande n'apparaît pas
1. Vérifiez le filtre actif (sélectionnez "Toutes")
2. Rafraîchissez la page
3. La commande peut être en statut "pending" (paiement Stripe en cours)

### Le bouton "Encaissé" ne fonctionne pas
1. L'erreur "Cannot mark as paid" signifie que le statut a déjà changé
2. Rafraîchissez la page pour voir le statut actuel
3. La commande est peut-être déjà payée

### La tablette kiosk affiche "Accès refusé"
1. Le terminal n'est pas activé ou a été désactivé
2. Allez sur `/admin/kiosk/setup` pour réactiver
3. Vérifiez que le terminal est bien "Actif" dans la liste

### La tablette kiosk affiche "Token invalide"
1. Le token a expiré ou a été supprimé
2. Supprimez le terminal dans l'admin
3. Créez un nouveau terminal sur cette tablette

### Un produit n'apparaît pas sur le site
1. Vérifiez qu'il est marqué comme "Disponible"
2. Vérifiez qu'il a un prix configuré
3. Rafraîchissez la page du site

### Problème de paiement Stripe
1. Vérifiez le dashboard Stripe pour les détails de l'erreur
2. La commande reste en "pending" si le paiement échoue
3. Le client doit réessayer le paiement

---

## Contacts Support

- **Problèmes techniques** : Contacter le développeur
- **Problèmes Stripe** : [Dashboard Stripe](https://dashboard.stripe.com)
- **Problèmes Supabase** : [Dashboard Supabase](https://supabase.com/dashboard)

---

## Raccourcis Utiles

| Action | URL |
|--------|-----|
| Dashboard commandes | `/fr/admin/dashboard` |
| Gestion menu | `/fr/admin/menu` |
| Gestion kiosk | `/fr/admin/kiosk/setup` |
| Page kiosk | `/fr/kiosk` |
| Site client | `/fr` |
| Click & Collect | `/fr/order` |
