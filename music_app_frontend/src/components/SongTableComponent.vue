<template>
  <v-sheet color="transparent">
    <v-card color="transparent" height="90vh" flat>
      <v-card-title>Song</v-card-title>
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
          <template v-slot:[`item.album`]="{item}">
            <div>{{ item.album?.title }}</div>
          </template>
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
              <v-card v-if="song" title="Edit">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field v-model="song.title" label="Title" tile flat/>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-file-input
                        v-model="song.file"
                        accept="image/jpg"
                        label="File"
                        show-size
                        placeholder="Pick an Song File"
                        prepend-icon="mdi-multimedia"
                        tile
                        flat
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="mode === 'create'" dense>
                    <v-col cols="12">
                      <v-autocomplete v-model="song.albumId" :items="albums" item-title="title" item-value="id"
                                      label="Album" tile flat/>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field v-model="song.sequenceNumber" type="number" label="Sequence Number" tile flat/>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea v-model="song.lyrics" label="Lyrics" tile flat/>
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
          <template v-slot:[`item.file-view`]="{item}">
            <v-dialog v-model="dialogPicture" height="60vh" width="50vw">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  icon="mdi-file-eye"
                  variant="plain"
                  size="small"
                  v-bind="activatorProps"
                ></v-btn>
              </template>
              <v-card v-if="dialogPicture" title="Picture" height="60vh" width="40vw">
                <v-card-text>
                  <v-row justify="center" align="center" class="fill-height">
                    <v-col align-self="center" cols="auto">
                      <song-element-component class="mx-2" :song="item" disable-like/>
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

import {ref, watch} from "vue";
import songRepository from "@/utils/repository/songRepository";
import SongElementComponent from "@/components/SongElementComponent.vue";
import albumRepository from "@/utils/repository/albumRepository";

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
    title: 'Album',
    align: 'start',
    sortable: false,
    key: 'album',
  },
  {
    title: 'Sequence Number',
    align: 'start',
    sortable: false,
    key: 'sequenceNumber',
  },
  {
    title: 'Duration',
    align: 'start',
    sortable: false,
    key: 'duration',
  },
  {
    title: 'File Id',
    align: 'start',
    sortable: false,
    key: 'fileId',
  },
  {
    title: 'lyrics',
    align: 'start',
    sortable: false,
    key: 'lyrics',
  },
  {
    title: 'Genres',
    align: 'start',
    sortable: false,
    key: 'genres',
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
    title: 'File View',
    align: 'start',
    sortable: true,
    key: 'file-view',
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
const song = ref(null)
const mode = ref('create')
const dialogPicture = ref(false)
const albums = ref([])


async function loadItems() {
  const trimmedSearch = search.value?.trim()
  songRepository.get(trimmedSearch != null && trimmedSearch.length > 0 ? `title=ilike='${trimmedSearch}'` : null, {
    limit: itemsPerPage.value,
    offset: itemsPerPage.value * (page.value - 1)
  }).then((response) => {
    items.value = response.data?.content
    totalItems.value = response.data?.meta?.totalElements
  })
}

async function initEdit(item) {
  mode.value = 'edit'
  song.value = Object.assign({}, item)
}

async function save() {
  if (mode.value === 'edit') {
    songRepository.patch(song.value, song.value.id).then(() => {
      if (song.value?.file) {
        songRepository.uploadFile(song.value.file, song.value.id).then(() => {
          loadItems()
          close()
        })
      } else {
        loadItems()
        close()
      }

    })
  } else if (mode.value === 'create') {
    songRepository.create(song.value).then((response) => {
      if (song.value?.file) {
        songRepository.uploadFile(song.value.file, response.data.id).then(() => {
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

async function deleteArtist(id) {
  songRepository.deleteById(id).then(() => {
    loadItems()
  })
}

async function close() {
  dialog.value = false
  song.value = null
}

async function initCreate() {
  dialog.value = true
  song.value = {}
  mode.value = 'create'
}

watch(dialog, (value) => {
  if (value) {
    albumRepository.getShort().then((response) => {
      albums.value = response.data
    })
  }
})
</script>


<style scoped>

</style>
