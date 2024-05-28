<template>
  <v-sheet color="transparent">
    <v-card color="transparent" height="80vh" flat>
      <v-row class="ma-4" align="center" justify="center">
        <v-col cols="2">
          <v-row justify="center" align="center">
            <v-col cols="12" align-self="center">
              <v-img :src="computedLogo" height="21vh" width="21vh" rounded>
                <template v-slot:error>
                  <v-avatar color="accent" size="256">
                    <div class="text-h1">{{ store.getCurrentUser.name.slice(0, 1) }}</div>
                  </v-avatar>
                </template>
              </v-img>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="12" align-self="center">
              <v-file-input v-model="avatarFile" label="Avatar File" flat tile/>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <v-row class="mt-2" align="center" justify="center">
            <v-col cols="6">
              <v-text-field v-model="user.name" label="Name" tile flat/>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="user.login" label="Login" tile flat disabled/>
            </v-col>
          </v-row>
          <v-row class="mt-2" align="center" justify="center">
            <v-col cols="6">
              <v-text-field v-model="user.email" label="Email" type="email" tile flat/>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="user.password" label="Password" type="password" tile flat/>
            </v-col>
          </v-row>
          <v-row align="center" justify="end">
            <v-col cols="auto">
              <v-btn @click="cancelChanges">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn @click="saveChanges">Save</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-sheet>
</template>


<script setup>

import {useAppStore} from "@/store/app";
import {ref, onMounted, watch, computed} from "vue";
import userRepository from "@/utils/repository/userRepository";

const store = useAppStore()

const user = ref({})
const avatarFile = ref(null)
const logoSrc = ref(null)

async function cancelChanges() {
  user.value = Object.assign({}, store.getCurrentUser)
}

async function saveChanges() {
  userRepository.patch(user.value, user.value.id).then(() => {
    if (avatarFile.value) {
      userRepository.uploadLogo(avatarFile.value, user.value.id).then(() => {
        store.loadUser()
        avatarFile.value = null
        userRepository.getCurrent().then((response) => {
          generateLogo(response.data?.fileId)
        })
      })
    } else {
      store.loadUser()
      generateLogo(user?.value?.fileId)
    }
  })
}

function generateLogo(fileId) {
  logoSrc.value = null
  if (!fileId) {
    return
  }
  logoSrc.value = userRepository.getLogoUrl(fileId)
}

const computedLogo = computed(() => {
  return logoSrc.value
})

watch(store.getCurrentUser, () => {
  user.value = Object.assign({}, store.getCurrentUser)
})


onMounted(() => {
  user.value = Object.assign({}, store.getCurrentUser)
  generateLogo(user?.value?.fileId)
})

</script>
