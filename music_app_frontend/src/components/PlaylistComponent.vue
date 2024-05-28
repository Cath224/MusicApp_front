<template>
  <v-sheet color="transparent">
    <v-card v-if="!!playlist" color="transparent" height="80vh" flat>
      <v-row align="start" justify="start">
        <v-col cols="auto">
          <v-img v-if="props.fileId" class="ml-5 mt-2" height="18vh" width="18vh" rounded :src="logoSrc">
            <template v-slot:error>
              <v-row justify="center" align="center" class="fill-height">
                <v-col cols="2">
                  <svg-icon type="mdi" size="36" :path="errorIconPath"/>
                </v-col>
              </v-row>
            </template>
          </v-img>
          <svg-icon v-else type="mdi" size="256" :path="errorIconPath" />
        </v-col>
        <v-col cols="4">
          <v-row dense justify="start" align="center">
            <v-col cols="auto">
              <div class="mt-3 text-h3">{{ playlist.title }}</div>
            </v-col>
            <v-col cols="auto">
              <v-dialog v-model="dialog" max-height="40vh" max-width="30vw">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                      icon="mdi-pencil"
                      variant="plain"
                      size="small"
                      v-bind="activatorProps"
                  ></v-btn>
                </template>
                <v-card title="Edit">
                  <v-card-text>
                    <v-row dense>
                      <v-col cols="12">
                        <v-text-field v-model="playlist.title" label="Title" tile flat />
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="12">
                        <v-select v-model="songIds" :items="songsToSelect" item-title="title" item-value="id" multiple tile flat />
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="12">
                        <v-file-input
                            v-model="playlist.logoFile"
                            accept="image/jpg"
                            label="Logo"
                            show-size
                            placeholder="Pick an playlist logo"
                            prepend-icon="mdi-multimedia"
                            tile
                            flat
                        />
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="12">
                        <v-checkbox v-model="playlist.privatePlaylist" label="Private" tile flat />
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn variant="plain" text="Close" @click="closeAddSongs" />
                    <v-btn variant="tonal" text="Save" @click="addSongs" />
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row dense justify="start" align="center">
            <v-col cols="auto">
              <div v-if="playlist.privatePlaylist" class="mt-3 text-subtitle-2">Private</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="start" justify="start">
        <v-col cols="12">
          <v-sheet class="ml-5 mt-2" color="transparent">
            <v-row dense justify="start" align="center">
              <v-col cols="auto">
                <div class="text-subtitle-1">Songs:</div>
              </v-col>
            </v-row>
            <v-list v-if="playlist?.songs?.length" class="mt-2" style="background: transparent" color="transparent"
                    base-color="transparent">
              <v-list-item v-for="song in playlist.songs" :key="song?.id" :value="song">
                <song-element-component class="mx-2" :song="song" history-mode @delete="deleteSongFromPlayList(song?.id)"/>
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
import SongElementComponent from "@/components/SongElementComponent.vue";
import {computed, ref, onMounted, watch} from "vue";
import {mdiGuitarAcoustic} from "@mdi/js";
import {getLogoUrl} from "@/utils/repository/artistRepository";
import playlistRepository from "@/utils/repository/playlistRepository";
import historyRepository from "@/utils/repository/historyRepository";
import likeRepository from "@/utils/repository/likeRepository";

const playlist = ref(null)

const props = defineProps(["id"]);

const songIds = ref([])

const songsToSelect = ref([])

const dialog = ref(false)

const logoSrc = computed(() => {
  return getLogoUrl(playlist.value?.fileId);
});

const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})

async function loadPlaylist() {
  playlistRepository.getById(props.id).then((response) => {
    playlist.value = response.data
  })
}

async function closeAddSongs() {
  songIds.value = []
  dialog.value = false
}

async function addSongs() {
  playlistRepository.update({
    title: playlist.value.title,
    privatePlaylist: playlist.value.privatePlaylist,
    songIds: songIds.value
  }, props.id).then(() => {
    if (playlist.value.logoFile) {
      playlistRepository.uploadLogo(playlist.value.logoFile, props.id).then(() => {
        closeAddSongs()
        loadPlaylist()
      })
    } else {
      closeAddSongs()
      loadPlaylist()
    }
  })
}

async function loadSongsToSelect() {
  let historySongs = historyRepository.get(0, 1000)
  let likedSongs = likeRepository.get(0, 1000)
  Promise.all([historySongs, likedSongs]).then((responses) => {
    let songsHistory = responses[0].data.content
    let songsLiked = responses[1].data.content
    let songs = new Map()
    songsHistory.map((el) => el.song).forEach((el) => songs.set(el.id, el))
    songsLiked.map((el) => el.song).forEach((el) => songs.set(el.id, el))
    let ids = new Set()
    playlist.value.songs.map((el) => el.id).forEach((el) => ids.add(el))
    songsToSelect.value = [...songs.values()].filter((el) =>  !ids.has(el.id))
  })
}

async function deleteSongFromPlayList(value) {
  playlistRepository.deleteSongs([value], props.id).then(() => {
    loadPlaylist()
  })
}

watch(dialog, () => {
  if (dialog.value === true) {
    loadSongsToSelect()
  }
})

onMounted(() => {
  loadPlaylist()
})

</script>


<style scoped>

</style>
