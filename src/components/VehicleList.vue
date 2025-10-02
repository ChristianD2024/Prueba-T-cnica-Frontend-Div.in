<template>
  <div>
    <!-- Título -->
    <h1>Listado de Vehículos</h1>
    
    <!-- Componente de filtros -->
    <VehicleFilters />

    <div v-if="loading">Cargando vehículos...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <!-- DEBUG TEMPORAL: Muestra conteos para diagnosticar -->
      <div class="debug-info" style="background: #f0f0f0; padding: 0.5rem; margin-bottom: 1rem; font-size: 0.9em;">
        <p>Total vehículos: {{ store.vehicles.length }}</p>
        <p>Filtrados: {{ store.filteredVehicles.length }}</p>
        <p>Paginados (visibles): {{ paginatedVehicles.length }} (Página {{ currentPage }} / {{ totalPages }})</p>
        <!-- Quita esta div completa después de fixear -->
      </div>

      <table class="vehicles-table">
        <thead>
          <tr>
            <th @click="setSort('make')" class="sortable">
              Marca <SortIcon :asc="sortAsc" :active="sortColumn === 'make'" />
            </th>
            <th @click="setSort('model')" class="sortable">
              Modelo <SortIcon :asc="sortAsc" :active="sortColumn === 'model'" />
            </th>
            <th @click="setSort('year')" class="sortable">
              Año <SortIcon :asc="sortAsc" :active="sortColumn === 'year'" />
            </th>
            <th @click="setSort('class')" class="sortable">
              Clase <SortIcon :asc="sortAsc" :active="sortColumn === 'class'" />
            </th>
            <th>Ubicación (lat, lng)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="vehicle in paginatedVehicles"
            :key="vehicle.id"
            @click="goToDetail(vehicle.id)"
            style="cursor: pointer;"
            title="Ver detalles"
          >
            <td>{{ vehicle.make }}</td>
            <td>{{ vehicle.model }}</td>
            <td>{{ vehicle.year }}</td>
            <td>{{ vehicle.class }}</td>
            <td>{{ vehicle.latitude.toFixed(4) }}, {{ vehicle.longitude.toFixed(4) }}</td>
          </tr>
          <tr v-if="paginatedVehicles.length === 0">
            <td colspan="5">No se encontraron vehículos con los filtros aplicados. (Debug: Filtrados={{ store.filteredVehicles.length }})</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="setPage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'
import VehicleFilters from './VehicleFilters.vue'

const store = useVehiclesStore()
const router = useRouter()

const {
  loading,
  error,
  paginatedVehicles,
  currentPage,
  totalPages,
  sortColumn,
  sortAsc,
  setSort,
  setPage,
  vehicles,      // Agrega esto para debug
  filteredVehicles // Agrega esto para debug
} = store

// Exponer store para debug en template
// (agrega estas líneas después de const { ... } = store)

onMounted(() => {
  store.loadSimulatedVehicles()
  console.log('=== DEBUG VEHICLELIST onMounted ===')
  console.log('Vehículos totales:', store.vehicles.length)
  console.log('Filtros iniciales:', store.filters)
  console.log('Filtered inicial:', store.filteredVehicles.length)
  console.log('Paginated inicial:', paginatedVehicles.length)
  console.log('Current page:', currentPage.value, 'Total pages:', totalPages.value)
  console.log('=== FIN DEBUG ===')
})

// Para volver a usar la API real, cambia a:
// onMounted(() => {
//   store.loadVehicles()
// })

function goToDetail(id: number | string) {
  router.push(`/vehicles/${id}`)
}

// SortIcon igual que antes
const SortIcon = {
  props: {
    asc: Boolean,
    active: Boolean
  },
  template: `
    <span v-if="active" class="sort-icon" aria-label="Orden">
      {{ asc ? '▲' : '▼' }}
    </span>
  `
}
</script>

<!-- Agrega al final del <style scoped> -->
<style scoped>
/* ... estilos existentes ... */

.debug-info {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.debug-info p {
  margin: 0.25rem 0;
  color: #666;
}
</style>

<style scoped>
.vehicles-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}

.vehicles-table th,
.vehicles-table td {
  border: 1px solid #ccc;
  padding: 0.5em;
  text-align: left;
}

.vehicles-table th.sortable {
  background-color: #f0f0f0;
  user-select: none;
  cursor: pointer;
}

.vehicles-table tbody tr:hover {
  background-color: #e6f7ff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
}

button {
  padding: 0.4em 1em;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
}

.error-message {
  color: #d9534f;
  font-weight: bold;
  margin: 1em 0;
}

.sort-icon {
  margin-left: 0.25em;
  font-size: 0.8em;
  color: #007bff;
}

</style>