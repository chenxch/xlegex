<script setup lang="ts">
import { ref } from 'vue'
import Card from './components/card.vue'
import { useGame } from './core/useGame'
import { fireworks } from './core/utils'

const containerRef = ref<HTMLElement | undefined>()
const clickAudioRef = ref<HTMLAudioElement | undefined>()
const dropAudioRef = ref<HTMLAudioElement | undefined>()
const winAudioRef = ref<HTMLAudioElement | undefined>()
const loseAudioRef = ref<HTMLAudioElement | undefined>()

const isWin = ref(false)

const {
  nodes,
  selectedNodes,
  handleSelect,
  handleBack,
  backFlag,
  handleRemove,
  removeFlag,
  removeList,
  handleSelectRemove,
} = useGame(containerRef, 13, 6, true, handleClickCard, handleDropCard, handleWin, handleLose)

function handleClickCard() {
  clickAudioRef.value?.play()
}

function handleDropCard() {
  dropAudioRef.value?.play()
}

function handleWin() {
  winAudioRef.value?.play()
  isWin.value = true
  fireworks()
}

function handleLose() {
  loseAudioRef.value?.play()
  setTimeout(() => {
    alert('槽位已满，再接再厉~')
    window.location.reload()
  }, 500)
}
</script>

<template>
  <div flex flex-col w-full h-full>
    <div text-44px text-center w-full color="#000" fw-600 h-60px flex items-center justify-center mt-10px>
      兔了个兔
    </div>
    <div ref="containerRef" flex-1 flex>
      <div w-full relative flex-1>
        <Card
          v-for="item in nodes" :key="item.id" :node="item"
          @click-card="handleSelect"
        />
      </div>
      <transition name="bounce">
        <div v-if="isWin" color="#000" flex items-center justify-center w-full text-28px fw-bold>
          成功加入兔圈~
        </div>
      </transition>
    </div>

    <div text-center h-50px flex items-center justify-center>
      <Card
        v-for="item in removeList" :key="item.id" :node="item"
        is-dock
        @click-card="handleSelectRemove"
      />
    </div>
    <div w-full flex items-center justify-center>
      <div border="~ 4px dashed #000" w-295px h-44px flex>
        <Card
          v-for="item in selectedNodes" :key="item.id" :node="item"
          is-dock
        />
      </div>
    </div>

    <div h-50px flex items-center w-full justify-center>
      <button :disabled="removeFlag" mr-10px @click="handleRemove">
        移出前三个
      </button>
      <button :disabled="backFlag" @click="handleBack">
        回退
      </button>
    </div>
    <div w-full color="#000" fw-600 text-center pb-10px>
      <span mr-20px>designer: Teacher Face</span>
      by: Xc
      <a
        class="icon-btn"
        color="#000"
        i-carbon-logo-github
        rel="noreferrer"
        href="https://github.com/chenxch"
        target="_blank"
        title="GitHub"
      />
      <span
        text-12px
        color="#00000018"
      >
        <span
          class="icon-btn"
          text-2
          i-carbon:arrow-up-left
        />
        star buff</span>
    </div>
    <audio
      ref="clickAudioRef"
      style="display: none;"
      controls
      src="./audio/click.mp3"
    />
    <audio
      ref="dropAudioRef"
      style="display: none;"
      controls
      src="./audio/drop.mp3"
    />
    <audio
      ref="winAudioRef"
      style="display: none;"
      controls
      src="./audio/win.mp3"
    />
    <audio
      ref="loseAudioRef"
      style="display: none;"
      controls
      src="./audio/lose.mp3"
    />
  </div>
</template>

<style>
body{
  background-color: #c3fe8b;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
