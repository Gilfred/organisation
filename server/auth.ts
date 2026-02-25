import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { prisma } from "~~/server/utils/prisma"
import { ac, admin, member, owner } from "~~/app/auth/permission"

console.log("[Better Auth] Initialisation du serveur d'authentification...");

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_development_only_32_chars_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    } : {}),
  },
  plugins: [
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
      organizationHooks: {
        afterCreateOrganization: async ({ organization, user }) => {
          console.log(`[Better Auth] Organisation créée: ${organization.name} (${organization.slug}) par ${user.email}`);
        },
        afterAddMember: async ({ member, user, organization }) => {
          console.log(`[Better Auth] Membre ajouté: ${user.email} rejoint ${organization.name} avec le rôle ${member.role}`);
        },
        afterAcceptInvitation: async ({ invitation, member, user, organization }) => {
          console.log(`[Better Auth] Invitation acceptée: ${user.email} a rejoint ${organization.name}`);
        }
      },
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/accept-invitation/${data.id}`;
        console.log(`[Better Auth] INVITATION à envoyer à ${data.email}.`);
        console.log(`[Better Auth] Lien d'acceptation: ${inviteLink}`);
        console.log(`[Better Auth] Rôle proposé: ${data.role}`);
        console.log(`[Better Auth] Organisation: ${data.organization.name}`);
      },
    })
  ]
});

console.log("[Better Auth] Serveur d'authentification prêt.");
