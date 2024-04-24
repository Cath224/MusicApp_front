<template>
  <v-row v-if="props.song" justify="start" align="center">
    <v-col v-if="!!props.imageMode" cols="auto">
      <v-img v-if="state.albumLogoSrc" class="ma-0 pa-0 text-no-wrap"  :src="state.albumLogoSrc" width="4vw" height="4vh" max-width="4vw" max-height="4vh" rounded />
    </v-col>
    <v-col cols="auto">
      <v-btn v-if="!store.getSongState || props.song?.id !== store.getSong?.id" icon="mdi-play" size="small"  @click="store.playSong(props.song)"></v-btn>
      <v-btn v-else icon="mdi-stop" size="small" @click="store.stopSong()"></v-btn>
    </v-col>
    <v-col cols="auto">
      <div class="text-white">{{ props.song?.title }}</div>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-btn :icon="state.liked ? 'mdi-heart' : 'mdi-heart-outline'" size="small" @click="like"></v-btn>
    </v-col>
    <v-col v-if="historyMode" cols="auto">
      <v-btn icon="mdi-delete" size="small" @click="deleteFromHistory"></v-btn>
    </v-col>
  </v-row>
</template>


<script setup>
import {useAppStore} from "@/store/app";
import {defineProps, reactive, onMounted, watch} from "vue";
import likeRepository from "@/utils/repository/likeRepository";
import albumRepository from "@/utils/repository/albumRepository";
import historyRepository from "@/utils/repository/historyRepository";
import eventBus from "@/utils/eventBusConfiguration";


const store = useAppStore()
const props = defineProps({
  song: Object,
  imageMode: Boolean,
  historyMode: Boolean,
})
const emit = defineEmits(['delete'])

const state = reactive({liked: false, albumLogoSrc: null})

async function like() {
  if (state.liked === true) {
    likeRepository.unlike(props.song?.id).then(() => {
      eventBus.emit('songLikeChanged', true)
      getLike()
    })
  } else {
    likeRepository.like(props.song?.id).then(() => {
      eventBus.emit('songLikeChanged', true)
      getLike()
    })
  }
}


async function getLike() {
  if (props.song?.id) {
    likeRepository.getBySongId(props.song.id).then((response) => {
      state.liked = !!response.data?.songId
    })
  }
}

async function loadAlbumLogo() {
  if (props.song?.albumId) {
    albumRepository.getById(props.song.albumId).then((response) => {
      state.albumLogoSrc = albumRepository.getLogoUrl(response.data?.fileId)
    })
  }
}

async function deleteFromHistory() {
  if (!props.historyMode) {
    return
  }
  historyRepository.deleteBySongId(props.song?.id).then(() => {
    emit('delete')
  })
}

watch(props.song, () => {
  if (props.song?.id) {
    loadAlbumLogo()
    getLike()
  }
})

onMounted(() => {
  loadAlbumLogo()
  getLike()
  eventBus.on('songLikeChanged', () => {
    getLike()
  })
})
</script>


<style scoped>

</style>
