import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Pour test, on récupère l'admin par email
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }, // ici tu peux tester d'autres utilisateurs
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  })

  if (!user) {
    return { error: 'Utilisateur non trouvé' }
  }

  // Extraire juste le nom des permissions
  const permissions = user.role.permissions.map(rp => rp.permission.name)
  return { email: user.email, role: user.role.name, permissions }
})