/**
 * Máscaras para formatação de inputs
 */

/**
 * Aplica máscara de CPF
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara XXX.XXX.XXX-XX
 */
export function cpfMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')
  value = value.substring(0, 11)

  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

  return value
}

/**
 * Aplica máscara de CNPJ
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara XX.XXX.XXX/XXXX-XX
 */
export function cnpjMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')
  value = value.substring(0, 14)

  value = value.replace(/(\d{2})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1/$2')
  value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2')

  return value
}

/**
 * Aplica máscara de CPF ou CNPJ automaticamente
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara apropriada
 */
export function cpfCnpjMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')

  if (value.length <= 11) {
    return cpfMask(value)
  } else {
    return cnpjMask(value)
  }
}

/**
 * Aplica máscara de telefone/celular
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function telefoneMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')
  value = value.substring(0, 11)

  if (value.length <= 10) {
    // Telefone fixo
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  } else {
    // Celular
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  }

  return value
}

/**
 * Aplica máscara de CEP
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara XXXXX-XXX
 */
export function cepMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')
  value = value.substring(0, 8)
  value = value.replace(/(\d{5})(\d{1,3})$/, '$1-$2')

  return value
}

/**
 * Aplica máscara de RG
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara XX.XXX.XXX-X
 */
export function rgMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')
  value = value.substring(0, 9)
  value = value.replace(/(\d{2})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1})$/, '$1-$2')

  return value
}

/**
 * Aplica máscara de data
 * @param {string} value - Valor sem máscara
 * @returns {string} Valor com máscara DD/MM/YYYY
 */
export function dataMask(value) {
  if (!value) return ''

  value = value.replace(/\D/g, '')
  value = value.substring(0, 8)
  value = value.replace(/(\d{2})(\d)/, '$1/$2')
  value = value.replace(/(\d{2})(\d)/, '$1/$2')

  return value
}

/**
 * Aplica máscara de dinheiro
 * @param {string|number} value - Valor
 * @returns {string} Valor formatado como R$ 1.234,56
 */
export function dinheiroMask(value) {
  if (value === null || value === undefined || value === '') return ''

  // Remove tudo que não é dígito
  let numero = String(value).replace(/\D/g, '')

  // Converte para número e divide por 100 (centavos)
  numero = (parseInt(numero) / 100).toFixed(2)

  // Formata
  return numero.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/**
 * Aplica máscara de porcentagem
 * @param {string|number} value - Valor
 * @returns {string} Valor formatado como 12,34%
 */
export function porcentagemMask(value) {
  if (value === null || value === undefined || value === '') return ''

  let numero = String(value).replace(/\D/g, '')
  numero = (parseInt(numero) / 100).toFixed(2)

  return numero.replace('.', ',')
}

/**
 * Remove máscara deixando apenas números
 * @param {string} value - Valor com máscara
 * @returns {string} Valor sem máscara
 */
export function removeMask(value) {
  if (!value) return ''
  return value.replace(/\D/g, '')
}
