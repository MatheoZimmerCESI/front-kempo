<template>
  <section
    class="relative min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('~/assets/css/logo/logo_background_scoreboard_version_1.png');"
  >
    <!-- Overlay clair -->
    <div class="absolute inset-0 bg-white bg-opacity-40"></div>

    <UCard
      class="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white bg-opacity-90 backdrop-blur-lg z-10"
      variant="solid"
      color="primary"
    >
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
        Inscription
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <UInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="votre.email@exemple.com"
          required
          color="primary"
        />
        <UInput
          v-model="password"
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          required
          color="primary"
        />

        <div class="flex justify-between text-sm text-gray-600">
          <NuxtLink to="/forgot-password" class="underline hover:text-gray-800">
            Mot de passe oublié ?
          </NuxtLink>
          <NuxtLink to="/login" class="underline hover:text-gray-800">
            Se connecter
          </NuxtLink>
        </div>

        <UButton type="submit" color="primary" variant="solid" block :disabled="loading">
          {{ loading ? 'Inscription…' : "S'inscrire" }}
        </UButton>

        <!-- Bouton Invité -->
        <NuxtLink to="/dashboard">
          <UButton variant="outline" color="primary" block>
            Invité
          </UButton>
        </NuxtLink>

        <p v-if="error" class="text-red-500 text-center mt-4">
          {{ error }}
        </p>
      </form>
    </UCard>

    <!-- Modales -->
    <ForgotPasswordModal v-model:open="showForgot" />
    <HelpModal />
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

import { ref } from 'vue'
import { useCookie, navigateTo } from '#app'
import { register } from '~/services/auth'
import type { AuthResponse } from '~/types/auth'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal.vue'
import HelpModal from '../components/HelpModal.vue'

// Données réactives
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const tokenCookie = useCookie<string | null>('token')

// Contrôle de l’ouverture de la modale Mot de passe oublié
const showForgot = ref(false)

// Soumission du formulaire d'inscription
async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    const { token } = (await register(email.value, password.value)) as AuthResponse
    tokenCookie.value = token
    await new Promise(r => setTimeout(r, 50))
    navigateTo('/dashboard')
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur lors de l’inscription'
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
