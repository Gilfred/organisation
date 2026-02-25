import { auth } from "~~/server/auth"

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  })

  if (!session) {
    return { error: "Unauthorized" }
  }

  const organizations = await auth.api.listOrganizations({
    headers: event.headers
  })

  const activeMember = await auth.api.getActiveMember({
    headers: event.headers
  })

  return {
    session,
    organizations,
    activeMember
  }
})
