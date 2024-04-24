<template>
  <v-sheet color="transparent">
    <v-card v-if="!!state.artist" color="transparent" height="80vh" flat>
      <v-row align="start" justify="start">
        <v-col cols="2">
          <v-img class="ml-4 mt-2 " :src="logoSrc" height="20vh" width="20vh" rounded>
            <template v-slot:error>
              <v-row justify="center" align="center" class="fill-height">
                <v-col cols="2">
                  <svg-icon type="mdi" size="36" :path="errorIconPath"/>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col cols="4">
          <div class="mt-3 text-h3">{{ state.artist.title }}</div>
          <div class="ml-2 text-subtitle-1">{{ state.artist.shortDescription }}</div>
        </v-col>
      </v-row>
      <v-row class="ml-4 mt-2" align="start" justify="start">
        <v-col cols="4">
          <v-sheet color="transparent">
            <div class="text-h4">Top Songs:</div>
            <v-list color="transparent" lines="three"
                    base-color="transparent"
                    item-props
                    :items="state.topSongs"
                    item-title="title"
                    item-value="id">
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="ml-4 mt-2" align="start" justify="start">
        <v-col cols="4">
          <v-sheet color="transparent">
            <div class="text-h4">Albums: </div>
            <v-item-group>
              <v-row>
                <v-col v-for="item in state.items" :key="item.id" cols="4">
                  <v-item>

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
import {computed, onMounted, reactive} from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {mdiGuitarAcoustic} from '@mdi/js';
import topSongRepository from "@/utils/repository/topSongRepository";

const props = defineProps(["id"]);
const state = reactive({artist: [], topSongs: []})

function loadArtist() {
  artistRepository.getById(props.id).then((response) => {
    state.artist = response.data;
  })
}

function loadTopSongs() {
  topSongRepository.getByArtistsId(props.id).then((response) => {
    state.topSongs = response.data;
  })
}

const logoSrc = computed(() => {
  return getLogoUrl(state.artist.fileId);
});

const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})

onMounted(() => {
  loadArtist()
  loadTopSongs()
})

</script>


<style scoped>

</style>
