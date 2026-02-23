import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: useRequestHeaders(['cookie'])
    }
  });
  
  if (!session) {
    if (to.path !== '/login') {
      return navigateTo('/login');
    }
  }
});
