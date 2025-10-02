<template>
  <aside class="filters-panel">
    <h3>Filtros</h3>

    <label>
      Tipo de auto:
      <input v-model="localFilters.class" placeholder="Ej: sedan" />
    </label>

    <label>
      Marca:
      <input v-model="localFilters.make" placeholder="Ej: Toyota" />
    </label>

    <label>
      Modelo:
      <input v-model="localFilters.model" placeholder="Ej: Camry" />
    </label>

    <label>
      Año mínimo:
      <input type="number" v-model.number="localFilters.yearMin" min="1900" max="2100" />
    </label>

    <label>
      Año máximo:
      <input type="number" v-model.number="localFilters.yearMax" min="1900" max="2100" />
    </label>

    <label>
      Transmisión:
      <select v-model="localFilters.transmission">
        <option value="">Todos</option>
        <option value="a">Automática</option>
        <option value="m">Manual</option>
      </select>
    </label>

    <label>
      Consumo ciudad mínimo:
      <input type="number" v-model.number="localFilters.cityMpgMin" min="0" />
    </label>

    <label>
      Consumo ciudad máximo:
      <input type="number" v-model.number="localFilters.cityMpgMax" min="0" />
    </label>

    <!-- Mensaje de error -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="buttons">
      <button @click="applyFilters">Aplicar filtros</button>
      <button @click="clearAll">Limpiar filtros</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'

const store = useVehiclesStore()

// Copia local para editar sin afectar inmediatamente el store
const localFilters = reactive({ ...store.filters })

// Variable reactiva para mensaje de error
const errorMessage = ref('')

function applyFilters() {
  // Validar rangos mínimos y máximos
  if (
    (localFilters.yearMin !== null && localFilters.yearMax !== null && localFilters.yearMin > localFilters.yearMax) ||
    (localFilters.cityMpgMin !== null && localFilters.cityMpgMax !== null && localFilters.cityMpgMin > localFilters.cityMpgMax)
  ) {
    errorMessage.value = 'El valor mínimo no puede ser mayor que el máximo en los rangos.'
    return
  }
  errorMessage.value = '' // Limpiar mensaje si no hay error
  store.setFilters({ ...localFilters })
  store.setPage(1) // Reiniciar a página 1 al aplicar filtros
}

function clearAll() {
  store.clearFilters()
  Object.assign(localFilters, {
    class: '',
    make: '',
    model: '',
    yearMin: null,
    yearMax: null,
    transmission: '',
    cityMpgMin: null,
    cityMpgMax: null
  })
  errorMessage.value = '' // Limpiar mensaje al limpiar filtros
  store.setPage(1)
}
</script>

<style scoped>
.filters-panel {
  border: 1px solid #ccc;
  padding: 1rem;
  max-width: 300px;
  background: #fafafa;
  font-family: Arial, sans-serif;
}
.filters-panel h3 {
  margin-top: 0;
}
.filters-panel label {
  display: block;
  margin-bottom: 0.5rem;
}
.filters-panel input,
.filters-panel select {
  width: 100%;
  padding: 0.3rem;
  margin-top: 0.2rem;
  box-sizing: border-box;
}
.buttons {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
.buttons button {
  flex: 1;
  padding: 0.5rem;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 0.5rem;
  font-weight: bold;
}
</style>