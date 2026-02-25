<script setup lang="ts">
import { ref, onMounted } from 'vue'

const result = ref<any>(null)

onMounted(async () => {
  const res = await fetch('/api/user-permissions')
  result.value = await res.json()
})
</script>

<template>
  <div>
    <h1>Test Permissions</h1>
    <pre>{{ result }}</pre>
  </div>
</template>