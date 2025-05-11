import { useApi } from '~/components/auth/useApi'
import type { Club } from '~/types/club'

/**
 * Récupère tous les clubs.
 */
export const getClubs = (): Promise<Club[]> => {
  const api = useApi()
  return api<Club[]>('/club')
}

/**
 * Récupère un club par son ID.
 */
export const getClubByID = (id: number): Promise<Club> => {
  const api = useApi()
  return api<Club>(`/club/${id}`)
}

/**
 * Crée un nouveau club.
 */
export const createClub = (
  data: Omit<Club, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/club', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour un club existant.
 */
export const updateClub = (
  id: number,
  data: Partial<Club>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/club/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime un club.
 */
export const deleteClub = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/club/${id}`, {
    method: 'DELETE',
  })
}
