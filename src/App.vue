<template>
  <router-view/>
  <global-dialog/>
  <global-snackbar/>
</template>

<script lang="ts" setup>
import GlobalDialog from "@/components/global/GlobalDialog.vue";
import GlobalSnackbar from "@/components/global/GlobalSnackbar.vue";
import {useLocalTheme} from "@/stores/theme";
import {onMounted} from "vue";
const {applyTheme} = useLocalTheme()
onMounted(()=>{
  applyTheme()
})
</script>
