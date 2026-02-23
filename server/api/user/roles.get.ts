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

    // Fetch user roles and their associated permissions
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

    const roles = userRoles.map(ur => ur.role.name);
    const permissions = Array.from(new Set(
        userRoles.flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.name))
    ));

    return {
        roles,
        permissions
    };
});
