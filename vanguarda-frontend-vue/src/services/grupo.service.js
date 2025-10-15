import api from './api'

/**
 * Serviço de grupos - atualizado
 */
export const grupoService = {
  /**
   * Lista grupos com filtros
   * @param {Object} filtros - Filtros (categoria_id, valor_credito_min, valor_credito_max, etc)
   * @returns {Promise<Object>} Lista de grupos
   */
  async listarGrupos(filtros = {}) {
    const params = new URLSearchParams()

    if (filtros.categoria_id) params.append('categoria_id', filtros.categoria_id)
    if (filtros.valor_credito_min) params.append('valor_credito_min', filtros.valor_credito_min)
    if (filtros.valor_credito_max) params.append('valor_credito_max', filtros.valor_credito_max)
    if (filtros.prazo_meses_min) params.append('prazo_meses_min', filtros.prazo_meses_min)
    if (filtros.prazo_meses_max) params.append('prazo_meses_max', filtros.prazo_meses_max)
    if (filtros.aceita_lance !== undefined) params.append('aceita_lance', filtros.aceita_lance)
    if (filtros.apenas_disponiveis !== undefined) params.append('apenas_disponiveis', filtros.apenas_disponiveis)
    if (filtros.limite) params.append('limite', filtros.limite)
    if (filtros.offset) params.append('offset', filtros.offset)

    const response = await api.get(`/grupos?${params.toString()}`)
    return response.data
  },

  /**
   * Obtém detalhes de um grupo específico
   * @param {number} grupoId - ID do grupo
   * @returns {Promise<Object>} Grupo com detalhes e bens
   */
  async obterGrupo(grupoId) {
    const response = await api.get(`/grupos/${grupoId}`)
    return response.data
  },

  /**
   * Verifica disponibilidade de cotas do grupo
   * @param {number} grupoId - ID do grupo
   * @returns {Promise<Object>} Disponibilidade
   */
  async verificarDisponibilidade(grupoId) {
    const response = await api.get(`/grupos/${grupoId}/disponibilidade`)
    return response.data
  }
}

