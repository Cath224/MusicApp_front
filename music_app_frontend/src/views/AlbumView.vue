<template>
  <album-component :id="props.id" />
</template>


<script setup>
import AlbumComponent from "@/components/AlbumComponent.vue";

const props = defineProps(["id"])
</script>

<style scoped>

</style>
