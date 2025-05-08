// src/services/categorie.ts
import { useApi } from '~/components/auth/useApi'
import type { Categorie } from '~/types/categorie'

/**
 * Récupère toutes les catégories.
 */
export const getCategories = (): Promise<Categorie[]> => {
  const api = useApi()
  return api<Categorie[]>('/categorie')
}

/**
 * Récupère une catégorie par son ID.
 */
export const getCategorieByID = (id: number): Promise<Categorie> => {
  const api = useApi()
  return api<Categorie>(`/categorie/${id}`)
}

/**
 * Crée une nouvelle catégorie.
 */
export const createCategorie = (
  data: Omit<Categorie, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/categorie', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour une catégorie existante.
 */
export const updateCategorie = (
  id: number,
  data: Partial<Categorie>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/categorie/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime une catégorie.
 */
export const deleteCategorie = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/categorie/${id}`, {
    method: 'DELETE',
  })
}
