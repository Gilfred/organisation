<script setup lang="ts">
import { useSession, signOut } from "~/lib/auth-client";

const { data: session, isPending } = useSession();

const handleLogout = async () => {
  await signOut();
  navigateTo("/login");
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold">Accueil</h1>
    <div v-if="isPending" class="mt-4">Chargement...</div>
    <div v-else-if="session" class="mt-4">
      <p>Bienvenue, {{ session.user.name }} ({{ session.user.email }})</p>
      <div class="flex gap-4 mt-4">
        <NuxtLink to="/dashboard" class="text-blue-600 underline">Tableau de bord</NuxtLink>
        <NuxtLink to="/admin" class="text-blue-600 underline">Admin</NuxtLink>
        <button @click="handleLogout" class="text-red-600 underline">Déconnexion</button>
      </div>
    </div>
    <div v-else class="mt-4">
      <NuxtLink to="/login" class="text-blue-600 underline">Se connecter</NuxtLink>
    </div>
  </div>
</template>
