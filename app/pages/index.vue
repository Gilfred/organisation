<template>

  <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
    <header style="text-align: center; margin-bottom: 40px;">
      <h1>Nuxt 4 + Better Auth Organizations</h1>
      <p style="font-size: 1.2rem; color: #666;">Gestion des accès et des permissions facilitée.</p>
    </header>

    <main>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3>Étape 1 : Authentification</h3>
          <p>Commencez par créer un compte ou vous connecter.</p>
          <NuxtLink to="/login" style="display: inline-block; padding: 10px 20px; background: #4caf50; color: white; text-decoration: none; border-radius: 4px;">Connexion / Inscription</NuxtLink>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3>Étape 2 : Organisations</h3>
          <p>Créez votre propre organisation ou rejoignez-en une.</p>
          <NuxtLink to="/organizations" style="display: inline-block; padding: 10px 20px; background: #2196f3; color: white; text-decoration: none; border-radius: 4px;">Gestion des Organisations</NuxtLink>
        </div>
      </div>

      <div style="padding: 20px; background: #fffde7; border-left: 5px solid #fbc02d; border-radius: 4px;">
        <h3>Configuration Requise</h3>
        <ul style="line-height: 1.6;">
          <li>Assurez-vous que votre base de données est accessible (<code>DATABASE_URL</code> dans <code>.env</code>).</li>
          <li>Appliquez les schémas : <code>npx prisma migrate dev</code>.</li>
          <li>Définissez <code>BETTER_AUTH_SECRET</code> (min 32 caractères).</li>
        </ul>
      </div>
    </main>

    <footer style="margin-top: 50px; text-align: center; color: #999; font-size: 0.9rem;">
      <p>Implémentation robuste basée sur Better Auth et Nuxt 4.</p>
    </footer>
  </div>
</template>
