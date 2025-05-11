<template>
  <div class="tournoi-actions">
    <!-- Bouton poubelle harmonisé -->
    <UButton
      class="delete-button"
      size="sm"
      variant="ghost"
      icon="heroicons-outline:trash"
      color="primary"
      @click="askDelete"
      aria-label="Supprimer le tournoi"
    />

    <!-- Modale de confirmation -->
    <UModal
      v-model:open="open"
      title="Confirmer la suppression"
      :ui="{ width: 'max-w-md' }"
      :close="false"
    >
      <template #body>
        <p>Êtes‑vous sûr de vouloir supprimer ce tournoi&nbsp;?</p>
      </template>

      <template #footer>
        <UButton color="error" @click="confirmDelete">
          Supprimer
        </UButton>
        <UButton variant="ghost" @click="open = false">
          Annuler
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
// import { deleteTournoi } from '~/services/tournoi'
// Import du CSS dédié
import '~/assets/css/GestionTournois/deleteTournoi.css'

// Props : id du tournoi à supprimer
const props = defineProps<{ id: number }>()
// Émet 'deleted' quand la suppression est réussie
const emit = defineEmits<{
  (e: 'deleted'): void
}>()

// État de la modale
const open = ref(false)

// Ouvre la modale
const askDelete = () => {
  open.value = true
}

// Confirme et effectue la suppression
const confirmDelete = async () => {
  const res = await deleteTournoi(props.id)
  if (res && res.success) {
    emit('deleted')
  } else {
    alert('La suppression a échoué. Veuillez réessayer.')
  }
  open.value = false
}
</script>
