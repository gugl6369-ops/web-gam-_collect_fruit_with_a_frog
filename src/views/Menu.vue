<script setup lang="ts">
  import {onMounted} from "vue";
  import {FormSchema, type NameFormValues} from "@/utilities";
  import {useForm} from "vee-validate";
  import {useRouter} from "vue-router";
  import {useUserStore} from "@/stores/userStore.ts";

  const userStore = useUserStore();
  const { defineField, errors } = useForm({
    validationSchema: FormSchema,
  })

  const router = useRouter();

  const [name, nameAttrs] = defineField('name')

  const createUser = () => {
    if(name.value) {
      localStorage.setItem('user', name.value);
      userStore.changeName(name.value);
      router.push('/game');
    }
  }
  onMounted(() => {
    name.value = 'GoGi'
  })

</script>

<template>
  <section class="w-full flex justify-center items-center">
    <div class="flex p-5 justify-center w-full  max-w-200 max-h-300 min-h-150 backdrop-blur-sm rounded-4xl shadow-emerald-800 shadow-2xl ">
      <form class="flex flex-col gap-[100px] p-12">
        <div>
          <p class="text-6xl text-center text-emerald-700">FrogiGogi</p>
          <p class="text-center text-emerald-900">The frog goes plop, plop, plop!</p>
        </div>
        <div class="relative ">
        <label class="swamp-input w-full">
          <span class="frog-icon">🐸</span>
          <input
            class="w-full" type="text" name="name" v-model="name" placeholder="Name"
            v-bind="nameAttrs"
          />
          <span class="bubble-in bubble-in1"></span>
          <span class="bubble-in bubble-in2"></span>
          <span class="bubble-in bubble-in3"></span>
        </label>
        <p
          class="absolute"
          >
          {{errors.name}}
        </p>
        </div>
        <button type="submit" :disabled="!!errors.name?.length" @click.prevent="createUser()" class="relative px-8 py-5
                 bg-gradient-to-b from-green-300 to-emerald-600
                 rounded-[50px]
                 shadow-2xl shadow-emerald-400/50
                 text-white font-bold text-2xl
                 flex items-center -gap-1
                 transition-all duration-200
                 hover:scale-105 hover:shadow-emerald-300/80
                 active:scale-95
                 border-2 border-white/30
                 btn-frog
                 cursor-pointer
                 justify-center">
          <span class="text-4xl drop-shadow-md">🐸</span>
          Start!
          <span class="bubble bubble-1"></span>
          <span class="bubble bubble-2"></span>
          <span class="bubble bubble-3"></span>
          <span class="bubble bubble-4"></span>
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>

/* ----- Анимация для кнопки (лягушка на листе) ----- */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}
.btn-frog {
  animation: float 2.5s ease-in-out infinite;
  transition: all 0.5s linear;
}

/* ----- Пузырьки для кнопки ----- */
@keyframes bubbleUp {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  100% { transform: translateY(-50px) scale(0.3); opacity: 0; }
}
.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  box-shadow: inset 0 0 6px rgba(255,255,255,0.6);
}
.bubble-1 { width: 14px; height: 14px; top: -8px; left: 15%; animation: bubbleUp 2.8s ease-out infinite; }
.bubble-2 { width: 10px; height: 10px; bottom: -6px; right: 25%; animation: bubbleUp 3.2s ease-out infinite 0.6s; }
.bubble-3 { width: 18px; height: 18px; top: 20%; left: -12px; animation: bubbleUp 3.0s ease-out infinite 1.2s; }
.bubble-4 { width: 8px; height: 8px; bottom: 30%; right: -10px; animation: bubbleUp 2.6s ease-out infinite 0.3s; }

.btn-frog::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 36px;
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%);
  pointer-events: none;
}
.btn-frog:disabled{
  background: gray;
  animation: none;
}
.swamp-input {
  position: relative;
  display: flex;
  background: linear-gradient(145deg, #d4f0d4, #a8d5a2);
  border-radius: 60px;
  padding: 6px;
  box-shadow: 0 8px 20px rgba(52, 211, 153, 0.3), inset 0 2px 8px rgba(255,255,255,0.5);
  border: 2px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  cursor: text;
}
.swamp-input:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 28px rgba(52, 211, 153, 0.5);
}
.swamp-input:focus-within {
  transform: scale(1.04);
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.4), 0 12px 32px rgba(52, 211, 153, 0.5);
  border-color: #6ee7b7;
}

.swamp-input input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.5rem; /* text-2xl */
  font-weight: 500;
  color: #065f46; /* тёмно-зелёный */
  padding: 8px 0;
  caret-color: #10b981;
}
.swamp-input input::placeholder {
  color: #6b9e7a;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Иконка лягушонка внутри поля */
.swamp-input .frog-icon {
  font-size: 1.8rem;
  margin-right: 8px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

/* Пузырьки для поля (дополнительные) */
.swamp-input .bubble-in {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  pointer-events: none;
}
.swamp-input .bubble-in1 {
  width: 12px; height: 12px;
  bottom: -4px; left: 10%;
  animation: bubbleUp 3.4s ease-out infinite 0.2s;
}
.swamp-input .bubble-in2 {
  width: 8px; height: 8px;
  top: -4px; right: 15%;
  animation: bubbleUp 2.9s ease-out infinite 1.0s;
}
.swamp-input .bubble-in3 {
  width: 16px; height: 16px;
  bottom: 20%; right: -8px;
  animation: bubbleUp 3.8s ease-out infinite 1.8s;
}

/* Декоративная ряска (листочки) */
.swamp-input::before {
  content: '🌿';
  position: absolute;
  top: -10px;
  right: 0px;
  font-size: 1.6rem;
  transform: rotate(20deg);
  opacity: 0.6;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  pointer-events: none;
}
.swamp-input::after {
  content: '🍃';
  position: absolute;
  bottom: -8px;
  left: -6px;
  font-size: 1.4rem;
  transform: rotate(-30deg);
  opacity: 0.5;
  pointer-events: none;
}


</style>
