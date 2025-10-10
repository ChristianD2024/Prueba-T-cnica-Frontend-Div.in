import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { fetchCars } from '../services/carsService'
import { generateChileCoordinates } from '../utils/geo'
import type { Vehicle } from '../types/Vehicle'  // Tipado Vehicle

// Datos simulados
const simulatedVehicles: Vehicle[] = [
  {
    id: 1,
    city_mpg: "32",
    class: "midsize car",
    combination_mpg: "34",
    cylinders: 4,
    displacement: 2.2,
    drive: "fwd",
    fuel_type: "gas",
    highway_mpg: "36",
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
  },
  {
    id: 5,
    city_mpg: "35",
    class: "sedan",
    combination_mpg: "37",
    cylinders: 6,
    displacement: 2.2,
    drive: "fwd",
    fuel_type: "gas",
    highway_mpg: "40",
    make: "toyota",
    model: "corolla",
    transmission: "m",
    year: 2019,
    latitude: -27.27027027027,
    longitude: -72.6396396396
  },
  {
    id: 6,
    city_mpg: "25",
    class: "sedan",
    combination_mpg: "28",
    cylinders: 4,
    displacement: 1.8,
    drive: "rwd",
    fuel_type: "gas",
    highway_mpg: "32",
    make: "mazda",
    model: "3",
    transmission: "m",
    year: 2018,
    latitude: 25.05,
    longitude: -108.25
  },
  {
    id: 7,
    city_mpg: "25",
    class: "sedan",
    combination_mpg: "28",
    cylinders: 4,
    displacement: 1.8,
    drive: "fwd",
    fuel_type: "gas",
    highway_mpg: "32",
    make: "mazda",
    model: "6",
    transmission: "a",
    year: 2020,
    latitude: 32.05,
    longitude: -181.22
  }
]

export const useVehiclesStore = defineStore('vehicles', () => {
  // Estado reactivo con tipado
  const vehicles = ref<Vehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = 20
  const sortColumn = ref<string | null>(null)
  const sortAsc = ref(true)

  // Filtros
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

  const filterErrors = ref<{ year?: string; cityMpg?: string }>({})

  function validateFilters() {
    filterErrors.value = {}

    if (filters.value.yearMin !== null && filters.value.yearMax !== null && filters.value.yearMin > filters.value.yearMax) {
      filterErrors.value.year = 'El año mínimo no puede ser mayor que el año máximo.'
    }

    if (filters.value.cityMpgMin !== null && filters.value.cityMpgMax !== null && filters.value.cityMpgMin > filters.value.cityMpgMax) {
      filterErrors.value.cityMpg = 'El consumo mínimo no puede ser mayor que el consumo máximo.'
    }

    return Object.keys(filterErrors.value).length === 0
  }

  async function loadVehicles(params = { limit: 50 }) {
    loading.value = true
    error.value = null
    try {
      const data = await fetchCars(params)
      vehicles.value = data.map((v: any, index: number) => {
        if (!v.latitude || !v.longitude) {
          const coords = generateChileCoordinates(String(v.id || index + 1))
          return { ...v, latitude: coords.latitude, longitude: coords.longitude } as Vehicle
        }
        return v as Vehicle
      })
      currentPage.value = 1
    } catch (err) {
      error.value = (err as Error).message || 'Error desconocido'
      console.error('Load vehicles error:', err)
    } finally {
      loading.value = false
    }
  }

  function loadSimulatedVehicles() {
    vehicles.value = simulatedVehicles
    currentPage.value = 1
  }

  function setSort(column: string) {
    if (sortColumn.value === column) {
      sortAsc.value = !sortAsc.value
    } else {
      sortColumn.value = column
      sortAsc.value = true
    }
    currentPage.value = 1
    console.log('🔄 setSort called:', column, sortAsc.value)
  }

  function setPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  async function setFilters(newFilters: Partial<typeof filters.value>) {
    const updatedFilters = { ...filters.value, ...newFilters }
    filters.value = { ...updatedFilters }
    validateFilters()
    currentPage.value = 1
    sortColumn.value = null 
    console.log('Filtros aplicados:', JSON.parse(JSON.stringify(filters.value)))
  }

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

  function getSortValue(vehicle: Vehicle, column: keyof Vehicle): any {
    let value = vehicle[column as keyof Vehicle]
    if (value === 'this field is for premium subscribers only') return null
    if (value == null) return null
    switch (column) {
      case 'fuel_type': return vehicle.fuel_type
      case 'combination_mpg': return Number(vehicle.combination_mpg) || 0
      case 'city_mpg': return Number(vehicle.city_mpg) || 0
      case 'highway_mpg': return Number(vehicle.highway_mpg) || 0
      default: return value
    }
  }

  // Computed con tipado Vehicle
  const filteredVehicles = computed(() => {
    console.log('🔍 filteredVehicles START - make:', filters.value.make, 'vehicles.length:', vehicles.value.length)
    if (!validateFilters()) {
      console.log('🔍 filteredVehicles END - invalid, []')
      return [] as Vehicle[]
    }

    const filtered = vehicles.value.filter((v: Vehicle) => {
      if (filters.value.class && !v.class.toLowerCase().includes(filters.value.class.toLowerCase())) return false
      if (filters.value.make && !v.make.toLowerCase().includes(filters.value.make.toLowerCase())) return false
      if (filters.value.model && !v.model.toLowerCase().includes(filters.value.model.toLowerCase())) return false
      if (filters.value.transmission) {
        const t = filters.value.transmission.toLowerCase()
        const vTrans = v.transmission.toLowerCase()
        if ((t === 'a' || t === 'automatica' || t === 'automática') && vTrans !== 'a' ||
            (t === 'm' || t === 'manual') && vTrans !== 'm') return false
      }
      if (filters.value.yearMin !== null && v.year < filters.value.yearMin) return false
      if (filters.value.yearMax !== null && v.year > filters.value.yearMax) return false
      const cityMpgNum = Number(v.city_mpg)
      if (filters.value.cityMpgMin !== null && (isNaN(cityMpgNum) || cityMpgNum < filters.value.cityMpgMin)) return false
      if (filters.value.cityMpgMax !== null && (isNaN(cityMpgNum) || cityMpgNum > filters.value.cityMpgMax)) return false
      return true
    })
    console.log('🔍 filteredVehicles END - length:', filtered.length, 'makes:', filtered.map(v => v.make))
    return filtered as Vehicle[]
  })

  const sortedVehicles = computed(() => {
    console.log('🔄 sortedVehicles START - filtered.length:', filteredVehicles.value.length, 'sortColumn:', sortColumn.value)
    const items = filteredVehicles.value
    
    if (!sortColumn.value || items.length <= 1) {
      console.log('🔄 sortedVehicles BYPASS - return items (length:', items.length, ')')
      return items
    }
    const sorted = [...items].sort((a: Vehicle, b: Vehicle) => {
      const valA = getSortValue(a, sortColumn.value!)
      const valB = getSortValue(b, sortColumn.value!)
      
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
    console.log('🔄 sortedVehicles END - length:', sorted.length)
    return sorted
  })

  const totalPages = computed(() => {
    console.log('📊 totalPages START - sorted.length:', sortedVehicles.value.length)
    const total = Math.ceil(sortedVehicles.value.length / itemsPerPage)
    console.log('📊 totalPages END:', total)
    return total || 1
  })

  const paginatedVehicles = computed(() => {
    console.log('📄 paginatedVehicles START - page:', currentPage.value, 'sorted.length:', sortedVehicles.value.length)
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    let paginated = sortedVehicles.value.slice(start, end)
    
    // Fallback si sorted vacío pero filtered >0 y page=1
    if (paginated.length === 0 && filteredVehicles.value.length > 0 && currentPage.value === 1) {
      paginated = filteredVehicles.value.slice(start, end)
      console.log('📄 paginatedVehicles FALLBACK - using filtered (length:', paginated.length, ')')
    }
    
    console.log('📄 paginatedVehicles END - length:', paginated.length, 'start/end:', start, '/', end, 'makes:', paginated.map(v => v.make || 'N/A'))
    return paginated
  })

// Orden y paginación en localStorage
watch([sortColumn, sortAsc, currentPage], ([col, asc, page]) => {
  localStorage.setItem('vehicleSort', JSON.stringify({ column: col, asc: asc }))
  localStorage.setItem('vehiclePage', page.toString())
}, { deep: true })

watch(() => true, () => {

  // Cargar sort
  const savedSortStr = localStorage.getItem('vehicleSort')
  if (savedSortStr) {
    try {
      const { column, asc } = JSON.parse(savedSortStr)
      sortColumn.value = column || null
      sortAsc.value = asc ?? true
      console.log('📥 Sort cargado de localStorage:', { column, asc })
    } catch (e) {
      console.warn('Error cargando sort:', e)
    }
  }

  // Cargar página
  const savedPageStr = localStorage.getItem('vehiclePage')
  if (savedPageStr) {
    try {
      currentPage.value = parseInt(savedPageStr, 10) || 1
      console.log('📥 Página cargada de localStorage:', currentPage.value)
    } catch (e) {
      console.warn('Error cargando página:', e)
    }
  }
}, { immediate: true })


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