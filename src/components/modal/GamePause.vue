<script setup lang="ts">
  import {useUserStore} from "@/stores/userStore.ts";

  const userStore = useUserStore()
</script>

<template>
  <teleport to="#modals">
    <section class="fixed inset-0 flex justify-center items-center z-2" @click="userStore.setPause(!userStore.isPause)">
      <div class="fixed inset-0 bg-black/70"></div>
      <img class="size-100" src="@/assets/img/pause.png" alt="Pause"/>
    </section>
  </teleport>
</template>
