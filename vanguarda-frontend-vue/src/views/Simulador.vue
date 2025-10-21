<template>
  <div class="container-full">
    <h2 class="page-title">Simulação de Consórcio Completa</h2>

    <!-- Seleção de Grupo e Bem -->
    <div class="card selecao-card">
      <div class="card-body">
        <div class="selecao-grid">
          <div class="form-group">
            <label class="form-label">Escolha o Grupo</label>
            <select v-model="grupoSelecionado" class="form-select" @change="onGrupoChange">
              <option v-for="grupo in grupos" :key="grupo.gru_id" :value="grupo">
                Grupo {{ grupo.gru_id_siens }} - {{ grupo.gru_caracteristicas }}
              </option>
            </select>
          </div>

          <div v-if="bensDoGrupo.length > 0" class="form-group">
            <label class="form-label">O que você deseja?</label>
            <select v-model="bemSelecionado" class="form-select" @change="onBemChange">
              <option :value="null">Valor personalizado</option>
              <option v-for="bem in bensDoGrupo" :key="bem.bem_id" :value="bem">
                {{ bem.bem_nome }} - {{ formatarDinheiro(bem.bem_credito) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Informações do Grupo -->
        <div v-if="grupoDetalhes" class="info-grupo">
          <div class="info-item">
            <span class="info-label">Categoria:</span>
            <strong>{{ grupoDetalhes.categoria_nome || 'Geral' }}</strong>
          </div>
          <div class="info-item">
            <span class="info-label">Cotas Disponíveis:</span>
            <strong class="text-success">{{ grupoDetalhes.gru_num_cotas_disponiveis || 0 }}</strong>
          </div>
          <div v-if="grupoDetalhes.gru_data_assembleia" class="info-item">
            <span class="info-label">Próxima Assembleia:</span>
            <strong>{{ formatarData(grupoDetalhes.gru_data_assembleia) }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="simulador-grid">
      <!-- Painel de Controles -->
      <div class="card controles-panel">
        <div class="card-header">
          <h3 class="card-title">Ajuste os Valores</h3>
        </div>

        <div class="card-body">
          <AlertMessage
            v-if="erro"
            type="error"
            :message="erro"
          />

          <!-- Valor do Crédito -->
          <div class="slider-group">
            <label class="slider-label">
              <span>Valor do Crédito</span>
              <strong class="slider-value">{{ formatarDinheiro(form.valorCredito) }}</strong>
            </label>
            <input
              v-model.number="form.valorCredito"
              type="range"
              class="slider"
              :min="minValorCredito"
              :max="maxValorCredito"
              :step="stepValorCredito"
            />
            <div class="slider-limits">
              <span>{{ formatarDinheiro(minValorCredito) }} (1 cota)</span>
              <span>{{ formatarDinheiro(maxValorCredito) }} ({{ Math.floor(maxValorCredito / minValorCredito) }} cotas)</span>
            </div>

            <!-- Indicador de Múltiplos de Cotas -->
            <div v-if="indicadorCotas" class="indicador-cotas">
              <span class="cotas-badge">
                <strong>{{ indicadorCotas.quantidade }}</strong>
                {{ indicadorCotas.quantidade === 1 ? 'cota' : 'cotas' }}
              </span>
              <span class="cotas-detalhes">{{ indicadorCotas.combinacao }}</span>
            </div>
          </div>

          <!-- Prazo em Meses -->
          <div class="slider-group">
            <label class="slider-label">
              <span>Prazo</span>
              <strong class="slider-value">{{ form.prazoMeses }} meses</strong>
            </label>
            <input
              v-model.number="form.prazoMeses"
              type="range"
              class="slider"
              :min="minPrazo"
              :max="maxPrazo"
              :step="1"
            />
            <div class="slider-limits">
              <span>{{ minPrazo }} meses</span>
              <span>{{ maxPrazo }} meses</span>
            </div>
          </div>

          <!-- Percentual de Lance -->
          <div class="slider-group">
            <label class="slider-label">
              <span>Lance (opcional)</span>
              <strong class="slider-value">{{ form.percentualLance }}%</strong>
            </label>
            <input
              v-model.number="form.percentualLance"
              type="range"
              class="slider"
              :min="0"
              :max="lanceMaxPermitido"
              :step="1"
              :disabled="!resultado?.aceita_lance"
            />
            <div class="slider-limits">
              <span>0%</span>
              <span>{{ lanceMaxPermitido }}%</span>
            </div>
            <span v-if="resultado?.aceita_lance" class="form-help">
              Aumenta chances de contemplação
            </span>
            <span v-else class="form-help text-warning">
              Este grupo não aceita lances
            </span>
          </div>

          <!-- Comparador de Prazos -->
          <div class="comparador-section">
            <button @click="toggleComparador" class="btn btn-outline btn-block">
              {{ mostrarComparador ? 'Ocultar' : 'Comparar' }} Outros Prazos
            </button>
          </div>
        </div>
      </div>

      <!-- Painel de Resultados -->
      <div class="card resultados-panel">
        <div class="card-header">
          <h3 class="card-title">Resultado da Simulação</h3>
          <LoadingSpinner v-if="carregando" />
        </div>

        <div v-if="resultado" class="card-body">
          <!-- Parcela Mensal Destaque -->
          <div class="resultado-destaque">
            <span class="resultado-label">Parcela Mensal</span>
            <span class="resultado-valor-grande">{{ formatarDinheiro(parcelaFinal) }}</span>
            <span class="resultado-info">por {{ resultado.prazo_meses }} meses</span>
          </div>

          <!-- Métricas Adicionais -->
          <div class="metricas-grid">
            <div class="metrica-card">
              <span class="metrica-label">Total de Taxas</span>
              <strong class="metrica-valor">{{ formatarDinheiro(resultado.valores.valor_total_taxas) }}</strong>
            </div>
            <div v-if="lanceMensal > 0" class="metrica-card highlight">
              <span class="metrica-label">Lance Mensal</span>
              <strong class="metrica-valor">{{ formatarDinheiro(lanceMensal) }}</strong>
            </div>
            <div class="metrica-card">
              <span class="metrica-label">Taxa Admin</span>
              <strong class="metrica-valor">{{ (parseFloat(resultado.taxa_admin_percentual) * 100).toFixed(2) }}%</strong>
            </div>
            <div class="metrica-card">
              <span class="metrica-label">Fundo Reserva</span>
              <strong class="metrica-valor">{{ (parseFloat(resultado.fundo_reserva_percentual) * 100).toFixed(2) }}%</strong>
            </div>
          </div>

          <!-- Detalhamento -->
          <div class="resultado-detalhes">
            <h4>Composição Mensal</h4>
            <div class="detalhe-item">
              <span>Parcela Base</span>
              <span>{{ formatarDinheiro(resultado.valores.valor_parcela_base) }}</span>
            </div>
            <div class="detalhe-item-small">
              <span>• Taxa Administrativa</span>
              <span>{{ formatarDinheiro(resultado.valores.valor_taxa_admin) }}</span>
            </div>
            <div class="detalhe-item-small">
              <span>• Fundo de Reserva</span>
              <span>{{ formatarDinheiro(resultado.valores.valor_fundo_reserva) }}</span>
            </div>
            <div class="detalhe-item-small">
              <span>• Seguro</span>
              <span>{{ formatarDinheiro(resultado.valores.valor_seguro) }}</span>
            </div>
            <div v-if="lanceMensal > 0" class="detalhe-item lance">
              <span>+ Lance Mensal ({{ form.percentualLance }}%)</span>
              <strong>{{ formatarDinheiro(lanceMensal) }}</strong>
            </div>
          </div>

          <!-- Gráfico de Composição -->
          <div class="grafico-section">
            <h4>Distribuição Total</h4>
            <GraficoComposicao :valores="{ ...resultado.valores, prazo_meses: resultado.prazo_meses }" />
          </div>

          <!-- Resumo Total -->
          <div class="resultado-resumo">
            <div class="resumo-item">
              <span>Valor do Crédito</span>
              <strong>{{ formatarDinheiro(resultado.valores.valor_credito) }}</strong>
            </div>
            <div class="resumo-item total">
              <span>Total a Pagar</span>
              <strong>{{ formatarDinheiro(resultado.valores.valor_total_pago) }}</strong>
            </div>
          </div>
        </div>

        <div v-else class="card-body text-center">
          <p class="text-secondary">Ajuste os valores para ver a simulação</p>
        </div>
      </div>
    </div>

    <!-- Comparador de Prazos (Modal) -->
    <div v-if="mostrarComparador" class="modal-overlay" @click="toggleComparador">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Comparação de Prazos</h3>
          <button @click="toggleComparador" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <LoadingSpinner v-if="carregandoComparacao" />
          <div v-else-if="comparacoes.length > 0" class="comparacao-table">
            <table>
              <thead>
                <tr>
                  <th>Prazo</th>
                  <th>Crédito Equivalente</th>
                  <th>Parcela</th>
                  <th>Diferença</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comp in comparacoes" :key="comp.prazo_desejado"
                    :class="{ 'atual': comp.prazo_desejado === form.prazoMeses }">
                  <td><strong>{{ comp.prazo_desejado }} meses</strong></td>
                  <td>{{ formatarDinheiro(comp.valor_credito_equivalente) }}</td>
                  <td>{{ formatarDinheiro(comp.valor_parcela_equivalente) }}</td>
                  <td :class="comp.diferenca_percentual >= 0 ? 'text-success' : 'text-danger'">
                    {{ comp.diferenca_percentual >= 0 ? '+' : '' }}{{ parseFloat(comp.diferenca_percentual).toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { simulacaoService, grupoService } from '@/services'
import { formatarDinheiro } from '@/utils'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import GraficoComposicao from '@/components/GraficoComposicao.vue'

// Estados
const grupos = ref([])
const grupoSelecionado = ref(null)
const grupoDetalhes = ref(null)
const bensDoGrupo = ref([])
const bemSelecionado = ref(null)
const resultado = ref(null)
const carregando = ref(false)
const erro = ref('')
const mostrarComparador = ref(false)
const comparacoes = ref([])
const carregandoComparacao = ref(false)

// Limites dos sliders
const minPrazo = 24
const maxPrazo = 120

// Limites dinâmicos baseados na cota
const valorBaseCota = computed(() => {
  // Se há um bem selecionado, usa o valor dele como base da cota
  if (bemSelecionado.value) {
    return parseFloat(bemSelecionado.value.bem_credito)
  }
  // Se não há bem selecionado mas há bens disponíveis, usa o menor valor
  if (bensDoGrupo.value.length > 0) {
    const valores = bensDoGrupo.value.map(b => parseFloat(b.bem_credito))
    return Math.min(...valores)
  }
  // Fallback para valor padrão
  return 10000
})

const minValorCredito = computed(() => valorBaseCota.value)
const maxValorCredito = computed(() => valorBaseCota.value * 10) // Até 10 cotas
const stepValorCredito = computed(() => valorBaseCota.value) // Step = 1 cota

// Formulário
const form = ref({
  valorCredito: 10000, // Será ajustado quando o grupo for carregado
  prazoMeses: 60,
  percentualLance: 0
})

// Computeds
const parcelaFinal = computed(() => {
  if (!resultado.value) return 0
  return resultado.value.valores.valor_parcela_com_lance ||
         resultado.value.valores.valor_parcela_base
})

const lanceMensal = computed(() => {
  if (!resultado.value || !resultado.value.valores.valor_lance) return 0
  return parseFloat(resultado.value.valores.valor_lance) / resultado.value.prazo_meses
})

const lanceMaxPermitido = computed(() => {
  if (!resultado.value || !resultado.value.percentual_lance_max) return 50
  return Math.floor(parseFloat(resultado.value.percentual_lance_max) * 100)
})

const indicadorCotas = computed(() => {
  if (!grupoSelecionado.value || !valorBaseCota.value) return null

  // Calcula quantas cotas estão sendo usadas (sempre será um múltiplo exato)
  const quantidade = Math.round(form.value.valorCredito / valorBaseCota.value)

  // Como o slider move em múltiplos, todas as cotas têm o mesmo valor
  const valorPorCota = valorBaseCota.value

  // Monta a descrição da combinação
  let combinacao = ''
  if (quantidade === 1) {
    combinacao = `${formatarDinheiro(valorPorCota)}`
  } else {
    combinacao = `${quantidade}x ${formatarDinheiro(valorPorCota)}`
  }

  return {
    quantidade,
    combinacao
  }
})

// Debounce timer
let debounceTimer = null

// Carregar grupos ao montar
onMounted(async () => {
  await carregarGrupos()
})

async function carregarGrupos() {
  try {
    const response = await grupoService.listarGrupos({ apenas_disponiveis: true })
    // Filtrar apenas grupos com dados completos para simulação
    grupos.value = (response.grupos || []).filter(grupo => {
      // Grupo precisa ter taxa_admin e fundo_reserva para poder simular
      return grupo.gru_taxa_admin != null && grupo.gru_fundo_reserva != null
    })

    if (grupos.value.length > 0) {
      grupoSelecionado.value = grupos.value[0]
      await onGrupoChange()
    } else {
      erro.value = 'Nenhum grupo disponível para simulação no momento'
    }
  } catch (error) {
    console.error('Erro ao carregar grupos:', error)
    erro.value = 'Erro ao carregar grupos disponíveis'
  }
}

async function onGrupoChange() {
  if (!grupoSelecionado.value) return

  try {
    // Carregar detalhes do grupo
    grupoDetalhes.value = await grupoService.obterGrupo(grupoSelecionado.value.gru_id)
    bensDoGrupo.value = grupoDetalhes.value.bens || []
    bemSelecionado.value = null

    // Ajustar valor inicial para o valor base da cota
    if (bensDoGrupo.value.length > 0) {
      const menorValor = Math.min(...bensDoGrupo.value.map(b => parseFloat(b.bem_credito)))
      form.value.valorCredito = menorValor
    }

    // Simular com o grupo selecionado
    await simularAutomaticamente()
  } catch (error) {
    console.error('Erro ao carregar grupo:', error)
  }
}

function onBemChange() {
  if (bemSelecionado.value) {
    // Define o valor do crédito como o valor do bem selecionado (1 cota)
    form.value.valorCredito = parseFloat(bemSelecionado.value.bem_credito)
  } else {
    // Se voltou para "Valor personalizado", mantém no mínimo (1 cota)
    form.value.valorCredito = valorBaseCota.value
  }
}

// Watch para simular automaticamente
watch(
  () => [form.value.valorCredito, form.value.prazoMeses, form.value.percentualLance],
  () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      simularAutomaticamente()
    }, 500)
  }
)

async function simularAutomaticamente() {
  if (!grupoSelecionado.value) return

  carregando.value = true
  erro.value = ''

  try {
    const dados = {
      grupo_id: grupoSelecionado.value.gru_id,
      valor_credito: form.value.valorCredito,
      prazo_meses: form.value.prazoMeses,
      percentual_lance: form.value.percentualLance / 100
    }

    resultado.value = await simulacaoService.simular(dados)
  } catch (error) {
    console.error('Erro ao simular:', error)
    erro.value = error.response?.data?.detail || 'Erro ao simular'
  } finally {
    carregando.value = false
  }
}

async function toggleComparador() {
  mostrarComparador.value = !mostrarComparador.value

  if (mostrarComparador.value && comparacoes.value.length === 0) {
    await carregarComparacoes()
  }
}

async function carregarComparacoes() {
  if (!grupoSelecionado.value) return

  carregandoComparacao.value = true
  comparacoes.value = []

  try {
    const prazos = [36, 48, 60, 72, 84, 96, 108, 120]

    for (const prazo of prazos) {
      const dados = {
        grupo_id: grupoSelecionado.value.gru_id,
        prazo_meses_desejado: prazo
      }

      const equivalencia = await simulacaoService.calcularEquivalencia(dados)
      comparacoes.value.push(equivalencia)
    }
  } catch (error) {
    console.error('Erro ao calcular equivalências:', error)
  } finally {
    carregandoComparacao.value = false
  }
}

function formatarData(dataStr) {
  if (!dataStr) return '-'
  const data = new Date(dataStr)
  return data.toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.container-full {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.page-title {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--color-primary);
}

/* Seleção de Grupo */
.selecao-card {
  margin-bottom: var(--spacing-xl);
}

.selecao-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  background: white;
  cursor: pointer;
}

.info-grupo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-hover);
  border-radius: var(--radius);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.simulador-grid {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

/* Painel de Controles */
.controles-panel {
  position: sticky;
  top: var(--spacing-lg);
}

.slider-group {
  margin-bottom: var(--spacing-xl);
}

.slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-base);
}

.slider-value {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: var(--color-primary-dark);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: none;
}

.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-limits {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Indicador de Cotas */
.indicador-cotas {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: var(--radius);
  border-left: 4px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.cotas-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  white-space: nowrap;
}

.cotas-badge strong {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.cotas-detalhes {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.comparador-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* Painel de Resultados */
.resultados-panel .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resultado-destaque {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.resultado-label {
  display: block;
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: var(--spacing-xs);
}

.resultado-valor-grande {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.resultado-info {
  display: block;
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

/* Métricas */
.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.metrica-card {
  background: var(--color-bg-hover);
  padding: var(--spacing-md);
  border-radius: var(--radius);
  text-align: center;
}

.metrica-card.highlight {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.metrica-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.metrica-valor {
  display: block;
  font-size: var(--font-size-xl);
  color: var(--color-primary);
}

/* Detalhamento */
.resultado-detalhes {
  background: var(--color-bg-hover);
  padding: var(--spacing-lg);
  border-radius: var(--radius);
  margin-bottom: var(--spacing-lg);
}

.resultado-detalhes h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.detalhe-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
  font-weight: 500;
}

.detalhe-item-small {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs) 0;
  padding-left: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detalhe-item.lance {
  background: rgba(139, 92, 246, 0.1);
  margin: var(--spacing-sm) calc(var(--spacing-lg) * -1);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  color: rgba(139, 92, 246, 1);
}

/* Gráfico */
.grafico-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}

.grafico-section h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

/* Resumo Total */
.resultado-resumo {
  border-top: 2px solid var(--color-border);
  padding-top: var(--spacing-lg);
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
}

.resumo-item.total {
  font-size: var(--font-size-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-sm);
}

.resumo-item.total strong {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
}

/* Modal Comparador */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.btn-close:hover {
  color: var(--color-text);
}

.modal-body {
  padding: var(--spacing-lg);
}

.comparacao-table table {
  width: 100%;
  border-collapse: collapse;
}

.comparacao-table th,
.comparacao-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.comparacao-table th {
  background: var(--color-bg-hover);
  font-weight: 600;
}

.comparacao-table tr:hover {
  background: var(--color-bg-hover);
}

.comparacao-table tr.atual {
  background: rgba(59, 130, 246, 0.1);
  font-weight: 600;
}

.text-success {
  color: #10b981;
}

.text-danger {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}

/* Responsivo */
@media (max-width: 1200px) {
  .simulador-grid {
    grid-template-columns: 1fr;
  }

  .controles-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .resultado-valor-grande {
    font-size: 2rem;
  }

  .metricas-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .selecao-grid {
    grid-template-columns: 1fr;
  }

  .indicador-cotas {
    flex-direction: column;
    align-items: flex-start;
  }

  .cotas-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>
