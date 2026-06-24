<script setup lang="ts">
import {
  onMounted,
  ref,
  useTemplateRef,
  onUnmounted, watchEffect, computed,
} from "vue";
  import FrutiIcon from "@/components/items/FrutiIcon.vue";
  import {useUserStore} from "@/stores/userStore.ts";
  import {formattedTime} from "@/utilities";
  import GamePause from "@/components/modal/GamePause.vue";
  import GameOver from "@/components/modal/GameOver.vue";

  interface FructCoordinates {
    x: number;
    y: number;
  }

  interface Fruct {
    id: string;
    coordinates: FructCoordinates;
  }

  const userStore = useUserStore()

  const fruits = ref<Fruct[]>([])
  const missFruit = ref<number>(0)
  const spavnFruit = ref<number>(2000)

  const itemRefs = useTemplateRef('flexBlock')
  const frogBlock = computed(() => {
    return itemRefs.value?.getBoundingClientRect().x ?? 0
  })
  const leftPosition = ref(0)
  const contentBlock = useTemplateRef('Block')


  const isLeftPressed = ref(false)
  const isRightPressed = ref(false)

  const isCooldown = ref(false)
  const autoCollectTimeLeft = ref(0)
  const cooldownTimeLeft = ref(0)

  let autoCollectTimer: number | null = null
  let cooldownTimer: number | null = null
  let moveInterval: number | null = null
  let moveIntervalFruct: number | null = null
  let timeInterval: number | null = null
  let moveIntervalX: number | null = null

  const moveBlock = () => {
    if(!userStore.isPause){
      if (!itemRefs.value || !contentBlock.value) return

      const frog = itemRefs.value.getBoundingClientRect()
      const containerWidth = contentBlock.value.getBoundingClientRect().width
      const blockWidth = frog.width
      const maxLeft = containerWidth - blockWidth

      let step = 0
      if (isLeftPressed.value) step -= 10
      if (isRightPressed.value) step += 10

      leftPosition.value = Math.max(0, Math.min(maxLeft, leftPosition.value + step))

      fruits.value = fruits.value.filter(fruit => {
        if ((fruit.coordinates.x >= frog.left-40 && fruit.coordinates.x <= frog.right) && (fruit.coordinates.y >= frog.top-60 && fruit.coordinates.y <= frog.top+30)){
          userStore.addScore()
          return false
        }
        else
          return true
      })

    }
  }

  const startCooldown = () => {
    isCooldown.value = true
    cooldownTimeLeft.value = 5

    if (cooldownTimer) clearInterval(cooldownTimer)

    cooldownTimer = setInterval(() => {
      cooldownTimeLeft.value -= 1
      if (cooldownTimeLeft.value <= 0) {
        cooldownTimeLeft.value = 0
        isCooldown.value = false
        clearInterval(cooldownTimer!)
        cooldownTimer = null
      }
    }, 1000);
  };

  const stopAutoCollect = () => {
    userStore.setAutoCollecting(false)
    if (autoCollectTimer) {
      clearInterval(autoCollectTimer)
      autoCollectTimer = null
    }
    if (!isCooldown.value) startCooldown()

  };

  const startAutoCollect = () => {
    if (userStore.isPause || userStore.isAutoCollecting || isCooldown.value) return;

    userStore.setAutoCollecting(true)
    autoCollectTimeLeft.value = 4

    if (autoCollectTimer) clearInterval(autoCollectTimer);
    autoCollectTimer = setInterval(() => {
      autoCollectTimeLeft.value -= 1
      if (autoCollectTimeLeft.value <= 0) {
        autoCollectTimeLeft.value = 0
        stopAutoCollect()
      }
    }, 1000)
  };

  const handleMiss = () =>{
    missFruit.value++
    userStore.decreaseLive()
  }

  const restart = () => {
    fruits.value = []
    missFruit.value = 0
    if (itemRefs.value && contentBlock.value) {
      const containerWidth = contentBlock.value.getBoundingClientRect().width
      leftPosition.value = containerWidth / 2.3
    }

    if (moveInterval)  clearInterval(moveInterval)
    if (moveIntervalFruct)  clearInterval(moveIntervalFruct)
    if (timeInterval)  clearInterval(timeInterval)

    moveInterval = setInterval(moveBlock, 16)
    moveIntervalFruct = setInterval(createFruct, spavnFruit.value)
    timeInterval = setInterval(userStore.addSecondInTime, 1000)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      isLeftPressed.value = true
    }
    else if (e.key === 'ArrowRight') {
      e.preventDefault()
      isRightPressed.value = true
    } else if (e.key === ' ') {
      e.preventDefault()
      startAutoCollect()
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      isLeftPressed.value = false
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      isRightPressed.value = false
    }
    else if (e.key === ' ') {
      e.preventDefault()
      if (userStore.isAutoCollecting) stopAutoCollect()
    }
  }

  const createFruct = () => {
    if(!userStore.isPause) {
      fruits.value.push(
        {
          id: String(new Date().getTime() + (Math.random() * 1000)),
          coordinates: {
            x: Math.max(0, Math.min(window.innerWidth - 100, Math.floor(Math.random() * window.innerWidth))),
            y: -40,
          }
        }
      )
      spavnFruit.value =  Math.random() * (3500 - 1000 + 1) + 1500
    }
  }

  onMounted(() => {
    if (itemRefs.value && contentBlock.value) {
      const containerWidth = contentBlock.value.getBoundingClientRect().width
      leftPosition.value = containerWidth / 2.3
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    moveInterval = setInterval(moveBlock, 16)
    moveIntervalFruct = setInterval(createFruct, 2000)
    timeInterval = setInterval(userStore.addSecondInTime, 1000)
  })


  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)

    if (moveInterval) clearInterval(moveInterval)
    if (timeInterval) clearInterval(timeInterval)

    if (autoCollectTimer) clearInterval(autoCollectTimer)
    if (cooldownTimer) clearInterval(cooldownTimer)
  })
</script>

<template>
  <div class="h-full flex items-end justify-center w-full" ref="Block">
    <template v-for="item in fruits" :key="item.id">
      <fruti-icon
        :positionX="itemRefs?.getBoundingClientRect().x"
        class="transition duration-200"
        @miss="handleMiss"
        :id="item.id"
        v-model="item.coordinates"
      />
    </template>
    <div class="h-full flex items-end justify-center w-full relative" ref="Block">
      <div class="absolute top-4 left-4 flex items-center gap-2 bg-emerald-800/50 text-white w-35 justify-center p-4 rounded-4xl backdrop-blur-sm select-none">
        <span class="text-3xl">{{ formattedTime(userStore.time) }}</span>
      </div>
      <div>
        <div class="absolute top-4 right-4 flex items-center gap-2 bg-green-400/50 text-white px-6 py-4 rounded-full backdrop-blur-sm select-none">
          <span class="font-mono text-3xl">{{ userStore.score + '/' + missFruit }}</span>
          <img src="@/assets/img/fruits.png" class="size-15" />
        </div>
        <div class="absolute -top-30 right-10">
          <template v-for="live in userStore.live">
            <img :src=" '/antiFruti/heart_' + String(live) + '.png'" alt="Clock" class="w-6 h-6" />
          </template>
        </div>
      </div>
    </div>
    <div
      ref="flexBlock"
      class="absolute flex flex-col justify-center items-center bottom-0"
      :style="{
        'left': leftPosition + 'px'
      }"
    >
      <img draggable="false" src="../assets/img/basket.png" class="w-60 h-30 -mb-10" alt="basket" />
      <img draggable="false" src="../assets/img/frog.png" class="w-30 h-40 z-1" alt="frog" />
    </div>
  </div>
  <game-over
    v-if="!userStore.isLive"
    @restart="restart"
  />
  <game-pause v-if="userStore.isPause && userStore.isLive" />
</template>
<style scoped>
img{
  user-select: none
}
</style>
