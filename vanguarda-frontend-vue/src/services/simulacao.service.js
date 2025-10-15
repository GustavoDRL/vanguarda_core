import api from './api'

/**
 * Serviço de simulações
 */
export const simulacaoService = {
  /**
   * Simula uma proposta de consórcio
   * @param {Object} dados - Dados da simulação
   * @param {number} dados.grupo_id - ID do grupo
   * @param {number} dados.valor_credito - Valor do crédito
   * @param {number} dados.prazo_meses - Prazo em meses
   * @param {number} [dados.percentual_lance] - Percentual de lance (0.0 a 1.0)
   * @returns {Promise<Object>} Simulação calculada
   */
  async simular(dados) {
    const response = await api.post('/simulacoes', dados)
    return response.data
  },

  /**
   * Calcula equivalência de prazo
   * @param {Object} dados - Dados da equivalência
   * @param {number} dados.grupo_id - ID do grupo
   * @param {number} dados.prazo_meses_desejado - Prazo desejado
   * @returns {Promise<Object>} Equivalência calculada
   */
  async calcularEquivalencia(dados) {
    const response = await api.post('/simulacoes/equivalencia-prazo', dados)
    return response.data
  }
}
