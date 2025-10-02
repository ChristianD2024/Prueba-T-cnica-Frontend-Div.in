// src/utils/geo.ts
export function hashStringToNumber(str: string, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convertir a entero 32 bits
  }
  return Math.abs(hash) % max
}

export function generateChileCoordinates(id: string): { latitude: number; longitude: number } {
  // Rango aproximado de Chile
  const latMin = -56
  const latMax = -17
  const lngMin = -75
  const lngMax = -66

  const latRange = latMax - latMin
  const lngRange = lngMax - lngMin

  const latHash = hashStringToNumber(id, 1000)
  const lngHash = hashStringToNumber(id + 'lng', 1000)

  const latitude = latMin + (latHash / 999) * latRange
  const longitude = lngMin + (lngHash / 999) * lngRange

  return { latitude, longitude }
}
