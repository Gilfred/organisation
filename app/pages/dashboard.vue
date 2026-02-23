<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import { useSession } from "~/lib/auth-client";
const { data: session } = useSession();
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">Tableau de Bord</h1>
    <p class="mt-4">Cette page est protégée et n'est accessible qu'aux utilisateurs connectés.</p>
    <div v-if="session" class="mt-4 p-4 bg-gray-100 rounded">
      <pre>{{ JSON.stringify(session, null, 2) }}</pre>
    </div>
    <NuxtLink to="/" class="block mt-4 text-blue-600 underline">Retour à l'accueil</NuxtLink>
  </div>
</template>
