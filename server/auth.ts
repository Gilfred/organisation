import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { prisma } from "~~/server/utils/prisma"
import { ac, admin, member, owner } from "~~/auth/permission"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  plugins: [
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
      }
    })
  ]
})
