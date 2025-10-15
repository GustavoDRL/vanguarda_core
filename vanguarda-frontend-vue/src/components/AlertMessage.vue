<template>
  <div v-if="show" :class="['alert', `alert-${type}`]" role="alert">
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error', 'danger'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})
</script>
