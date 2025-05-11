<template>
  <UModal
    v-model:open="open"
    title="Mot de passe oublié"
    description="Entrez votre email pour recevoir un lien"
    size="md"
    class="max-w-md mx-auto"
  >
    <template #body>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <UInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="votre.email@exemple.com"
          required
          color="primary"
        />
        <p v-if="message" class="text-green-600 text-center">{{ message }}</p>
        <p v-if="error" class="text-red-600 text-center">{{ error }}</p>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton variant="ghost" @click="open = false">
          Annuler
        </UButton>
        <UButton
          color="primary"
          :is-loading="loading"
          @click="onSubmit"
        >
          Envoyer le lien
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { forgotPassword } from '~/services/auth'
import type { MessageResponse } from '~/types/auth'

const props = defineProps<{ open: boolean }>()

// ⚠️ ici on déclare la signature d’emit correctement
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const open    = ref(props.open)
const email   = ref('')
const loading = ref(false)
const message = ref<string|null>(null)
const error   = ref<string|null>(null)

// synchro props <-> ref
watch(() => props.open, v => open.value = v)
watch(open, v => emit('update:open', v))

async function onSubmit() {
  if (!email.value) {
    error.value = 'Veuillez saisir un email.'
    return
  }
  loading.value = true
  message.value = error.value = null

  try {
    const res = await forgotPassword(email.value) as MessageResponse
    message.value = res.message
  } catch (err: any) {
    error.value = err.data?.message || 'Erreur inattendue.'
  } finally {
    loading.value = false
  }
}
</script>
