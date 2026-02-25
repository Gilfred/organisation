import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { prisma } from "~~/server/utils/prisma"
import { ac, admin, member, owner } from "~~/auth/permission"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
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
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
        console.log(`Invitation envoyée à ${data.email}. Lien: ${inviteLink}`);
        // Ici, vous intégreriez un service d'envoi d'email comme Resend, SendGrid, etc.
      },
    })
  ]
})
