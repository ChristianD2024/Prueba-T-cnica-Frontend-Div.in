<template>
  <div>
    <h1>Gestor de Vehículos</h1>
    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
      
      <!-- VehicleList como hijo principal (integra filtros + tabla) -->
      <VehicleList @select="goToVehicle" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import VehicleList from '../components/VehicleList.vue'  // Importa VehicleList

const router = useRouter()

// Función para navegar (si @select en VehicleList)
function goToVehicle(vehicle: any) {
  router.push(`/vehicles/${vehicle.id}`)
}
</script>

<style scoped>

</style>