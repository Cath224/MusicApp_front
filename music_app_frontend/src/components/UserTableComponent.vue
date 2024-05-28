<template>
  <v-sheet color="transparent">
    <v-card color="transparent" height="80vh" flat>
      <v-card-title>Users</v-card-title>
      <v-card-text>
        <v-text-field v-model="search" placeholder="Search..." label="Search"/>
        <v-data-table-server v-model:items-per-page="itemsPerPage"
                             v-model:page="page"
                             :headers="headers"
                             :items="items"
                             :items-length="totalItems"
                             :loading="loading"
                             :search="search"
                             item-value="name"
                             @update:options="loadItems">
          <template v-slot:[`item.album`]="{item}">
            <div>{{ item.album?.title }}</div>
          </template>
          <template v-slot:[`item.roles`]="{item}">
            <div>{{retriveRoles(item)}}</div>
          </template>
          <template v-slot:[`item.links`]="{item}">
            <div>{{item?.links?.join(", ")}}</div>
          </template>
          <template v-slot:[`item.block-actions`]="{item}">
            <v-btn
              :icon="item.blocked === true ? 'mdi-account-badge' : 'mdi-account-cancel'"
              variant="plain"
              size="small"
              @click="changeUserBlockStatus(item.id, item.blocked)"
            ></v-btn>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup>

import {ref} from "vue";
import userRepository from "@/utils/repository/userRepository";

const headers = ref([
  {
    title: 'Id',
    align: 'start',
    sortable: false,
    key: 'id',
  },
  {
    title: 'Login',
    align: 'start',
    sortable: true,
    key: 'login',
  },
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  {
    title: 'Email',
    align: 'start',
    sortable: false,
    key: 'email',
  },
  {
    title: 'Links',
    align: 'start',
    sortable: false,
    key: 'links',
  },
  {
    title: 'Roles',
    align: 'start',
    sortable: false,
    key: 'roles',
  },
  {
    title: 'Blocked',
    align: 'start',
    sortable: false,
    key: 'blocked',
  },
  {
    title: 'Genres',
    align: 'start',
    sortable: false,
    key: 'genres',
  },
  {
    title: 'File Id',
    align: 'start',
    sortable: true,
    key: 'fileId',
  },
  {
    title: 'Created Timestamp',
    align: 'start',
    sortable: true,
    key: 'createdTimestamp',
  },
  {
    title: 'Updated Timestamp',
    align: 'start',
    sortable: true,
    key: 'updatedTimestamp',
  },
  {
    title: 'Block',
    align: 'start',
    sortable: true,
    key: 'block-actions',
  },
])
const itemsPerPage = ref(50)
const totalItems = ref(0)
const loading = ref(false)
const search = ref(null)
const items = ref([])
const page = ref(1)


async function loadItems() {
  const trimmedSearch = search.value?.trim()
  userRepository.get(trimmedSearch != null && trimmedSearch.length > 0 ? `name=ilike='${trimmedSearch}'` : null, {
    limit: itemsPerPage.value,
    offset: itemsPerPage.value * (page.value - 1)
  }).then((response) => {
    items.value = response.data?.content
    totalItems.value = response.data?.meta?.totalElements
  })
}


async function changeUserBlockStatus(id, current) {
  userRepository.patch({
    blocked: !current,
  }, id).then(() => {
    loadItems()
  })
}

function retriveRoles(item) {
  return item?.roles?.map((el) => el.title).join(", ")
}

</script>


<style scoped>

</style>
