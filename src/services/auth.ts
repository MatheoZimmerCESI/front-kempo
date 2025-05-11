import { useApi } from '~/components/auth/useApi'
import type { AuthResponse, MessageResponseAuth } from '~/types/auth'


export function register(email: string, password: string) {
  const api = useApi()
  return api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { email, password },
  })
}

export function login(email: string, password: string) {
  const api = useApi()
  return api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function forgotPassword(email: string) {
  const api = useApi()
  return api<MessageResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })
}

export function resetPassword(token: string, newPassword: string) {
  const api = useApi()
  return api<MessageResponse>('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  })
}
