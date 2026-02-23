<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  role: "admin",
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-red-600">Espace Administration</h1>
    <p class="mt-4">Cette page est réservée aux utilisateurs ayant le rôle "admin".</p>
    <NuxtLink to="/" class="block mt-4 text-blue-600 underline">Retour à l'accueil</NuxtLink>
  </div>
</template>
