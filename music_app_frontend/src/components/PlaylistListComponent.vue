<template>
  <v-sheet color="transparent">
    <v-row class="ml-4 mt-2" dense>
      <v-col cols="auto">
        <div class="text-h4">Playlists</div>
      </v-col>
      <v-col cols="auto">
        <v-dialog v-model="dialog" max-height="40vh" max-width="30vw">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                icon="mdi-plus-box"
                variant="plain"
                size="small"
                v-bind="activatorProps"
            ></v-btn>
          </template>
          <v-card title="Create Playlist">
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field v-model="playlist.title" label="Title" tile flat />
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
              <v-btn variant="plain" text="Close" @click="closePlaylist" />
              <v-btn variant="tonal" text="Create" @click="createPlaylist" />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-card  color="transparent" height="80vh" flat>
      <v-item-group>
        <v-row>
          <v-col v-for="item in items" :key="item.id" cols="auto">
            <v-item>
              <playlist-list-element-component :id="item.id" :title="item.title" :file-id="item.fileId"/>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-card>

  </v-sheet>
</template>

<script setup>
import PlaylistListElementComponent from "@/components/PlaylistListElementComponent.vue";
import {onMounted, ref} from "vue";
import playlistRepository from "@/utils/repository/playlistRepository";

const items = ref([])
const dialog = ref(false)
const playlist = ref({})

async function loadPlaylists() {
  playlistRepository.get().then((response) => {
    items.value = response.data.content;
  })
}

async function closePlaylist() {
  playlist.value = {}
  dialog.value = false
}

async function createPlaylist() {
  playlistRepository.create({
    title: playlist.value.title,
    privatePlaylist: playlist.value.privatePlaylist
  }).then((response) => {
    if (playlist.value.logoFile) {
      playlistRepository.uploadLogo(playlist.value.logoFile, response.data.id).then(() => {
        dialog.value = false
        playlist.value = {}
        loadPlaylists()
      })
    } else {
      dialog.value = false
      playlist.value = {}
      loadPlaylists()
    }
  })
}

onMounted(() => {
  loadPlaylists()
})
</script>


<style scoped>

</style>
