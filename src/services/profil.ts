import { useApi } from '~/components/auth/useApi'
import type {
  ProfileResponse,
  MessageResponseProfile,
  ProfileForm
} from '~/types/profil'

/**
 * Récupère les infos du profil de l’utilisateur connecté
 */
export function getProfile() {
  const api = useApi()
  return api<ProfileResponse>('/profile', {
    method: 'GET'
  })
}

/**
 * Met à jour le profil compétiteur (autorise les null pour tous les champs)
 */
export function updateProfile(data: {
  firstname?: string
  surname?: string
  birthday?: string | null
  sex?: string | null
  weight?: number | null
  countryId?: number | null
  clubId?: number | null
  gradeId?: number | null
}) {
  const api = useApi()
  return api<MessageResponseProfile>('/profile', {
    method: 'PATCH',
    body: data
  })
}

/**
 * Désactive (soft-deactivate) le compte connecté
 * Renvoie 204 No Content
 */
export function deactivateAccount() {
  const api = useApi()
  return api<void>('/profile/deactivate', {
    method: 'PATCH'
  })
}

/**
 * Réactive un compte désactivé
 * @param creds { email, password }
 * Renvoie 204 No Content
 */
export function reactivateAccount(creds: { email: string; password: string }) {
  const api = useApi()
  return api<void>('/profile/reactivate', {
    method: 'PATCH',
    body: creds
  })
}

/**
 * Supprime définitivement (soft-delete) le compte connecté
 * Renvoie 204 No Content
 */
export function deleteAccount() {
  const api = useApi()
  return api<void>('/profile', {
    method: 'DELETE'
  })
}
