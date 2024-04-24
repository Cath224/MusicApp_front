<template>
  <v-sheet color="transparent">
    <v-card  color="transparent" height="80vh" flat>
      <div class="ml-4 mt-2 text-h5">History:</div>
      <v-list class="ml-4 mt-2" style="background: transparent" color="transparent"
              base-color="transparent">
        <v-list-item v-for="song in songs" :key="song?.id" :value="song">
          <song-element-component :song="song" image-mode history-mode @delete="reloadHistory" />
        </v-list-item>
      </v-list>
    </v-card>
  </v-sheet>
</template>


<script setup>
import {ref, onMounted} from "vue";
import historyRepository from "@/utils/repository/historyRepository";
import SongElementComponent from "@/components/SongElementComponent.vue";


const songs = ref([])

async function loadHistory() {
  historyRepository.get(0, 1000).then((response) => {
    const pageableResponse = response.data
    if (pageableResponse?.content?.length) {
      songs.value = pageableResponse.content.map((el) => el.song).filter((el) => !!el)
    }
  })
}

async function reloadHistory() {
  historyRepository.get(0, 1000).then((response) => {
    const pageableResponse = response.data
    if (pageableResponse?.content?.length) {
      songs.value = pageableResponse.content.map((el) => el.song).filter((el) => !!el)
    }
  })
}

onMounted(() => {
  loadHistory()
})
</script>
