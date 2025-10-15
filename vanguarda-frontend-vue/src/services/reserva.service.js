import api from './api'

/**
 * Serviço de reservas
 */
export const reservaService = {
  /**
   * Cria uma nova reserva
   * @param {Object} dados - Dados da reserva
   * @returns {Promise<Object>} Reserva criada
   */
  async criar(dados) {
    const response = await api.post('/reservas', dados)
    return response.data
  },

  /**
   * Lista reservas
   * @param {Object} filtros - Filtros
   * @returns {Promise<Object>} Lista de reservas
   */
  async listar(filtros = {}) {
    const response = await api.get('/reservas', { params: filtros })
    return response.data
  },

  /**
   * Busca reserva por ID
   * @param {number} id - ID da reserva
   * @returns {Promise<Object>} Reserva
   */
  async buscarPorId(id) {
    const response = await api.get(`/reservas/${id}`)
    return response.data
  },

  /**
   * Atualiza reserva
   * @param {number} id - ID da reserva
   * @param {Object} dados - Dados para atualizar
   * @returns {Promise<Object>} Reserva atualizada
   */
  async atualizar(id, dados) {
    const response = await api.patch(`/reservas/${id}`, dados)
    return response.data
  },

  /**
   * Cancela reserva
   * @param {number} id - ID da reserva
   * @returns {Promise<Object>} Reserva cancelada
   */
  async cancelar(id) {
    const response = await api.delete(`/reservas/${id}`)
    return response.data
  }
}
