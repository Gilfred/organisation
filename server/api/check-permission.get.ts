import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { email, permission } = query

  if (!email || !permission) return { error: 'Email et permission requis' }

  const user = await prisma.user.findUnique({
    where: { email: email as string },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      }
    }
  })

  if (!user) return { error: 'Utilisateur non trouvé' }

  const hasPermission = user.role.permissions.some(
    (rp) => rp.permission.name === permission
  )

  return { email: user.email, hasPermission }
})