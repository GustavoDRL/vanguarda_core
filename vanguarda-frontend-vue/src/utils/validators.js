/**
 * Funções de validação
 */

/**
 * Valida CPF
 * @param {string} cpf - CPF a validar
 * @returns {boolean} True se válido
 */
export function validarCPF(cpf) {
  if (!cpf) return false

  cpf = cpf.replace(/\D/g, '')

  if (cpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false

  // Validação do primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return false

  // Validação do segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(10))) return false

  return true
}

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a validar
 * @returns {boolean} True se válido
 */
export function validarCNPJ(cnpj) {
  if (!cnpj) return false

  cnpj = cnpj.replace(/\D/g, '')

  if (cnpj.length !== 14) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Validação do primeiro dígito verificador
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  const digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(0))) return false

  // Validação do segundo dígito verificador
  tamanho = tamanho + 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(1))) return false

  return true
}

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
export function validarEmail(email) {
  if (!email) return false

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida telefone/celular
 * @param {string} telefone - Telefone a validar
 * @returns {boolean} True se válido
 */
export function validarTelefone(telefone) {
  if (!telefone) return false

  telefone = telefone.replace(/\D/g, '')

  // Telefone fixo: 10 dígitos, Celular: 11 dígitos
  return telefone.length === 10 || telefone.length === 11
}

/**
 * Valida CEP
 * @param {string} cep - CEP a validar
 * @returns {boolean} True se válido
 */
export function validarCEP(cep) {
  if (!cep) return false

  cep = cep.replace(/\D/g, '')

  return cep.length === 8
}

/**
 * Valida data no formato DD/MM/YYYY
 * @param {string} data - Data a validar
 * @returns {boolean} True se válida
 */
export function validarData(data) {
  if (!data) return false

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/

  if (!regex.test(data)) return false

  const [, dia, mes, ano] = data.match(regex)
  const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))

  return (
    dataObj.getFullYear() === parseInt(ano) &&
    dataObj.getMonth() === parseInt(mes) - 1 &&
    dataObj.getDate() === parseInt(dia)
  )
}

/**
 * Valida se campo está vazio
 * @param {any} value - Valor a validar
 * @returns {boolean} True se não está vazio
 */
export function validarObrigatorio(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string' && value.trim() === '') return false
  return true
}

/**
 * Valida tamanho mínimo
 * @param {string} value - Valor a validar
 * @param {number} min - Tamanho mínimo
 * @returns {boolean} True se válido
 */
export function validarTamanhoMinimo(value, min) {
  if (!value) return false
  return value.length >= min
}

/**
 * Valida tamanho máximo
 * @param {string} value - Valor a validar
 * @param {number} max - Tamanho máximo
 * @returns {boolean} True se válido
 */
export function validarTamanhoMaximo(value, max) {
  if (!value) return true
  return value.length <= max
}

/**
 * Valida número mínimo
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @returns {boolean} True se válido
 */
export function validarNumeroMinimo(value, min) {
  const numero = parseFloat(value)
  if (isNaN(numero)) return false
  return numero >= min
}

/**
 * Valida número máximo
 * @param {number} value - Valor a validar
 * @param {number} max - Valor máximo
 * @returns {boolean} True se válido
 */
export function validarNumeroMaximo(value, max) {
  const numero = parseFloat(value)
  if (isNaN(numero)) return false
  return numero <= max
}
