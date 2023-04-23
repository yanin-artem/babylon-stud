<template>
  <canvas style="width: 80%;height: 80%;" ref="canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Scene from "src/babylon/Scene";

const canvas = ref();

onMounted(() => {
  new Scene(canvas.value);
})

</script>

<style lang="sass" scoped>
canvas
  width: 80%
  height: 80%
</style>
