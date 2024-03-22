/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter } from 'vue-router'
import {createWebHashHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/artists',
    name: 'artists',
    component: () => import("@/views/ArtistsListView.vue")
  },
  {
    path: '/artists/:id',
    name: 'artist',
    props: true,
    component: () => import("@/views/ArtistView.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
