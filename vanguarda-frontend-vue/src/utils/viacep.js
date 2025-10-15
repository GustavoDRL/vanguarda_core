/**
 * Serviço para buscar endereço por CEP usando ViaCEP
 */

/**
 * Busca endereço por CEP
 * @param {string} cep - CEP a buscar (com ou sem máscara)
 * @returns {Promise<Object|null>} Dados do endereço ou null se não encontrado
 */
export async function buscarCEP(cep) {
  if (!cep) return null

  // Remove máscara
  cep = cep.replace(/\D/g, '')

  if (cep.length !== 8) return null

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()

    if (data.erro) {
      return null
    }

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}
