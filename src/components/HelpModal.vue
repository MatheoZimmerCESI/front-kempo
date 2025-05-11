<template>
  <div>
    <!-- Bouton Aide flottant -->
    <UButton
      class="fixed bottom-6 right-6 z-20 rounded-full p-3 shadow-lg"
      color="primary"
      variant="solid"
      size="md"
      @click="open = true"
    >
      Aide
    </UButton>

    <!-- Modale d'aide -->
    <UModal v-model:open="open" title="Aide - Compte" close-button class="max-w-lg">
      <template #body>
        <div class="space-y-4">
          <h3 class="font-semibold">Mon compte est désactivé</h3>
          <p>
            Pour réactiver votre compte, saisissez votre email et votre mot de passe
            ci-dessous, puis cliquez sur « Réactiver mon compte ». Vous retournerez ensuite
            au formulaire de connexion.
          </p>

          <UInput v-model="creds.email" placeholder="Email" type="email" />
          <UInput v-model="creds.password" placeholder="Mot de passe" type="password" />

          <UButton
            block
            color="primary"
            @click="onReactivate"
            :loading="loading"
          >
            Réactiver mon compte
          </UButton>

          <p
            v-if="message"
            class="mt-2"
            :class="isError ? 'text-red-600' : 'text-green-600'"
          >
             {{ message }}
          </p>
        </div>

        <hr class="my-6" />

        <div class="space-y-4">
          <h3 class="font-semibold">Mon compte a été supprimé</h3>
          <p>
            Votre compte a été supprimé et ne peut plus être récupéré automatiquement.
            Si vous souhaitez revenir dessus dans les 7 jours, veuillez contacter
            <a href="mailto:admin@exemple.com" class="text-blue-600">
              admin@exemple.com
            </a>.
          </p>
        </div>
      </template>

      <template #footer>
        <UButton variant="ghost" @click="open = false">Fermer</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCookie } from '#app'
import { reactivateAccount } from '~/services/profil'

const open = ref(false)
const loading = ref(false)
const message = ref('')
const isError = ref(false)

// Renomme pour éviter la collision avec l'import
const creds = ref<{ email: string; password: string }>({
  email: '',
  password: ''
})

// Cookie token partagé avec la page de login
const tokenCookie = useCookie<string | null>('token')

async function onReactivate() {
  loading.value = true
  message.value = ''
  isError.value = false
  try {
    // 1) Appel à PATCH /profile/reactivate avec email+password
    await reactivateAccount(creds.value)

    // 2) En cas de succès, on supprime tout token résiduel
    tokenCookie.value = null

    // 3) Affiche un message de succès
    message.value = 'Votre compte est réactivé ! Fermez cette fenêtre et reconnectez-vous.'
    isError.value = false
  } catch (err: any) {
    message.value = err.data?.message || 'Erreur lors de la réactivation'
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Ajustes personnalisés si besoin */
</style>
