<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, type TemplateRef, watchEffect} from "vue";
  import {useUserStore} from "@/stores/userStore.ts";

  interface FProps {
    id: string;
    positionX: number;
  }
  interface FructCoordinates {
    x: number;
    y: number;
  }

  const emit = defineEmits<{
    miss: []
  }>();
  const props = defineProps<FProps>()
  const model = defineModel<FructCoordinates>({
    required: true,
  })
  const coordinatesX = computed(() => {
    return props.positionX ?? 0
  });

  const userStore = useUserStore()
  const listFruct = [
    'apple-fu',
    'avocado-fu',
    'banana-fu',
    'gru-fu',
    'orange-fu',
  ]
  const randomIndex = Math.floor(Math.random() * listFruct.length)
  const randomSpeed = Math.random() * listFruct.length + 0.5
  let moveInterval: number | null = null

  const moveFruct = () => {
    if (!userStore.isPause && !userStore.isAutoCollecting) {
      if (model.value.y > window.innerHeight - 100) {
        emit('miss')
        if (moveInterval) clearInterval(moveInterval)
        return;
      }
      model.value.y += randomSpeed
    }
    if (userStore.isAutoCollecting && coordinatesX !== undefined) {
      if (model.value.x != coordinatesX.value) {
        model.value.x = coordinatesX.value
      }
      if (!(model.value.y > window.innerHeight - 100)) {
        model.value.y += 80
      }
    }
  }

  onMounted(() => {
    moveInterval = setInterval(moveFruct, 16)
  })
  onUnmounted( () => {
    if(!moveInterval) return
    clearInterval(moveInterval)
  } )

</script>

<template>
  <div :style="{'top': model.y + 'px', 'left': model.x + 'px'}" class="absolute transition duration-300">
    <img class="size-20" :src="'/antiFruti/'+listFruct[randomIndex] + '.png'">
  </div>
</template>

<style scoped>

</style>
