<template>
  <div>
    <!-- Título -->
    <h1>Listado de Vehículos</h1>
    
    <!-- Botón para abrir modal de filtros -->
    <button class="filters-toggle" @click="showModal = true">
      Filtros ▼
    </button>

    <!-- Contenido principal: loading, error, tabla, paginación -->
    <div v-if="loading">Cargando vehículos...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <!-- DEBUG TEMPORAL -->
      <div class="debug-info" style="background: #f0f0f0; padding: 0.5rem; margin-bottom: 1rem; font-size: 0.9em;">
        <p>Total vehículos: {{ vehicles.length }}</p>
        <p>Filtrados: {{ filteredVehicles.length }}</p>
        <p>Paginados (visibles): {{ paginatedVehicles.length }} (Página {{ currentPage }} / {{ totalPages }})</p>
      </div>

      <!-- Tabla -->
      <table class="vehicles-table" :key="`list-table-${filteredVehicles.length}-${currentPage}`">
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
        <tbody :key="`list-tbody-${paginatedVehicles.length}-${filteredVehicles.length}`">
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
            <td colspan="5">No se encontraron vehículos con los filtros aplicados. (Debug: Filtrados={{ filteredVehicles.length }})</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="setPage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
    </div>

    <!-- Modal de filtros -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Filtros de vehículos</h3>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        <!-- Contenido de filtros -->
        <VehicleFilters @apply="handleApply" @clear="handleClear" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, toRefs, ref } from 'vue'  // + ref para showModal
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'
import VehicleFilters from './VehicleFilters.vue'
import SortIcon from './SortIcon.vue'

const store = useVehiclesStore()
const router = useRouter()

// Reactividad del store 
const {
  loading,
  error,
  paginatedVehicles,
  currentPage,
  totalPages,
  sortColumn,
  sortAsc,
  setSort: storeSetSort,
  setPage,
  vehicles,
  filteredVehicles,
  loadSimulatedVehicles
} = toRefs(store)

const setSort = storeSetSort.value

// Estado para modal
const showModal = ref(false)

// Funciones para cerrar modal al aplicar/limpiar
function handleApply() {
  // Ya se aplicó en VehicleFilters (setFilters), solo cerrar
  showModal.value = false
}

function handleClear() {
  // Ya se limpió en VehicleFilters (clearFilters), solo cerrar
  showModal.value = false
}

// (onMounted, watch, goToDetail, clearFilters)
onMounted(() => {
  if (vehicles.value.length === 0) {
    loadSimulatedVehicles.value()
  }
  console.log('=== VEHICLELIST onMounted - Datos cargados ===')
  console.log('vehicles.length:', vehicles.value.length)
  console.log('Filtros iniciales:', store.filters)
  console.log('Filtered inicial:', filteredVehicles.value.length)
  console.log('Paginated inicial:', paginatedVehicles.value.length)
  console.log('=== FIN DEBUG VEHICLELIST ===')
})

watch(paginatedVehicles, (newVal) => {
  console.log('📋 VehicleList watch: paginatedVehicles changed to length', newVal.length, 'makes:', newVal.map(v => v.make || 'N/A'))
}, { immediate: true })

function goToDetail(id: number | string) {
  router.push(`/vehicles/${id}`)
}

function clearFilters() {
  store.clearFilters()
}
</script>

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

.debug-info {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.debug-info p {
  margin: 0.25rem 0;
  color: #666;
} 

/* Nuevos estilos para modal */
.filters-toggle {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1em;
  font-size: 1em;
}

.filters-toggle:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* Fondo gris semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;  /* Animación suave */
}

.modal-content {
  background: white;
  padding: 1.5em;
  border-radius: 8px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;  /* Scroll si muchos filtros */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5em;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #d9534f;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>