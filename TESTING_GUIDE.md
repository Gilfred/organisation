# Guide de test pour la gestion des Organisations

Ce document explique comment tester l'implémentation de la gestion des organisations avec Better Auth.

## Prérequis

1.  **Variables d'environnement** : Assurez-vous d'avoir un fichier `.env` avec les variables suivantes :
    ```env
    DATABASE_URL="postgresql://..."
    BETTER_AUTH_SECRET="une_valeur_secrete_longue"
    BETTER_AUTH_URL="http://localhost:3000"
    ```
2.  **Base de données** : Appliquez les changements de schéma :
    ```bash
    npx prisma migrate dev --name add_organizations
    ```

## Pages de Test

L'application inclut désormais des pages pour tester directement dans le navigateur :

-   **Accueil (`/`)** : Instructions et navigation.
-   **Connexion (`/login`)** : Permet de créer un compte (Inscription) ou de se connecter.
-   **Organisations (`/organizations`)** : Interface complète pour créer une organisation, changer l'organisation active et inviter des membres.

## Structure Technique

-   **Handler API (`server/api/auth/[...auth].ts`)** : Point d'entrée crucial qui gère toutes les requêtes d'authentification.
-   **Configuration Serveur (`server/auth.ts`)** : Configuration de Better Auth avec le plugin `organization`.
-   **Configuration Client (`app/lib/auth-client.ts`)** : Client Better Auth pour le frontend.
-   **Permissions (`auth/permission.ts`)** : Définition des rôles et ressources.

## Guide de Test pas à pas

1.  Allez sur `/login` et cliquez sur "Pas de compte ?" pour vous inscrire.
2.  Une fois connecté, vous serez redirigé vers `/organizations`.
3.  Créez une organisation en remplissant le nom et le slug.
4.  Une fois créée, elle apparaîtra dans "Mes Organisations". Cliquez sur "Activer" si elle ne l'est pas déjà.
5.  Invitez un collègue par son email (il devra aussi se créer un compte pour voir ses invitations, bien que l'invitation apparaisse déjà en base de données).

## Résolution des problèmes (500 Error)

Si vous rencontrez une erreur 500 :
1.  Vérifiez que `DATABASE_URL` est correct et que les migrations Prisma ont été appliquées.
2.  Vérifiez que `BETTER_AUTH_SECRET` est défini dans votre `.env`.
3.  Assurez-vous que le serveur a été redémarré après l'ajout de `server/api/auth/[...auth].ts`.
