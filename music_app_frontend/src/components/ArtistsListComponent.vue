<template>
  <v-sheet color="transparent">
    <v-card  color="transparent" height="80vh" flat>
      <v-item-group>
        <v-row>
          <v-col v-for="item in state.items" :key="item.id" cols="auto">
            <v-item>
              <artists-list-element-component :id="item.id" :title="item.title" :file-id="item.fileId"/>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-card>
  </v-sheet>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import artistRepository from "@/utils/repository/artistRepository";
import ArtistsListElementComponent from "@/components/ArtistsListElementComponent.vue";

const state = reactive({items: []})


function loadArtists() {
  artistRepository.get().then((response) => {
    state.items = response.data.content;
  })
}

onMounted(() => {
  loadArtists()
})
</script>

<script>

export default {
  methods: {}
}
</script>


<style scoped>

</style>
