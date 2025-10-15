import api from './api'

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Faz login do usuário
   * @param {string} login - Login do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise<Object>} Dados do login com tokens
   */
  async login(login, senha) {
    const response = await api.post('/auth/login', {
      login,
      senha
    })

    // Salva token no localStorage
    if (response.data.tokens?.access_token) {
      localStorage.setItem('access_token', response.data.tokens.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }

    return response.data
  },

  /**
   * Faz logout do usuário
   */
  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  },

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  /**
   * Obtém usuário atual
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}
