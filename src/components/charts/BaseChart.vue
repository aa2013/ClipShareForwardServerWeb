<template>
  <div :id="id" class="size-full"/>
</template>
<script setup lang="ts">
import {markRaw} from "vue";
import * as echarts from 'echarts';
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps<{
  id: string;
  options: echarts.EChartsOption;
}>();
const chart = ref<echarts.ECharts>();
const onResize = () => {
  chart.value?.resize();
}
onMounted(() => {
  chart.value = markRaw(echarts.init(document.getElementById(props.id)));
  window.addEventListener('resize', onResize);
  chart.value && chart.value.setOption(props.options);
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
watch([props], (oldV, newV) => {
  chart.value && chart.value.setOption(newV[0].options);
})
</script>
<style scoped>

</style>
