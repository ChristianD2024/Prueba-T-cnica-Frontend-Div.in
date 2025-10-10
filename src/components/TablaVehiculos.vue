<template>
  <div>
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <!-- Skeleton loader simple -->
      <div class="skeleton-row" v-for="n in 5" :key="n"></div>
      <p>Cargando vehículos...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
      <button @click="reloadVehicles">Reintentar</button>
    </div>

    <div v-else-if="paginatedVehicles.length === 0" class="no-results">
      <p>No se encontraron vehículos con los filtros aplicados.</p>
      <p class="debug-info">
        Debug: Filtrados={{ filteredVehicles.length }} | Total={{ vehiclesTotal }} | Paginados={{ paginatedVehicles.length }} (Página {{ page }} / {{ totalPages }})
      </p>
      <button @click="clearFilters">Limpiar filtros</button>  <!-- Botón directo -->
    </div>

    <!-- Tabla: Key agresiva en table y tbody -->
    <div v-else>
      <table :key="`tabla-full-${filteredVehicles.length}-${page}-${Date.now() % 10000}`">  <!-- Key con timestamp para force total re-render -->
        <thead>
          <tr>
            <th @click="sort('class')">Tipo de auto</th>
            <th @click="sort('fuel_type')">Tipo de combustible</th>
            <th @click="sort('make')">Marca</th>
            <th @click="sort('model')">Modelo</th>
            <th @click="sort('year')">Año</th>
            <th @click="sort('transmission')">Tipo de transmisión</th>
            <th @click="sort('city_mpg')">Consumo en ciudad</th>
            <th @click="sort('highway_mpg')">Consumo en carretera</th>
            <th @click="sort('combination_mpg')">Consumo mixto</th>
          </tr>
        </thead>
        <tbody :key="`tbody-${paginatedVehicles.length}-${filteredVehicles.length}`">  <!-- Key en tbody -->
          <tr v-for="vehicle in paginatedVehicles" :key="vehicle.id + '-' + filteredVehicles.length" @click="$emit('select', vehicle)" tabindex="0" @keydown.enter="$emit('select', vehicle)">
            <td>{{ capitalizeWords(vehicle.class) }}</td>
            <td>{{ vehicle.fuel_type || '-' }}</td>
            <td>{{ vehicle.make || '-' }}</td>
            <td>{{ vehicle.model || '-' }}</td>
            <td>{{ vehicle.year || '-' }}</td>
            <td>{{ mapTransmission(vehicle.transmission) }}</td>
            <td>{{ cleanValue(vehicle.city_mpg) }}<span v-if="!isNaN(Number(vehicle.city_mpg))">mpg</span></td>
            <td>{{ cleanValue(vehicle.highway_mpg) }}<span v-if="!isNaN(Number(vehicle.highway_mpg))">mpg</span></td>
            <td>{{ cleanValue(vehicle.combination_mpg) }}<span v-if="!isNaN(Number(vehicle.combination_mpg))">mpg</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="page === 1" @click="changePage(page - 1)">Anterior</button>
        <span>Página {{ page }} de {{ totalPages }}</span>
        <button :disabled="page === totalPages" @click="changePage(page + 1)">Siguiente</button>
      </div>
      <button v-else-if="filteredVehicles.length > 0" @click="clearFilters">Limpiar filtros</button> 
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'

const store = useVehiclesStore()

// Computed (agrega filteredVehicles y vehiclesTotal para debug)
const paginatedVehicles = computed(() => store.paginatedVehicles)
const filteredVehicles = computed(() => store.filteredVehicles)  // Acceso directo para debug
const vehiclesTotal = computed(() => store.vehicles.length)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const page = computed(() => store.currentPage)
const totalPages = computed(() => store.totalPages)
// const currentPage = computed(() => store.currentPage)  // Para :key

watch([filteredVehicles, paginatedVehicles], ([newFiltered, newPaginated]) => {
  console.log('📋 TablaVehiculos watch: filtered to', newFiltered.length, 'paginated to', newPaginated.length, 'makes:', newPaginated.map(v => v.make || 'N/A'))
}, { deep: true, immediate: true })  // immediate: true para log inicial


function cleanValue(value: any) {
  if (value === 'this field is for premium subscribers only') return 'No disponible'
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string' && isNaN(Number(value))) return 'No disponible'
  return value
}


function mapTransmission(value: string) {
  if (!value) return '-'
  const v = value.toLowerCase()
  if (v === 'a') return 'Automática'
  if (v === 'm') return 'Manual'
  return value
}

function capitalizeWords(str: string) {
  if (!str) return '-'
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

// Función clearFilters (emite o llama store)
function clearFilters() {
  store.clearFilters()
}

function sort(column: string) {
  store.setSort(column)
}

function changePage(newPage: number) {
  store.setPage(newPage)
}

function reloadVehicles() {
  store.loadSimulatedVehicles()
}

</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  cursor: pointer;
  background-color: #f0f0f0;
  padding: 8px;
  user-select: none;
}
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
tr:hover,
tr:focus {
  background-color: #f9f9f9;
  outline: none;
}
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error {
  text-align: center;
  color: red;
  margin-bottom: 1rem;
}
.error button {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  cursor: pointer;
}
.loading-state {
  padding: 1rem;
}
.skeleton-row {
  height: 20px;
  background: linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  margin-bottom: 10px;
  border-radius: 4px;
}
.debug-info {
  font-size: 0.8em;
  color: #666;
  font-style: italic;
  margin-top: 0.5em;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.no-results {
  text-align: center;
  font-style: italic;
  color: #666;
}
.debug-info { font-size: 0.8em; color: #666; margin: 0.5em 0; }
</style>