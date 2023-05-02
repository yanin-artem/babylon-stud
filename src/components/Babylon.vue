<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="btn" val="action" label="Курсор" />
      <q-radio v-model="btn" val="position" label="Смещение" />
      <q-radio v-model="btn" val="rotation" label="Вращение" />
      <q-radio v-model="btn" val="scaling" label="Масштабирование" />
    </div>
  </div>
  <canvas style="width: 80%;height: 80%;" ref="canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
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
</style>
