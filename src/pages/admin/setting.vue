<template>
  <div>
    <v-card :color="!isSameLoginSettings?'primary':undefined"
            variant="tonal"
            class="mx-auto border"
    >
      <v-card-title>
        <v-icon icon="mdi-account-key" class="mr-2"/>
        <span class="font-weight-black">
          登录
        </span>
      </v-card-title>
      <v-divider opacity="1"/>

      <v-card-text class="pt-4">
        <v-skeleton-loader
          :loading="!loginSettings"
          type="list-item-two-line,button"
        >
          <v-form class="size-full"
                  v-model="formValid.loginSettings"
                  @submit.prevent="()=>updateConfig(loginSettings,'loginSettings')">

            <v-text-field
              label="登录超时时间（秒）"
              prepend-icon="mdi-clock-time-eight-outline"
              variant="underlined"
              type="number"
              v-model.number="loginSettings!.loginExpiredSeconds"
              :rules="[
              value=>!!value||'Required.',
              value=>value>=0||'Cannot be negative.',
              value=>/^\d+$/.test(value)||'Cannot be decimal.'
            ]"
            />
            <v-btn type="submit" :color="isSameLoginSettings?'grey':'primary'" variant="flat"
                   :disabled="isSameLoginSettings" :loading="submitLoading.loginSettings"
                   prepend-icon="mdi-content-save" class="my-2">
              保存
            </v-btn>

          </v-form>
        </v-skeleton-loader>
      </v-card-text>
    </v-card>
    <v-card :color="!isSameFileTransferLimit?'primary':undefined"
            variant="tonal"
            class="mx-auto border my-5"
    >
      <v-card-title>
        <v-icon icon="mdi-file-arrow-left-right-outline" class="mr-2"/>
        <span class="font-weight-black">
          文件传输限制
        </span>
      </v-card-title>
      <v-divider opacity="1"/>
      <v-card-text class="pt-4">
        <v-skeleton-loader
          :loading="!fileTransferLimit"
          type="text,list-item-two-line,button"
        >
          <v-form class="size-full"
                  v-model="formValid.fileTransferLimit"
                  @submit.prevent="()=>updateConfig(fileTransferLimit,'fileTransferLimit')">
            <v-switch color="primary" hide-details inset
                      v-model="fileTransferLimit!.fileTransferEnabled">
              <template #prepend>
                <v-icon icon="mdi-car-speed-limiter" class="mr-4"/>
                启用速率限制
              </template>
            </v-switch>
            <v-text-field
              v-model.number="fileTransferLimit!.fileTransferRateLimit"
              label="速率限制（KB/s）"
              prepend-icon="mdi-speedometer"
              variant="underlined"
              type="number"
              :rules="[
              value=>!!value||'Required.',
              value=>value>=0||'Cannot be negative.',
              value=>/^\d+$/.test(value)||'Cannot be decimal.'
            ]"
            />
            <v-btn type="submit" :color="isSameFileTransferLimit?'grey':'primary'" variant="flat"
                   :disabled="isSameFileTransferLimit" :loading="submitLoading.fileTransferLimit"
                   prepend-icon="mdi-content-save" class="my-2">
              保存
            </v-btn>

          </v-form>
        </v-skeleton-loader>
      </v-card-text>
    </v-card>
    <v-card :color="!isSameUnlimitedDevices?'primary':undefined"
            variant="tonal"
            class="mx-auto border"
    >
      <v-card-title>
        <v-icon icon="mdi-cellphone-link" class="mr-2"/>
        <span class="font-weight-black">
          白名单设备
        </span>
      </v-card-title>
      <v-divider opacity="1"/>

      <v-card-text class="pt-4">
        <v-skeleton-loader
          :loading="!unlimitedDevices"
          type="paragraph,paragraph,button"
        >
          <v-form class="size-full"
                  v-model="formValid.unlimitedDevices"
                  @submit.prevent="()=>updateConfig({unlimitedDevices},'unlimitedDevices')">
            <v-list>
              <v-list-item v-for="(device,i) in unlimitedDevices" :key="i">
                <div>
                  <v-chip class="my-4 flex items-center" label color="primary">
                    <v-icon icon="mdi-music-accidental-sharp"/>
                    Device {{ i + 1 }}
                  </v-chip>
                  <v-btn size="small"
                         class="ml-2" color="#ff4081"
                         variant="tonal"
                         @click="()=>onDeleteUnlimitedDevice(i)"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </div>
                <v-text-field
                  v-model="device.id"
                  label="设备id"
                  prepend-icon="mdi-identifier"
                  variant="underlined"
                  :rules="[
                    value=>!!value||'Required.',
                    value=>{
                      if(unlimitedDevices!.some((item,idx)=>item.id === value && idx !== i)){
                        return 'The device ID already exists'
                      }
                      return true
                    }
                  ]"
                />
                <v-text-field
                  v-model="device.name"
                  label="设备名称"
                  prepend-icon="mdi-label-outline"
                  variant="underlined"
                  :rules="[
                    value=>!!value||'Required.',
                  ]"
                />
                <v-text-field
                  v-model="device.desc"
                  label="设备描述"
                  prepend-icon="mdi-information-outline"
                  variant="underlined"
                />
              </v-list-item>
              <v-btn variant="text" color="primary" prepend-icon="mdi-plus"
                     @click="unlimitedDevices?.push({} as UnlimitedDevice)">
                添加设备
              </v-btn>
            </v-list>
            <v-btn type="submit" :color="isSameUnlimitedDevices?'grey':'primary'" variant="flat"
                   :disabled="isSameUnlimitedDevices" :loading="submitLoading.unlimitedDevices"
                   prepend-icon="mdi-content-save" class="my-2">
              保存
            </v-btn>

          </v-form>
        </v-skeleton-loader>
      </v-card-text>
    </v-card>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import colors from 'vuetify/lib/util/colors'
import {computed, onMounted, ref} from "vue";
import {FileTransferLimit, LoginSettings, SysConfig, UnlimitedDevice} from "@/types";
import * as configReq from "@/network/details/config";
import {useGlobalDialog} from "@/stores/dialog";
import {useGlobalSnackbar} from "@/stores/snackbar";

const {showGlobalDialog} = useGlobalDialog()
const {showSnackbar} = useGlobalSnackbar()
const loginSettings = ref<LoginSettings>()
const fileTransferLimit = ref<FileTransferLimit>()
const unlimitedDevices = ref<UnlimitedDevice[]>()
const originConfig = ref<SysConfig>()
const formValid = ref({
  loginSettings: false,
  fileTransferLimit: false,
  unlimitedDevices: false,
})
const submitLoading = ref({
  loginSettings: false,
  fileTransferLimit: false,
  unlimitedDevices: false,
})
const isSameLoginSettings = computed(() => {
  if (!loginSettings.value) return true
  const originData = {
    loginExpiredSeconds: originConfig.value?.loginExpiredSeconds
  }
  return JSON.stringify(loginSettings.value) === JSON.stringify(originData)
})
const isSameFileTransferLimit = computed(() => {
  if (!fileTransferLimit.value) return true
  const originData = {
    fileTransferEnabled: originConfig.value?.fileTransferEnabled,
    fileTransferRateLimit: originConfig.value?.fileTransferRateLimit,
  }
  return JSON.stringify(fileTransferLimit.value) === JSON.stringify(originData)
})
const isSameUnlimitedDevices = computed(() => {
  if (!fileTransferLimit.value) return true
  const originData = originConfig.value?.unlimitedDevices ?? []
  return JSON.stringify(unlimitedDevices.value) === JSON.stringify(originData)
})
const loadConfigs = () => {
  configReq.getConfigs().then(configs => {
    originConfig.value = configs
    fileTransferLimit.value = {
      fileTransferEnabled: configs.fileTransferEnabled,
      fileTransferRateLimit: configs.fileTransferRateLimit,
    }

    loginSettings.value = {
      loginExpiredSeconds: configs.loginExpiredSeconds
    }
    unlimitedDevices.value = JSON.parse(JSON.stringify(configs.unlimitedDevices ?? []))
  })
}
const updateConfig = (config: any, group: string) => {
  const isValid = formValid.value[group]
  if (!isValid) {
    return
  }
  submitLoading.value[group] = true
  configReq.updateConfig(config).then(res => {
    showSnackbar({
      text: `更新${res ? '成功' : '失败'}`,
    }, !res)
    if (res) {
      Object.assign(originConfig.value!, config)
      originConfig.value = JSON.parse(JSON.stringify(originConfig.value!))
      return
    }
  }).finally(() => {
    submitLoading.value[group] = false
  })
}
onMounted(() => {
  setTimeout(loadConfigs, 500)
})
const onDeleteUnlimitedDevice = (idx: number) => {
  const device = unlimitedDevices.value![idx]
  if (device.name !== "" && !device.name && device.id !== "" && !device.id) {
    unlimitedDevices.value = unlimitedDevices.value!.filter((_, i) => i !== idx)
    return
  }
  showGlobalDialog({
    persistent: true,
    title: "提示",
    msg: `是否删除该白名单设备: ${device.name ?? '<unknown>'}（${device.id ?? '<unknown>'}）？`,
    showCancelBtn: true,
    onOk() {
      unlimitedDevices.value = unlimitedDevices.value!.filter((_, i) => i !== idx)
    },
  })
}
</script>
<style scoped>

</style>
