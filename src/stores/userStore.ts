import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useUserStore = defineStore('user', () => {
  const name = ref<string | null>( localStorage.getItem( 'user' ) ?? null );

  const live = ref<boolean[]>([true, true, true])
  const score = ref<number>(0)
  const time = ref<number>(0)
  const isPause = ref<boolean>(false)
  const isAutoCollecting = ref<boolean>(false)

  const addSecondInTime = () => {
    if (!isPause.value) {
      time.value++
    }
  }

  const isLive = computed(() => {
    return Boolean(live.value.find(i => i === true))
  })

  const changeName = (newName: string) => {
    name.value = newName
  }

  const decreaseLive = () => {
    live.value[live.value.findIndex(i => i === true)] = false
  }

  const clearUser = () => {
    isPause.value = false
    live.value = ([true, true, true])
    score.value = 0
    time.value = 0
  }

  const addScore = () => {
    score.value++
  }

  const setPause = (pause: boolean) => {
    isPause.value = pause
  }

  const setAutoCollecting = (autoCollecting: boolean) => {
    isAutoCollecting.value = autoCollecting
  }

  return {
    name,
    live,
    score,
    time,
    isPause,
    isAutoCollecting,
    isLive,
    changeName,
    decreaseLive,
    clearUser,
    addScore,
    addSecondInTime,
    setPause,
    setAutoCollecting,
  }
} )
