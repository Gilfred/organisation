<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { ref, onMounted } from 'vue'

const route = useRoute()
const invitationId = route.params.id as string
const message = ref('Acceptation de l\'invitation en cours...')
const error = ref('')

onMounted(async () => {
  if (!invitationId) {
    error.value = "ID d'invitation manquant"
    message.value = ""
    return
  }

  const { data, error: err } = await authClient.organization.acceptInvitation({
    invitationId
  })

  if (err) {
    error.value = err.message
    message.value = ''
  } else {
    message.value = 'Invitation acceptée avec succès ! Redirection...'
    setTimeout(() => navigateTo('/organizations'), 2000)
  }
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Invitation</h1>
    <p v-if="message">{{ message }}</p>
    <p v-if="error" style="color: red;">Erreur: {{ error }}</p>
    <NuxtLink to="/organizations">Aller aux organisations</NuxtLink>
  </div>
</template>
