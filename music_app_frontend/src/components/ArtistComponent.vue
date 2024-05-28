<template>
  <v-sheet color="transparent">
    <v-card v-if="!!state.artist" color="transparent" height="80vh" flat>
      <v-row align="start" justify="start">
        <v-col cols="auto">
          <v-img v-if="state.logoSrc" class="ml-3 mt-2 " :src="state.logoSrc" height="20vh" width="20vh" rounded>
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
          <div class="mt-3 text-h3">{{ state.artist.title }}</div>
          <div class="ml-2 text-subtitle-1">{{ state.artist.shortDescription }}</div>
        </v-col>
      </v-row>

      <v-row class="ml-4 mt-2" align="start" justify="start">
        <v-col cols="12">
          <v-sheet color="transparent">
            <div class="text-subtitle-1">Top Songs:</div>
            <v-list v-if="!!state.topSongs?.length" class="mt-2" style="background: transparent" color="transparent"
                    base-color="transparent">
              <v-list-item v-for="song in state.topSongs" :key="song?.id" :value="song">
                <song-element-component class="mx-2" :song="song" />
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="ml-4 mt-2" align="start" justify="start">
        <v-col cols="4">
          <v-sheet color="transparent">
            <div class="text-h5">Albums:</div>
            <v-item-group v-if="!!state.albums?.length" class="mt-1">
              <v-row>
                <v-col v-for="item in  state.albums" :key="item.id" cols="4">
                  <v-item>
                    <v-card v-if="item?.fileId" height="20vh" width="20vh" :to="{name: 'album', params: {id: item.id}}" flat :image="getLogoUrl(item.fileId)" :title="item.title" >
                      <template v-slot:image>
                        <v-img :src="getLogoUrl(item.fileId)" height="20vh" width="20vh" rounded />
                      </template>
                    </v-card>
                    <v-card v-else height="20vh" width="20vh" flat :title="item.title" />
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row v-if="!!state.similar?.length" class="ml-4 mt-2" align="start" justify="start">
        <v-col cols="4">
          <v-sheet color="transparent">
            <div class="text-h5">Similar:</div>
            <v-item-group class="mt-1">
              <v-row>
                <v-col v-for="item in state.similar" :key="item.id" cols="4">
                  <v-item>
                    <v-card v-if="item?.fileId" height="20vh" width="20vh" :to="{name: 'artist', params: {id: item.id}}" flat :image="getLogoUrl(item.fileId)" :title="item.title" >
                      <template v-slot:image>
                        <v-img :src="getLogoUrl(item.fileId)" height="20vh" width="20vh" rounded />
                      </template>
                    </v-card>
                    <v-card v-else height="20vh" width="20vh" flat :title="item.title" />
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-sheet>

</template>

<script setup>
import artistRepository, {getLogoUrl} from "@/utils/repository/artistRepository";
import {computed,  onMounted, ref} from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {mdiGuitarAcoustic} from '@mdi/js';
import topSongRepository from "@/utils/repository/topSongRepository";
import albumRepository from "@/utils/repository/albumRepository";
import SongElementComponent from "@/components/SongElementComponent.vue";


const props = defineProps(["id"]);
const state = ref({artist: [], topSongs: [], logoSrc: null, albums: [], similar: []})

function loadArtist() {
  artistRepository.getById(props.id).then((response) => {
    state.value.artist = response.data;
    state.value.logoSrc = getLogoUrl(state.value.artist?.fileId)
  })
}

async function loadTopSongs() {
  topSongRepository.getByArtistsId(props.id).then(async (response) => {
    state.value.topSongs = response.data;

  })
}

async function loadAlbums() {
  albumRepository.get(`musicianId==${props.id}`).then(async (response) => {
    state.value.albums = response?.data.content
  })
}

async function loadSimilar() {
  artistRepository.getSimilarById(props.id).then(async (response) => {
    state.value.similar = response?.data
  })
}




const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})

onMounted(() => {
  loadArtist()
  loadTopSongs()
  loadAlbums()
  loadSimilar()
})

</script>


<style scoped>

</style>
