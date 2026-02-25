# Guide de test pour la gestion des Organisations

Ce document explique comment tester l'implémentation de la gestion des organisations avec Better Auth dans votre application Nuxt.

## Configuration requise

1.  **Fichier `.env`** : Créez un fichier `.env` à la racine du projet avec :
    ```env
    DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/votre_base"
    BETTER_AUTH_SECRET="une_valeur_secrete_de_32_caracteres_minimum"
    BETTER_AUTH_URL="http://localhost:3000"
    ```
2.  **Base de données** : Appliquez les migrations Prisma :
    ```bash
    npx prisma migrate dev --name init_orgs
    ```

## Utilisation de l'interface de test

Le projet contient des pages simples pour tester les fonctionnalités :

-   **Accueil (`/`)** : Lien vers les différentes pages de test.
-   **Connexion (`/login`)** : Créez un compte via l'onglet "Pas de compte ?" puis connectez-vous.
-   **Organisations (`/organizations`)** :
    -   Créez une nouvelle organisation (ex: Nom: "Ma Team", Slug: "ma-team").
    -   Basculez entre vos organisations.
    -   Invitez d'autres membres par email.

## Résolution des problèmes fréquents

### Erreur 500 au chargement
- **Vérifiez la console serveur** : J'ai ajouté des logs qui commencent par `[Better Auth]` et `[Prisma]`.
- **Base de données** : Si Prisma ne peut pas se connecter, une erreur sera affichée au démarrage du serveur.
- **Migration** : Assurez-vous d'avoir exécuté `npx prisma migrate dev`. Si vous avez changé le schéma manuellement, essayez `npx prisma db push`.
- **Secret** : Assurez-vous que `BETTER_AUTH_SECRET` est bien présent.

### 404 sur les requêtes `/api/auth/*`
- Assurez-vous que le fichier `server/api/auth/[...auth].ts` existe bien.
- Vérifiez que vous utilisez le bon port (généralement 3000).

## Architecture
- `server/auth.ts` : Configuration principale.
- `auth/permission.ts` : Définition des rôles (`owner`, `admin`, `member`) et des permissions.
- `app/lib/auth-client.ts` : Configuration du client Nuxt.
