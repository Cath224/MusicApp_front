<template>
  <v-card v-if="store.getPlayerState && store.getSong" width="100vw" height="10vh" flat>
    <v-slider class="mt-1 mx-2" :model-value="store.getCurrentTime" :max="store.getSong?.duration" absolute hide-details
              hide-spin-buttons density="compact" @update:modelValue="updated"/>
    <v-row class="mt-2" align="center" justify="start">
      <v-col cols="auto">
        <v-btn v-if="!store.getSongState" icon="mdi-play" size="small" @click="store.playSongCurrent()"></v-btn>
        <v-btn v-else icon="mdi-stop" size="small" @click="store.stopSong()"></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn icon="mdi-skip-next-circle" size="small" @click="nextSong()"></v-btn>
      </v-col>
      <v-col cols="audto" align-self="center">
        <div class="text-subtitle-1">{{ store.getSong?.title }}</div>
      </v-col>
      <v-spacer/>
      <v-col cols="2">
        <v-slider :model-value="store.getVolume" :max="1" absolute hide-details hide-spin-buttons density="compact"
                  @update:modelValue="updatedVolume"/>
      </v-col>
      <v-col cols="auto">
        <v-btn :icon="liked ? 'mdi-heart' : 'mdi-heart-outline'" size="small" @click="like"></v-btn>
      </v-col>
      <v-col cols="1">
        <v-menu location="top">
          <template v-slot:activator="{ props }">
            <v-btn
                icon="mdi-format-list-bulleted-triangle"
                v-bind="props"
            />
          </template>
          <v-list v-if="getQueue()?.length">
            <v-list-item
                v-for="song of getQueue()" :key="song?.id" :text="song?.title"
            >
              <v-list-item-title>{{ song.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col class="my-0 py-0" cols="auto">
        <v-btn size="small" flat icon="mdi-close" @click="close"></v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>


<script setup>

import {useAppStore} from "@/store/app";
import likeRepository from "@/utils/repository/likeRepository";
import {onMounted, ref, watch} from "vue";
import eventBus from "@/utils/eventBusConfiguration";

const store = useAppStore()
const liked = ref(false)

async function close() {
  store.disablePlayer()
}


async function like() {
  if (liked.value === true) {
    likeRepository.unlike(store.getSong?.id).then(() => {
      eventBus.emit('songLikeChanged', false)
      getLike()
    })
  } else {
    likeRepository.like(store.getSong?.id).then(() => {
      eventBus.emit('songLikeChanged', true)
      getLike()
    })
  }
}



async function nextSong() {
  store.playNextSong()
}

async function getLike() {
  likeRepository.getBySongId(store.getSong?.id).then((response) => {
    liked.value = !!response.data?.songId
  })
}

async function updated(value) {
  store.changeCurrentTime(value)
}

async function updatedVolume(value) {
  store.changeVolume(value)
}

function getQueue() {
  return store.getCurrentPlaylist
}

watch(store.getSong, (value, oldValue) => {
  if (value && !oldValue) {
    getLike()
  }
})

onMounted(() => {
  getLike()
  eventBus.on('songLikeChanged', () => {
    getLike()
  })
})

</script>

<style scoped>

</style>
