<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Nuxt + Better Auth Organizations</h1>
    <p>Cette application permet de tester l'implémentation des organisations.</p>

    <nav>
      <ul>
        <li><NuxtLink to="/login">Connexion / Inscription</NuxtLink></li>
        <li><NuxtLink to="/organizations">Gestion des Organisations</NuxtLink></li>
        <li><NuxtLink to="/test">Test API Legacy (Déprécié)</NuxtLink></li>
      </ul>
    </nav>

    <div style="margin-top: 50px; padding: 20px; border: 1px dashed #ccc;">
      <h3>Instructions</h3>
      <ol>
        <li>Configurez votre <code>DATABASE_URL</code> dans un fichier <code>.env</code>.</li>
        <li>Lancez les migrations : <code>npx prisma migrate dev</code>.</li>
        <li>Inscrivez-vous sur la page <strong>Connexion</strong>.</li>
        <li>Créez votre première organisation sur la page <strong>Gestion des Organisations</strong>.</li>
      </ol>
    </div>
  </div>
</template>
