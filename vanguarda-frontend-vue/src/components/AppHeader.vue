<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="header-brand">
          <img src="/logo-vanguarda-icon.png" alt="Vanguarda Consórcios" class="brand-logo" />
          <div class="brand-text">
            <h1 class="brand-title">Vanguarda</h1>
            <p class="brand-subtitle">Realize Seus Sonhos</p>
          </div>
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
  background: #FFFFFF;  /* Branco para diferenciar do resto */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);  /* Sombra para separação */
  padding: var(--spacing-lg) 0;  /* Mais espaço para logo maior */
  border-bottom: 3px solid #D1FF00;  /* Borda verde Vanguarda */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-md);
}

.brand-logo {
  height: 100px;  /* Bem maior */
  width: auto;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: var(--font-size-2xl);  /* 24px */
  font-weight: 700;
  color: #2C3E50;  /* Azul acinzentado para contraste */
  margin: 0;
  letter-spacing: -0.01em;
}

.brand-subtitle {
  font-family: 'DM Sans', sans-serif;  /* Fonte secundária */
  font-size: var(--font-size-sm);  /* 14px */
  color: #666666;  /* Cinza médio */
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
    flex-direction: column;
    align-items: center;
  }

  .brand-logo {
    height: 80px;  /* Ainda grande no mobile */
  }

  .brand-text {
    align-items: center;
  }
}
</style>
