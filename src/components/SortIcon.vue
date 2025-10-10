<template>
  <span v-if="active" class="sort-icon" aria-label="Orden">
    {{ asc ? '▲' : '▼' }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  asc: boolean
  active: boolean
}>();
</script>

<style scoped>
.sort-icon {
  margin-left: 0.25em;
  font-size: 0.8em;
  color: #007bff;
}
</style>