<template>
  <v-app theme="dark">
    <v-app-bar :elevation="2">

      <v-app-bar-title>
        <v-img width="5vw" height="5vh" src="./assets/Eum-Ag.svg"/>
      </v-app-bar-title>
      <v-row justify="start" align="center">
        <v-col v-if="!loginPage" cols="5">
          <v-text-field v-model="state.search" prepend-icon="mdi-magnify"
                        bg-color="white" hide-details hide-no-data hide-spin-buttons
                        density="comfortable" menu-icon="" placeholder="Поиск" clearable auto-select-first rounded
                        flat variant="solo" item-props @click:prepend="search" @keyup.enter="search"/>
        </v-col>
        <v-spacer/>
        <v-col v-if="!loginPage && store.getCurrentUser != null" cols="auto" class="mr-0 pr-0">

          <v-btn icon :to="{name: 'user'}">
            <v-avatar color="accent">
              <div>{{ store.getCurrentUser.name.slice(0, 1) }}</div>
              <v-tooltip
                  activator="parent"
                  location="bottom"
              >{{ store.getCurrentUser.name }}
              </v-tooltip>
            </v-avatar>
          </v-btn>

        </v-col>
        <v-col v-if="!loginPage && store.getCurrentUser != null" cols="auto" class="ml-0 pl-0">
          <v-btn class="mx-2" icon="mdi-logout" rounded @click="logout"></v-btn>
        </v-col>
      </v-row>


    </v-app-bar>
    <v-navigation-drawer
        v-if="!loginPage"
        permanent
        theme="dark"
    >
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" :to="{name: 'home'}"></v-list-item>
        <v-list-item v-if="isLoggedIn()" prepend-icon="mdi-playlist-music" title="Playlists"
                     :to="{name: 'playlists'}"></v-list-item>
        <v-list-item v-if="isLoggedIn()" prepend-icon="mdi-thumb-up" title="Likes" :to="{name: 'likes'}"></v-list-item>
        <v-list-item v-if="isLoggedIn()" prepend-icon="mdi-history" title="History"
                     :to="{name: 'history'}"></v-list-item>
        <v-list-item v-if="isAdmin()" prepend-icon="mdi-account-music" title="Artists Table"
                     :to="{name: 'admin-artist-table'}"></v-list-item>
        <v-list-item v-if="isAdmin()" prepend-icon="mdi-album" title="Albums Table"
                     :to="{name: 'admin-album-table'}"></v-list-item>
        <v-list-item v-if="isAdmin()" prepend-icon="mdi-music" title="Songs Table"
                     :to="{name: 'admin-song-table'}"></v-list-item>
        <v-list-item v-if="isAdmin()" prepend-icon="mdi-account" title="Users Table"
                     :to="{name: 'admin-user-table'}"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
      <v-snackbar
          :model-value="errorBar"
          timer="1000"
          color="red"
      >
        {{ errorBarText }}

        <template v-slot:actions>
          <v-btn
              color="black"
              variant="text"
              @click="errorBar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <v-footer v-if="store.getPlayerState" app elevation="5">

      <player-component :song="store.getSong"/>
    </v-footer>
  </v-app>
</template>

<script setup>

import PlayerComponent from "@/components/PlayerComponent.vue";
import {useAppStore} from "@/store/app";
import {reactive, computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {tokenProvider} from "@/utils/tokenProvider";
import eventBus from "@/utils/eventBusConfiguration";
import {userProvider} from "@/utils/userProvider";

const store = useAppStore()
const router = useRouter()
const state = reactive({search: null})
const errorBar = ref(false)
const errorBarText = ref("Error")

function search() {
  if (state.search?.length) {
    router.push({name: "search", params: {search: state.search}})
  }
}

function isLoggedIn() {
  return !!tokenProvider.getToken()
}

function logout() {
  tokenProvider.clearToken()
  userProvider.clearUser()
  store.clearUser()
  router.push({name: "auth"})
}

function loadCurrentUser() {
  store.loadUser()
}

async function isAdmin() {
  return store.getCurrentUser?.roles
      ?.filter((el) => el != null)
      .filter((el) => el.authorities?.map((el2) => el2.code).includes('ADMIN_AUTHORITY'))
}

const loginPage = computed(() => {
  return ['auth', 'register', 'welcome'].includes(router.currentRoute.value.name)
})

onMounted(() => {
  eventBus.on('error', (error) => {
    errorBar.value = true
    if (error.code === 403) {
      errorBarText.value = "Wrong Credentials"
    }
  })
  loadCurrentUser()
})
</script>
