<template>
  <section
    class="relative min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('~/assets/css/logo/logo_background_scoreboard_version_1.png')"
  >
    <!-- Overlay clair -->
    <div class="absolute inset-0 bg-white bg-opacity-40"></div>

    <UCard class="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white bg-opacity-90 backdrop-blur-lg z-10">
      <!-- Bandeau bleu autour du logo -->
      <div class="flex justify-center mb-6">
        <div class="bg-[#2C3E50] p-4 rounded-full">
          <img
            src="~/assets/css/logo/logo_background_scoreboard_version_1.png"
            alt="Logo"
            class="h-20 w-auto"
          />
        </div>
      </div>

      <h1 class="text-3xl text-gray-800 text-center font-extrabold mb-6">
        Réinitialiser le mot de passe
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <UInput
          v-model="newPassword"
          label="Nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          required
          color="primary"
        />
        <UInput
          v-model="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          required
          color="primary"
        />

        <UButton type="submit" color="primary" variant="solid" block :disabled="loading">
          {{ loading ? 'En cours…' : 'Valider' }}
        </UButton>

        <p v-if="error" class="text-red-500 text-center mt-2">
          {{ error }}
        </p>
        <p v-if="success" class="text-green-600 text-center mt-2">
          {{ success }}
        </p>
      </form>
    </UCard>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import { resetPassword } from '~/services/auth'
import type { MessageResponse } from '~/types/auth'

const route = useRoute()
const token = ref('')

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

onMounted(() => {
  token.value = (route.query.token as string) || ''
  if (!token.value) {
    error.value = 'Token manquant dans l’URL.'
  }
})

async function onSubmit() {
  error.value = null
  success.value = null

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    const res = (await resetPassword(token.value, newPassword.value)) as MessageResponse
    success.value = res.message || 'Mot de passe réinitialisé avec succès.'
    setTimeout(() => navigateTo('/login'), 2000)
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur lors de la réinitialisation.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
section {
  position: relative;
}
</style>
