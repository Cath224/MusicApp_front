<template>
  <artist-component :id="props.id" />
</template>

<script setup>
import ArtistComponent from "@/components/ArtistComponent.vue";

const props = defineProps(["id"]);
</script>



<style scoped>

</style>
