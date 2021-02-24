import { createWebHistory , createRouter } from 'vue-router'
import routes from './routes'

// Create router Instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Export router instance
export default router