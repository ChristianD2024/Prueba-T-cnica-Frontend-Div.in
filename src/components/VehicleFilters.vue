<template>
  <div class="filters-panel">
    <h3>Filtros de vehículos</h3>

    <div class="filter-group">
      <label for="class">Clase:</label>
      <input id="class" type="text" v-model="localFilters.class" placeholder="Ej: compact car" />
    </div>

    <div class="filter-group">
      <label for="make">Marca:</label>
      <input id="make" type="text" v-model="localFilters.make" placeholder="Ej: honda" />
    </div>

    <div class="filter-group">
      <label for="model">Modelo:</label>
      <input id="model" type="text" v-model="localFilters.model" placeholder="Ej: civic" />
    </div>

    <div class="filter-group">
      <label for="transmission">Transmisión (A/M):</label>
      <input id="transmission" type="text" v-model="localFilters.transmission" placeholder="Ej: a o m" maxlength="1" />
    </div>

    <div class="filter-group">
      <label for="yearMin">Año mínimo:</label>
      <input id="yearMin" type="number" v-model.number="localFilters.yearMin" min="1900" max="2030" placeholder="Ej: 2010" />
    </div>

    <div class="filter-group">
      <label for="yearMax">Año máximo:</label>
      <input id="yearMax" type="number" v-model.number="localFilters.yearMax" min="1900" max="2030" placeholder="Ej: 2018" />
    </div>
    <div v-if="localFilterErrors.year" class="error-message">{{ localFilterErrors.year }}</div>

    <div class="filter-group">
      <label for="cityMpgMin">Consumo mínimo (city mpg):</label>
      <input id="cityMpgMin" type="number" v-model.number="localFilters.cityMpgMin" min="0" max="50" placeholder="Ej: 20" />
    </div>

    <div class="filter-group">
      <label for="cityMpgMax">Consumo máximo (city mpg):</label>
      <input id="cityMpgMax" type="number" v-model.number="localFilters.cityMpgMax" min="0" max="50" placeholder="Ej: 30" />
    </div>
    <div v-if="localFilterErrors.cityMpg" class="error-message">{{ localFilterErrors.cityMpg }}</div>

    <!-- Mostrar errores generales si hay -->
    <div v-if="hasLocalFilterErrors" class="error-message">
      <p>Hay errores en los filtros. Corrige para aplicar.</p>
    </div>

    <div class="buttons">
      <button :disabled="hasLocalFilterErrors" @click="applyFilters">Aplicar filtros</button>
      <button @click="clearAllFilters">Limpiar filtros</button>
    </div>

    <!-- Debug: conteo de vehículos filtrados (usa store directamente para conteo) -->
    <p class="filter-info">Vehículos mostrados: {{ store.filteredVehicles.length }} de {{ store.vehicles.length }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useVehiclesStore } from '@/stores/vehicles'

const store = useVehiclesStore()

// Filtros LOCALES (no mutan store hasta "Aplicar")
const localFilters = ref({
  class: '',
  make: '',
  model: '',
  transmission: '',
  yearMin: null as number | null,
  yearMax: null as number | null,
  cityMpgMin: null as number | null,
  cityMpgMax: null as number | null
})

// Errores locales para validación antes de aplicar
const localFilterErrors = ref({
  year: '',
  cityMpg: ''
})

const hasLocalFilterErrors = computed(() => {
  return localFilterErrors.value.year !== '' || localFilterErrors.value.cityMpg !== ''
})

// Watcher para validar filtros locales en tiempo real (sin aplicar al store)
watch(localFilters, () => {
  validateLocalFilters()
}, { deep: true })

// Validación local (similar a store.validateFilters)
function validateLocalFilters() {
  const errors: any = { year: '', cityMpg: '' }
  
  // Validar años
  if (localFilters.value.yearMin !== null && localFilters.value.yearMax !== null) {
    if (localFilters.value.yearMin > localFilters.value.yearMax) {
      errors.year = 'Año mínimo no puede ser mayor que el máximo'
    }
  }
  
  // Validar MPG
  if (localFilters.value.cityMpgMin !== null && localFilters.value.cityMpgMax !== null) {
    if (localFilters.value.cityMpgMin > localFilters.value.cityMpgMax) {
      errors.cityMpg = 'Consumo mínimo no puede ser mayor que el máximo'
    }
  }
  
  localFilterErrors.value = errors
}

function applyFilters() {
  if (hasLocalFilterErrors.value) {
    console.log('Errores locales en filtros:', localFilterErrors.value)
    return
  }
  
  // Aplica al store (resetea página y valida)
  store.setFilters(localFilters.value)
  console.log('Filtros aplicados desde local:', localFilters.value)
}

function clearAllFilters() {
  // Resetea locales y aplica al store
  localFilters.value = {
    class: '',
    make: '',
    model: '',
    transmission: '',
    yearMin: null,
    yearMax: null,
    cityMpgMin: null,
    cityMpgMax: null
  }
  localFilterErrors.value = { year: '', cityMpg: '' }
  store.clearFilters()
  console.log('Filtros limpiados desde local')
}

// Inicializa locales con valores del store al montar (opcional, para sincronizar)
import { onMounted } from 'vue'
onMounted(() => {
  localFilters.value = { ...store.filters }
})
</script>

<!-- Mantén el <style scoped> igual -->

<style scoped>
.filters-panel {
  max-width: 400px;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fafafa;
}

.filter-group {
  margin-bottom: 0.8em;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.3em;
}

input[type="text"],
input[type="number"] {
  padding: 0.4em;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 1em;
}

input[type="text"]:focus,
input[type="number"]:focus {
  border-color: #007bff;
  outline: none;
}

.error-message {
  color: #d9534f;
  font-size: 0.9em;
  margin-top: -0.6em;
  margin-bottom: 0.8em;
}

.buttons {
  display: flex;
  gap: 1em;
}

button {
  padding: 0.6em 1.2em;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.2s ease;
}

button:disabled {
  background-color: #a0c8ff;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>