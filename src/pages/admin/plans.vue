<template>
  <div class="relative">
    <div v-if="plans" class="size-full">
      <v-row v-if="plans.length">
        <v-col v-for="(plan,i) in plans" :key="i" cols="12" sm="6" md="4" lg="4" xl="3">
          <Plan v-model="plans[i]" @onEditClick="()=>onEditBtnClick(plan)"/>
        </v-col>
      </v-row>
      <empty-content v-else/>
    </div>
    <div v-else>
      <v-row>
        <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="4" lg="4" xl="3">
          <Plan/>
        </v-col>
      </v-row>
    </div>
    <div class="fixed right-10 bottom-10 ga-2 flex flex-col">
      <v-fade-transition>
        <v-fab color="primary" icon="mdi-chevron-up"
               class="z-10" @click="scrollToTop"
               v-if="scrollTop>=300"
               style="width: 50px;height: 50px;"/>
      </v-fade-transition>
      <v-fab color="primary" icon="mdi-plus"
             class="z-10" @click="onAddFabClicked"
             style="width: 50px;height: 50px;"/>
    </div>
    <plan-dialog v-model="showDialog" :data="editData"/>
  </div>
</template>
<script setup lang="ts">

import Plan from "@/components/Plan.vue";
import {PlanType} from "@/types";
import {onMounted, onUnmounted, ref} from "vue";
import PlanDialog from "@/components/PlanDialog.vue";
import * as planReq from '@/network/details/plan'
import EmptyContent from "@/components/EmptyContent.vue";

const scrollTop = ref<number>(0)
const editData = ref<PlanType>()
const showDialog = ref<boolean>(false)
const plans = ref<PlanType[]>()
const scrollToTop = () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
}
const onWindowScroll = () => {
  scrollTop.value = window.scrollY || document.documentElement.scrollTop
}
onMounted(() => {
  window.addEventListener('scroll', onWindowScroll)
  planReq.getPlans().then(res => {
    setTimeout(() => plans.value = res, 350)
  })
})
onUnmounted(() => {
  window.removeEventListener("scroll", onWindowScroll);
});
const onAddFabClicked = () => {
  showDialog.value = true
  editData.value = undefined
}
const onEditBtnClick = (plan: PlanType) => {
  editData.value = plan
  showDialog.value = true
};
</script>
<style scoped>

</style>
