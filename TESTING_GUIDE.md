# Guide de test pour la gestion des Organisations

Ce document explique comment tester l'implémentation complète de la gestion des organisations avec Better Auth.

## Étape 1 : Configuration
1.  **Fichier `.env`** : Assurez-vous d'avoir configuré `DATABASE_URL`, `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL`.
2.  **Base de données** : Appliquez les schémas avec `npx prisma migrate dev`.

## Étape 2 : Test de Création
1.  Ouvrez l'application sur `/login`.
2.  Créez un compte (ex: `admin@test.com`) et connectez-vous.
3.  Allez sur `/organizations`.
4.  Remplissez le formulaire "Créer une Organisation" et validez.
5.  L'organisation doit apparaître dans "Mes Organisations". Cliquez sur "Activer".

## Étape 3 : Test d'Invitation et "Rejoindre"
1.  Dans l'organisation active, utilisez le formulaire d'invitation pour inviter un autre email (ex: `user@test.com`).
2.  **Vérifiez la console du serveur** : Le lien d'invitation sera affiché (ex: `http://localhost:3000/accept-invitation/ID_INVIT`).
3.  Déconnectez-vous et créez un compte avec l'email invité (`user@test.com`).
4.  Sur la page `/organizations` de ce nouvel utilisateur, vous verrez l'invitation dans la section **"Invitations Reçues"**.
5.  Cliquez sur **"Accepter"**. L'organisation apparaîtra alors dans sa liste "Mes Organisations".
6.  Alternativement, vous pouvez coller le lien d'invitation affiché dans la console serveur directement dans votre navigateur.

## Résolution des problèmes
- **L'organisation ne s'affiche pas** : Assurez-vous d'avoir cliqué sur "Activer" pour la rendre active dans votre session.
- **Invitations non visibles** : L'email utilisé pour l'invitation doit correspondre exactement à l'email du compte utilisateur.
- **Erreur 500** : Vérifiez les logs du serveur pour des erreurs de connexion à la base de données.
