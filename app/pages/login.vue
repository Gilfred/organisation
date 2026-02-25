<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const name = ref('')
const isRegister = ref(false)
const message = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  message.value = ""

  if (isRegister.value) {
    const { data, error } = await authClient.signUp.email({
      email: email.value,
      password: password.value,
      name: name.value,
    })
    isLoading.value = false
    if (error) message.value = `Erreur d'inscription: ${error.message}`
    else message.value = "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
  } else {
    const { data, error } = await authClient.signIn.email({
      email: email.value,
      password: password.value,
    })
    isLoading.value = false
    if (error) message.value = `Erreur de connexion: ${error.message}`
    else {
      message.value = "Connexion réussie ! Redirection..."
      await navigateTo('/organizations')
    }
  }
}

const logout = async () => {
  await authClient.signOut()
  message.value = "Vous avez été déconnecté."
}

const { data: session, isPending } = authClient.useSession()
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif; max-width: 400px; margin: 0 auto;">
    <h1>{{ isRegister ? 'Créer un compte' : 'Connexion' }}</h1>

    <div v-if="isPending">Vérification de la session...</div>

    <div v-else-if="session">
      <p>Connecté en tant que: <strong>{{ session.user.email }}</strong></p>
      <div style="display: flex; gap: 10px;">
        <button @click="navigateTo('/organizations')">Mes Organisations</button>
        <button @click="logout" style="background: #f44336; color: white; border: none; padding: 5px 10px; cursor: pointer;">Déconnexion</button>
      </div>
    </div>

    <div v-else>
      <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 10px;">
        <div v-if="isRegister">
          <label>Nom complet:</label>
          <input v-model="name" type="text" style="padding: 8px;" required />
        </div>

        <label>Email:</label>
        <input v-model="email" type="email" style="padding: 8px;" required />
        <label>Mot de passe:</label>
        <input v-model="password" type="password" style="padding: 8px;" required />

        <button type="submit" :disabled="isLoading" style="padding: 10px; background: #4caf50; color: white; border: none; cursor: pointer;">
          {{ isLoading ? 'Action en cours...' : (isRegister ? 'S\'inscrire' : 'Se connecter') }}
        </button>

        <button type="button" @click="isRegister = !isRegister" style="background: none; border: none; color: #2196f3; text-decoration: underline; cursor: pointer;">
          {{ isRegister ? 'Déjà un compte ? Connectez-vous' : 'Pas de compte ? Inscrivez-vous' }}
        </button>
      </form>
    </div>

    <div v-if="message" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; background: #f5f5f5;">
      {{ message }}
    </div>

    <p style="margin-top: 30px; text-align: center;">
      <NuxtLink to="/">← Accueil</NuxtLink>
    </p>
  </div>
</template>
