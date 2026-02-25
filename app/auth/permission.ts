import { createAccessControl } from "better-auth/plugins/access"

/**
 * Toujours utiliser `as const`
 */
const statement = {
  project: ["create", "update", "delete", "share"],
  sale: ["create", "refund"],
} as const

export const ac = createAccessControl(statement)

export const member = ac.newRole({
  project: ["create"],
})

export const admin = ac.newRole({
  project: ["create", "update"],
  sale: ["create"]
})

export const owner = ac.newRole({
  project: ["create", "update", "delete", "share"],
  sale: ["create", "refund"]
})