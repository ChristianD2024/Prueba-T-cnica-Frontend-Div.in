<template>
  <main class="home-page">
    
    <VehicleList />
  </main>
</template>

<script setup lang="ts">
import VehicleList from '@/components/VehicleList.vue'
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 2em auto;
  padding: 0 1em;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 1.5em;
}
</style>