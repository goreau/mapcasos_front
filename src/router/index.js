import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/general/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/home',
    name: 'start',
    component: HomeView
  },
  {
    path: '/casos/:tipo',
    name: 'casos',
    component: () => import( '../views/casos/FilterCasosView.vue'),
    force: true,
  },
  {
    path: '/filtrorelat',
    name: 'filtrorelat',
    component: () => import( '../views/relat/FilterRelatView.vue'),
  },
  {
    path: '/editcaso',
    name: 'editcaso',
    component: () => import( '../views/casos/EditView.vue'),
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import( '../views/general/PreferencesView.vue'),
  },
  {
    path: '/convencoes',
    name: 'convencoes',
    component: () => import( '../views/general/ConventionsView.vue'),
  },
  {
    path: '/mapa',
    name: 'mapa',
    props: {
      arrData: Array,
    },
    component: () => import( '../views/casos/CasosView.vue'),
  },
  {
    path: '/relat',
    name: 'relat',
    props: {
      arrData: Array,
    },
    component: () => import( '../views/relat/ReportView.vue'),
  },
  {
    path: '/diagrama',
    name: 'diagrama',
    component: () => import( '../views/charts/DiagramaView.vue'),
  },
  {
    path: '/histograma',
    name: 'histograma',
    component: () => import( '../views/charts/HistogramaView.vue'),
  },
  {
    path: '/importa',
    name: 'importa',
    component: () => import( '../views/sinan/ImportaView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
