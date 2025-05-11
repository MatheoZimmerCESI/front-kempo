<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mes Matchs</h1>

    <div v-if="loading">Chargement…</div>

    <!-- Pas encore de profil compétiteur -->
    <div v-else-if="noProfile" class="text-yellow-600">
      Vous n’avez pas encore complété votre profil compétiteur.
      <NuxtLink to="/user/profile" class="underline ml-1">
        Compléter mon profil
      </NuxtLink>
    </div>

    <!-- Erreur réseau ou autre -->
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <!-- Affichage des matchs groupés par tournoi -->
    <div v-else>
      <div v-for="group in groups" :key="group.tournoi.id" class="mb-4">
        <details class="border rounded">
          <summary class="cursor-pointer bg-gray-100 p-2 font-semibold">
            Matchs du tournoi : {{ group.tournoi.nom }}
          </summary>
          <ul class="p-2 space-y-2">
            <li
              v-for="m in group.matchs"
              :key="m.id"
              class="p-2 bg-white rounded shadow-sm"
            >
              <p>
                Match #{{ m.id }} – Score :
                <span class="font-medium">{{ getMyScore(m) }}</span>
                /
                <span class="font-medium">{{ getOppScore(m) }}</span>
              </p>
              <p>Faute(s) : {{ getMyFaults(m) }}</p>
            </li>
          </ul>
          <div class="p-2 border-t bg-gray-50 text-sm space-y-1">
            <p>Points moyens : {{ stats(group.matchs).avgPoints.toFixed(1) }}</p>
            <p>Fautes moyennes : {{ stats(group.matchs).avgFaults.toFixed(1) }}</p>
            <p>Victoires : {{ stats(group.matchs).wins }}</p>
            <p>Défaites : {{ stats(group.matchs).losses }}</p>
          </div>
        </details>
      </div>

      <div v-if="groups.length === 0" class="text-gray-600">
        Aucun match trouvé.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NuxtLink } from '#components'
import { getMyCompetiteur } from '~/services/competiteur'
import { getMyMatchs }      from '~/services/match'
import { getTournois }      from '~/services/tournoi'
import type { Competiteur } from '~/types/competiteur'
import type { Match }       from '~/types/match'
import type { Tournoi }     from '~/types/tournoi'

const loading    = ref(true)
const noProfile  = ref(false)
const error      = ref<string | null>(null)

const myCompetiteur = ref<Competiteur | null>(null)
const matchs         = ref<Match[]>([])
const tournois       = ref<Tournoi[]>([])

onMounted(async () => {
  try {
    // 1) Profil compétiteur
    try {
      myCompetiteur.value = await getMyCompetiteur()
    } catch (e: any) {
      if (e?.message?.includes('404')) {
        noProfile.value = true
        return
      }
      throw e
    }

    // 2) Matchs + Tournois
    const [m, t] = await Promise.all([
      getMyMatchs(),
      getTournois()
    ])
    matchs.value   = m
    tournois.value = t

  } catch (e: any) {
    error.value = e.message || 'Erreur réseau'
  } finally {
    loading.value = false
  }
})

// Score et fautes en camelCase
function getMyScore(m: Match): number {
  if (!myCompetiteur.value) return 0
  return m.competitor1Id === myCompetiteur.value.id ? m.score1 : m.score2
}
function getOppScore(m: Match): number {
  if (!myCompetiteur.value) return 0
  return m.competitor1Id === myCompetiteur.value.id ? m.score2 : m.score1
}
function getMyFaults(m: Match): number {
  if (!myCompetiteur.value) return 0
  return m.competitor1Id === myCompetiteur.value.id
    ? m.keikokuCompetiteur1
    : m.keikokuCompetiteur2
}

// Grouper par tournoi via tournoiId
const groups = computed(() => {
  return tournois.value
    .map(tr => ({
      tournoi: tr,
      matchs: matchs.value.filter(m => m.tournoiId === tr.id)
    }))
    .filter(g => g.matchs.length > 0)
})

// Stats inchangées
function stats(matchList: Match[]) {
  if (!myCompetiteur.value || matchList.length === 0) {
    return { avgPoints: 0, avgFaults: 0, wins: 0, losses: 0 }
  }
  let sumPts = 0, sumFlt = 0, w = 0, l = 0
  matchList.forEach(m => {
    const ms = getMyScore(m)
    const os = getOppScore(m)
    const mf = getMyFaults(m)
    sumPts += ms
    sumFlt += mf
    if (ms > os) w++
    if (ms < os) l++
  })
  return {
    avgPoints: sumPts / matchList.length,
    avgFaults: sumFlt / matchList.length,
    wins: w,
    losses: l
  }
}
</script>
