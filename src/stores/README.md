Este proyecto es una aplicación web para gestionar un listado de vehículos, con funcionalidades de filtrado, ordenamiento, paginación y navegación a detalles. Construida con Vue 3 y Pinia para el estado reactivo, utiliza datos simulados para demostración (puede integrarse con una API real).

Requisitos previos:
Node.js (versión 18 o superior recomendada).
npm (o yarn/pnpm) para manejar dependencias.
Un editor de código como VS Code.

Cómo ejecutar el proyecto
1. Clonar y configurar el proyecto
Clona el repositorio:
bash

Run
Copy code
git clone <URL_DEL_REPOSITORIO>
cd gestor-vehiculos

Instala las dependencias:
bash

Run
Copy code
npm install

Dependencias clave:
vue: Framework principal (v3.4+).
pinia: Gestión de estado reactivo.
vite: Herramienta de build y dev server.
@vue/test-utils, vitest, jsdom: Para testing.
Otras: vue-router para navegación, @types/node para TypeScript.

2. Modo desarrollo
Ejecuta el servidor de desarrollo:
bash

Run
Copy code
npm run dev
Abre http://localhost:5173 (o el puerto indicado) en tu navegador.
La app cargará con datos simulados (4 vehículos). Puedes filtrar por marca (ej: "honda"), ordenar columnas, y navegar a detalles.

3. Ejecutar pruebas
Corre todas las pruebas unitarias:
bash

Run
Copy code
npm run test
Usa Vitest para probar el store (filtrado, ordenamiento).
Para modo interactivo (watch): npm run test -- --watch.
UI de pruebas: npm run test:ui.
Cobertura: npm run test:coverage.
Pruebas actuales: Cubren ordenamiento por 'make'/'year' y filtros por marca/año en tests/vehiclesStore.test.ts.

5. Estructura de archivos clave
src/: Código fuente.
components/: Componentes Vue (ej: VehicleList.vue, VehicleFilters.vue).
stores/: Pinia stores (ej: vehicles.ts para estado de vehículos).
views/: Vistas/rutas (ej: VehicleList.vue como página principal).
router/: Configuración de rutas.
tests/: Archivos de pruebas (ej: vehiclesStore.test.ts).
vite.config.ts: Configuración de Vite (incluye Vitest para testing).
package.json: Scripts y dependencias.
Notas adicionales
Datos simulados: La app usa 4 vehículos de ejemplo en stores/vehicles.ts. Para API real, cambia loadSimulatedVehicles() por loadVehicles() en VehicleList.vue.
Limpieza: Si hay issues con localStorage (filtros persistidos), ejecuta en consola del navegador: localStorage.removeItem('vehicleFilters').
TypeScript: El proyecto usa TS para tipado estricto; verifica errores con npm run type-check (si lo agregas en scripts).
Decisiones técnicas
Vue 3 con Composition API: Elegido por su reactividad moderna, mejor performance y soporte para TypeScript. Usamos <script setup> para simplicidad y legibilidad en componentes.
Pinia para state management: Reemplaza Vuex; es ligero, TypeScript-friendly y soporta devtools. El store vehicles maneja vehículos, filtros, ordenamiento y paginación de forma reactiva (usando ref y computed).
Vite como bundler: Rápido para desarrollo (HMR instantáneo) y build. Configurado con plugin Vue y alias @ para imports relativos a src/. Integra Vitest nativamente para testing sin configuración extra.
Vue Router: Para navegación SPA (ej: ruta /vehicles/:id para detalles). Simple y reactivo.
Vitest para testing: Basado en Vite, rápido y compatible con Vue Test Utils. Configurado con jsdom para simular DOM, globals (describe, it) y setup de Pinia. Pruebas cubren lógica crítica del store (filtrado/ordenamiento) sin mocks complejos.
TypeScript: Para tipado seguro (ej: interfaces implícitas en refs). Evita errores runtime en filtros y props.
CSS/SCSS: Estilos scoped en componentes para encapsulación. Grid/Flexbox para layout responsivo en filtros y tabla.
Simulación de datos: Usamos array estático para desarrollo rápido; coordenadas generadas para ubicaciones (futuro mapa). Ignora campos "premium" en filtros (ej: city_mpg como string).
Validación y UX: Filtros con validación de rangos (años/MPG) en store; errores mostrados en UI. Reactividad en tiempo real para strings, pero confirmación en botones para rangos.
Otras: No usamos Vuex (obsoleto); evité bibliotecas pesadas como Vuetify para mantenerlo ligero (~50KB gzipped).
Estas decisiones priorizan simplicidad, performance y mantenibilidad, ideal para un MVP escalable.

Posibles mejoras futuras
Autenticación y premium: Manejar campos "premium subscribers only" con login (ej: Firebase Auth).
Responsividad avanzada: Usar Tailwind CSS o Vuetify para mobile-first; agregar búsqueda en tiempo real con debounce.
Persistencia mejorada: Guardar estado en IndexedDB o Vuex Persist para offline.
Accesibilidad: Agregar ARIA labels en tabla/filtros y keyboard navigation.
Internacionalización: Soporte multi-idioma con vue-i18n (ej: labels en español/inglés).
Optimización: Lazy-loading de rutas, virtual scrolling para tablas grandes, y PWA para app móvil.