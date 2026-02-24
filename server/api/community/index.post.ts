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
    const { name, slug, description } = body;

    if (!name || !slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing name or slug',
        });
    }

    const community = await prisma.community.create({
        data: {
            name,
            slug,
            description,
        }
    });

    // Automatically make the creator an admin of the community
    const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
    
    if (adminRole) {
        await prisma.userCommunityRole.create({
            data: {
                userId: session.user.id,
                communityId: community.id,
                roleId: adminRole.id
            }
        });
    }

    return community;
});
