// src/services/pays.ts
import { useApi } from '~/components/auth/useApi'
import type { Pays } from '~/types/pays'

/**
 * Récupère tous les pays.
 */
export const getPays = (): Promise<Pays[]> => {
  const api = useApi()
  return api<Pays[]>('/pays')
}

/**
 * Récupère un pays par son ID.
 */
export const getPaysByID = (id: number): Promise<Pays> => {
  const api = useApi()
  return api<Pays>(`/pays/${id}`)
}

/**
 * Crée un nouveau pays.
 */
export const createPays = (
  data: Omit<Pays, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/pays', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour un pays existant.
 */
export const updatePays = (
  id: number,
  data: Partial<Pays>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/pays/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime un pays.
 */
export const deletePays = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/pays/${id}`, {
    method: 'DELETE',
  })
}
