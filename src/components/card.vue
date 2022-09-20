<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  node: CardNode
  isDock: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['clickCard'])

const isFreeze = computed(() => {
  return props.node.parents.length > 0 ? props.node.parents.some(o => o.state < 2) : false
},
)

function handleClick() {
  if (!isFreeze.value)
    emit('clickCard', props.node)
}
</script>

<template>
  <div
    class="card"
    :style="isDock ? {} : { position: 'absolute', zIndex: node.zIndex, top: `${node.top}px`, left: `${node.left}px` }"
    @click="handleClick"
  >
    <!-- {{ item.zIndex }}-{{ item.type }} -->
    <!-- {{ node.id }} -->
    <img v-if="node.type === 1" src="../assets/1.jpg" width="40" height="40">
    <img v-if="node.type === 2" src="../assets/2.jpg" width="40" height="40">
    <img v-if="node.type === 3" src="../assets/3.jpg" width="40" height="40">
    <img v-if="node.type === 4" src="../assets/4.jpg" width="40" height="40">
    <img v-if="node.type === 5" src="../assets/5.jpg" width="40" height="40">
    <div v-if="isFreeze" class="mask" />
  </div>
</template>

<style scoped>
.card{
  width: 40px;
  height: 40px;
  /* border: 1px solid red; */
  background: #fff;
  color:#000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid #000;
  box-shadow: 1px 5px 5px -1px #000;
  cursor: pointer;
}
img{
  border-radius: 4px;
}
.mask {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  width: 40px;
  height: 40px;
  pointer-events: none;
}
</style>
