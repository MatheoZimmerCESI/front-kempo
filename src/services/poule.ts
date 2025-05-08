// src/services/poule.ts
import { useApi } from '~/components/auth/useApi'
import type { Poule } from '~/types/poule'

/**
 * Récupère toutes les poules.
 */
export const getPoules = (): Promise<Poule[]> => {
  const api = useApi()
  return api<Poule[]>('/poule')
}

/**
 * Récupère une poule par son ID.
 */
export const getPouleByID = (id: number): Promise<Poule> => {
  const api = useApi()
  return api<Poule>(`/poule/${id}`)
}

/**
 * Crée une nouvelle poule.
 */
export const createPoule = (
  data: Omit<Poule, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/poule', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour une poule existante.
 */
export const updatePoule = (
  id: number,
  data: Partial<Poule>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/poule/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime une poule.
 */
export const deletePoule = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/poule/${id}`, {
    method: 'DELETE',
  })
}
