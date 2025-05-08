// types/nuxt.d.ts
import type { Ofetch } from 'ofetch'

export {}

declare module '#app' {
  interface NuxtApp {
    /**
     * Toast helper
     */
    $showToast: (type: 'success' | 'fail', title: string, timeout?: number) => void
    /**
     * Client API ofetch configuré dans plugins/auth.client.ts
     */
    $api: Ofetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Toast helper
     */
    $showToast: (type: 'success' | 'fail', title: string, timeout?: number) => void
    /**
     * Client API ofetch configuré dans plugins/auth.client.ts
     */
    $api: Ofetch
  }
}
