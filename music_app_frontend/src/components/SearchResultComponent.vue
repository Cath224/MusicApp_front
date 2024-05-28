<template>
  <v-sheet color="transparent">
    <v-card color="transparent" height="80vh" flat>
      <v-tabs
          v-model="state.tab"
          class="mt-4 ml-4"
      >
        <v-tab :value="1">Artists</v-tab>
        <v-tab :value="2">Albums</v-tab>
        <v-tab :value="3">Songs</v-tab>
      </v-tabs>
      <v-window v-model="state.tab">
        <v-window-item
            :key="1"
            :value="1"
        >
          <v-container fluid>
            <v-list class="mt-2" style="background: transparent" color="transparent"
                    base-color="transparent">
              <v-list-item v-for="artist in state.artists" :key="artist?.id" :value="artist"
                           :to="{name: 'artist', params: {id: artist.id}}">
                <v-list-item-title class="text-white">{{ artist.title }}</v-list-item-title>
                <template v-slot:prepend>
                  <v-img v-if="artist?.fileId" class="mr-4" :src="artistRepository.getLogoUrl(artist.fileId)" height="5vh" width="5vh" rounded />
                </template>
              </v-list-item>
            </v-list>
          </v-container>
        </v-window-item>
        <v-window-item
            :key="2"
            :value="2"
        >
          <v-container fluid>
            <v-list class="mt-2" style="background: transparent" color="transparent"
                    lines="one"
                    base-color="transparent">
              <v-list-item v-for="album in state.albums" :key="album?.id" :value="album"
                           :to="{name: 'album', params: {id: album.id}}">
                <v-list-item-title class="text-white">{{ album.title }}</v-list-item-title>
                <template v-slot:prepend>
                  <v-img v-if="album?.fileId" class="mr-4" :src="albumRepository.getLogoUrl(album.fileId)" height="5vh" width="5vh" rounded />
                </template>
              </v-list-item>
            </v-list>
          </v-container>
        </v-window-item>
        <v-window-item
            :key="3"
            :value="3"
        >
          <v-container fluid>
            <v-list class="mt-2" style="background: transparent" color="transparent"
                    base-color="transparent">
              <v-list-item v-for="song in state.songs" :key="song?.id" :value="song">
                <song-element-component class="mx-2" :song="song" image-mode  />
              </v-list-item>
            </v-list>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-sheet>
</template>


<script setup>
import {computed, defineProps, onMounted, reactive, watch} from "vue"
import artistRepository from "@/utils/repository/artistRepository";
import albumRepository from "@/utils/repository/albumRepository";
import songRepository from "@/utils/repository/songRepository";
import SongElementComponent from "@/components/SongElementComponent.vue";

const props = defineProps(["search"])
const state = reactive({tab: 1, artists: [], albums: [], songs: []})

const searchComputed = computed(() => {
  console.log(props.search)
  return props.search
})

async function searchArtists() {
  artistRepository.get(`title=ilike='${props.search}'`).then(async (response) => {
    state.artists = response.data.content
  })
}

async function searchAlbums() {
  if (props.search) {
    albumRepository.get(`title=ilike='${props.search}',genres.title=in=('${props.search}')`).then(async (response) => {
      state.albums = response.data.content
    })
  }
}

async function searchSongs() {
  songRepository.get(`title=ilike='${props.search}'`).then(async (response) => {
    state.songs = response.data.content
    let albumIds = [...new Set(state.songs.filter((el) => !!el).map((el) => el.albumId))].join(",")
    if (albumIds?.length) {
      albumRepository.get(`id=in=(${albumIds})`).then(async (response) => {
        let albums = response.data.content
        let albumsByIds = new Map()
        albums.forEach((el) => {
          albumsByIds.set(el.id, el)
        })
        console.log(albumsByIds)
        state.songs.forEach((el) => {
          el.album = albumsByIds.get(el.albumId)
        })
      })
    }
  })
}

watch(searchComputed, () => {
  searchArtists()
  searchAlbums()
  searchSongs()
})

onMounted(() => {
  searchArtists()
  searchAlbums()
  searchSongs()
})
</script>


<style scoped>

</style>
