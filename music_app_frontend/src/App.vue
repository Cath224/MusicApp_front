<template>
  <v-app theme="dark">
    <v-app-bar :elevation="2">

      <v-app-bar-title>Music App</v-app-bar-title>
      <v-row justify="start" align="center">
        <v-col cols="5">
          <v-text-field prepend-inner-icon="mdi-magnify" bg-color="white" hide-details hide-no-data hide-spin-buttons
                          density="comfortable" menu-icon="" placeholder="Поиск" clearable auto-select-first rounded
                          flat variant="solo" item-props></v-text-field>
        </v-col>
      </v-row>


    </v-app-bar>
    <v-navigation-drawer
      permanent
      theme="dark"
    >
      <v-list nav>
        <v-list-item prepend-icon="mdi-email" title="Inbox" value="inbox"></v-list-item>
        <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Supervisors" value="supervisors"></v-list-item>
        <v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>
