// src/plugins/auth.client.ts
import { defineNuxtPlugin, useState, useCookie } from '#app'
import type { JwtPayload } from '~/types/auth'

function decodeJwt(token: string): JwtPayload {
  const [_, payload] = token.split('.')
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
  return JSON.parse(decodeURIComponent(
    json.split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
  )) as JwtPayload
}

export default defineNuxtPlugin(() => {
  const userState = useState<JwtPayload | null>('user', () => null)
  const tokenCookie = useCookie<string | null>('token')

  // Décodage initial
  if (tokenCookie.value) {
    try {
      userState.value = decodeJwt(tokenCookie.value)
    } catch {
      tokenCookie.value = null
      userState.value = null
    }
  }

  // Watcher pour login/logout
  watch(tokenCookie, (val) => {
    if (val) {
      try {
        userState.value = decodeJwt(val)
      } catch {
        tokenCookie.value = null
        userState.value = null
      }
    } else {
      userState.value = null
    }
  })
})
