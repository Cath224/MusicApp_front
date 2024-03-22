<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <v-card flat :to="{name: 'artist', params: {id: props.id}}">
        <v-avatar class="ma-0" size="large" rounded >
          <v-img rounded :src="logoSrc">
            <template v-slot:error>
              <svg-icon type="mdi" size="36" :path="errorIconPath" />
            </template>
          </v-img>
        </v-avatar>
        <div class="text-subtitle-2">{{props.title}}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import {computed} from "vue";
import {getLogoUrl} from "@/utils/repository/artistRepository"
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGuitarAcoustic } from '@mdi/js';



const props = defineProps(["id", "title", "fileId"]);

const logoSrc = computed(() => {
  return getLogoUrl(props.fileId);
});

const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})
</script>

<script>

export default {
  methods: {

  }
}
</script>

<style scoped>

</style>
