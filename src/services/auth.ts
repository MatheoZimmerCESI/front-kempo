// src/services/auth.ts
import { useApi } from '~/components/auth/useApi'
import type { AuthResponse } from '~/types/auth'

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
