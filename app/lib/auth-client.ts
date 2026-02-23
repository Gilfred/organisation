import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
    // If baseURL is not provided, it defaults to the current window origin on the client
    // and can be configured via environment variables for the server.
    // For Nuxt, leaving it empty or using a simple fallback is often best for copy-paste.
    baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.BETTER_AUTH_URL || 'http://localhost:3000')
});

export const { signIn, signUp, signOut, useSession } = authClient;
