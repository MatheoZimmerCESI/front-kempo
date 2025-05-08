<template>
  <!-- Bouton d'ouverture de la modale -->
  <UButton @click="open = true" color="primary" class="create-button">
    + Créer un tournoi
  </UButton>

  <!-- Modale NuxtUI de création de tournoi -->
  <UModal
    v-model:open="open"
    title="Créer un tournoi"
    description="Remplissez les informations pour ajouter un tournoi"
    :ui="{ width: 'max-w-7xl', height: 'max-h-screen' }"
    :close="false"
  >
    <template #body>
      <!-- Formulaire réutilisable -->
      <FormTournoi
        submitLabel="Créer"
        @submitted="handleCreate"
      />
    </template>

    <template #footer>
      <UButton variant="ghost" @click="open = false">
        Annuler
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormTournoi from './FormTournoi.vue'
import { createTournoi } from '~/services/tournoi'
import type { Tournoi } from '~/types/tournoi'

// Alias pour les nouveaux tournois (sans l'ID)
type NewTournoi = Omit<Tournoi, 'id'>

const open = ref(false)
// Événement émis quand la création est réussie
const emit = defineEmits<{ (e: 'created'): void }>()

/**
 * Reçoit un NewTournoi typé, appelle l'API puis ferme la modale
 */
async function handleCreate(data: NewTournoi) {
  const res = await createTournoi(data)
  if (res) {
    emit('created')
    open.value = false
  }
}
</script>

<style scoped>
.create-button {
  align-self: flex-end;
  margin-bottom: 1rem;
}
</style>
