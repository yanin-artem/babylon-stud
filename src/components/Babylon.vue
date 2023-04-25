<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="btn" val="action" label="Курсор" />
      <q-radio v-model="btn" val="rectangle" label="Смещение" />
      <q-radio v-model="btn" val="ellipse" label="Вращение" />
      <q-radio v-model="btn" val="polygon" label="Масштабирование" />
    </div>
  </div>
  <canvas style="width: 80%;height: 80%;" ref="canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Scene from "src/babylon/Scene";

const canvas = ref();

const btn = ref<string>("action");

onMounted(() => {
  const scene = new Scene(canvas.value);
  scene.Actions(btn.value);

  watch(btn, () => {
    scene.Actions(btn.value)
  })
})

</script>

<style lang="sass" scoped>
canvas
  width: 80%
  height: 80%
</style>
