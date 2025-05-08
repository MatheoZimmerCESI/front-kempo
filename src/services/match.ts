// src/services/match.ts
import { useApi } from '~/components/auth/useApi'
import type { Match } from '~/types/match'

/**
 * Récupère tous les matchs.
 */
export const getMatchs = (): Promise<Match[]> => {
  const api = useApi()
  return api<Match[]>('/match')
}

/**
 * Récupère un match par son ID.
 */
export const getMatchByID = (id: number): Promise<Match> => {
  const api = useApi()
  return api<Match>(`/match/${id}`)
}

/**
 * Crée un nouveau match.
 */
export const createMatch = (
  data: Omit<Match, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/match', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour un match existant.
 */
export const updateMatch = (
  id: number,
  data: Partial<Match>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/match/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Met à jour uniquement le score d’un match.
 */
export const updateMatchScore = (
  id: number,
  score1: number,
  score2: number,
  keikoku1: number,
  keikoku2: number,
  is_finished: boolean
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/match/${id}/score`, {
    method: 'PATCH',
    body: {
      score1,
      score2,
      keikoku_competiteur1: keikoku1,
      keikoku_competiteur2: keikoku2,
      is_finished,
    },
  })
}

/**
 * Supprime un match.
 */
export const deleteMatch = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/match/${id}`, {
    method: 'DELETE',
  })
}


/**
 * Récupère les matchs du compétiteur lié à l’utilisateur connecté.
 */
export const getMyMatchs = (): Promise<Match[]> => {
  const api = useApi()
  return api<Match[]>('/competiteur/mes-matchs')
}


