<template>
  <nav class="bg-white shadow-md p-4 flex items-center justify-between">
    <div class="flex items-center space-x-6">
      <NuxtLink to="/dashboard" class="text-primary font-semibold hover:underline">
        Dashboard
      </NuxtLink>

      <NuxtLink to="/Calendrier-Tournois" class="text-gray-700 hover:text-primary">
        Calendrier Tournois
      </NuxtLink>

      <NuxtLink
        v-if="isGuest"
        to="/login"
        class="text-gray-700 hover:text-primary"
      >
        Connexion / Créer compte
      </NuxtLink>

      <NuxtLink
        v-if="isUser || isGestionnaire || isAdmin"
        to="/clubs"
        class="text-gray-700 hover:text-primary"
      >
        Liste des Clubs
      </NuxtLink>

      <NuxtLink
        v-if="isUser"
        to="/matchs"
        class="text-gray-700 hover:text-primary"
      >
        Mes Matchs
      </NuxtLink>

      <NuxtLink
        v-if="isGestionnaire || isAdmin"
        to="/categorie"
        class="text-gray-700 hover:text-primary"
      >
        Catégories
      </NuxtLink>

      <NuxtLink
        v-if="isUser || isGestionnaire || isAdmin"
        to="/profile"
        class="text-gray-700 hover:text-primary"
      >
        Mon Profil
      </NuxtLink>
    </div>
    <div>
      <UButton
        v-if="!isGuest"
        variant="outline"
        color="primary"
        size="sm"
        @click="logout"
      >
        Déconnexion
      </UButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCookie, navigateTo, useState } from '#app'
import { computed } from 'vue'

type UserState = { userId: number; roles: string[] } | null
const userState = useState<UserState>('user')
const roles = computed(() => userState.value?.roles || [])

const isAdmin = computed(() => roles.value.includes('admin'))
const isGestionnaire = computed(() => roles.value.includes('gestionnaire'))
const isUser = computed(() => roles.value.includes('user'))
const isGuest = computed(() => roles.value.includes('invite') || !roles.value.length)

function logout() {
  const tokenCookie = useCookie<string | null>('token')
  tokenCookie.value = null
  // clear user state
  userState.value = null
  navigateTo('/login')
}
</script>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 50;
}
</style>
