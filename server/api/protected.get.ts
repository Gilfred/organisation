import { auth } from "~~/server/utils/auth";

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

    return {
        message: "Ceci est une donnée sécurisée provenant de l'API",
        user: session.user
    };
});
