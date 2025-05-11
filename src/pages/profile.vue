<template>
  <section class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Mon profil</h1>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
      <!-- 1. Résumé -->
      <ProfileSummary
        :id="userId"
        :email="email"
        :createdAt="createdAt"
        :updatedAt="updatedAt"
        :competiteur="competiteur!"
        :roles="roles"
      />

      <!-- 2. Actions -->
      <ProfileActions
        @edit="openEditModal"
        @deactivate="onDeactivate"
        @delete="onDelete"
      />
    </div>

    <!-- 3. Modale d’édition -->
    <UModal
      v-model:open="showEditModal"
      title="Modifier mes informations personnelles"
      description="Mettez à jour vos données ci-dessous"
      close-button
      class="max-w-4xl"
    >
      <template #body>
        <ProfileForm
          :form="form"
          :countries="countries"
          :clubs="clubs"
          :grades="grades"
          :loading="loading"
          :error="error"
          :success="success"
          @submit="onSubmit"
        />
      </template>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton variant="ghost" @click="showEditModal = false">
            Annuler
          </UButton>
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Composants
import ProfileSummary from '~/components/profile/ProfileSummary.vue'
import ProfileActions from '~/components/profile/ProfileActions.vue'
import ProfileForm    from '~/components/profile/ProfileForm.vue'

// Services
import {
  getProfile,
  updateProfile,
  deactivateAccount,
  deleteAccount
} from '~/services/profil'
import { getPays }   from '~/services/pays'
import { getClubs }  from '~/services/club'
import { getGrades } from '~/services/grade'

// Types
import type { ProfileResponse, MessageResponseProfile } from '~/types/profil'
import type { ProfileForm as PF }                      from '~/types/profil'


const tokenCookie = useCookie<string | null>('token')


// ---- ÉTAT LOCAL ----
// Formulaire d’édition (sans createdAt/updatedAt)
const form = ref<PF>({
  id:        0,
  email:     '',
  firstname: '',
  surname:   '',
  birthday:  undefined,
  sex:       undefined,
  weight:    undefined,
  countryId: undefined,
  clubId:    undefined,
  gradeId:   undefined
})

const userId      = ref<number>(0)
const email       = ref('')
const createdAt   = ref<string>('')
const updatedAt   = ref<string>('')
const competiteur = ref<ProfileResponse['competiteur']>(null)
const roles       = ref<string[]>([])

const countries = ref<{ id: number; name: string }[]>([])
const clubs     = ref<{ id: number; name: string }[]>([])
const grades    = ref<{ id: number; name: string }[]>([])

const loading = ref(false)
const error   = ref<string | null>(null)
const success = ref<string | null>(null)

// Contrôle l’ouverture de la modale
const showEditModal = ref(false)

// ---- CHARGEMENT INITIAL ----
onMounted(async () => {
  try {
    const [res, paysList, clubList, gradeList] = await Promise.all([
      getProfile() as Promise<ProfileResponse>,
      getPays(),
      getClubs(),
      getGrades()
    ])

    // Meta user
    userId.value    = res.id
    email.value     = res.email
    createdAt.value = res.createdAt
    updatedAt.value = res.updatedAt
    roles.value     = res.roles

    // Pré-remplissage form + competiteur
    competiteur.value = res.competiteur
    form.value.id        = res.id
    form.value.email     = res.email
    if (res.competiteur) {
      const c = res.competiteur
      form.value.firstname = c.firstname
      form.value.surname   = c.surname
      form.value.birthday  = c.birthday ?? undefined
      form.value.sex       = c.sex === 'M' || c.sex === 'F' ? c.sex : undefined
      form.value.weight    = c.weight ?? undefined
      form.value.countryId = c.countryId ?? undefined
      form.value.clubId    = c.clubId ?? undefined
      form.value.gradeId   = c.gradeId ?? undefined
    }

    // Lists
    countries.value = paysList
    clubs.value     = clubList
    grades.value    = gradeList
  } catch (e: any) {
    error.value = e?.data?.message || 'Impossible de charger le profil'
  }
})

// Ouvre la modale
function openEditModal() {
  error.value       = null
  success.value     = null
  showEditModal.value = true
}

// Envoie les modifications
async function onSubmit(payload: Partial<PF>) {
  loading.value = true
  error.value   = null
  success.value = null

  try {
    const res: MessageResponseProfile = await updateProfile(payload)
    success.value = res.message
    // showEditModal.value = false  // si tu veux fermer la modale
  } catch (e: any) {
    error.value = e?.data?.message || 'Erreur lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

// Désactivation du compte
async function onDeactivate() {
  await deactivateAccount()
  // 1) Supprimer le token
  tokenCookie.value = null
  // 2) Rediriger
  navigateTo('/login')
}

// Suppression définitive
async function onDelete() {
  await deleteAccount()
  // 1) Supprimer le token
  tokenCookie.value = null
  // 2) Rediriger
  navigateTo('/login')
}
</script>

<style scoped>
section {
  background-image: none;
}
</style>
