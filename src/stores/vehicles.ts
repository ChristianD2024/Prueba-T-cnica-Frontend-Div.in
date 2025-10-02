import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { fetchCars } from '../services/carsService'
import { generateChileCoordinates } from '../utils/geo'

// src/data/simulatedVehicles.ts
  // Al inicio de vehicles.ts, antes de exportar el store
const simulatedVehicles = [
  {
    id: 1,
    city_mpg: "this field is for premium subscribers only",
    class: "midsize car",
    combination_mpg: "this field is for premium subscribers only",
    cylinders: 4,
    displacement: 2.2,
    drive: "fwd",
    fuel_type: "gas",
    highway_mpg: "this field is for premium subscribers only",
    make: "toyota",
    model: "camry",
    transmission: "a",
    year: 1993,
    latitude: -22.270270270270267,
    longitude: -71.63963963963964
  },
  {
    id: 2,
    city_mpg: "25",
    class: "compact car",
    combination_mpg: "28",
    cylinders: 4,
    displacement: 1.8,
    drive: "fwd",
    fuel_type: "gas",
    highway_mpg: "32",
    make: "honda",
    model: "civic",
    transmission: "m",
    year: 2010,
    latitude: 34.05,
    longitude: -118.25
  },
  {
    id: 3,
    city_mpg: "30",
    class: "sedan",
    combination_mpg: "33",
    cylinders: 6,
    displacement: 3.0,
    drive: "rwd",
    fuel_type: "diesel",
    highway_mpg: "36",
    make: "bmw",
    model: "330d",
    transmission: "a",
    year: 2015,
    latitude: 48.85,
    longitude: 2.35
  },
  {
    id: 4,
    city_mpg: "22",
    class: "suv",
    combination_mpg: "24",
    cylinders: 8,
    displacement: 4.0,
    drive: "awd",
    fuel_type: "gas",
    highway_mpg: "26",
    make: "jeep",
    model: "grand cherokee",
    transmission: "a",
    year: 2018,
    latitude: 40.71,
    longitude: -74.01
  }
]
 //Datos simulados

export const useVehiclesStore = defineStore('vehicles', () => {
  // Estado reactivo
  const vehicles = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = 20
  const sortColumn = ref<string>('class')
  const sortAsc = ref(true)

  // Estado de filtros
  const filters = ref({
    class: '',
    make: '',
    model: '',
    yearMin: null as number | null,
    yearMax: null as number | null,
    transmission: '',
    cityMpgMin: null as number | null,
    cityMpgMax: null as number | null
  })


// Función para cargar datos simulados
  function loadSimulatedVehicles() {
  vehicles.value = simulatedVehicles
  currentPage.value = 1
}


  // Estado para errores de validación de filtros
  const filterErrors = ref<{ year?: string; cityMpg?: string }>({})

  /**
   * Validar filtros numéricos (rangos)
   */
  function validateFilters() {
    filterErrors.value = {}

    if (
      filters.value.yearMin !== null &&
      filters.value.yearMax !== null &&
      filters.value.yearMin > filters.value.yearMax
    ) {
      filterErrors.value.year = 'El año mínimo no puede ser mayor que el año máximo.'
    }

    if (
      filters.value.cityMpgMin !== null &&
      filters.value.cityMpgMax !== null &&
      filters.value.cityMpgMin > filters.value.cityMpgMax
    ) {
      filterErrors.value.cityMpg = 'El consumo mínimo no puede ser mayor que el consumo máximo.'
    }

    // Retorna true si no hay errores
    return Object.keys(filterErrors.value).length === 0
  }

  /**
   * Carga vehículos desde la API con parámetros opcionales (para filtros futuros)
   */
  async function loadVehicles(params = { limit: 50 }) {
    loading.value = true
    error.value = null
    try {
      const data = await fetchCars(params)
      vehicles.value = data.map(v => {
        if (!v.latitude || !v.longitude) {
          const coords = generateChileCoordinates(String(v.id))
          return { ...v, latitude: coords.latitude, longitude: coords.longitude }
        }
        return v
      })
      currentPage.value = 1
    } catch (err) {
      error.value = (err as Error).message || 'Error desconocido'
    } finally {
      loading.value = false
    }
  }

  /**
   * Cambia la columna y dirección de ordenamiento
   */
  function setSort(column: string) {
    if (sortColumn.value === column) {
      sortAsc.value = !sortAsc.value
    } else {
      sortColumn.value = column
      sortAsc.value = true
    }
    currentPage.value = 1
  }

  /**
   * Cambia la página actual, validando límites
   */
  function setPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Actualiza los filtros y resetea la página actual
   * Solo actualiza si la validación pasa
   */
    function setFilters(newFilters: Partial<typeof filters.value>) {
    const updatedFilters = { ...filters.value, ...newFilters }
    filters.value = updatedFilters
    validateFilters()
    currentPage.value = 1
    console.log('Filtros aplicados:', JSON.parse(JSON.stringify(filters.value)))
  }


  /**
   * Limpia todos los filtros y resetea la página actual
   */
  function clearFilters() {
    filters.value = {
      class: '',
      make: '',
      model: '',
      yearMin: null,
      yearMax: null,
      transmission: '',
      cityMpgMin: null,
      cityMpgMax: null
    }
    filterErrors.value = {}
    currentPage.value = 1
  }

  /**
   * Obtener valor correcto según columna para ordenamiento
   */
  function getSortValue(vehicle: any, column: string) {
    switch (column) {
      case 'fuel_type': return vehicle.fuel_type
      case 'combination_mpg': return vehicle.combination_mpg
      case 'city_mpg': return vehicle.city_mpg
      case 'highway_mpg': return vehicle.highway_mpg
      default: return vehicle[column]
    }
  }

  /**
   * Computed: vehículos filtrados según filtros activos
   * Solo si no hay errores de validación
   */
  const filteredVehicles = computed(() => {
    if (!validateFilters()) return []

    return vehicles.value.filter(v => {
      if (filters.value.class && !v.class.toLowerCase().includes(filters.value.class.toLowerCase())) return false
      if (filters.value.make && !v.make.toLowerCase().includes(filters.value.make.toLowerCase())) return false
      if (filters.value.model && !v.model.toLowerCase().includes(filters.value.model.toLowerCase())) return false
      if (filters.value.transmission) {
        const t = filters.value.transmission.toLowerCase()
        const vTrans = v.transmission.toLowerCase()
        if (
          (t === 'a' || t === 'automatica' || t === 'automática') && vTrans !== 'a' ||
          (t === 'm' || t === 'manual') && vTrans !== 'm'
        ) return false
      }
      if (filters.value.yearMin !== null && v.year < filters.value.yearMin) return false
      if (filters.value.yearMax !== null && v.year > filters.value.yearMax) return false
      const cityMpgNum = Number(v.city_mpg)
      if (filters.value.cityMpgMin !== null && (isNaN(cityMpgNum) || cityMpgNum < filters.value.cityMpgMin)) return false
      if (filters.value.cityMpgMax !== null && (isNaN(cityMpgNum) || cityMpgNum > filters.value.cityMpgMax)) return false
      return true
    })
  })

  /**
   * Computed: vehículos ordenados según columna y dirección, sobre los filtrados
   */
  const sortedVehicles = computed(() => {
    if (!sortColumn.value) return filteredVehicles.value
    return [...filteredVehicles.value].sort((a, b) => {
      const valA = getSortValue(a, sortColumn.value)
      const valB = getSortValue(b, sortColumn.value)

      if (valA == null) return 1
      if (valB == null) return -1
      if (valA === valB) return 0

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc.value ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()

      if (strA < strB) return sortAsc.value ? -1 : 1
      if (strA > strB) return sortAsc.value ? 1 : -1
      return 0
    })
  })

  /**
   * Computed: total de páginas basado en vehículos filtrados
   */
  const totalPages = computed(() => {
    return Math.ceil(sortedVehicles.value.length / itemsPerPage)
  })

  /**
   * Computed: vehículos paginados según página actual y ordenamiento
   */
  const paginatedVehicles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return sortedVehicles.value.slice(start, start + itemsPerPage)
  })

  // Persistir filtros en localStorage
  watch(filters, (newFilters) => {
    localStorage.setItem('vehicleFilters', JSON.stringify(newFilters))
  }, { deep: true })

  // Al iniciar, cargar filtros guardados si existen
  const savedFilters = localStorage.getItem('vehicleFilters')
  if (savedFilters) {
    filters.value = JSON.parse(savedFilters)
    validateFilters()
  }

  return {
    vehicles,
    loading,
    error,
    currentPage,
    totalPages,
    paginatedVehicles,
    filters,
    filterErrors,
    setSort,
    setPage,
    loadVehicles,
    loadSimulatedVehicles,
    setFilters,
    clearFilters,
    filteredVehicles,
    validateFilters
  }
})
