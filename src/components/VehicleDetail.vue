<template>
  <div class="vehicle-detail">
    <button @click="goBack">← Volver a la lista</button>

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

    <div id="map" style="height: 400px;" v-if="vehicle"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'  // corregir ruta si es necesario
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'  // Importar estilos Leaflet

const route = useRoute()
const router = useRouter()
const store = useVehiclesStore()

const vehicleId = route.params.id as string
const mapInitialized = ref(false)

// Computed para obtener el vehículo según el id
const vehicle = computed(() => {
  return store.vehicles.find(v => String(v.id) === vehicleId)
})

function goBack() {
  router.push('/')
}

async function initMap() {
  if (!vehicle.value) return

  // Crear mapa centrado en la ubicación del vehículo
  const map = L.map('map').setView([vehicle.value.latitude, vehicle.value.longitude], 13)

  // Cargar los tiles del mapa (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Agregar marcador en la ubicación del vehículo
  L.marker([vehicle.value.latitude, vehicle.value.longitude]).addTo(map)
    .bindPopup(`${vehicle.value.make} ${vehicle.value.model}`)
    .openPopup()
}

onMounted(async () => {
  if (store.vehicles.length === 0) {
    await store.loadVehicles()
  }
})

// Esperar a que el vehículo esté disponible para inicializar el mapa
watch(
  () => vehicle.value,
  (newVal) => {
    if (newVal && !mapInitialized.value) {
      initMap()
      mapInitialized.value = true
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.vehicle-detail {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
button {
  margin-bottom: 1rem;
  cursor: pointer;
}
</style>