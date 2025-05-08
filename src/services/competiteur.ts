// src/services/competiteur.ts
import { useApi } from '~/components/auth/useApi'
import type { Competiteur } from '~/types/competiteur'

/**
 * Récupère tous les compétiteurs.
 */
export const getCompetiteurs = (): Promise<Competiteur[]> => {
  const api = useApi()
  return api<Competiteur[]>('/competiteur')
}

/**
 * Récupère un compétiteur par son ID.
 */
export const getCompetiteurByID = (id: number): Promise<Competiteur> => {
  const api = useApi()
  return api<Competiteur>(`/competiteur/${id}`)
}

/**
 * Crée un nouveau compétiteur.
 */
export const createCompetiteur = (
  data: Omit<Competiteur, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/competiteur', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour un compétiteur existant.
 */
export const updateCompetiteur = (
  id: number,
  data: Partial<Competiteur>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/competiteur/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime un compétiteur.
 */
export const deleteCompetiteur = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/competiteur/${id}`, {
    method: 'DELETE',
  })
}


/**
 * Récupère le profil du compétiteur lié à l’utilisateur connecté.
 */
export const getMyCompetiteur = (): Promise<Competiteur> => {
  const api = useApi()
  return api<Competiteur>('/competiteur/mon-profil')
}