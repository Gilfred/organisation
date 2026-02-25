import { prisma } from './utils/prisma'

async function main() {
  console.log('🌱 Seeding roles and permissions...')

  // Créer des rôles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrateur' }
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER', description: 'Utilisateur standard' }
  })

  // Créer des permissions
  const manageUsers = await prisma.permission.upsert({
    where: { name: 'MANAGE_USERS' },
    update: {},
    create: { name: 'MANAGE_USERS', description: 'Gérer les utilisateurs' }
  })

  const viewContent = await prisma.permission.upsert({
    where: { name: 'VIEW_CONTENT' },
    update: {},
    create: { name: 'VIEW_CONTENT', description: 'Voir le contenu' }
  })

  // Lier permissions aux rôles
  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: adminRole.id, permissionId: manageUsers.id } },
    update: {},
    create: { roleId: adminRole.id, permissionId: manageUsers.id }
  })

  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: userRole.id, permissionId: viewContent.id } },
    update: {},
    create: { roleId: userRole.id, permissionId: viewContent.id }
  })

  console.log('✅ Seed finished!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })