// utils/api.ts
import { useRuntimeConfig } from 'nuxt/app'

export function apiUrl(path: string) {
  const config = useRuntimeConfig()
  return `${config.public.apiBase}${path}`
}
