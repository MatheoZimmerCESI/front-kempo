<template>
  <div class="bg-white p-6 rounded-2xl shadow space-y-4">
    <h2 class="text-xl font-semibold">Actions du compte</h2>

    <!-- Modifier -->
    <UButton color="primary" block @click="emit('edit')">
      Modifier mes informations personnelles
    </UButton>

    <!-- Désactivation -->
    <UButton color="warning" block @click="showDeactivateModal = true">
      Désactiver mon compte
    </UButton>

    <!-- Suppression -->
    <UButton color="error" block @click="showDeleteModal = true">
      Supprimer définitivement
    </UButton>

    <!-- Modal de confirmation désactivation -->
    <UModal
      v-model:open="showDeactivateModal"
      title="Confirmer la désactivation"
      close-button
      class="max-w-md"
    >
      <template #body>
        <p>
          Votre compte sera désactivé et vous ne pourrez plus vous connecter.
          Vous pourrez le réactiver à tout moment via le bouton Aide sur la page de Connexion.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton variant="ghost" @click="showDeactivateModal = false">
            Annuler
          </UButton>
          <UButton color="warning" @click="confirmDeactivate">
            Désactiver
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal de confirmation suppression -->
    <UModal
      v-model:open="showDeleteModal"
      title="Confirmer la suppression"
      close-button
      class="max-w-md"
    >
      <template #body>
        <p>
          Votre compte sera désactivé pendant 7 jours pendant lesquels
          vous pourrez revenir sur votre décision. Après ce délai,
          il sera supprimé de façon irréversible.
        </p>
        <p>
          Si vous souhaitez une suppression immédiate,
          <a href="mailto:admin@exemple.com" class="text-blue-600">
            contactez un administrateur.
          </a>
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton variant="ghost" @click="showDeleteModal = false">
            Annuler
          </UButton>
          <UButton color="error" @click="confirmDelete">
            Supprimer
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'deactivate'): void
  (e: 'delete'): void
}>()

// États pour les modales
const showDeactivateModal = ref(false)
const showDeleteModal = ref(false)

function confirmDeactivate() {
  emit('deactivate')
  showDeactivateModal.value = false
}

function confirmDelete() {
  emit('delete')
  showDeleteModal.value = false
}
</script>
