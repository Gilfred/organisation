<script setup lang="ts">
import { signIn } from "~/lib/auth-client";

const loginWithGoogle = async () => {
  await signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Connexion</h1>
    <button
      @click="loginWithGoogle"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Se connecter avec Google
    </button>
  </div>
</template>
