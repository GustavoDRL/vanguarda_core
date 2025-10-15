<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="header-brand">
          <h1 class="brand-title">Vanguarda</h1>
          <p class="brand-subtitle">Simulação de Consórcio</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// Header simplificado sem autenticação
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: var(--shadow);
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.brand-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.header-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .header-brand {
    align-items: center;
  }
}
</style>
