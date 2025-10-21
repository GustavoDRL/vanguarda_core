<template>
  <div class="grafico-container">
    <canvas ref="chartCanvas"></canvas>
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
  if (!chartCanvas.value) return

  // Validar se os valores existem e são válidos
  if (!props.valores || !props.valores.valor_credito) return

  const ctx = chartCanvas.value.getContext('2d')

  // Destruir gráfico anterior se existir
  if (chartInstance) {
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

  // Se todos os valores forem zero ou inválidos, não criar gráfico
  if (valorCredito === 0 && valorTaxaAdmin === 0 && valorFundoReserva === 0 && valorSeguro === 0) {
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
        '#D1FF00',  // Verde Vanguarda - Crédito (maior porção)
        '#2C3E50',  // Azul Acinzentado - Taxa Admin
        '#2575FC',  // Azul Secundário - Fundo Reserva
        '#E7E7E7'   // Cinza Claro - Seguro
      ],
      borderColor: '#FFFFFF',  // Borda branca para separação limpa
      borderWidth: 4,  // Borda mais grossa para melhor separação
      hoverOffset: 12,  // Efeito mais pronunciado ao passar o mouse
      hoverBorderWidth: 4
    }]
  }

  // Adicionar lance se existir
  const valorLance = parseFloat(valores.valor_lance) || 0
  if (valorLance > 0) {
    dados.labels.push('Lance')
    dados.datasets[0].data.push(valorLance)
    dados.datasets[0].backgroundColor.push('#A8C700')  // Verde oliva complementar à marca
  }

  try {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: dados,
      options: {
        responsive: true,
        maintainAspectRatio: false,  // Permite controle de altura
        cutout: '0%',  // Pizza completa sem buraco
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200,
          easing: 'easeInOutQuart',
          delay: (context) => {
            return context.dataIndex * 100  // Anima cada fatia sequencialmente
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: true
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              font: {
                family: "'DM Sans', sans-serif",
                size: 14,
                weight: '600'
              },
              padding: 12,
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              color: '#2C3E50',
              textAlign: 'center',
              generateLabels: function(chart) {
                const data = chart.data
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(0)
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  }
                })
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#2C3E50',
            titleColor: '#D1FF00',
            bodyColor: '#FFFFFF',
            borderColor: '#D1FF00',
            borderWidth: 2,
            padding: 16,
            cornerRadius: 8,
            displayColors: false,  // Remove o quadrado colorido do tooltip
            titleFont: {
              family: "'DM Sans', sans-serif",
              size: 15,
              weight: '700'
            },
            bodyFont: {
              family: "'DM Sans', sans-serif",
              size: 14,
              weight: '500'
            },
            callbacks: {
              title: function(context) {
                return context[0].label || ''
              },
              label: function(context) {
                const value = context.parsed
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                const valorFormatado = value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
                return `${valorFormatado} (${percentage}%)`
              }
            }
          }
        }
      }
    })

    // Atualizar suavemente após criação
    setTimeout(() => {
      if (chartInstance) {
        chartInstance.update('none')
      }
    }, 100)
  } catch (error) {
    console.error('[GraficoComposicao] Erro ao criar gráfico:', error)
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
  height: 350px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}

.grafico-container canvas {
  max-width: 100%;
  max-height: 100%;
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .grafico-container {
    height: 320px;
    padding: var(--spacing-md);
  }
}
</style>
