<template>
  <div class="grafico-container">
    <canvas ref="chartCanvas" style="background: transparent !important; filter: none !important; mix-blend-mode: normal !important;"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'

// Registrar elementos necessários
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
  valores: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

function criarGrafico() {
  console.log('[GraficoComposicao] criarGrafico chamado')
  console.log('[GraficoComposicao] chartCanvas.value:', chartCanvas.value)
  console.log('[GraficoComposicao] props.valores:', props.valores)

  if (!chartCanvas.value) {
    console.log('[GraficoComposicao] ABORTADO: chartCanvas.value é null')
    return
  }

  // Validar se os valores existem e são válidos
  if (!props.valores || !props.valores.valor_credito) {
    console.log('[GraficoComposicao] ABORTADO: valores inválidos ou valor_credito ausente')
    return
  }

  const ctx = chartCanvas.value.getContext('2d')
  console.log('[GraficoComposicao] Context 2D obtido:', ctx)
  console.log('[GraficoComposicao] Canvas dimensions:', {
    width: chartCanvas.value.width,
    height: chartCanvas.value.height,
    clientWidth: chartCanvas.value.clientWidth,
    clientHeight: chartCanvas.value.clientHeight
  })

  // Verificar estilos computados
  const computedStyle = window.getComputedStyle(chartCanvas.value)
  console.log('[GraficoComposicao] Estilos CSS computados:', {
    background: computedStyle.background,
    backgroundColor: computedStyle.backgroundColor,
    filter: computedStyle.filter,
    opacity: computedStyle.opacity,
    mixBlendMode: computedStyle.mixBlendMode,
    display: computedStyle.display
  })

  // Destruir gráfico anterior se existir
  if (chartInstance) {
    console.log('[GraficoComposicao] Destruindo gráfico anterior')
    chartInstance.destroy()
  }

  // Limpar o canvas antes de criar o gráfico
  ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)

  const valores = props.valores
  const prazoMeses = valores.prazo_meses || 60

  // Converter e validar os valores
  const valorCredito = parseFloat(valores.valor_credito) || 0
  const valorTaxaAdmin = parseFloat(valores.valor_taxa_admin) || 0
  const valorFundoReserva = parseFloat(valores.valor_fundo_reserva) || 0
  const valorSeguro = parseFloat(valores.valor_seguro) || 0

  console.log('[GraficoComposicao] Valores convertidos:', {
    valorCredito,
    valorTaxaAdmin,
    valorFundoReserva,
    valorSeguro,
    prazoMeses
  })

  // Se todos os valores forem zero ou inválidos, não criar gráfico
  if (valorCredito === 0 && valorTaxaAdmin === 0 && valorFundoReserva === 0 && valorSeguro === 0) {
    console.log('[GraficoComposicao] ABORTADO: todos os valores são zero')
    return
  }

  const dados = {
    labels: ['Crédito', 'Taxa Admin', 'Fundo Reserva', 'Seguro'],
    datasets: [{
      data: [
        valorCredito,
        valorTaxaAdmin * prazoMeses,
        valorFundoReserva * prazoMeses,
        valorSeguro * prazoMeses
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',  // Azul - Crédito
        'rgba(239, 68, 68, 0.8)',   // Vermelho - Taxa Admin
        'rgba(245, 158, 11, 0.8)',  // Laranja - Fundo Reserva
        'rgba(16, 185, 129, 0.8)'   // Verde - Seguro
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 2
    }]
  }

  // Adicionar lance se existir
  const valorLance = parseFloat(valores.valor_lance) || 0
  if (valorLance > 0) {
    console.log('[GraficoComposicao] Adicionando lance:', valorLance)
    dados.labels.push('Lance')
    dados.datasets[0].data.push(valorLance)
    dados.datasets[0].backgroundColor.push('rgba(139, 92, 246, 0.8)') // Roxo
    dados.datasets[0].borderColor.push('rgba(139, 92, 246, 1)')
  }

  console.log('[GraficoComposicao] Dados finais para o gráfico:', JSON.stringify(dados, null, 2))
  console.log('[GraficoComposicao] Array de dados:', dados.datasets[0].data)
  console.log('[GraficoComposicao] Labels:', dados.labels)
  console.log('[GraficoComposicao] BackgroundColors:', dados.datasets[0].backgroundColor)
  console.log('[GraficoComposicao] Criando Chart.js...')

  try {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: dados,
      options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12
            },
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentage}%)`
            }
          }
        }
      }
    }
    })
    console.log('[GraficoComposicao] Gráfico criado com sucesso!', chartInstance)

    // Forçar re-render
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.update()
        console.log('[GraficoComposicao] Gráfico atualizado após timeout')
      }
    }, 100)
  } catch (error) {
    console.error('[GraficoComposicao] ERRO ao criar gráfico:', error)
  }
}

watch(() => props.valores, () => {
  criarGrafico()
}, { deep: true })

onMounted(() => {
  criarGrafico()
})
</script>

<style scoped>
.grafico-container {
  position: relative;
  height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.grafico-container canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>
