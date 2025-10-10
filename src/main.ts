import { createApp } from 'vue'
import App from './App.vue'

// Importar Pinia y Vue Router
import { createPinia } from 'pinia'
import router from './router' 

import 'leaflet/dist/leaflet.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')