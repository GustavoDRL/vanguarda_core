/**
 * Funções de formatação de valores
 */

/**
 * Formata número como dinheiro (R$ 1.234,56)
 * @param {number|string} value - Valor numérico
 * @returns {string} Valor formatado
 */
export function formatarDinheiro(value) {
  if (value === null || value === undefined || value === '') return 'R$ 0,00'

  const numero = parseFloat(value)

  if (isNaN(numero)) return 'R$ 0,00'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numero)
}

/**
 * Formata número simples (1.234,56)
 * @param {number|string} value - Valor numérico
 * @param {number} decimais - Número de casas decimais (padrão: 2)
 * @returns {string} Valor formatado
 */
export function formatarNumero(value, decimais = 2) {
  if (value === null || value === undefined || value === '') return '0,00'

  const numero = parseFloat(value)

  if (isNaN(numero)) return '0,00'

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais
  }).format(numero)
}

/**
 * Formata porcentagem (12,34%)
 * @param {number|string} value - Valor numérico (0.1234 = 12.34%)
 * @param {number} decimais - Número de casas decimais (padrão: 2)
 * @returns {string} Valor formatado
 */
export function formatarPorcentagem(value, decimais = 2) {
  if (value === null || value === undefined || value === '') return '0%'

  const numero = parseFloat(value)

  if (isNaN(numero)) return '0%'

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais
  }).format(numero)
}

/**
 * Formata data (DD/MM/YYYY)
 * @param {string|Date} value - Data
 * @returns {string} Data formatada
 */
export function formatarData(value) {
  if (!value) return ''

  const data = new Date(value)

  if (isNaN(data.getTime())) return ''

  return new Intl.DateTimeFormat('pt-BR').format(data)
}

/**
 * Formata data e hora (DD/MM/YYYY HH:MM)
 * @param {string|Date} value - Data
 * @returns {string} Data formatada
 */
export function formatarDataHora(value) {
  if (!value) return ''

  const data = new Date(value)

  if (isNaN(data.getTime())) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data)
}

/**
 * Converte string de dinheiro para número
 * @param {string} value - Valor formatado (R$ 1.234,56)
 * @returns {number} Valor numérico
 */
export function dinheiroParaNumero(value) {
  if (!value) return 0

  // Remove R$, espaços, pontos e substitui vírgula por ponto
  const numero = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  return parseFloat(numero) || 0
}

/**
 * Converte porcentagem para decimal
 * @param {string|number} value - Valor em porcentagem (25% ou 25)
 * @returns {number} Valor decimal (0.25)
 */
export function porcentagemParaDecimal(value) {
  if (value === null || value === undefined || value === '') return 0

  let numero = parseFloat(String(value).replace('%', '').replace(',', '.'))

  if (isNaN(numero)) return 0

  return numero / 100
}

/**
 * Trunca texto com reticências
 * @param {string} text - Texto
 * @param {number} length - Tamanho máximo
 * @returns {string} Texto truncado
 */
export function truncarTexto(text, length = 50) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Formata CPF (XXX.XXX.XXX-XX)
 * @param {string} value - CPF sem formatação
 * @returns {string} CPF formatado
 */
export function formatarCPF(value) {
  if (!value) return ''

  const cpf = value.replace(/\D/g, '')

  if (cpf.length !== 11) return value

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ (XX.XXX.XXX/XXXX-XX)
 * @param {string} value - CNPJ sem formatação
 * @returns {string} CNPJ formatado
 */
export function formatarCNPJ(value) {
  if (!value) return ''

  const cnpj = value.replace(/\D/g, '')

  if (cnpj.length !== 14) return value

  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formata telefone ((XX) XXXXX-XXXX)
 * @param {string} value - Telefone sem formatação
 * @returns {string} Telefone formatado
 */
export function formatarTelefone(value) {
  if (!value) return ''

  const tel = value.replace(/\D/g, '')

  if (tel.length === 11) {
    return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (tel.length === 10) {
    return tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return value
}

/**
 * Primeira letra maiúscula
 * @param {string} text - Texto
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Todas palavras com primeira letra maiúscula
 * @param {string} text - Texto
 * @returns {string} Texto com palavras capitalizadas
 */
export function titleCase(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}
