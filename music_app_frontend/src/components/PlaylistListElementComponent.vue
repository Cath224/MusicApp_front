<template>
  <v-card class="ma-2 pa-4" color="transparent" flat :to="{name: 'playlist', params: {id: props.id}}" >
    <v-avatar class="ma-0" size="256" rounded >
      <v-img rounded :src="logoSrc">
        <template v-slot:error>
          <svg-icon type="mdi" size="256" :path="errorIconPath" />
        </template>
      </v-img>
    </v-avatar>
    <div class="text-subtitle-2">{{props.title}}</div>
  </v-card>
</template>

<script setup>
import SvgIcon from "@jamescoyle/vue-icon";
import {computed} from "vue";
import {getLogoUrl} from "@/utils/repository/artistRepository";
import {mdiGuitarAcoustic} from "@mdi/js";

const props = defineProps(["id", "title", "fileId"]);

const logoSrc = computed(() => {
  return getLogoUrl(props.fileId);
});

const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})
</script>


<style scoped>

</style>
