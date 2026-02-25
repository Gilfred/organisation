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

### Erreur 500 ou Page Blanche
- **Structure Nuxt 4** : Les pages ont été déplacées dans `app/pages/` conformément à la nouvelle structure de Nuxt 4.
- **Console serveur** : J'ai ajouté des logs qui commencent par `[Better Auth]` et `[Prisma]`.
- **Base de données** : Si Prisma ne peut pas se connecter, une erreur sera affichée au démarrage du serveur.
- **Migration** : Assurez-vous d'avoir exécuté `npx prisma migrate dev`.
- **Secret** : Assurez-vous que `BETTER_AUTH_SECRET` est bien présent.

### 404 sur les requêtes `/api/auth/*`
- Le handler est situé dans `server/api/auth/[...auth].ts`.
- Assurez-vous d'utiliser le port configuré dans `BETTER_AUTH_URL`.

## Architecture (Nuxt 4)
- `server/auth.ts` : Configuration principale (Backend).
- `app/auth/permission.ts` : Définition des rôles (`owner`, `admin`, `member`) et des permissions.
- `app/lib/auth-client.ts` : Configuration du client Nuxt (Vue).
- `app/pages/` : Contient toutes les interfaces de test.
