import { useApi } from '~/components/auth/useApi'
import type { Grade } from '~/types/grade'

/**
 * Récupère tous les grades.
 */
export const getGrades = (): Promise<Grade[]> => {
  const api = useApi()
  return api<Grade[]>('/grade')
}

/**
 * Récupère un grade par son ID.
 */
export const getGradeByID = (id: number): Promise<Grade> => {
  const api = useApi()
  return api<Grade>(`/grade/${id}`)
}

/**
 * Crée un nouveau grade.
 */
export const createGrade = (
  data: Omit<Grade, 'id'>
): Promise<{ id: number }> => {
  const api = useApi()
  return api<{ id: number }>('/grade', {
    method: 'POST',
    body: data,
  })
}

/**
 * Met à jour un grade existant.
 */
export const updateGrade = (
  id: number,
  data: Partial<Grade>
): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/grade/${id}`, {
    method: 'PUT',
    body: data,
  })
}

/**
 * Supprime un grade.
 */
export const deleteGrade = (id: number): Promise<{ success: boolean }> => {
  const api = useApi()
  return api<{ success: boolean }>(`/grade/${id}`, {
    method: 'DELETE',
  })
}
