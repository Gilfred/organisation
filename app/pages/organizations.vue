<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { ref, onMounted } from 'vue'

const { data: session } = authClient.useSession()
const { data: organizations } = authClient.useListOrganizations()
const { data: activeOrg } = authClient.useActiveOrganization()

const newOrgName = ref('')
const newOrgSlug = ref('')
const inviteEmail = ref('')
const inviteRole = ref('member')
const message = ref('')

const createOrg = async () => {
  const { data, error } = await authClient.organization.create({
    name: newOrgName.value,
    slug: newOrgSlug.value,
  })
  if (error) {
    message.value = `Erreur: ${error.message}`
  } else {
    message.value = `Organisation "${data.name}" créée !`
    newOrgName.value = ''
    newOrgSlug.value = ''
  }
}

const switchOrg = async (id: string) => {
  await authClient.organization.setActive({
    organizationId: id
  })
  message.value = `Organisation active changée`
}

const inviteMember = async () => {
  const { error } = await authClient.organization.inviteMember({
    email: inviteEmail.value,
    role: inviteRole.value,
  })
  if (error) {
    message.value = `Erreur invitation: ${error.message}`
  } else {
    message.value = `Invitation envoyée à ${inviteEmail.value}`
    inviteEmail.value = ''
  }
}
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Gestion des Organisations</h1>
<<<<<<< HEAD
    
=======

>>>>>>> be388da89f4935a552d0af84c92f0b1ceacc6a51
    <div v-if="!session" style="color: red;">
      Vous devez être connecté pour tester cette page. <NuxtLink to="/login">Aller à la page de connexion</NuxtLink>
    </div>

    <div v-else>
      <p>Connecté en tant que: <strong>{{ session.user.email }}</strong></p>
<<<<<<< HEAD
      
=======

>>>>>>> be388da89f4935a552d0af84c92f0b1ceacc6a51
      <hr />

      <section>
        <h2>Créer une Organisation</h2>
        <input v-model="newOrgName" placeholder="Nom" />
        <input v-model="newOrgSlug" placeholder="Slug" />
        <button @click="createOrg">Créer</button>
      </section>

      <hr />

      <section>
        <h2>Mes Organisations</h2>
        <ul>
          <li v-for="org in organizations" :key="org.id">
            {{ org.name }} ({{ org.slug }})
            <button @click="switchOrg(org.id)" :disabled="activeOrg?.id === org.id">
              {{ activeOrg?.id === org.id ? 'Active' : 'Activer' }}
            </button>
          </li>
        </ul>
      </section>

      <hr />

      <section v-if="activeOrg">
        <h2>Organisation Active: {{ activeOrg.name }}</h2>
        <h3>Inviter un membre</h3>
        <input v-model="inviteEmail" placeholder="Email du collègue" />
        <select v-model="inviteRole">
          <option value="member">Membre</option>
          <option value="admin">Admin</option>
        </select>
        <button @click="inviteMember">Inviter</button>
      </section>

      <div v-if="message" style="margin-top: 20px; padding: 10px; background: #eee; border: 1px solid #ccc;">
        {{ message }}
      </div>
      <p style="margin-top: 40px;">
        <NuxtLink to="/">Retour à l'accueil</NuxtLink>
      </p>
    </div>
  </div>
</template>
