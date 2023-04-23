<template>
  <q-btn @click="action = !action" label="Action"/>
  <canvas style="width: 80%;height: 80%;" ref="canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Scene from "src/babylon/Scene";

const canvas = ref();

const action = ref<boolean>(false);

onMounted(() => {
  const scene = new Scene(canvas.value);
  watch(action, () => {
    if (action.value)
      scene.Actions(true)
    else
      scene.Actions(false)
  })
})

</script>

<style lang="sass" scoped>
canvas
  width: 80%
  height: 80%
</style>
