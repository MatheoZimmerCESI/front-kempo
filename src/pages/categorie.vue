<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Liste des catégories</h1>

    <!-- Barre de recherche -->
    <UInput
      v-model="search"
      placeholder="Rechercher une catégorie…"
      clearable
      class="mb-4 max-w-md"
    />

    <div v-if="loading" class="text-gray-600">Chargement…</div>
    <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="filteredCategories.length === 0" class="text-gray-600 text-center">
        Aucune catégorie trouvée.
      </div>
      <ul class="space-y-2">
        <li
          v-for="cat in filteredCategories"
          :key="cat.id"
          class="p-4 bg-white rounded shadow"
        >
          <h2 class="font-semibold">{{ cat.nom }}</h2>
          <p class="text-sm text-gray-500">
            Âge : {{ cat.ageMin }}-{{ cat.ageMax }} ans •
            Poids : {{ cat.poidsMin }}-{{ cat.poidsMax }} kg •
            Sexe : {{ cat.sexe }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getCategories } from '~/services/categorie'
import type { Categorie } from '~/types/categorie'

const search = ref('')
const categories = ref<Categorie[]>([])
const loading    = ref(true)
const error      = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  error.value   = null
  try {
    categories.value = await getCategories()
  } catch (e: any) {
    error.value = e.data?.message || 'Impossible de charger les catégories'
  } finally {
    loading.value = false
  }
})

const filteredCategories = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return categories.value
  return categories.value.filter(cat =>
    cat.nom.toLowerCase().includes(term)
  )
})
</script>

<style scoped>
section {
  max-width: 800px;
  margin: auto;
}
</style>
