<template>
  <section class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Tableau de bord</h1>
    <p class="mb-6">Connecté en tant que <span class="font-medium">{{ roleLabel }}</span>.</p>

    <!-- Section Admin -->
    <div v-if="isAdmin" class="space-y-4">
      <h2 class="text-xl font-semibold">Espace Administrateur</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard>
          <h3 class="font-medium">Gestion des utilisateurs</h3>
          <UButton color="primary" variant="solid" @click="goTo('/admin/users')">
            Aller à la gestion des comptes
          </UButton>
        </UCard>
        <UCard>
          <h3 class="font-medium">Création de tournois</h3>
          <UButton color="primary" variant="solid" @click="goTo('/Calendrier-Tournois')">
            Gérer les tournois
          </UButton>
        </UCard>
      </div>
    </div>

    <!-- Section Gestionnaire -->
    <div v-else-if="isGestionnaire" class="space-y-4">
      <h2 class="text-xl font-semibold">Espace Gestionnaire</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard>
          <h3 class="font-medium">Lancer un tournoi</h3>
          <UButton color="primary" variant="solid" @click="goTo('/Calendrier-Tournois')">
            Lancer / Mettre à jour
          </UButton>
        </UCard>
        <UCard>
          <h3 class="font-medium">Gestion des compétiteurs</h3>
          <UButton color="primary" variant="solid" @click="goTo('/gestion/competiteurs')">
            Voir les compétiteurs
          </UButton>
        </UCard>
      </div>
    </div>

    <!-- Section Utilisateur -->
    <div v-else class="space-y-4">
      <h2 class="text-xl font-semibold">Espace Utilisateur</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard>
          <h3 class="font-medium">Liste des tournois</h3>
          <UButton color="primary" variant="solid" @click="goTo('/Calendrier-Tournois')">
            Voir les tournois
          </UButton>
        </UCard>
        <UCard>
          <h3 class="font-medium">Mes résultats</h3>
          <UButton color="primary" variant="solid" @click="goTo('/user/resultats')">
            Consulter mes matchs
          </UButton>
        </UCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useState, navigateTo } from '#app'

type UserState = { userId: number; roles: string[] } | null

const userState = useState<UserState>('user')
const roles = computed(() => userState.value?.roles || [])
const isAdmin = computed(() => roles.value.includes('admin'))
const isGestionnaire = computed(() => roles.value.includes('gestionnaire'))
const roleLabel = computed(() => {
  if (isAdmin.value) return 'Administrateur'
  if (isGestionnaire.value) return 'Gestionnaire'
  return 'Utilisateur'
})

function goTo(path: string) {
  navigateTo(path)
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
