import axios from 'axios'

const API_URL = 'https://api.api-ninjas.com/v1/cars?model=camry'

export async function fetchCars() {
  try {
    const response = await axios.get(API_URL, {
      headers: { 'X-Api-Key': 'zaWNyiaEQJC0QezRnOxbWw==4ce1HeX7Zra7Zf2d' } // API_KEY
    })
    return response.data
  } catch (error) {
    throw new Error('Error al obtener vehículos')
  }
}
