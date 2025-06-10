import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import JobDetail from '../views/JobDetail.vue'
import HomeView from '../views/HomeView.vue'
import MoreJobs from '../views/MoreJobs.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'job/:id',
          name: 'JobDetail',
          component: JobDetail
        },
        {
          path: 'more-jobs',
          name: 'MoreJobs',
          component: MoreJobs
        }
      ]
    }
  ],
})

export default router
