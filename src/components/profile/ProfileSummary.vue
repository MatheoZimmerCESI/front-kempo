<template>
  <div class="bg-white p-6 rounded-2xl shadow">
    <h2 class="text-xl font-semibold mb-4">Résumé</h2>

    <!-- Email & date d’inscription -->
    <p>
      <span class="font-medium">Email :</span>
      {{ email }}
    </p>
    <p v-if="createdAt">
      <span class="font-medium">Inscrit le :</span>
      {{ formatDate(createdAt) }}
    </p>

    <!-- Date de naissance -->
    <p v-if="competiteur?.birthday">
      <span class="font-medium">Date de naissance :</span>
      {{ formatDate(competiteur.birthday) }}
    </p>
    <p v-else>
      <span class="font-medium">Date de naissance :</span> —
    </p>

    <!-- Sexe -->
    <p>
      <span class="font-medium">Sexe :</span>
      {{ sexeLabel(competiteur?.sex) }}
    </p>

    <!-- Poids -->
    <p>
      <span class="font-medium">Poids :</span>
      {{ competiteur?.weight != null ? competiteur.weight + ' kg' : '—' }}
    </p>

    <!-- Pays, club, grade -->
    <p>
      <span class="font-medium">Pays :</span>
      {{ competiteur?.pays?.name ?? '—' }}
    </p>
    <p>
      <span class="font-medium">Club :</span>
      {{ competiteur?.club?.name ?? '—' }}
    </p>
    <p>
      <span class="font-medium">Grade :</span>
      {{ competiteur?.grade?.name ?? '—' }}
    </p>

    <!-- Rôles -->
    <p>
      <span class="font-medium">Rôles :</span>
      {{ roles.length ? roles.join(', ') : '—' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs, computed } from 'vue'
import { useState } from '#app'
import type { ProfileResponse } from '~/types/profil'

/** On reçoit toute la réponse /profile en props */
const props = defineProps<ProfileResponse>()
/** Rendre email, createdAt & competiteur faciles à utiliser (conserve la réactivité) */
const { email, createdAt, competiteur } = toRefs(props)

/** Récupération du state global pour extraire les rôles */
type UserState = { userId: number; roles: string[] } | null
const userState = useState<UserState>('user')
const roles = computed(() => userState.value?.roles ?? [])

/** Helpers pour formater dates et sexe */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric'
  }).format(new Date(iso))
}
function sexeLabel(sex?: string | null) {
  if (sex === 'M') return 'Masculin'
  if (sex === 'F') return 'Féminin'
  return '—'
}
</script>
