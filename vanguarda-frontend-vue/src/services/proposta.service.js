import api from './api'

/**
 * Serviço de propostas
 */
export const propostaService = {
  /**
   * Cria uma nova proposta
   * @param {Object} dados - Dados da proposta
   * @returns {Promise<Object>} Proposta criada
   */
  async criar(dados) {
    const response = await api.post('/propostas', dados)
    return response.data
  },

  /**
   * Converte reserva em proposta
   * @param {Object} dados - Dados da conversão
   * @returns {Promise<Object>} Proposta criada
   */
  async converterReserva(dados) {
    const response = await api.post('/propostas/converter-reserva', dados)
    return response.data
  },

  /**
   * Lista propostas
   * @param {Object} filtros - Filtros
   * @returns {Promise<Object>} Lista de propostas
   */
  async listar(filtros = {}) {
    const response = await api.get('/propostas', { params: filtros })
    return response.data
  },

  /**
   * Busca proposta por ID
   * @param {number} id - ID da proposta
   * @returns {Promise<Object>} Proposta
   */
  async buscarPorId(id) {
    const response = await api.get(`/propostas/${id}`)
    return response.data
  },

  /**
   * Atualiza proposta
   * @param {number} id - ID da proposta
   * @param {Object} dados - Dados para atualizar
   * @returns {Promise<Object>} Proposta atualizada
   */
  async atualizar(id, dados) {
    const response = await api.patch(`/propostas/${id}`, dados)
    return response.data
  }
}
