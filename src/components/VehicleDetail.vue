<template>
  <div class="vehicle-detail">
    <!-- Botón volver: Usa router.back() para mantener estado -->
    <button @click="goBack">← Volver a la tabla</button>

    <h2 v-if="vehicle">{{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.year }})</h2>
    <p v-else>Cargando detalles del vehículo...</p>

    <ul v-if="vehicle">
      <li><strong>Tipo de auto:</strong> {{ vehicle.class }}</li>
      <li><strong>Combustible:</strong> {{ vehicle.fuel_type }}</li>
      <li><strong>Transmisión:</strong> {{ vehicle.transmission }}</li>
      <li><strong>Consumo ciudad:</strong> {{ vehicle.city_mpg }} mpg</li>
      <li><strong>Consumo carretera:</strong> {{ vehicle.highway_mpg }} mpg</li>
      <li><strong>Consumo combinado:</strong> {{ vehicle.combination_mpg }} mpg</li>
    </ul>

    <!-- Mapa interactivo (Leaflet) -->
    <div id="map" class="map-container" v-if="vehicle"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick, computed } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'
import L from 'leaflet'
import type { Vehicle } from '@/types/Vehicle'  // Tipado

const route = useRoute()
const router = useRouter()
const store = useVehiclesStore()

const vehicleId = computed(() => route.params.id as string)  // Computed para reactivo
const mapInitialized = ref(false)
let map: L.Map | null = null  // Referencia al mapa para cleanup

// Computed vehicle (busca por ID en store.vehicles)
const vehicle = computed(() => {
  return store.vehicles.find((v: Vehicle) => String(v.id) === vehicleId.value)
})

function goBack() {
  // router.back() vuelve a la página anterior
  router.back()
}

async function initMap() {
  if (!vehicle.value || mapInitialized.value) return

  // Remover mapa viejo si existe (para re-mount)
  if (map) {
    map.remove()
  }

  // Crear mapa centrado en lat/lng del vehículo (geo.ts)
  map = L.map('map').setView([vehicle.value.latitude, vehicle.value.longitude], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Marcador con popup (tooltip) que muestra make, model y year
  const popupContent = `${vehicle.value.make} ${vehicle.value.model} (${vehicle.value.year})`
  L.marker([vehicle.value.latitude, vehicle.value.longitude])
    .addTo(map)
    .bindPopup(popupContent)
    .openPopup()  // Abrir auto al cargar
}

onMounted(async () => {
  // Carga datos si vacío (simulados o API)
  if (store.vehicles.length === 0) {
    // Para dev: store.loadSimulatedVehicles()
    await store.loadSimulatedVehicles()  // O usa simulados sin API: store.loadVehicles()
  }
  // Espera un tick para asegurar DOM listo
  await nextTick()
  initMap()
  mapInitialized.value = true
})

// Watch para re-init si vehicle cambia (ej. datos cargan después)
watch(vehicle, (newVal) => {
  if (newVal) {
    initMap()
  }
}, { immediate: true })
</script>

<style scoped>
.vehicle-detail {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

button {
  margin-bottom: 1rem;
  padding: 0.5em 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.5em;
  padding: 0.5em;
  background: #f8f9fa;
  border-radius: 4px;
}

.map-container {
  height: 400px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 1em;
}
</style>