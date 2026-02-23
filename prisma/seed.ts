import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting seed process...')

  // 1. Create Roles
  console.log('🌱 Creating roles...')
  const roles = [
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'user', description: 'Regular user' },
    { name: 'moderator', description: 'Community moderator' },
  ]

  const createdRoles = {} as Record<string, any>
  for (const r of roles) {
    createdRoles[r.name] = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    })
  }

  // 2. Create Permissions
  console.log('🔑 Creating permissions...')
  const permissions = [
    { name: 'community:manage', description: 'Manage community settings' },
    { name: 'post:create', description: 'Create posts in community' },
    { name: 'post:delete', description: 'Delete posts in community' },
    { name: 'admin:access', description: 'Access global admin panel' },
  ]

  const createdPermissions = {} as Record<string, any>
  for (const p of permissions) {
    createdPermissions[p.name] = await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    })
  }

  // 3. Assign Permissions to Roles
  console.log('🔗 Assigning permissions to roles...')
  // Admin gets everything
  for (const p of Object.values(createdPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: createdRoles['admin'].id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: createdRoles['admin'].id,
        permissionId: p.id,
      },
    })
  }

  // User gets post:create
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: createdRoles['user'].id,
        permissionId: createdPermissions['post:create'].id,
      },
    },
    update: {},
    create: {
      roleId: createdRoles['user'].id,
      permissionId: createdPermissions['post:create'].id,
    },
  })

  // 4. Create Communities
  console.log('🏔️ Creating communities...')
  const communities = [
    { name: 'Nuxt Developers', slug: 'nuxt-devs', description: 'A community for Nuxt.js developers' },
    { name: 'Prisma Enthusiasts', slug: 'prisma-fans', description: 'A community for Prisma ORM fans' },
  ]

  const createdCommunities = []
  for (const c of communities) {
    createdCommunities.push(
      await prisma.community.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  }

  // 5. Create Users
  console.log('👥 Creating users...')
  const users = [
    { name: 'Alice Admin', email: 'alice@example.com' },
    { name: 'Bob Builder', email: 'bob@example.com' },
    { name: 'Charlie Coder', email: 'charlie@example.com' },
  ]

  const createdUsers = []
  for (const u of users) {
    createdUsers.push(
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          ...u,
          emailVerified: true,
        },
      })
    )
  }

  // 6. Assign Memberships (UserCommunityRole)
  console.log('🎖️ Assigning users to communities...')

  // Alice is Admin in Nuxt Developers
  await prisma.userCommunityRole.upsert({
    where: {
      userId_communityId_roleId: {
        userId: createdUsers[0].id,
        communityId: createdCommunities[0].id,
        roleId: createdRoles['admin'].id,
      }
    },
    update: {},
    create: {
      userId: createdUsers[0].id,
      communityId: createdCommunities[0].id,
      roleId: createdRoles['admin'].id,
    }
  })

  // Bob is Moderator in Nuxt Developers and User in Prisma Enthusiasts
  const bobMemberships = [
    {
      userId: createdUsers[1].id,
      communityId: createdCommunities[0].id,
      roleId: createdRoles['moderator'].id,
    },
    {
      userId: createdUsers[1].id,
      communityId: createdCommunities[1].id,
      roleId: createdRoles['user'].id,
    }
  ]

  for (const m of bobMemberships) {
    await prisma.userCommunityRole.upsert({
      where: {
        userId_communityId_roleId: {
          userId: m.userId,
          communityId: m.communityId,
          roleId: m.roleId,
        }
      },
      update: {},
      create: m
    })
  }

  // Charlie is Admin in Prisma Enthusiasts
  await prisma.userCommunityRole.upsert({
    where: {
      userId_communityId_roleId: {
        userId: createdUsers[2].id,
        communityId: createdCommunities[1].id,
        roleId: createdRoles['admin'].id,
      }
    },
    update: {},
    create: {
      userId: createdUsers[2].id,
      communityId: createdCommunities[1].id,
      roleId: createdRoles['admin'].id,
    }
  })

  console.log('✅ Seeding complete successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
