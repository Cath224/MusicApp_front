<template>
  <v-sheet color="transparent" height="90vh">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="auto">
        <v-card v-if="isLoginComputed" color="blue-grey-darken-4" width="20vw">
          <v-card-title>Sign In</v-card-title>
          <v-card-text>
            <v-text-field v-model="state.login" label="Login"></v-text-field>
            <v-text-field v-model="state.password" type="password" label="Password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="!state.login || !state.password" @click="login">Login</v-btn>
            <v-btn class="ml-2" @click="changeMode">Register</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else-if="isRegisterComputed" color="blue-grey-darken-4" width="20vw">
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-text-field v-model="state.login" label="Login"/>
            <v-text-field v-model="state.password" type="password" label="Password"/>
            <v-text-field v-model="state.name" label="Name"/>
            <v-text-field v-model="state.email" type="email" label="Email"/>
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="!state.login || !state.password || !state.name || !state.email" @click="register">
              Register
            </v-btn>
            <v-btn class="ml-2" @click="changeMode">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import {ref, computed} from "vue";
import authRepository from "@/utils/repository/authRepository";
import {tokenProvider} from "@/utils/tokenProvider";
import {useRouter} from "vue-router";
import {userProvider} from "@/utils/userProvider";

const state = ref({login: null, password: null, name: null, email: null})

const mode = ref("login")

const router = useRouter()

const isLoginComputed = computed(() => mode.value === "login")
const isRegisterComputed = computed(() => mode.value === "register")

function changeMode() {
  if (mode.value === "login") {
    mode.value = "register"
    return
  }
  if (mode.value === "register") {
    mode.value = "login"
  }
}

function login() {
  authRepository.login({
    login: state.value.login,
    password: state.value.password
  }).then((response) => {
    let tokenResponse = response.data
    tokenProvider.setToken(tokenResponse?.token)
    userProvider.setUser(state.value.login)
    router.push({name: 'home'})
  })
}

function register() {
  authRepository.register({
    login: state.value.login,
    password: state.value.password,
    name: state.value.name,
    email: state.value.email,
  }).then(() => {
    mode.value = "login"
  })
}

</script>
