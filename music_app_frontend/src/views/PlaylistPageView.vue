<template>
  <playlist-component :id="props.id" />
</template>


<script setup>
import PlaylistComponent from "@/components/PlaylistComponent.vue";

const props = defineProps(["id"])
</script>


<style scoped>

</style>
