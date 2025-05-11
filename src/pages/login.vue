<template>
  <section
    class="relative min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('~/assets/css/logo/logo_background_scoreboard_version_1.png');"
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
        Connexion
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
          <!-- Bouton Mot de passe oublié -->
          <button
            type="button"
            class="underline hover:text-gray-800"
            @click="showForgot = true"
          >
            Mot de passe oublié ?
          </button>
          <NuxtLink to="/register" class="underline hover:text-gray-800">
            Pas de compte ?
          </NuxtLink>
        </div>

        <UButton type="submit" color="primary" variant="solid" block :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </UButton>

        <!-- Bouton Invité -->
        <NuxtLink to="/dashboard">
          <UButton variant="outline" color="primary" block>
            Invité
          </UButton>
        </NuxtLink>

        <p v-if="error" class="text-red-500 text-center mt-2">
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
import { login } from '~/services/auth'
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

// Soumission du formulaire de login 
async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    const { token } = (await login(email.value, password.value)) as AuthResponse
    tokenCookie.value = token
    // petit délai pour hydrater le cookie
    await new Promise(r => setTimeout(r, 50))
    navigateTo('/dashboard')
  } catch (err: any) {
      // Message d’erreur plus utilisateur
      // Si l'API renvoie 403, c'est qu'il s'agit d'un compte désactivé ou supprimé
     if (err.response?.status === 403 || err.data?.message === 'Compte inactif ou supprimé') {
       error.value = 'Votre compte est désactivé. Pour le réactiver, utilisez le bouton Aide sur la page de connexion.'
     } else {
       // Erreur classique d'authentification
       error.value = 'Adresse e-mail ou mot de passe invalide. Vérifiez vos informations.'
     }
    
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
