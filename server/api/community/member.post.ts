import { auth } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const body = await readBody(event);
    const { communityId, userId, roleName } = body;

    if (!communityId || !userId || !roleName) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing communityId, userId or roleName',
        });
    }

    // Check if the current user has permission to manage members in this community
    // (Simplification: check if they are 'admin' in this community)
    const currentUserRole = await prisma.userCommunityRole.findFirst({
        where: {
            userId: session.user.id,
            communityId: communityId,
            role: { name: 'admin' }
        }
    });

    if (!currentUserRole) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: You are not an admin of this community',
        });
    }

    const targetRole = await prisma.role.findUnique({ where: { name: roleName } });
    if (!targetRole) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Role not found',
        });
    }

    const membership = await prisma.userCommunityRole.upsert({
        where: {
            userId_communityId_roleId: {
                userId,
                communityId,
                roleId: targetRole.id
            }
        },
        update: {},
        create: {
            userId,
            communityId,
            roleId: targetRole.id
        }
    });

    return membership;
});
