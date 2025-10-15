import { defineStore } from 'pinia'
import { ref } from 'vue'
import { simulacaoService } from '@/services'

/**
 * Store de simulação
 */
export const useSimulacaoStore = defineStore('simulacao', () => {
  // Estado
  const simulacaoAtual = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  // Actions
  async function simular(dados) {
    carregando.value = true
    erro.value = null

    try {
      const resultado = await simulacaoService.simular(dados)
      simulacaoAtual.value = resultado
      return resultado
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao realizar simulação'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function calcularEquivalencia(dados) {
    carregando.value = true
    erro.value = null

    try {
      const resultado = await simulacaoService.calcularEquivalencia(dados)
      return resultado
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao calcular equivalência'
      throw error
    } finally {
      carregando.value = false
    }
  }

  function limparSimulacao() {
    simulacaoAtual.value = null
    erro.value = null
  }

  function limparErro() {
    erro.value = null
  }

  return {
    // Estado
    simulacaoAtual,
    carregando,
    erro,
    // Actions
    simular,
    calcularEquivalencia,
    limparSimulacao,
    limparErro
  }
})
