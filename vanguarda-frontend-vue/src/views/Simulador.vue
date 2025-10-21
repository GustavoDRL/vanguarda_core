<template>
  <div class="page-wrapper">
    <!-- Hero Section - Conforme Branding Kit -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Realize Seu Sonho</h1>
        <p class="hero-subtitle">
          Simule gratuitamente e descubra o melhor plano para você.
          Maior índice de contemplações do Brasil.
        </p>
        <div class="hero-badges">
          <span class="badge-trust">✅ Regulado pelo Banco Central</span>
          <span class="badge-trust">#1 em Contemplações</span>
          <span class="badge-trust">+200 mil veículos entregues</span>
        </div>
      </div>
    </section>

    <!-- Seção Branca Principal - Conforme Branding Kit -->
    <section class="section-white">
      <div class="container-full">
        <!-- Seleção de Grupo e Bem -->
        <div class="card selecao-card">
      <div class="card-body">
        <div class="selecao-grid">
          <div class="form-group">
            <label class="form-label">Escolha Seu Plano</label>
            <select v-model="grupoSelecionado" class="form-select" @change="onGrupoChange">
              <option v-for="grupo in grupos" :key="grupo.gru_id" :value="grupo">
                Grupo {{ grupo.gru_id_siens }} - {{ grupo.gru_caracteristicas }}
              </option>
            </select>
          </div>

          <div v-if="bensDoGrupo.length > 0" class="form-group">
            <label class="form-label">Qual é o Seu Sonho?</label>
            <select v-model="bemSelecionado" class="form-select" @change="onBemChange">
              <option :value="null">Escolher valor personalizado</option>
              <option v-for="bem in bensDoGrupo" :key="bem.bem_id" :value="bem">
                {{ bem.bem_nome }} - {{ formatarDinheiro(bem.bem_credito) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Informações do Plano -->
        <div v-if="grupoDetalhes" class="info-grupo">
          <div class="info-item">
            <span class="info-label">Categoria</span>
            <strong>{{ grupoDetalhes.categoria_nome || 'Geral' }}</strong>
          </div>
          <div class="info-item">
            <span class="info-label">Vagas Disponíveis</span>
            <strong class="text-success">{{ grupoDetalhes.gru_num_cotas_disponiveis || 0 }}</strong>
          </div>
          <div v-if="grupoDetalhes.gru_data_assembleia" class="info-item">
            <span class="info-label">Próximo Sorteio</span>
            <strong>{{ formatarData(grupoDetalhes.gru_data_assembleia) }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="simulador-grid">
      <!-- Painel de Controles -->
      <div class="card controles-panel">
        <div class="card-header">
          <h3 class="card-title">Personalize Seu Plano</h3>
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
              <span>Quer Ser Contemplado Mais Rápido?</span>
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
              <span>Sem lance</span>
              <span>Lance de {{ lanceMaxPermitido }}%</span>
            </div>
            <span v-if="resultado?.aceita_lance" class="form-help">
              💡 Com lance você aumenta suas chances de contemplação e realiza seu sonho mais rápido
            </span>
            <span v-else class="form-help text-warning">
              Este plano contempla apenas por sorteio mensal
            </span>
          </div>

          <!-- Comparador de Prazos -->
          <div class="comparador-section">
            <button @click="toggleComparador" class="btn btn-outline btn-block">
              {{ mostrarComparador ? 'Fechar Comparação' : 'Comparar Planos e Economizar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Painel de Resultados -->
      <div class="card resultados-panel">
        <div class="card-header">
          <h3 class="card-title">Seu Plano Personalizado</h3>
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
          <p class="text-secondary">Personalize seu plano acima para ver como realizar seu sonho</p>
        </div>
      </div>
    </div>

    <!-- Comparador de Prazos (Modal) -->
    <div v-if="mostrarComparador" class="modal-overlay" @click="toggleComparador">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Compare e Escolha o Melhor Plano</h3>
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
      </div><!-- /container-full -->
    </section><!-- /section-white -->
  </div><!-- /page-wrapper -->
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
/* === HERO SECTION - CONFORME BRANDING KIT === */
.page-wrapper {
  background: var(--fundo-base); /* #2C3E50 - fundo escuro oficial */
}

.hero-section {
  background: var(--verde-primario); /* #D1FF00 */
  color: var(--cinza-escuro); /* #333333 - texto escuro no verde */
  padding: 64px 24px; /* var(--spacing-xxl) var(--spacing-md) */
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem; /* 56px - H1 do branding */
  font-weight: 900; /* Black */
  line-height: 1.2;
  margin-bottom: 24px; /* var(--spacing-md) */
  color: var(--cinza-escuro); /* #333 no verde */
}

.hero-subtitle {
  font-size: 1.25rem; /* 20px - Body Large */
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 32px; /* var(--spacing-lg) */
  color: var(--cinza-escuro);
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-badges {
  display: flex;
  justify-content: center;
  gap: 16px; /* var(--spacing-sm) */
  flex-wrap: wrap;
}

.badge-trust {
  display: inline-flex;
  align-items: center;
  gap: 8px; /* var(--spacing-xs) */
  background: var(--cinza-escuro); /* Fundo escuro */
  color: var(--branco); /* Texto branco */
  padding: 8px 16px; /* var(--spacing-xs) var(--spacing-sm) */
  border-radius: 9999px; /* var(--radius-full) */
  font-weight: 600;
  font-size: 0.875rem; /* 14px */
  border: 2px solid #111111;  /* Borda escura ao invés de sombra */
}

/* === SEÇÃO BRANCA - CONFORME BRANDING KIT === */
.section-white {
  background: var(--branco); /* #FFFFFF */
  color: var(--cinza-escuro); /* #333333 */
  padding: 64px 24px; /* var(--spacing-xxl) var(--spacing-md) */
  min-height: 100vh;
}

.container-full {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0; /* Sem padding extra, já tem no section */
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
  padding: 1rem;  /* 16px - Grid 8px */
  border: 2px solid #d0d0d0;
  border-radius: var(--radius-md);
  font-size: 1.125rem;
  font-weight: 600;
  background: white;
  cursor: pointer;
  color: #1a1a1a;
}

.info-grupo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: #F5F5F5;  /* Cinza muito claro - branding */
  border-radius: var(--radius-md);
  border: 2px solid #CCCCCC;  /* Borda mais escura para destaque */
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: #FFFFFF;  /* Branco puro - branding */
  border-radius: var(--radius);
  border: 1px solid #CCCCCC;  /* Borda ao invés de sombra */
}

.info-label {
  font-family: 'DM Sans', sans-serif; /* Fonte secundária do branding */
  font-size: 1rem; /* 16px - Maior */
  font-weight: 500;
  color: var(--cinza); /* #666666 */
  margin-bottom: 4px;
  /* SEM text-transform - não está no branding */
}

.info-item strong {
  font-size: 1.25rem; /* 20px - Maior */
  font-weight: 700;
  color: #2C3E50; /* Azul acinzentado */
}

.simulador-grid {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

/* Painel de Controles */
.controles-panel {
  position: static;  /* Estático para não se mover */
}

.slider-group {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: #F9FAFB;  /* Fundo cinza muito claro */
  border-radius: var(--radius-md);
  border: 2px solid #E7E7E7;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: 1.125rem;
  font-weight: 700;
  color: #333333;  /* Texto escuro */
}

.slider-label span {
  color: #666666;  /* Label em cinza */
}

.slider-value {
  color: #2C3E50;  /* Azul acinzentado */
  font-size: 2rem;  /* MUITO MAIOR - 32px */
  font-weight: 900;
  /* Sem sombra - mais simples e legível */
}

.slider {
  width: 100%;
  height: 6px;  /* Mais fino */
  border-radius: var(--radius-full);
  background: #000000;  /* Preto para máxima visibilidade */
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 32px;  /* MAIOR */
  height: 32px;  /* MAIOR */
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: var(--transition);
  border: 3px solid #333333;  /* Borda escura para destaque */
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: var(--color-primary-dark);
}

.slider::-moz-range-thumb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: var(--transition);
  border: 3px solid #333333;  /* Borda escura para destaque */
}

.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-limits {
  display: flex;
  justify-content: space-between;
  margin-top: 8px; /* var(--spacing-xs) - Grid 8px */
  font-family: 'DM Sans', sans-serif; /* Fonte secundária */
  font-size: 0.875rem; /* 14px - Body Small */
  font-weight: 400;
  color: var(--cinza); /* #666666 */
}

.form-help {
  font-family: 'DM Sans', sans-serif; /* Fonte secundária para hints */
  font-size: 0.875rem; /* 14px - Body Small */
  font-weight: 400;
}

/* Indicador de Cotas */
.indicador-cotas {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(37, 117, 252, 0.1);  /* Azul Vanguarda com transparência */
  border-radius: var(--radius);
  border-left: 4px solid var(--color-secondary);  /* Borda azul */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.cotas-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 1rem 1.5rem;  /* 16px 24px - Grid 8px */
  background: var(--color-primary);  /* Verde Vanguarda */
  color: #1a1a1a;  /* TEXTO MUITO ESCURO no verde */
  border-radius: var(--radius-full);
  font-size: 1.125rem;  /* 18px */
  white-space: nowrap;
  font-weight: 700;
  border: 2px solid #BDE70E;  /* Borda verde mais escura */
}

.cotas-badge strong {
  font-size: 1.75rem;  /* MUITO MAIOR */
  font-weight: 900;
}

.cotas-detalhes {
  font-family: 'DM Sans', sans-serif; /* Fonte secundária para dados */
  font-size: 1.125rem;
  color: var(--color-text-dark);  /* Texto escuro - está em seção branca */
  font-weight: 600;
}

.comparador-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* Painel de Resultados */
.resultados-panel {
  position: static;  /* Estático para não se mover */
}

.resultados-panel .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resultado-destaque {
  background: #2C3E50;  /* Azul acinzentado - mesmo da parte externa */
  color: white;  /* Branco para textos normais */
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  margin-bottom: var(--spacing-xl);
  border: 3px solid #1a2633;  /* Borda ainda mais escura */
}

.resultado-label {
  display: block;
  font-family: 'DM Sans', sans-serif; /* Fonte secundária para labels */
  font-size: 1.25rem;  /* 20px - Maior */
  color: #FFFFFF;  /* Branco */
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.resultado-valor-grande {
  display: block;
  font-size: 4rem;  /* GIGANTE - 64px */
  font-weight: 900;
  margin-bottom: var(--spacing-sm);
  color: #D1FF00;  /* Verde característico da marca */
  /* Sem sombra - mais simples e legível */
  letter-spacing: -0.02em;
}

.resultado-info {
  display: block;
  font-family: 'DM Sans', sans-serif; /* Fonte secundária para info */
  font-size: 1.125rem;  /* 18px - Maior */
  color: #FFFFFF;  /* Branco */
  font-weight: 500;
}

/* Métricas */
.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.metrica-card {
  background: #FFFFFF;  /* Branco puro para máximo contraste */
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  text-align: center;
  border: 3px solid #2C3E50;  /* Borda azul acinzentado */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.metrica-card.highlight {
  background: #FFFEF0;  /* Amarelo muito claro */
  border: 3px solid #BDE70E;  /* Borda verde brilhante */
}

.metrica-card.highlight .metrica-valor {
  color: #7ED500;  /* Verde escuro para destaque */
}

.metrica-label {
  display: block;
  font-family: 'DM Sans', sans-serif; /* Fonte secundária */
  font-size: 0.875rem; /* 14px - Body Small */
  color: var(--cinza); /* #666666 */
  margin-bottom: 8px; /* var(--spacing-xs) */
  font-weight: 500;
  text-align: center;  /* Centralizado */
  width: 100%;
  /* SEM text-transform */
}

.metrica-valor {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;  /* MUITO MAIOR - 32px */
  color: #2C3E50;  /* Azul acinzentado */
  font-weight: 900;
  text-align: center !important;  /* Centralizado - forçado */
  width: 100%;  /* Largura total para garantir centralização */
  margin: 0 auto;  /* Centralização adicional */
  padding: 0;
  /* Sem sombra - mais simples e legível */
}

/* Detalhamento */
.resultado-detalhes {
  background: #FFFFFF;  /* Branco puro */
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  border: 2px solid #E7E7E7;
}

.resultado-detalhes h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  color: #2C3E50;  /* Azul acinzentado */
  font-weight: 700;
}

.detalhe-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: #F9FAFB;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  font-size: 1.25rem;  /* 20px - Maior */
  color: var(--color-text-dark);  /* Texto escuro em fundo claro */
}

.detalhe-item span:last-child {
  color: #2C3E50;  /* Azul acinzentado */
  font-weight: 700;
}

.detalhe-item-small {
  display: flex;
  justify-content: space-between;
  padding: 8px 0; /* var(--spacing-xs) - Grid 8px */
  padding-left: 24px; /* var(--spacing-md) */
  font-family: 'DM Sans', sans-serif; /* Fonte secundária */
  font-size: 1rem;  /* 16px - Maior */
  color: var(--cinza); /* #666666 */
  font-weight: 500;  /* Peso maior para melhor legibilidade */
}

.detalhe-item.lance {
  background: #FFFEF0;  /* Amarelo muito claro */
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-radius: var(--radius-sm);
  color: var(--color-text-dark);  /* Texto escuro */
  border: 3px solid #BDE70E;  /* Borda verde brilhante */
}

.detalhe-item.lance strong {
  color: #7ED500;  /* Verde escuro para valor */
  font-size: 1.5rem;  /* Maior - 24px */
}

/* Gráfico */
.grafico-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius);
  border: 1px solid #e5e7eb;
  color: var(--color-text-dark);  /* Texto escuro em fundo branco */
}

.grafico-section h4 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  text-align: center;
  color: #2C3E50;  /* Azul acinzentado */
  font-weight: 700;
}

/* Resumo Total */
.resultado-resumo {
  background: #FFFFFF;  /* Branco puro */
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 3px solid #2C3E50;  /* Borda azul acinzentado */
  margin-top: var(--spacing-lg);
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md);
  color: var(--color-text-dark);  /* Texto escuro em card branco */
  font-weight: 600;
  background: #F9F9F9;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.resumo-item strong {
  color: #2C3E50;  /* Azul acinzentado */
  font-size: 1.25rem;
}

.resumo-item.total {
  font-size: var(--font-size-xl);
  padding: var(--spacing-md);
  background: #F0F7FF;  /* Fundo azul muito claro */
  border-radius: var(--radius-sm);
  margin-top: var(--spacing-md);
  border: 2px solid #2C3E50;  /* Borda azul acinzentado */
}

.resumo-item.total strong {
  color: #2C3E50;  /* Azul acinzentado */
  font-size: var(--font-size-2xl);
  font-weight: 900;
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
  border-bottom: 1px solid #E7E7E7;  /* Cinza claro - branding */
}

.modal-header h3 {
  margin: 0;
  color: var(--color-text-dark);  /* Texto escuro em modal branco */
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666666;  /* Cinza médio - branding */
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.btn-close:hover {
  color: var(--color-text-dark);  /* Escuro no hover */
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
  border-bottom: 1px solid #E7E7E7;  /* Cinza claro - branding */
  color: var(--color-text-dark);  /* Texto escuro */
}

.comparacao-table th {
  background: #F5F5F5;  /* Cinza muito claro - branding */
  font-weight: 600;
}

.comparacao-table tr:hover {
  background: #F5F5F5;  /* Cinza muito claro - branding */
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
