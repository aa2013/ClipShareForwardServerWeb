<template>
  <v-card class="pa-2 h-[100%] flex flex-col" flat>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-flag" class="mr-2" color="primary"/>
      运行日志

      <v-spacer/>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      />

    </v-card-title>
    <v-divider/>
    <div class="flex-1-0 overflow-auto h-0" ref="tableContainer">
      <v-data-table
        v-model="pageData.page"
        :items-per-page="pageData.itemsPerPage"
        width="100%"
        items-per-page-text="分页数量 "
        :headers="tableHeaders"
        :items="logs"
        no-data-text="暂无数据"
        :fixed-header="true"
        sticky
        :height="tableHeight||tableContainer?.offsetHeight"
        :search="search"
      >
        <template v-slot:item.level="{ item }">
          <v-chip
            :color="LogLevelColors[item.level as LogLevel]??'grey'"
            :text="item.level"
            class="text-uppercase"
            size="small"
            label
          />
        </template>
        <template v-slot:bottom>

        </template>
      </v-data-table>
    </div>
    <div class="flex flex-wrap justify-between items-center ga-4 pa-2">
      <div>
        共 {{ logs.length }} 条数据
      </div>
      <div class="flex flex-wrap items-center">
        <div class="w-[120px]">
          <v-select
            hide-details
            density="compact"
            label="分页数量"
            v-model="pageData.itemsPerPage"
            :items="pageData.pageItems"
            variant="outlined"
          />
        </div>
        <v-pagination
          show-first-last-page
          v-model="pageData.page"
          :length="pageCnt"
          class="w-[400px]"
        />

      </div>

    </div>
  </v-card>
</template>
<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import {Log, LogLevel} from "@/types";
import * as logReq from '@/network/details/log'

const LogLevelColors: Record<LogLevel, string> = {
  'info': 'primary',
  'warn': 'orange',
  'error': 'red',
}
const tableHeaders = [
  {
    title: '时间',
    align: 'start',
    key: 'time',
    minWidth: '200px'
  },
  {
    title: '日志级别',
    align: 'start',
    key: 'level',
    minWidth: '115px'
  },
  {
    title: '日志内容',
    align: 'start',
    key: 'content',
  },
] as any[]
const logs = ref<Log[]>([])
const pageData = ref({
  page: 1,
  pageItems: [10, 20, 50, 100,],
  itemsPerPage: 20
})
const pageCnt = computed(() => Math.ceil(logs.value.length / pageData.value.itemsPerPage))
const search = ref<string>()
let logTimer: number
const fetchLogs = () => {
  const logLen = logs.value.length
  const lastTime = logs.value[logLen - 1]?.time
  logReq.getLogs(lastTime).then(list => {
    logs.value.push(...list.map(item => {
      const logParts = item.log.split(' ')
      const level = logParts[0].replace(/[\[\]]/g, "")
      return {
        time: item.time,
        level: level,
        content: logParts.slice(3).join(' ')
      } as Log
    }))
  })
}
const tableContainer = ref<HTMLElement>()
const tableHeight = ref<number>()
const onWindowResize = () => {
  tableHeight.value = tableContainer.value?.offsetHeight
}
onMounted(() => {
  fetchLogs()
  logTimer = setInterval(fetchLogs, 1000)
  window.addEventListener('resize', onWindowResize)
})
onUnmounted(() => {
  clearInterval(logTimer)
  window.removeEventListener('resize', onWindowResize)
})
</script>
<style scoped>

</style>
