<!-- src/pages/clubs.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Liste des Clubs</h1>

    <!-- Barre de recherche -->
    <UInput
      v-model="search"
      placeholder="Rechercher un club…"
      clearable
      class="mb-4 max-w-md"
    />

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="flex justify-center py-10">
      <Loading size="lg" />
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="text-red-600 text-center">
      {{ error }}
    </div>

    <!-- Liste des clubs filtrée -->
    <div v-else>
      <div v-if="filteredClubs.length === 0" class="text-gray-600 text-center">
        Aucun club trouvé.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="club in filteredClubs"
          :key="club.id"
          hoverable
          class="p-4"
        >
          <CardTitle>{{ club.name }}</CardTitle>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getClubs } from '~/services/club'
import type { Club } from '~/types/club'

// Composants Nuxt UI auto-importés:
// UInput, Card, CardTitle, Loading

const search = ref('')
const clubs = ref<Club[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    clubs.value = await getClubs()
  } catch (e: any) {
    error.value = e.message || 'Erreur lors du chargement des clubs.'
  } finally {
    loading.value = false
  }
})

const filteredClubs = computed((): Club[] => {
  const term = search.value.trim().toLowerCase()
  if (!term) return clubs.value
  return clubs.value.filter((c: Club) =>
    c.name.toLowerCase().includes(term)
  )
})
</script>
