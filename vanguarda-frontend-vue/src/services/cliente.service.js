import api from './api'

/**
 * Serviço de clientes
 */
export const clienteService = {
  /**
   * Busca cliente por CPF/CNPJ
   * @param {string} cpfCnpj - CPF ou CNPJ
   * @returns {Promise<Object|null>} Cliente encontrado ou null
   */
  async buscarPorCpfCnpj(cpfCnpj) {
    try {
      const response = await api.get(`/clientes/cpf-cnpj/${cpfCnpj}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Cria um novo cliente
   * @param {Object} dados - Dados do cliente
   * @returns {Promise<Object>} Cliente criado
   */
  async criar(dados) {
    const response = await api.post('/clientes', dados)
    return response.data
  },

  /**
   * Busca cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Cliente
   */
  async buscarPorId(id) {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  /**
   * Lista clientes
   * @param {Object} filtros - Filtros de busca
   * @returns {Promise<Object>} Lista de clientes
   */
  async listar(filtros = {}) {
    const response = await api.get('/clientes', { params: filtros })
    return response.data
  },

  /**
   * Adiciona endereço ao cliente
   * @param {number} clienteId - ID do cliente
   * @param {Object} endereco - Dados do endereço
   * @returns {Promise<Object>} Endereço criado
   */
  async adicionarEndereco(clienteId, endereco) {
    const response = await api.post(`/clientes/${clienteId}/enderecos`, endereco)
    return response.data
  },

  /**
   * Adiciona conta bancária ao cliente
   * @param {number} clienteId - ID do cliente
   * @param {Object} conta - Dados da conta
   * @returns {Promise<Object>} Conta criada
   */
  async adicionarConta(clienteId, conta) {
    const response = await api.post(`/clientes/${clienteId}/contas`, conta)
    return response.data
  }
}
