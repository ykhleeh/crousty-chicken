# Guide de Résolution des Problèmes - Crousty Chicken

## Table des matières
1. [Problèmes Commandes](#problèmes-commandes)
2. [Problèmes Kiosk](#problèmes-kiosk)
3. [Problèmes Paiement](#problèmes-paiement)
4. [Problèmes Menu](#problèmes-menu)
5. [Problèmes Techniques](#problèmes-techniques)
6. [Maintenance](#maintenance)

---

## Problèmes Commandes

### La commande n'apparaît pas dans le dashboard

**Symptômes** : Client a payé mais la commande n'est pas visible.

**Causes possibles** :
1. Le filtre est actif (pas sur "Toutes")
2. La commande est en statut "pending" (paiement Stripe en cours)
3. Le webhook Stripe n'a pas été reçu

**Solutions** :
1. Sélectionnez le filtre "Toutes"
2. Attendez quelques secondes et rafraîchissez
3. Vérifiez le dashboard Stripe pour voir si le paiement est complété
4. Vérifiez les logs du webhook dans Stripe > Developers > Webhooks

---

### Le bouton de statut ne fonctionne pas

**Symptômes** : Clic sur "En préparation" ou "Prête" sans effet.

**Causes possibles** :
1. Le statut a déjà changé (UI désynchronisée)
2. Transition de statut non autorisée
3. Erreur serveur

**Solutions** :
1. Rafraîchissez la page (F5)
2. Vérifiez le message d'erreur dans la console (F12)
3. Les transitions valides sont :
   - `pending_payment` → `paid` (bouton Encaissé)
   - `paid` → `preparing`
   - `preparing` → `ready`

---

### Erreur "Cannot transition from X to Y"

**Cause** : La commande est dans un statut différent de ce que l'UI affiche.

**Solution** :
1. C'est un problème de synchronisation UI
2. Rafraîchissez la page
3. Le statut correct s'affichera

---

### Commande dupliquée

**Cause possible** : Double-clic du client sur le bouton de paiement.

**Solution** :
1. Vérifiez dans Stripe si deux paiements ont été effectués
2. Remboursez le paiement dupliqué si nécessaire
3. Marquez une des commandes comme "ready" pour la clôturer

---

## Problèmes Kiosk

### "Accès refusé" sur la tablette

**Causes possibles** :
1. Aucun token n'est configuré sur cette tablette
2. Le token a été supprimé

**Solutions** :
1. Connectez-vous à `/admin/kiosk/setup`
2. Créez un nouveau terminal avec un nom descriptif
3. Le token sera automatiquement stocké

---

### "Token invalide" sur la tablette

**Causes possibles** :
1. Le terminal a été désactivé par un admin
2. Le token a été supprimé de la base de données
3. Le localStorage de la tablette a été vidé

**Solutions** :
1. Vérifiez dans `/admin/kiosk/setup` si le terminal est actif
2. Si désactivé, cliquez sur "Activer"
3. Si supprimé, créez un nouveau terminal

---

### La tablette ne passe pas en plein écran

**Causes possibles** :
1. Le navigateur bloque le fullscreen
2. L'utilisateur n'a pas touché l'écran

**Solutions** :
1. L'API Fullscreen nécessite une action utilisateur (tap)
2. Assurez-vous que l'utilisateur touche l'écran sur le splash screen
3. Certains navigateurs (Safari) peuvent avoir des restrictions

---

### Comment sortir du mode kiosk (pour le staff)

**Méthode** :
1. Tapez **5 fois rapidement** dans le **coin supérieur gauche** de l'écran
2. Le mode plein écran se désactivera
3. Vous pouvez maintenant accéder aux paramètres du navigateur

---

### Le ticket ne s'affiche pas après commande

**Causes possibles** :
1. Erreur lors de la création de la commande
2. Token kiosk invalide

**Solutions** :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que le terminal est toujours actif
3. Testez en créant un nouveau terminal

---

## Problèmes Paiement

### Le paiement Stripe échoue

**Vérifications** :
1. Dashboard Stripe > Payments pour voir l'erreur exacte
2. Erreurs communes :
   - Carte refusée : problème côté client
   - Insufficient funds : fonds insuffisants
   - Authentication required : 3D Secure requis

**Solutions** :
1. Le client doit réessayer avec une autre carte
2. Vérifiez que le mode (test/live) correspond à vos clés

---

### Webhook Stripe non reçu

**Symptômes** : Paiement réussi sur Stripe mais commande reste en "pending".

**Vérifications** :
1. Stripe > Developers > Webhooks > Voir les tentatives
2. Vérifiez que l'URL du webhook est correcte
3. Vérifiez le `STRIPE_WEBHOOK_SECRET`

**Solutions** :
1. Corrigez l'URL du webhook si nécessaire
2. Mettez à jour le secret dans `.env`
3. Redéployez l'application
4. Pour une commande bloquée, mettez à jour manuellement le statut dans Supabase

---

### Remboursement

**Procédure** :
1. Allez sur dashboard.stripe.com
2. Trouvez le paiement
3. Cliquez sur "Refund"
4. Choisissez le montant (total ou partiel)

> **Note** : Le remboursement Stripe ne met pas à jour automatiquement le statut de la commande dans l'app.

---

## Problèmes Menu

### Un produit n'apparaît pas sur le site

**Vérifications** :
1. Le produit est-il marqué "Disponible" ?
2. Le produit a-t-il des prix configurés ?
3. Le produit est-il dans la bonne catégorie ?

**Solutions** :
1. Dans Gestion Menu, trouvez le produit
2. Vérifiez/cochez "Disponible"
3. Vérifiez que les prix sont renseignés

---

### Image du produit ne s'affiche pas

**Causes possibles** :
1. L'image n'a pas été uploadée
2. Problème de permissions Supabase Storage
3. URL incorrecte

**Solutions** :
1. Réuploadez l'image dans le formulaire produit
2. Vérifiez les policies du bucket `menu-images` dans Supabase
3. L'URL devrait commencer par votre URL Supabase

---

### Les prix sont incorrects

**Attention** : Les prix sont en **centimes** dans la base de données.

| Prix affiché | Valeur en DB |
|--------------|--------------|
| 9,50€ | 950 |
| 13,00€ | 1300 |

**Solution** : Multipliez le prix en euros par 100 lors de la saisie.

---

## Problèmes Techniques

### Le site ne charge pas

**Vérifications** :
1. Le serveur est-il en ligne ? (Vercel dashboard)
2. Erreurs dans les logs ?
3. Variables d'environnement correctes ?

**Solutions** :
1. Vérifiez le statut sur status.vercel.com
2. Consultez les logs de déploiement
3. Redéployez si nécessaire

---

### Erreur 500 (Internal Server Error)

**Causes possibles** :
1. Variable d'environnement manquante
2. Erreur dans le code
3. Problème Supabase

**Solutions** :
1. Vérifiez toutes les variables d'env sont définies
2. Consultez les logs Vercel pour l'erreur exacte
3. Vérifiez le statut Supabase

---

### Realtime ne fonctionne pas

**Symptômes** : Les commandes n'apparaissent pas automatiquement, il faut rafraîchir.

**Vérifications** :
1. Console > "Realtime subscription status: SUBSCRIBED" ?
2. Realtime est-il activé sur Supabase ?

**Solutions** :
1. Supabase > Project Settings > Database > Enable Realtime
2. Activez Realtime sur la table `orders`
3. Vérifiez les policies RLS permettent la lecture

---

### Erreur de build

**Commandes de diagnostic** :
```bash
npm run lint      # Vérifier les erreurs de linting
npm run build     # Voir les erreurs de compilation
```

**Erreurs communes** :
- Type manquant : Ajouter le type TypeScript
- Import manquant : Vérifier le chemin d'import
- Variable undefined : Vérifier les variables d'env

---

## Maintenance

### Mise à jour des dépendances

```bash
# Voir les packages outdated
npm outdated

# Mettre à jour (avec prudence)
npm update

# Mettre à jour une dépendance spécifique
npm install package@latest
```

> **Important** : Testez toujours après une mise à jour !

---

### Backup de la base de données

**Supabase** :
1. Dashboard > Project Settings > Database
2. Backups sont automatiques (plan payant)
3. Pour un backup manuel : SQL Editor > Export

---

### Nettoyage des anciennes commandes

Les commandes restent dans la base indéfiniment. Pour nettoyer :

```sql
-- Supprimer les commandes "ready" de plus de 30 jours
DELETE FROM orders
WHERE status = 'ready'
AND created_at < NOW() - INTERVAL '30 days';
```

> **Attention** : Faites un backup avant toute suppression !

---

### Monitoring

**Vercel** :
- Analytics intégrés
- Logs de fonction
- Alertes de build

**Supabase** :
- Dashboard > Reports
- Logs API
- Usage quotidien

**Stripe** :
- Dashboard > Developers > Logs
- Alertes de webhook

---

## Contacts d'urgence

| Problème | Action |
|----------|--------|
| Site down | Vérifier Vercel, puis contacter le dev |
| Paiements | Vérifier Stripe, puis contacter le dev |
| Base de données | Vérifier Supabase, puis contacter le dev |
| Sécurité | Contacter immédiatement le dev |

---

## Checklist de diagnostic rapide

Quand quelque chose ne fonctionne pas :

1. [ ] Rafraîchir la page
2. [ ] Vider le cache du navigateur
3. [ ] Essayer un autre navigateur
4. [ ] Vérifier la connexion internet
5. [ ] Vérifier les logs (console navigateur F12)
6. [ ] Vérifier le statut des services (Vercel, Supabase, Stripe)
7. [ ] Contacter le développeur avec les détails de l'erreur
