// composables/useApi.ts
import { useCookie, useRuntimeConfig } from '#app'
import { ofetch } from 'ofetch'

/**
 * Retourne un client ofetch préconfiguré avec :
 *  - baseURL depuis runtimeConfig.public.apiBase
 *  - interception du token JWT dans le cookie "token"
 */
export function useApi() {
  const tokenCookie = useCookie<string | null>('token')
  const apiBase = useRuntimeConfig().public.apiBase as string

  return ofetch.create({
    baseURL: apiBase,
    async onRequest({ options }) {
      const t = tokenCookie.value
      if (!t) return
      const h = new Headers(options.headers || {})
      h.set('Authorization', `Bearer ${t}`)
      options.headers = h
    },
  })
}
