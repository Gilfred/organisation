import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Test connection (optional, will log error to console if fails)
prisma.$connect()
  .then(() => {
    console.log("Prisma: Connexion à la base de données réussie.");
  })
  .catch((err) => {
    console.error("Prisma Error: Impossible de se connecter à la base de données.", err);
  });
