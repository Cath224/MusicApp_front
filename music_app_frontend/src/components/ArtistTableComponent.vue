<template>
  <v-sheet color="transparent">
    <v-card color="transparent" height="80vh" flat>
      <v-card-title>Artists</v-card-title>
      <v-card-text>
        <v-row class="mb-2">
          <v-col cols="auto">
            <v-btn
              text="Create"
              @click="initCreate()"/>
          </v-col>
        </v-row>
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
          <template v-slot:[`item.edit-actions`]="{item}">
            <v-dialog v-model="dialog" max-height="60vh" max-width="30vw">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  icon="mdi-pencil"
                  variant="plain"
                  size="small"
                  v-bind="activatorProps"
                  @click="initEdit(item)"
                ></v-btn>
              </template>
              <v-card v-if="artist" title="Edit">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field v-model="artist.title" label="Title" tile flat/>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-file-input
                        v-model="artist.logoFile"
                        accept="image/jpg"
                        label="Logo"
                        show-size
                        placeholder="Pick an Artist logo"
                        prepend-icon="mdi-multimedia"
                        tile
                        flat
                      />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-combobox v-model="artist.links" label="Links" tile flat multiple/>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea v-model="artist.shortDescription" label="Short Description" tile flat/>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea v-model="artist.description" label="Description" tile flat/>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn variant="plain" text="Close" @click="close"/>
                  <v-btn variant="tonal" text="Save" @click="save"/>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:[`item.delete-actions`]="{item}">
            <v-btn
              icon="mdi-delete"
              variant="plain"
              size="small"
              @click="deleteArtist(item.id)"
            ></v-btn>
          </template>
          <template v-slot:[`item.logo-view`]="{item}">
            <v-dialog v-model="dialogPicture" height="60vh" width="50vw">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  icon="mdi-file-eye"
                  variant="plain"
                  size="small"
                  v-bind="activatorProps"
                ></v-btn>
              </template>
              <v-card title="Picture" height="60vh" width="40vw">
                <v-card-text>
                  <v-row justify="center" align="center" class="fill-height">
                    <v-col align-self="center" cols="auto">
                      <v-img v-if="item.fileId" :src="generateFileSrc(item.fileId)" height="40vh"
                             width="40vh" rounded>
                        <template v-slot:error>
                          <v-row justify="center" align="center" class="fill-height">
                            <v-col cols="2">
                              <svg-icon type="mdi" size="36" :path="errorIconPath"/>
                            </v-col>
                          </v-row>
                        </template>
                      </v-img>
                      <svg-icon v-else type="mdi" size="36" :path="errorIconPath"/>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup>

import {computed, ref} from "vue";
import artistRepository from "@/utils/repository/artistRepository";
import SvgIcon from "@jamescoyle/vue-icon";
import {mdiGuitarAcoustic} from '@mdi/js';

const headers = ref([
  {
    title: 'Id',
    align: 'start',
    sortable: false,
    key: 'id',
  },
  {
    title: 'Title',
    align: 'start',
    sortable: true,
    key: 'title',
  },
  {
    title: 'File Id',
    align: 'start',
    sortable: false,
    key: 'fileId',
  },
  {
    title: 'Description',
    align: 'start',
    sortable: false,
    key: 'description',
  },
  {
    title: 'Short Description',
    align: 'start',
    sortable: false,
    key: 'shortDescription',
  },
  {
    title: 'Short Description',
    align: 'start',
    sortable: false,
    key: 'shortDescription',
  },
  {
    title: 'Links',
    align: 'start',
    sortable: false,
    key: 'links',
  },
  {
    title: 'Country Code',
    align: 'start',
    sortable: true,
    key: 'countryCode',
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
    title: 'Created By',
    align: 'start',
    sortable: true,
    key: 'createdBy',
  },
  {
    title: 'Updated By',
    align: 'start',
    sortable: true,
    key: 'updatedBy',
  },
  {
    title: 'Logo View',
    align: 'start',
    sortable: true,
    key: 'logo-view',
  },
  {
    title: 'Edit Actions',
    align: 'start',
    sortable: true,
    key: 'edit-actions',
  },
  {
    title: 'Delete Actions',
    align: 'start',
    sortable: true,
    key: 'delete-actions',
  },
])
const itemsPerPage = ref(50)
const totalItems = ref(0)
const loading = ref(false)
const search = ref(null)
const items = ref([])
const page = ref(1)
const dialog = ref(false)
const artist = ref(null)
const mode = ref('create')
const dialogPicture = ref(false)

const errorIconPath = computed(() => {
  return mdiGuitarAcoustic;
})

async function loadItems() {
  const trimmedSearch = search.value?.trim()
  artistRepository.get(trimmedSearch != null && trimmedSearch.length > 0 ? `title=ilike='${trimmedSearch}'` : null, {
    limit: itemsPerPage.value,
    offset: itemsPerPage.value * (page.value - 1)
  }).then((response) => {
    items.value = response.data?.content
    totalItems.value = response.data?.meta?.totalElements
  })
}

async function initEdit(item) {
  mode.value = 'edit'
  artist.value = Object.assign({}, item)
}


async function save() {
  if (mode.value === 'edit') {
    artistRepository.patch(artist.value, artist.value.id).then(() => {
      if (artist.value?.logoFile) {
        artistRepository.uploadLogo(artist.value.logoFile, artist.value.id).then(() => {
          loadItems()
          close()
        })
      } else {
        loadItems()
        close()
      }

    })
  } else if (mode.value === 'create') {
    artistRepository.create(artist.value).then((response) => {
      if (artist.value?.logoFile) {
        artistRepository.uploadLogo(artist.value.logoFile, response.data.id).then(() => {
          loadItems()
          close()
        })
      } else {
        loadItems()
        close()
      }

    })
  }

}

function generateFileSrc(id) {
  return artistRepository.getLogoUrl(id)
}

async function deleteArtist(id) {
  artistRepository.deleteById(id).then(() => {
    loadItems()
  })
}

async function close() {
  dialog.value = false
  artist.value = null
}

async function initCreate() {
  dialog.value = true
  artist.value = {}
  mode.value = 'create'
}

</script>


<style scoped>

</style>
