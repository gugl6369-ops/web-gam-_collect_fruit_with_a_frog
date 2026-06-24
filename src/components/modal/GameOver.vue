<script setup lang="ts">
  import {useUserStore} from "@/stores/userStore.ts";
  import {onMounted} from "vue";
  import {formattedTime} from "@/utilities";

  const userStore = useUserStore()

  const emit = defineEmits<{
    'restart': []
  }>();
  const handleRestart = () => {
    userStore.clearUser()
    emit("restart")
  }

  onMounted(() => {
    userStore.setPause(true)
  })
</script>

<template>
  <teleport to="#modals">
    <section class="fixed inset-0 flex justify-center items-center z-10">
      <div class="fixed inset-0 bg-black/40"></div>
      <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40
              flex flex-col w-[90%] max-w-lg p-20 md:p-14
              justify-center items-center gap-4
              animate-[fadeIn_0.4s_ease-out]">
        <p class="text-5xl text-green-400 text-center">
          {{ userStore.time > 10 ? 'You lasted more than 10 seconds!' : ' You not lasted did`t more than 10 seconds!!(((' }}
        </p>
        <p class="text-5xl text-green-600">{{ formattedTime(userStore.time) }}</p>
        <p class="text-2xl text-green-600/50">catch: {{ userStore.score }}</p>
        <button
          class="relative inline-flex items-center gap-3 px-10 py-4 text-xl font-bold text-white bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-lg shadow-green-500/30 transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/50 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300/50 select-none"
          @click="handleRestart"
        >
          🐸 Restart
        </button>
      </div>
    </section>
  </teleport>
</template>

<style scoped>
  .frog-btn {
    animation: float 3s ease-in-out infinite, breathe 2.8s ease-in-out infinite 0.2s;
    will-change: transform, box-shadow;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes breathe {
    0%, 100% {
      box-shadow: 0 8px 32px rgba(34, 197, 94, 0.35), 0 0 0 0 rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    50% {
      box-shadow: 0 8px 40px rgba(34, 197, 94, 0.55), 0 0 60px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255,255,255,0.25);
    }
  }
</style>


