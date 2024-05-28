/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter} from 'vue-router'
import {createWebHashHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import {tokenProvider} from "@/utils/tokenProvider";
import {useAppStore} from "@/store/app";
import userRepository from "@/utils/repository/userRepository";

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
  },
  {
    path: '/albums/:id',
    name: 'album',
    props: true,
    component: () => import("@/views/AlbumView.vue")
  },
  {
    path: '/search/:search',
    name: 'search',
    props: true,
    component: () => import("@/views/SearchView.vue")
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import("@/views/AuthView.vue")
  },
  {
    path: '/history',
    name: 'history',
    component: () => import("@/views/HistoryView.vue")
  },
  {
    path: '/likes',
    name: 'likes',
    component: () => import("@/views/LikeView.vue")
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import("@/views/PlaylistView.vue")
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    props: true,
    component: () => import("@/views/PlaylistPageView.vue")
  },
  {
    path: '/user',
    name: 'user',
    props: true,
    component: () => import("@/views/UserView.vue")
  },
  {
    path: '/admin/song-table',
    name: 'admin-song-table',
    props: true,
    component: async () => import("@/views/SongTableView.vue")
  },
  {
    path: '/admin/artist-table',
    name: 'admin-artist-table',
    props: true,
    component: async () => import("@/views/ArtistTableView.vue")
  },
  {
    path: '/admin/album-table',
    name: 'admin-album-table',
    props: true,
    component: async () => import("@/views/AlbumTableView.vue")
  },
  {
    path: '/admin/user-table',
    name: 'admin-user-table',
    props: true,
    component: async () => import("@/views/UserTableView.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})


router.beforeEach(async (to) => {
  const token = tokenProvider.getToken()
  if (token) {
    if (['auth', 'register'].includes(to.name)) {
      return false
    }
    if (to.name?.startsWith('admin-')) {
      let user = useAppStore().getCurrentUser
      if (!user) {
        const response = await userRepository.getCurrent()
        user = response.data
        useAppStore().setLoadedUser(user)
      }
      return user?.roles?.flatMap((el) => el.authorities).map((el) => el.code)?.includes('ADMIN_AUTHORITY');
    }
  } else if (!['auth', 'register', 'home'].includes(to.name)) {
    return {name: 'auth'}
  }
})
export default router
