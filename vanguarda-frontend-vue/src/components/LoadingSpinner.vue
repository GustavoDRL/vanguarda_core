<template>
  <div v-if="show" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>
