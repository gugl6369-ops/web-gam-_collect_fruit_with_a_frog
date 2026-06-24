<script setup lang="ts">
  import {useRoute} from "vue-router";
  import {useUserStore} from "@/stores/userStore.ts";
  import {onMounted, onUnmounted} from "vue";

  const userStore = useUserStore()
  const position = useRoute();

  const handlePress = (e: KeyboardEvent) => {
   if (e.key === 'Escape'){
     userStore.setPause(!userStore.isPause)
   }
  }

  onMounted(() => {
   document.addEventListener('keydown', handlePress)
  })

  onUnmounted(() => {
   document.removeEventListener('keydown', handlePress)
  })
</script>
<template>
  <div class="h-screen overflow-hidden">
    <header class="relative">
      <div class="p-5">
        <button v-show="position.name === 'game'" class="p-5 rounded-2xl border-4 backdrop-blur-sm text-white text-3xl font-[taff] cursor-pointer" @click="userStore.setPause(!userStore.isPause)">Pause</button>
        <p  v-show="position.name === 'game'" class="text-3xl text-green-950 pl-7">{{ userStore.name ?? ' ' }}</p>
      </div>
    </header>
    <main class="h-full flex justify-center w-full items-center">
      <router-view/>
    </main>
  </div>
  <div id="modals"></div>
</template>

<style scoped>

</style>
