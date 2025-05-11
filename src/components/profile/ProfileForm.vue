<template>
    <h2 class="text-xl font-semibold mb-4">Modifier mes informations</h2>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Prénom / Nom -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom</label>
          <UInput
            id="firstname"
            v-model="form.firstname"
            placeholder="Ex. Jean"
            required
          />
        </div>
        <div>
          <label for="surname" class="block text-sm font-medium text-gray-700">Nom</label>
          <UInput
            id="surname"
            v-model="form.surname"
            placeholder="Ex. Dupont"
            required
          />
        </div>
      </div>

      <!-- Email (lecture seule) -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <UInput id="email" v-model="form.email" type="email" disabled />
      </div>

      <!-- Date de naissance / Sexe -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="birthday" class="block text-sm font-medium text-gray-700">Date de naissance</label>
          <UInput id="birthday" v-model="form.birthday" type="date" />
        </div>
        <div>
          <label for="sex" class="block text-sm font-medium text-gray-700">Sexe</label>
          <USelect
            id="sex"
            v-model="form.sex"
            :items="[
              { label: 'Masculin', value: 'M' },
              { label: 'Féminin',  value: 'F' }
            ]"
            placeholder="Sélectionnez"
          />
        </div>
      </div>

      <!-- Poids -->
      <div>
        <label for="weight" class="block text-sm font-medium text-gray-700">Poids (kg)</label>
        <UInput
          id="weight"
          v-model.number="form.weight"
          type="number"
          min="0"
          placeholder="Ex. 75"
        />
      </div>

      <!-- Pays / Club / Grade -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label for="countryId" class="block text-sm font-medium text-gray-700">Pays</label>
          <USelect
            id="countryId"
            v-model="form.countryId"
            :items="countries.map(c => ({ label: c.name, value: c.id }))"
            placeholder="Sélectionnez votre pays"
            required
          />
        </div>
        <div>
          <label for="clubId" class="block text-sm font-medium text-gray-700">Club</label>
          <USelect
            id="clubId"
            v-model="form.clubId"
            :items="clubs.map(c => ({ label: c.name, value: c.id }))"
            placeholder="Sélectionnez votre club"
            required
          />
        </div>
        <div>
          <label for="gradeId" class="block text-sm font-medium text-gray-700">Grade</label>
          <USelect
            id="gradeId"
            v-model="form.gradeId"
            :items="grades.map(g => ({ label: g.name, value: g.id }))"
            placeholder="Sélectionnez votre grade"
            required
          />
        </div>
      </div>

      <!-- Bouton Enregistrer -->
      <UButton type="submit" color="primary" block :disabled="saving">
        {{ saving ? 'Enregistrement…' : 'Enregistrer les modifications' }}
      </UButton>
    </form>

    <p v-if="error"   class="mt-4 text-red-600 text-center">{{ error }}</p>
    <p v-if="success" class="mt-4 text-green-600 text-center">{{ success }}</p>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  getProfile,
  updateProfile,
} from '~/services/profil' 
import type {
  ProfileResponse,
  ProfileForm as PF,
  MessageResponseProfile
} from '~/types/profil'

/** Formulaire réactif */
const form = reactive<PF>({
  id:         0,
  email:      '',
  firstname:  '',
  surname:    '',
  birthday:   undefined,
  sex:        undefined,
  weight:     undefined,
  countryId:  undefined,
  clubId:     undefined,
  gradeId:    undefined
})

/** Listes déroulantes */
const countries = ref<{ id: number; name: string }[]>([])
const clubs      = ref<{ id: number; name: string }[]>([])
const grades     = ref<{ id: number; name: string }[]>([])

/** États de soumission */
const saving  = ref(false)
const error   = ref<string|null>(null)
const success = ref<string|null>(null)

onMounted(async () => {
  try {
    // 1. Charge le profil
    const p: ProfileResponse = await getProfile()
    form.id        = p.id
    form.email     = p.email
    form.firstname = p.competiteur?.firstname || ''
    form.surname   = p.competiteur?.surname   || ''
    form.birthday  = p.competiteur?.birthday  || undefined
    form.sex       = (p.competiteur?.sex as 'M'|'F') || undefined
    form.weight    = p.competiteur?.weight    ?? undefined
    form.countryId = p.competiteur?.pays?.id   ?? undefined
    form.clubId    = p.competiteur?.club?.id   ?? undefined
    form.gradeId   = p.competiteur?.grade?.id  ?? undefined

    // 2. Charge pays, clubs, grades pour les selects
    countries.value = await getPays()
    clubs.value      = await getClubs()
    grades.value     = await getGrades()
  } catch (e: any) {
    error.value = e.message || 'Impossible de charger les données'
  }
})

/** Envoi du formulaire */
async function onSubmit() {
  saving.value = true
  error.value  = null
  success.value = null

  try {
    const msg: MessageResponseProfile = await updateProfile({ ...form })
    success.value = msg.message
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la mise à jour'
  } finally {
    saving.value = false
  }
}
</script>
