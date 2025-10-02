<template>
  <div>
    <h1>Gestor de Vehículos</h1>
    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
      <!-- Panel lateral de filtros -->
      <FiltersPanel />

      <!-- Tabla de vehículos -->
      <div style="flex: 1;">
        <TablaVehiculos @select="goToVehicle" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '../stores/vehicles'
import TablaVehiculos from '../components/TablaVehiculos.vue'
import FiltersPanel from '../components/FiltersPanel.vue'

console.log('VehiculosView.vue cargado')

const store = useVehiclesStore()
const router = useRouter()

// Cargar vehículos simulados al montar la vista (temporal)
onMounted(() => {
  store.loadSimulatedVehicles()
  console.log('Vehículos cargados:', store.vehicles)
})
// Para volver a usar la API real, cambia a:
// onMounted(() => {
//   store.loadVehicles()
// })

// Función para navegar al detalle del vehículo seleccionado
function goToVehicle(vehicle: any) {
  router.push(`/vehicles/${vehicle.id}`)
}
</script>

<style scoped>
/* Opcional: estilos para mejorar presentación */
</style>