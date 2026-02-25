# Guide de test pour la gestion des Organisations

Ce document explique comment tester l'implémentation de la gestion des organisations avec Better Auth.

## Prérequis

1.  **Base de données** : Assurez-vous que votre `DATABASE_URL` est configuré dans le fichier `.env`.
2.  **Migration** : Appliquez les changements de schéma :
    ```bash
    npx prisma migrate dev --name add_organizations
    ```

## Tests recommandés

### 1. Création d'une Organisation
Depuis votre client Nuxt, vous pouvez créer une organisation :
```typescript
import { authClient } from "~/lib/auth-client"

const { data, error } = await authClient.organization.create({
    name: "Ma Super Entreprise",
    slug: "ma-super-entreprise",
});

if (data) {
    console.log("Organisation créée !", data);
}
```
*Note : Le créateur devient automatiquement 'owner' de l'organisation.*

### 2. Vérification des Permissions
Pour vérifier si l'utilisateur actuel a la permission de créer un projet (définie dans `auth/permission.ts`) :
```typescript
const canCreateProject = await authClient.organization.hasPermission({
  permissions: {
    project: ["create"],
  },
});

console.log("Peut créer un projet ?", canCreateProject);
```

### 3. Changement d'Organisation active
Si l'utilisateur appartient à plusieurs organisations :
```typescript
await authClient.organization.setActive({
    organizationId: "id-de-l-organisation"
});
```

### 4. Invitation d'un membre
```typescript
await authClient.organization.inviteMember({
    email: "collegue@exemple.com",
    role: "admin", // ou 'member'
});
```

## Structure de l'implémentation

-   **Serveur** (`server/auth.ts`) : Configuration de Better Auth avec le plugin `organization`, l'adaptateur Prisma et le contrôle d'accès (AC).
-   **Client** (`app/lib/auth-client.ts`) : Initialisation du client avec le plugin `organizationClient`.
-   **Permissions** (`auth/permission.ts`) : Définition des ressources (`project`, `sale`) et des rôles (`owner`, `admin`, `member`).
-   **Schéma** (`prisma/schema.prisma`) : Tables `Organization`, `Member` et `Invitation` ajoutées.
