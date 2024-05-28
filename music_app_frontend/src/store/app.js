// Utilities
import {defineStore} from 'pinia'
import {generateQueue, getCurrentQueue, getSongUrl} from "@/utils/repository/playerRepository";
import userRepository from "@/utils/repository/userRepository";

export const useAppStore = defineStore('app', {
  state: () => ({
    playerEnabled: false,
    songPlaying: false,
    song: null,
    audio: null,
    currentTime: 0,
    volume: 0,
    user: null,
    currentPlaylist: [],
  }),
  getters: {
    getPlayerState(state) {
      return state.playerEnabled
    },
    getSong(state) {
      return state.song
    },
    getSongState(state) {
      return state.songPlaying
    },
    getCurrentTime(state) {
      return state.currentTime
    },
    getVolume(state) {
      return state.volume
    },
    getCurrentUser(state) {
      return state.user
    },
    getCurrentUserAuthorities(state) {
      return state.user?.roles?.flatMap((el) => el.authorities)
    },
    getCurrentPlaylist(state) {
      return state.currentPlaylist
    }
  },
  actions: {
    enablePlayer() {
      this.playerEnabled = true
    },
    disablePlayer() {
      this.playerEnabled = false
      this.audio.pause()
      this.songPlaying = false
      this.currentTime = 0
      this.song = null
      this.audio = null
      this.currentPlaylist = []
    },
    changeCurrentTime(changedTime) {
      this.audio.currentTime = changedTime
    },
    changeVolume(volume) {
      this.audio.volume = volume
    },
    playSong(song) {
      if (!this.audio || this.song?.id !== song.id) {
        if (this.audio && this.song?.id !== song.id) {
          this.audio.pause()
        }
        this.audio = new Audio(getSongUrl(song.id))
        this.audio.volume = 0.5
        this.song = song
      }
      this.songPlaying = true
      if (!this.playerEnabled) {
        this.enablePlayer()
      }
      this.audio.addEventListener("timeupdate", () => {
        if (this.audio && this.audio.currentTime) {
          this.currentTime = this.audio.currentTime
        }
      })

      this.audio.addEventListener("volumechange", () => {
        if (this.audio && this.audio.volume) {
          this.volume = this.audio.volume
        }
      })
      this.volume = this.audio.volume
      this.currentTime = this.audio.currentTime

      generateQueue(song.id).then(() => {
        getCurrentQueue().then((response) => {
          this.currentPlaylist = response.data
          this.audio.play()
          this.audio.addEventListener("ended", () => {
            this.playNextSong()
          })
        })
      })
    },
    playSongCurrent() {
      if (!this.audio) {
        this.audio = new Audio(getSongUrl(this.song?.id))
      }
      this.songPlaying = true
      if (!this.playerEnabled) {
        this.enablePlayer()
      }
      this.audio.addEventListener("timeupdate", () => {
        if (this.audio && this.audio.currentTime) {
          this.currentTime = this.audio.currentTime
        }
      })
      this.audio.play()
    },
    playNextSong() {
      getCurrentQueue().then((response) => {
        this.currentPlaylist = response.data
        this.playSong(this.currentPlaylist[1])
      })
    },
    stopSong() {
      this.audio.pause()
      this.songPlaying = false
    },

    loadUser() {
      userRepository.getCurrent().then((response) => {
        this.user = response.data
      })
    },
    setLoadedUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = null
    }
  }
})

