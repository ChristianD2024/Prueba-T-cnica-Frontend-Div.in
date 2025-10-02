import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'          // Importa la nueva página
import VehicleDetail from '../components/VehicleDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  
  {
    path: '/vehicles/:id',
    name: 'VehicleDetail',
    component: VehicleDetail,
    props: true
  },

  {
    path: '/vehiculos',
    name: 'VehiculosView',
    component: () => import('../views/VehiculosView.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
