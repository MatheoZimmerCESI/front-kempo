// src/services/tournoi.ts
import { useApi } from '~/components/auth/useApi'
import type { Tournoi } from '~/types/tournoi'

/**
 * Récupère tous les tournois.
 */
export const getTournois = (): Promise<Tournoi[]> => {
  const api = useApi()
  return api<Tournoi[]>('/tournoi')
}

/**
 * Récupère un tournoi par son ID.
 */
export const getTournoiByID = (id: number): Promise<Tournoi> => {
  const api = useApi()
  return api<Tournoi>(`/tournoi/${id}`)
}

/**
 * Crée un nouveau tournoi.
 */
export const createTournoi = (
  data: Omit<Tournoi, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/tournoi', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour un tournoi existant.
 */
export const updateTournoi = (
  id: number,
  data: Partial<Tournoi>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/tournoi/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime un tournoi.
 */
export const deleteTournoi = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/tournoi/${id}`, {
    method: 'DELETE',
  })
}
