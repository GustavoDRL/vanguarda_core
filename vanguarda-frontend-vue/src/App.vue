<template>
  <div id="app">
    <AppHeader v-if="mostrarHeader" />

    <main class="main-content">
      <RouterView />
    </main>

    <LoadingSpinner :show="carregandoGlobal" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSimulacaoStore, useClienteStore, useReservaStore, usePropostaStore } from '@/stores'
import AppHeader from '@/components/AppHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()

const simulacaoStore = useSimulacaoStore()
const clienteStore = useClienteStore()
const reservaStore = useReservaStore()
const propostaStore = usePropostaStore()

// Não mostrar header na tela de login
const mostrarHeader = computed(() => route.name !== 'Login')

// Loading global (qualquer store carregando)
const carregandoGlobal = computed(() => {
  return (
    simulacaoStore.carregando ||
    clienteStore.carregando ||
    reservaStore.carregando ||
    propostaStore.carregando
  )
})
</script>

<style>
@import '@/assets/styles.css';

.main-content {
  min-height: calc(100vh - 120px);
  padding-bottom: var(--spacing-xl);
}
</style>
