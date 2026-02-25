<script setup lang="ts">
import { ref, onMounted } from 'vue'

const result = ref<any>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/org-info')
    result.value = await res.json()
  } catch (err) {
    result.value = { error: "Failed to fetch org info" }
  }
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Test Org Info (API)</h1>
    <p>Cette page appelle <code>/api/org-info</code> pour vérifier l'état côté serveur.</p>
    <pre style="background: #f4f4f4; padding: 15px; border-radius: 4px; overflow: auto;">{{ result }}</pre>
    <NuxtLink to="/">Retour</NuxtLink>
  </div>
</template>
