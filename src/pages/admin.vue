<template>
  <v-app id="inspire">
    <AppDrawer v-model="drawer" v-if="mobile"/>
    <v-app-bar elevation="0" class="border-b">
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="mobile"/>
      <v-app-bar-title>
        <AppLogoTitle/>
      </v-app-bar-title>
      <v-btn flat icon="mdi-github"/>
      <v-btn flat icon="mdi-brightness-auto" color="primary"/>
    </v-app-bar>
    <AppDrawer v-model="drawer" v-if="!mobile"/>
    <v-main>
      <v-container class="flex flex-col h-full">
        <router-view class="flex-1"/>
        <Footer/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppDrawer from "@/components/AppDrawer.vue";
import AppLogoTitle from "@/components/AppLogo.vue";
import {useDisplay} from 'vuetify'
import {ref, watchEffect} from "vue";
import Footer from "@/components/Footer.vue";

const {mobile} = useDisplay()
const drawer = ref<boolean>(!mobile.value)
watchEffect(() => {
  drawer.value = !mobile.value
})
</script>
