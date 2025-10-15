import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reservaService } from '@/services'

/**
 * Store de reserva
 */
export const useReservaStore = defineStore('reserva', () => {
  // Estado
  const reservaAtual = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  // Actions
  async function criar(dados) {
    carregando.value = true
    erro.value = null

    try {
      const reserva = await reservaService.criar(dados)
      reservaAtual.value = reserva
      return reserva
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao criar reserva'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function buscarPorId(id) {
    carregando.value = true
    erro.value = null

    try {
      const reserva = await reservaService.buscarPorId(id)
      reservaAtual.value = reserva
      return reserva
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao buscar reserva'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function cancelar(id) {
    carregando.value = true
    erro.value = null

    try {
      await reservaService.cancelar(id)
      if (reservaAtual.value?.res_id === id) {
        reservaAtual.value = null
      }
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao cancelar reserva'
      throw error
    } finally {
      carregando.value = false
    }
  }

  function limparReserva() {
    reservaAtual.value = null
    erro.value = null
  }

  function limparErro() {
    erro.value = null
  }

  return {
    // Estado
    reservaAtual,
    carregando,
    erro,
    // Actions
    criar,
    buscarPorId,
    cancelar,
    limparReserva,
    limparErro
  }
})
