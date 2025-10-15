import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'

/**
 * Store de autenticação
 */
export const useAuthStore = defineStore('auth', () => {
  // Estado
  const usuario = ref(authService.getCurrentUser())
  const carregando = ref(false)
  const erro = ref(null)

  // Getters
  const estaAutenticado = computed(() => authService.isAuthenticated())

  // Actions
  async function login(login, senha) {
    carregando.value = true
    erro.value = null

    try {
      const resultado = await authService.login(login, senha)
      usuario.value = resultado.usuario
      return resultado
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao fazer login'
      throw error
    } finally {
      carregando.value = false
    }
  }

  function logout() {
    authService.logout()
    usuario.value = null
  }

  function limparErro() {
    erro.value = null
  }

  return {
    // Estado
    usuario,
    carregando,
    erro,
    // Getters
    estaAutenticado,
    // Actions
    login,
    logout,
    limparErro
  }
})
