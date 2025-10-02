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

    <!-- Sin resultados -->
    <div v-else-if="vehicles.length === 0" class="no-results">
      <p>No hay vehículos para mostrar.</p>
    </div>

    <!-- Tabla de vehículos -->
    <div v-else>
      <!-- Opcional: eliminar o comentar este pre en producción -->
      <!-- <pre style="background: #f0f0f0; padding: 1rem; max-height: 300px; overflow: auto;">
        {{ JSON.stringify(vehicles, null, 2) }}
      </pre>  -->

      <table>
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
        <tbody>
          <tr v-for="vehicle in vehicles" :key="vehicle.id" @click="$emit('select', vehicle)" tabindex="0" @keydown.enter="$emit('select', vehicle)">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'

const store = useVehiclesStore()

const vehicles = computed(() => store.paginatedVehicles)

watch(vehicles, (newVal) => {
  console.log('Vehículos mostrados en tabla:', JSON.parse(JSON.stringify(newVal)))
})

onMounted(() => {
  store.loadSimulatedVehicles()
})


const loading = computed(() => store.loading)
const error = computed(() => store.error)
const page = computed(() => store.currentPage)
const totalPages = computed(() => store.totalPages)

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
</style>