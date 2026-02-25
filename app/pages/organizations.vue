<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { ref, watchEffect } from 'vue'

const { data: session, isPending: isSessionPending } = authClient.useSession()
const { data: organizations, isPending: isOrgsPending, error: orgsError } = authClient.useListOrganizations()
const { data: activeOrg } = authClient.useActiveOrganization()

const newOrgName = ref('')
const newOrgSlug = ref('')
const inviteEmail = ref('')
const inviteRole = ref('member')
const message = ref('')
const isLoading = ref(false)

const createOrg = async () => {
  if (!newOrgName.value || !newOrgSlug.value) {
    message.value = "Veuillez remplir le nom et le slug."
    return
  }

  isLoading.value = true
  const { data, error } = await authClient.organization.create({
    name: newOrgName.value,
    slug: newOrgSlug.value,
  })
  isLoading.value = false

  if (error) {
    message.value = `Erreur lors de la création: ${error.message}`
  } else {
    message.value = `Organisation "${data.name}" créée avec succès !`
    newOrgName.value = ''
    newOrgSlug.value = ''
  }
}

const switchOrg = async (id: string) => {
  isLoading.value = true
  const { error } = await authClient.organization.setActive({
    organizationId: id
  })
  isLoading.value = false

  if (error) {
    message.value = `Erreur lors du changement: ${error.message}`
  } else {
    message.value = `Organisation active changée.`
  }
}

const inviteMember = async () => {
  if (!inviteEmail.value) return

  isLoading.value = true
  const { error } = await authClient.organization.inviteMember({
    email: inviteEmail.value,
    role: inviteRole.value,
  })
  isLoading.value = false

  if (error) {
    message.value = `Erreur invitation: ${error.message}`
  } else {
    message.value = `Invitation envoyée à ${inviteEmail.value}`
    inviteEmail.value = ''
  }
}

// Log for debugging
watchEffect(() => {
  console.log("Session:", session.value)
  console.log("Organisations:", organizations.value)
  console.log("Active Org:", activeOrg.value)
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
    <h1>Gestion des Organisations</h1>
    <div v-if="isSessionPending">Chargement de la session...</div>

    <div v-else-if="!session" style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">
      Vous devez être connecté pour accéder à cette page.
      <NuxtLink to="/login">Aller à la page de connexion</NuxtLink>
    </div>

    <div v-else>
      <p>Connecté en tant que: <strong>{{ session.user.email }}</strong></p>
      <div v-if="message" style="margin: 20px 0; padding: 10px; background: #e0f7fa; border: 1px solid #00acc1; border-radius: 4px;">
        {{ message }}
      </div>
      <hr />

      <section>
        <h2>Créer une Organisation</h2>
        <div style="display: flex; gap: 10px;">
          <input v-model="newOrgName" placeholder="Nom de l'organisation" style="padding: 5px;" />
          <input v-model="newOrgSlug" placeholder="slug-de-l-org" style="padding: 5px;" />
          <button @click="createOrg" :disabled="isLoading">
            {{ isLoading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </section>

      <hr />

      <section>
        <h2>Mes Organisations</h2>
        <div v-if="isOrgsPending">Chargement des organisations...</div>
        <div v-else-if="orgsError" style="color: red;">Erreur: {{ orgsError.message }}</div>
        <div v-else-if="!organizations || organizations.length === 0">
          Vous n'êtes membre d'aucune organisation.
        </div>
        <ul v-else style="list-style: none; padding: 0;">
          <li v-for="org in organizations" :key="org.id" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>{{ org.name }}</strong> <small>({{ org.slug }})</small>
            </div>
            <button @click="switchOrg(org.id)" :disabled="activeOrg?.id === org.id || isLoading">
              {{ activeOrg?.id === org.id ? 'Active' : 'Activer' }}
            </button>
          </li>
        </ul>
      </section>

      <hr />

      <section v-if="activeOrg" style="background: #f9f9f9; padding: 15px; border-radius: 4px;">
        <h2>Détails Organisation Active: {{ activeOrg.name }}</h2>
        <p>ID: <code>{{ activeOrg.id }}</code></p>

        <h3>Inviter un nouveau membre</h3>
        <div style="display: flex; gap: 10px;">
          <input v-model="inviteEmail" placeholder="Email" type="email" style="padding: 5px;" />
          <select v-model="inviteRole" style="padding: 5px;">
            <option value="member">Membre</option>
            <option value="admin">Admin</option>
          </select>
          <button @click="inviteMember" :disabled="isLoading">
            {{ isLoading ? 'Envoi...' : 'Inviter' }}
          </button>
        </div>
      </section>
      <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <NuxtLink to="/">← Retour à l'accueil</NuxtLink>
      </p>
    </div>
  </div>
</template>
