<template>
  <v-sheet color="transparent">
    <v-row class="mt-4" justify="center" align="center">
      <v-col cols="6">
        <v-card class="my-4" color="transparent" height="30vh" flat>
          <v-card-title>Top 10 Songs</v-card-title>
          <v-card-text>
            <v-item-group>
              <v-row v-for="(item, index) in topSongs.slice(0, 5)" :key="item.id">
                <v-col cols="auto" class="mx-2">
                  <v-item>
                    <v-row class="mt-2" align="center">
                      <v-col class="my-0 py-0" cols="auto">
                        <div>{{ index + 1 }}.</div>
                      </v-col>
                      <v-col class="my-0 py-0" cols="auto">
                        <song-element-component disable-like image-mode :song="item"/>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
              </v-row>
              <v-row v-for="(item, index) in topSongs.slice(5, 10)" :key="item.id">
                <v-col cols="auto" class="mx-2">
                  <v-item>
                    <v-row class="mt-2" align="center">
                      <v-col class="my-0 py-0" cols="auto">
                        <div>{{ index + 5 }}.</div>
                      </v-col>
                      <v-col class="my-0 py-0" cols="auto">
                        <song-element-component disable-like image-mode :song="item"/>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-card-text>
        </v-card>
        <v-divider/>
        <v-card class="my-4" color="transparent" height="30vh" flat>
          <v-card-title>Newest Songs</v-card-title>
          <v-card-text>
            <v-item-group>
              <v-row v-for="(item, index) in newestSongs.slice(0, 5)" :key="item.id">
                <v-col cols="auto" class="mx-2">
                  <v-item>
                    <v-row class="mt-2" align="center">
                      <v-col class="my-0 py-0" cols="auto">
                        <div>{{ index + 1 }}.</div>
                      </v-col>
                      <v-col class="my-0 py-0" cols="auto">
                        <song-element-component disable-like image-mode :song="item"/>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
              </v-row>
              <v-row v-for="(item, index) in newestSongs.slice(5, 10)" :key="item.id">
                <v-col cols="auto" class="mx-2">
                  <v-item>
                    <v-row class="mt-2" align="center">
                      <v-col class="my-0 py-0" cols="auto">
                        <div>{{ index + 5 }}.</div>
                      </v-col>
                      <v-col class="my-0 py-0" cols="auto">
                        <song-element-component disable-like image-mode :song="item"/>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-card-text>
        </v-card>
        <v-divider/>
        <v-card class="my-4" color="transparent" height="50vh" flat>
          <v-card-title>Top 10 Artists</v-card-title>
          <v-card-text>
            <v-slide-group
              show-arrows
            >
              <v-slide-group-item v-for="item in topArtists" :key="item.id">
                <artists-list-element-component :id="item.id" :file-id="item.fileId" :title="item.title"/>
              </v-slide-group-item>
            </v-slide-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>


<script setup>


import topSongRepository from "@/utils/repository/topSongRepository";
import {ref, onMounted} from "vue";
import SongElementComponent from "@/components/SongElementComponent.vue";
import ArtistsListElementComponent from "@/components/ArtistsListElementComponent.vue";

const topSongs = ref([])
const newestSongs = ref([])
const topArtists = ref([])


async function loadTops() {
  topSongRepository.getTop10Songs().then((response) => {
    topSongs.value = response.data
  })
  topSongRepository.getNewestSongs().then((response) => {
    newestSongs.value = response.data
  })
  topSongRepository.getTop10Artists().then((response) => {
    topArtists.value = response.data
  })
}

onMounted(() => {
  loadTops()
})

</script>

<style scoped>

</style>
