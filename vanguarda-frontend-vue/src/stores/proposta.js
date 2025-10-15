import { defineStore } from 'pinia'
import { ref } from 'vue'
import { propostaService } from '@/services'

/**
 * Store de proposta
 */
export const usePropostaStore = defineStore('proposta', () => {
  // Estado
  const propostaAtual = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  // Actions
  async function criar(dados) {
    carregando.value = true
    erro.value = null

    try {
      const proposta = await propostaService.criar(dados)
      propostaAtual.value = proposta
      return proposta
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao criar proposta'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function converterReserva(dados) {
    carregando.value = true
    erro.value = null

    try {
      const proposta = await propostaService.converterReserva(dados)
      propostaAtual.value = proposta
      return proposta
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao converter reserva'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function buscarPorId(id) {
    carregando.value = true
    erro.value = null

    try {
      const proposta = await propostaService.buscarPorId(id)
      propostaAtual.value = proposta
      return proposta
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao buscar proposta'
      throw error
    } finally {
      carregando.value = false
    }
  }

  function limparProposta() {
    propostaAtual.value = null
    erro.value = null
  }

  function limparErro() {
    erro.value = null
  }

  return {
    // Estado
    propostaAtual,
    carregando,
    erro,
    // Actions
    criar,
    converterReserva,
    buscarPorId,
    limparProposta,
    limparErro
  }
})
