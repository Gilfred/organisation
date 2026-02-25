import { createAuthClient } from "better-auth/client"
import { organizationClient } from "better-auth/client/plugins"
import { ac, owner, admin, member } from "@/auth/permissions"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member
      }
    })
  ]
})