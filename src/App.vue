<template>
  <router-view/>
  <global-dialog/>
  <global-snackbar/>
</template>

<script lang="ts" setup>
import GlobalDialog from "@/components/global/GlobalDialog.vue";
import GlobalSnackbar from "@/components/global/GlobalSnackbar.vue";
</script>
