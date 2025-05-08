<template>
  <!-- Icône crayon pour ouvrir la modale de modification -->
  <UButton
    class="update-icon"
    size="sm"
    variant="ghost"
    icon="heroicons-outline:pencil"
    color="primary"
    aria-label="Modifier le tournoi"
    @click="open = true"
  />

  <!-- Modale NuxtUI de mise à jour d'un tournoi -->
  <UModal
    v-model:open="open"
    title="Modifier le tournoi"
    description="Mettez à jour les informations du tournoi"
    :ui="{ width: 'max-w-7xl', height: 'max-h-screen' }"
    :close="false"
  >
    <template #body>
      <!-- Formulaire réutilisable avec données initiales -->
      <FormTournoi
        :initialData="initialFormData"
        submitLabel="Modifier"
        @submitted="handleUpdate"
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
// Import du CSS pour la classe .update-icon
import '~/assets/css/GestionTournois/updateTournoi.css'

// import { ref, computed } from 'vue'
// import type { Tournoi } from '~/types/tournoi'
// import FormTournoi from './FormTournoi.vue'
// import { updateTournoi } from '~/services/tournoi'

// Props : on reçoit tout l'objet tournoi à modifier
const props = defineProps<{
  tournoi: Tournoi
}>()

// Événement émis quand la mise à jour est réussie
const emit = defineEmits<{
  (e: 'updated'): void
}>()

// Alias pour un nouveau tournoi (sans l'ID)
type NewTournoi = Omit<Tournoi, 'id'>

// Contrôle l'ouverture de la modale
const open = ref(false)

// Préparation des données initiales pour FormTournoi
const initialFormData = computed<NewTournoi>(() => ({
  nom: props.tournoi.nom,
  lieu: props.tournoi.lieu,
  date_debut: props.tournoi.date_debut,
  date_fin: props.tournoi.date_fin,
  systemeElimination: props.tournoi.systemeElimination,
  id_categorie: props.tournoi.id_categorie,
  id_pays: props.tournoi.id_pays
}))

/**
 * Appelé à la soumission du formulaire :
 * on appelle l'API update, on ferme la modale et on émet 'updated' pour
 * que le parent rafraîchisse la liste.
 */
async function handleUpdate(data: NewTournoi) {
  // Assertion non‑nulle sur l'ID pour rassurer TS
  const res = await updateTournoi(props.tournoi.id!, data)
  if (res && res.success) {
    emit('updated')
    open.value = false
  } else {
    alert('La mise à jour a échoué. Veuillez réessayer.')
  }
}
</script>
