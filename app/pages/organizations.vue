<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { ref, onMounted, watchEffect } from 'vue'

const { data: session, isPending: isSessionPending } = authClient.useSession()
const { data: organizations, isPending: isOrgsPending, error: orgsError, refetch: refetchOrgs } = authClient.useListOrganizations()
const { data: activeOrg } = authClient.useActiveOrganization()

const invitations = ref<any[]>([])
const isInvitationsLoading = ref(false)

const newOrgName = ref('')
const newOrgSlug = ref('')
const inviteEmail = ref('')
const inviteRole = ref('member')
const message = ref('')
const isLoading = ref(false)

const fetchInvitations = async () => {
  isInvitationsLoading.value = true
  const { data, error } = await authClient.organization.listUserInvitations()
  isInvitationsLoading.value = false
  if (!error && data) {
    invitations.value = data
  }
}

onMounted(() => {
  fetchInvitations()
})

const createOrg = async () => {
  if (!newOrgName.value || !newOrgSlug.value) {
    message.value = "Veuillez remplir le nom et le slug."
    return
  }

  isLoading.value = true
  message.value = "Création de l'organisation..."
  const { data, error } = await authClient.organization.create({
    name: newOrgName.value,
    slug: newOrgSlug.value,
  })
  isLoading.value = false

  if (error) {
    message.value = `Erreur lors de la création: ${error.message}`
    console.error("Create Org Error:", error)
  } else {
    message.value = `Organisation "${data.name}" créée avec succès !`
    newOrgName.value = ''
    newOrgSlug.value = ''
    await refetchOrgs()
  }
}

const switchOrg = async (id: string) => {
  isLoading.value = true
  message.value = "Changement d'organisation..."
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

const acceptInvite = async (invitationId: string) => {
  isLoading.value = true
  message.value = "Acceptation de l'invitation..."
  const { error } = await authClient.organization.acceptInvitation({
    invitationId
  })
  isLoading.value = false

  if (error) {
    message.value = `Erreur lors de l'acceptation: ${error.message}`
  } else {
    message.value = `Invitation acceptée !`
    await fetchInvitations()
    await refetchOrgs()
  }
}

const inviteMember = async () => {
  if (!inviteEmail.value) return

  isLoading.value = true
  message.value = "Envoi de l'invitation..."
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

// Debugging
watchEffect(() => {
  if (session.value) console.log("[Debug] Session active:", session.value.user.email)
  if (organizations.value) console.log("[Debug] Organisations:", organizations.value.length)
  if (activeOrg.value) console.log("[Debug] Org Active:", activeOrg.value.name)
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif; max-width: 900px; margin: 0 auto; line-height: 1.5;">
    <h1>Gestion des Organisations</h1>

    <div v-if="isSessionPending">Chargement de la session...</div>

    <div v-else-if="!session" style="color: red; padding: 20px; border: 2px solid red; border-radius: 8px; text-align: center;">
      <h3>Accès restreint</h3>
      <p>Vous devez être connecté pour accéder à cette page.</p>
      <NuxtLink to="/login" style="display: inline-block; padding: 10px 20px; background: #2196f3; color: white; text-decoration: none; border-radius: 4px;">Se connecter</NuxtLink>
    </div>

    <div v-else>
      <div style="display: flex; justify-content: space-between; align-items: center; background: #f0f4f8; padding: 10px 20px; border-radius: 8px; margin-bottom: 20px;">
        <span>Utilisateur : <strong>{{ session.user.email }}</strong></span>
        <button @click="authClient.signOut().then(() => navigateTo('/login'))" style="background: #e53935; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">Déconnexion</button>
      </div>

      <div v-if="message" style="margin: 20px 0; padding: 15px; background: #fff9c4; border: 1px solid #fbc02d; border-radius: 4px; font-weight: bold;">
        {{ message }}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <!-- Left Column: Create & Invites -->
        <div>
          <section style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin-top: 0;">Créer une Organisation</h2>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <input v-model="newOrgName" placeholder="Nom de l'organisation" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
              <input v-model="newOrgSlug" placeholder="slug-de-l-organisation" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
              <button @click="createOrg" :disabled="isLoading" style="padding: 10px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                {{ isLoading ? 'Action en cours...' : 'Créer l\'organisation' }}
              </button>
            </div>
          </section>

          <section style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="margin-top: 0;">Invitations Reçues</h2>
            <div v-if="isInvitationsLoading">Chargement des invitations...</div>
            <div v-else-if="invitations.length === 0" style="color: #666;">Aucune invitation en attente.</div>
            <ul v-else style="list-style: none; padding: 0;">
              <li v-for="invite in invitations" :key="invite.id" style="padding: 10px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px; background: #f9f9f9;">
                <div>De: <strong>{{ invite.organization.name }}</strong></div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">Rôle : {{ invite.role }}</div>
                <button @click="acceptInvite(invite.id)" :disabled="isLoading" style="background: #2196f3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                  Accepter
                </button>
              </li>
            </ul>
          </section>
        </div>

        <!-- Right Column: List & Active Org -->
        <div>
          <section style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin-top: 0;">Mes Organisations</h2>
            <div v-if="isOrgsPending">Chargement...</div>
            <div v-else-if="orgsError" style="color: red;">{{ orgsError.message }}</div>
            <div v-else-if="organizations.length === 0" style="color: #666;">Vous n'êtes membre d'aucune organisation.</div>
            <ul v-else style="list-style: none; padding: 0;">
              <li v-for="org in organizations" :key="org.id" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <span><strong>{{ org.name }}</strong> ({{ org.slug }})</span>
                <button @click="switchOrg(org.id)" :disabled="activeOrg?.id === org.id || isLoading" :style="{ background: activeOrg?.id === org.id ? '#ddd' : '#2196f3', color: activeOrg?.id === org.id ? '#666' : 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: activeOrg?.id === org.id ? 'default' : 'pointer' }">
                  {{ activeOrg?.id === org.id ? 'Active' : 'Activer' }}
                </button>
              </li>
            </ul>
          </section>

          <section v-if="activeOrg" style="background: #e8f5e9; padding: 20px; border: 1px solid #c8e6c9; border-radius: 8px;">
            <h2 style="margin-top: 0; color: #2e7d32;">Organisation Active : {{ activeOrg.name }}</h2>
            <p style="margin-bottom: 20px;">Utilisez ce formulaire pour inviter des collaborateurs dans cette organisation.</p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <input v-model="inviteEmail" placeholder="Email du collaborateur" type="email" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;" />
              <select v-model="inviteRole" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="member">Membre</option>
                <option value="admin">Administrateur</option>
              </select>
              <button @click="inviteMember" :disabled="isLoading" style="padding: 10px; background: #2e7d32; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Envoyer l'invitation
              </button>
            </div>
          </section>
        </div>
      </div>

      <p style="margin-top: 40px; text-align: center;">
        <NuxtLink to="/">← Retour à l'accueil</NuxtLink>
      </p>
    </div>
  </div>
</template>
