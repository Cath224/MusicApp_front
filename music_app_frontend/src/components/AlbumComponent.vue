<template>
  <v-sheet color="transparent">
    <v-card v-if="!!state.album" color="transparent" height="80vh" flat>
      <v-row align="start" justify="start">
        <v-col cols="auto">
          <v-img v-if="state.logoSrc" class="ml-5 mt-2 " :src="state.logoSrc" height="18vh" width="18vh" rounded>
            <template v-slot:error>
              <v-row justify="center" align="center" class="fill-height">
                <v-col cols="2">
                  <svg-icon type="mdi" size="36" :path="errorIconPath"/>
                </v-col>
              </v-row>
            </template>
          </v-img>
          <svg-icon v-else type="mdi" size="36" :path="errorIconPath"/>
        </v-col>
        <v-col cols="4">
          <div class="mt-3 text-h3">{{ state.album.title }}</div>
          <div class="text-subtitle-1">Genres: {{ state.album.genres.join(", ") }}</div>
          <div class="mt-2 text-subtitle-2">{{ state.album.shortDescription }}</div>
        </v-col>
      </v-row>
      <v-row align="start" justify="start">
        <v-col cols="12">
          <v-sheet class="ml-5 mt-2" color="transparent">
            <div class="text-subtitle-1">Songs:</div>
            <v-list class="mt-2" style="background: transparent" color="transparent"
                    base-color="transparent">
              <v-list-item v-for="song in state.songs" :key="song?.id" :value="song">
                <song-element-component class="mx-2" :song="song" />
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-sheet>
</template>

<script setup>


import SvgIcon from "@jamescoyle/vue-icon";
import {reactive, defineProps, onMounted, computed} from "vue";
import albumRepository from "@/utils/repository/albumRepository";
import songRepository from "@/utils/repository/songRepository";
import {mdiGuitarAcoustic} from '@mdi/js';
import SongElementComponent from "@/components/SongElementComponent.vue";


const props = defineProps(["id"])
const state = reactive({album: null, logoSrc: null, songs: []});

async function loadAlbum() {
  albumRepository.getById(props.id).then(async (response) => {
    state.album = response.data
    state.logoSrc = albumRepository.getLogoUrl(state.album.fileId)
  })
}

async function loadSongs() {
  songRepository.get(`albumId==${props.id}`).then(async (response) => {
    state.songs = response.data.content
  })
}

const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})

onMounted(() => {
  loadAlbum()
  loadSongs()
})

</script>


<style scoped>

</style>
