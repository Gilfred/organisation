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

    const query = getQuery(event);
    const communityId = query.communityId as string;

    let roles: string[] = [];
    let permissions: string[] = [];

    if (communityId) {
        // Fetch roles and permissions for a specific community
        const communityRoles = await prisma.userCommunityRole.findMany({
            where: {
                userId: session.user.id,
                communityId: communityId
            },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });

        roles = communityRoles.map(cr => cr.role.name);
        permissions = Array.from(new Set(
            communityRoles.flatMap(cr => cr.role.rolePermissions.map(rp => rp.permission.name))
        ));
    } else {
        // Fetch global roles
        const userRoles = await prisma.userRole.findMany({
            where: { userId: session.user.id },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });

        roles = userRoles.map(ur => ur.role.name);
        permissions = Array.from(new Set(
            userRoles.flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.name))
        ));
    }

    return {
        roles,
        permissions
    };
});
