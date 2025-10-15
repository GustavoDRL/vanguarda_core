import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clienteService } from '@/services'

/**
 * Store de cliente
 */
export const useClienteStore = defineStore('cliente', () => {
  // Estado
  const clienteAtual = ref(null)
  const carregando = ref(false)
  const erro = ref(null)

  // Actions
  async function buscarPorCpfCnpj(cpfCnpj) {
    carregando.value = true
    erro.value = null

    try {
      const cliente = await clienteService.buscarPorCpfCnpj(cpfCnpj)

      if (cliente) {
        clienteAtual.value = cliente
      }

      return cliente
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao buscar cliente'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function criar(dados) {
    carregando.value = true
    erro.value = null

    try {
      const cliente = await clienteService.criar(dados)
      clienteAtual.value = cliente
      return cliente
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao criar cliente'
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function buscarPorId(id) {
    carregando.value = true
    erro.value = null

    try {
      const cliente = await clienteService.buscarPorId(id)
      clienteAtual.value = cliente
      return cliente
    } catch (error) {
      erro.value = error.response?.data?.detail || 'Erro ao buscar cliente'
      throw error
    } finally {
      carregando.value = false
    }
  }

  function setCliente(cliente) {
    clienteAtual.value = cliente
  }

  function limparCliente() {
    clienteAtual.value = null
    erro.value = null
  }

  function limparErro() {
    erro.value = null
  }

  return {
    // Estado
    clienteAtual,
    carregando,
    erro,
    // Actions
    buscarPorCpfCnpj,
    criar,
    buscarPorId,
    setCliente,
    limparCliente,
    limparErro
  }
})
