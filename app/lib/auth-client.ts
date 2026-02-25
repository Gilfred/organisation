import { createAuthClient } from "better-auth/vue"
import { organizationClient } from "better-auth/client/plugins"
import { ac, owner, admin, member } from "../auth/permission"

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
