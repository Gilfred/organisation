<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const name = ref('')
const isRegister = ref(false)
const message = ref('')

const handleSubmit = async () => {
  if (isRegister.value) {
    const { data, error } = await authClient.signUp.email({
      email: email.value,
      password: password.value,
      name: name.value,
    })
    if (error) message.value = `Erreur: ${error.message}`
    else message.value = "Compte créé ! Vous pouvez vous connecter."
  } else {
    const { data, error } = await authClient.signIn.email({
      email: email.value,
      password: password.value,
    })
    if (error) message.value = `Erreur: ${error.message}`
    else {
      message.value = "Connecté !"
      await navigateTo('/organizations')
    }
  }
}

const logout = async () => {
  await authClient.signOut()
  message.value = "Déconnecté"
}

const { data: session } = authClient.useSession()
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>{{ isRegister ? 'Inscription' : 'Connexion' }}</h1>

    <div v-if="session">
      <p>Vous êtes déjà connecté en tant que {{ session.user.email }}</p>
      <button @click="logout">Déconnexion</button>
      <p><NuxtLink to="/organizations">Aller à la gestion des organisations</NuxtLink></p>
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <div v-if="isRegister">
        <label>Nom:</label><br />
        <input v-model="name" type="text" /><br />
      </div>
      <label>Email:</label><br />
      <input v-model="email" type="email" required /><br />
      <label>Mot de passe:</label><br />
      <input v-model="password" type="password" required /><br /><br />

      <button type="submit">{{ isRegister ? 'S\'inscrire' : 'Se connecter' }}</button>
      <button type="button" @click="isRegister = !isRegister" style="margin-left: 10px;">
        {{ isRegister ? 'Déjà un compte ?' : 'Pas de compte ?' }}
      </button>
    </form>

    <div v-if="message" style="margin-top: 20px; color: blue;">
      {{ message }}
    </div>

    <p style="margin-top: 20px;">
      <NuxtLink to="/">Accueil</NuxtLink>
    </p>
  </div>
</template>
