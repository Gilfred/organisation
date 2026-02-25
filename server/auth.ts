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
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/accept-invitation/${data.id}`;
        console.log(`[Better Auth] Invitation à envoyer à ${data.email}. Lien: ${inviteLink}`);
      },
    })
  ]
});

console.log("[Better Auth] Serveur d'authentification initialisé.");
