<!-- src/pages/clubs.vue -->
<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Liste des clubs</h1>

    <!-- Barre de recherche -->
    <UInput
      v-model="search"
      placeholder="Rechercher un club…"
      clearable
      class="mb-6 max-w-md"
    />

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center py-10">
      <Loading size="lg" />
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="text-red-600 text-center">
      {{ error }}
    </div>

    <!-- Liste des clubs -->
    <div v-else>
      <div v-if="filteredClubs.length === 0" class="text-gray-600 text-center">
        Aucun club trouvé.
      </div>

      <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <li
          v-for="club in filteredClubs"
          :key="club.id"
        >
          <UCard hoverable class="p-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">{{ club.name }}</h2>
              <NuxtLink
                :to="`/clubs/${club.id}`"
                class="text-primary-600 hover:underline text-sm"
              >
                Détails
              </NuxtLink>
            </div>
          </UCard>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getClubs } from '~/services/club'
import type { Club } from '~/types/club'

const search = ref('')
const clubs = ref<Club[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    clubs.value = await getClubs()
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur lors du chargement des clubs.'
  } finally {
    loading.value = false
  }
})

const filteredClubs = computed((): Club[] => {
  const term = search.value.trim().toLowerCase()
  if (!term) return clubs.value
  return clubs.value.filter(c =>
    c.name.toLowerCase().includes(term)
  )
})
</script>

<style scoped>
section {
  max-width: 960px;
  margin: auto;
}
</style>
