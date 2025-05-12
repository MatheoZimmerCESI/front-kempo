<template>
  <div class="list-tournois p-6">
    <!-- Bouton de création -->
    <div class="mb-4">
      <CreateTournoi @created="refreshAll" />
    </div>

    <!-- Message si aucun tournoi -->
    <div v-if="tournois.length === 0" class="no-data text-gray-600">
      Aucun tournoi pour le moment.
    </div>

    <!-- Liste des tournois -->
    <UCard
      v-for="tournoi in tournois"
      :key="tournoi.id"
      class="tournoi-card mb-4 relative"
    >
      <!-- Actions Admin -->
      <div class="absolute top-2 right-2 flex space-x-2">
        <DeleteTournoi :id="tournoi.id!" @deleted="refreshAll" />
        <UpdateTournoi :tournoi="tournoi" @updated="refreshAll" />
      </div>

      <div class="tournoi-header mb-2">
        <h2 class="tournoi-nom text-xl font-semibold">{{ tournoi.nom }}</h2>
      </div>

      <div class="tournoi-details space-y-1 text-sm">
        <div class="detail-item flex">
          <span class="detail-label w-40 font-medium">Lieu :</span>
          <span class="detail-value">{{ tournoi.lieu }}</span>
        </div>
        <div class="detail-item flex">
          <span class="detail-label w-40 font-medium">Date de début :</span>
          <span class="detail-value">{{ formatDate(tournoi.dateDebut) }}</span>
        </div>
        <div class="detail-item flex">
          <span class="detail-label w-40 font-medium">Date de fin :</span>
          <span class="detail-value">{{ formatDate(tournoi.dateFin) }}</span>
        </div>
        <div class="detail-item flex">
          <span class="detail-label w-40 font-medium">Système d’élimination :</span>
          <span class="detail-value capitalize">{{ tournoi.systemeElimination.trim() }}</span>
        </div>
        <div class="detail-item flex">
          <span class="detail-label w-40 font-medium">Catégorie :</span>
          <span class="detail-value">
            {{ categorieMap[tournoi.categorieId] ?? '—' }}
          </span>
        </div>
        <div class="detail-item flex">
          <span class="detail-label w-40 font-medium">Pays :</span>
          <span class="detail-value">
            {{ paysMap[tournoi.countryId] ?? '—' }}
          </span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getTournois } from '~/services/tournoi'
import { getCategories } from '~/services/categorie'
import { getPays } from '~/services/pays'

import type { Tournoi }    from '~/types/tournoi'
import type { Categorie } from '~/types/categorie'
import type { Pays }      from '~/types/pays'

import CreateTournoi from '~/components/GestionTournois/CreateTournoi.vue'
import DeleteTournoi from '~/components/GestionTournois/DeleteTournoi.vue'
import UpdateTournoi from '~/components/GestionTournois/UpdateTournoi.vue'
import '~/assets/css/GestionTournois/listTournoi.css'

// États
const tournois     = ref<Tournoi[]>([])
const categories   = ref<Categorie[]>([])
const pays         = ref<Pays[]>([])
const categorieMap = reactive<Record<number, string>>({})
const paysMap      = reactive<Record<number, string>>({})

// Charge tournois
async function refreshTournois() {
  tournois.value = await getTournois()
}

// Charge catégories et construit le map
async function refreshCategories() {
  categories.value = await getCategories()
  Object.keys(categorieMap).forEach(k => delete categorieMap[+k])
  categories.value.forEach(c => {
    if (c.id != null) categorieMap[c.id] = c.nom
  })
}

// Charge pays et construit le map
async function refreshPays() {
  pays.value = await getPays()
  Object.keys(paysMap).forEach(k => delete paysMap[+k])
  pays.value.forEach(p => {
    if (p.id != null) paysMap[p.id] = p.name
  })
}

// Tout rafraîchir
async function refreshAll() {
  await Promise.all([
    refreshTournois(),
    refreshCategories(),
    refreshPays()
  ])
}

// Initialisation
onMounted(refreshAll)

// Formatte date
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year:  'numeric',
    month: 'long',
    day:   'numeric'
  })
}
</script>

<style scoped>
.tournoi-card {
  position: relative;
}
</style>
