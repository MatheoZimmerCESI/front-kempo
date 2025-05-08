<!-- /pages/tournoi.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useState, navigateTo } from '#app'

// Composants enfants
import ListTournoisUser  from '~/components/GestionTournois/ListTournoisUser.vue'
import ListTournoisAdmin from '~/components/GestionTournois/ListTournoisAdmin.vue'

// Récupère l’état global 'user' (mis à jour au login)
type UserState = { userId: number; roles: string[] } | null
const userState = useState<UserState>('user')

// Tableau de rôles
const roles = computed(() => userState.value?.roles || [])

// Flags pour chaque rôle
const isAdmin        = computed(() => roles.value.includes('admin'))
const isGestionnaire = computed(() => roles.value.includes('gestionnaire'))

// Choix du composant : admin+gestionnaire → Admin, sinon → User (inclut 'user' et 'invite')
const currentComponent = computed(() => {
  if (isAdmin.value || isGestionnaire.value) {
    return ListTournoisAdmin
  }
  return ListTournoisUser
})

// Si l’utilisateur n’est ni loggé ni invité, on le redirige vers /login
if (!userState.value) {
  navigateTo('/login')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Calendrier des tournois</h1>
    <!-- Monte dynamiquement le composant adéquat -->
    <component :is="currentComponent" />
  </div>
</template>
