import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    // We can use hooks to perform actions after certain events
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // Assign default role "user" upon creation
                    try {
                        let role = await prisma.role.findUnique({
                            where: { name: "user" }
                        });

                        if (!role) {
                            role = await prisma.role.create({
                                data: {
                                    name: "user",
                                    description: "Default user role"
                                }
                            });
                        }

                        await prisma.userRole.create({
                            data: {
                                userId: user.id,
                                roleId: role.id
                            }
                        });
                    } catch (error) {
                        console.error("Error assigning default role:", error);
                    }
                }
            }
        }
    }
});
