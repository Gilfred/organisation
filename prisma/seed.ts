import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Roles
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Default user role',
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator role with full access',
    },
  })

  // Create some example Permissions
  const permissions = [
    { name: 'post:create', description: 'Can create posts' },
    { name: 'post:delete', description: 'Can delete posts' },
    { name: 'admin:access', description: 'Can access admin panel' },
  ]

  for (const p of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    })

    // Assign admin:access to admin role
    if (p.name === 'admin:access') {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  console.log('✅ Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
