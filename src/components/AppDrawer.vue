<template>
  <v-navigation-drawer v-model="showDrawer">
    <div class="flex flex-1 h-[100%] flex-col pb-[4px] px-[8px]">
      <AppLogoTitle v-if="showAppLogoTitle" class="border-b-[1px]"/>
      <v-list density="compact" class="flex-1">
        <v-list-item nav :active="item.route===route.path"
                     v-for="(item, i) in items"
                     :key="i"
                     :value="item"
                     color="primary"
                     @click="router.push(item.route)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider opacity="1" class="my-[4px]"/>
      <v-card elevation="0" v-ripple>
        <template v-slot:title>
          <div class="flex justify-between ">
            <div class="flex align-center">
              <v-avatar color="primary">{{ local.username.substring(0, 1) }}</v-avatar>
              <div class="ml-[8px]">{{ local.username }}</div>
            </div>

            <v-menu>
              <template #activator="{ props }">
                <v-btn icon="mdi-logout" elevation="0" v-bind="props"/>
              </template>
              <div class="px-[16px] py-[8px] rounded-[8px] bg-[white] m-[8px]"
              :style="{boxShadow: '0 0px 20px #0000001a'}">
                <div class="mb-[8px] flex items-center">
                  <v-icon icon="mdi-information-outline" size="small" class="mr-1" color="orange"/>
                  是否确认退出登录？
                </div>
                <div class="flex justify-end">
                  <v-btn variant="text" class="mr-[4px]"
                         size="small">
                    取消
                  </v-btn>
                  <v-btn variant="text" @click="logout" color="primary"
                         size="small">
                    确认
                  </v-btn>
                </div>
              </div>
            </v-menu>
          </div>
        </template>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import AppLogoTitle from "@/components/AppLogo.vue";
import {defineModel} from 'vue';

import {useDisplay} from 'vuetify'
import {ref, watchEffect} from "vue";
import {local} from "@/utils/user";
import * as userReq from '@/network/details/user'
import router from "@/router";

const showDrawer = defineModel<boolean>()
const {mobile} = useDisplay()
const showAppLogoTitle = ref<boolean>(mobile.value)
import {useRoute} from 'vue-router'

const route = useRoute()
watchEffect(() => {
  showAppLogoTitle.value = mobile.value
})
const items = [
  {text: '连接信息', icon: 'mdi-connection', route: '/admin/connection'},
  {text: '配置修改', icon: 'mdi-cogs', route: '/admin/setting'},
  {text: '运行日志', icon: 'mdi-flag', route: '/admin/log'},
]
const logout = () => {
  userReq.logout().finally(() => {
    local.clearUser()
    router.push("/login")
  })
}
</script>
<style scoped>

</style>
