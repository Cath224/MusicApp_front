<template>
  <search-result-component v-if="props.search" :search="props.search"/>
</template>


<script setup>
import SearchResultComponent from "@/components/SearchResultComponent.vue";
import {defineProps} from "vue";

const props = defineProps(["search"])
</script>


<style scoped>

</style>
