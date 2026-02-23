import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
    // We attempt to get the URL from runtime config if available,
    // otherwise fallback to a sensible default.
    baseURL: import.meta.client ? window.location.origin : (process.env.BETTER_AUTH_URL || 'http://localhost:3000')
});

export const { signIn, signUp, signOut, useSession } = authClient;
