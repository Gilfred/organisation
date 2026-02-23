import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: useRequestHeaders(['cookie'])
    }
  });

  if (!session) {
    return navigateTo('/login');
  }

  // Get required role or permission from page meta
  const requiredRole = to.meta.role as string;
  const requiredPermission = to.meta.permission as string;

  if (!requiredRole && !requiredPermission) return;

  // Fetch user roles and permissions from our API
  const { data: authData } = await useFetch('/api/user/roles', {
    headers: useRequestHeaders(['cookie'])
  });

  if (!authData.value) {
    return navigateTo('/');
  }

  const { roles, permissions } = authData.value;

  if (requiredRole && !roles.includes(requiredRole)) {
    return navigateTo('/');
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return navigateTo('/');
  }
});
