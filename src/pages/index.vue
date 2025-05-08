<script setup lang="ts">
import { useCookie, navigateTo } from '#app'

// Récupère le JWT stocké
const tokenCookie = useCookie<string | null>('token')

// Dès que la page se charge, on redirige
if (tokenCookie.value) {
  // Utilisateur (ou invité) authentifié  
  navigateTo('/dashboard')
} else {
  // Pas de token → vers la page de connexion
  navigateTo('/login')
}
</script>
