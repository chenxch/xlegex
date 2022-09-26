<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<Props>()
const emit = defineEmits(['clickCard'])

// 加载图片资源
const modules = import.meta.glob('../assets/tutu2/*.png', {
  as: 'url',
  import: 'default',
  eager: true,
})
const IMG_MAP = Object.keys(modules).reduce((acc, cur) => {
  const key = cur.replace('../assets/tutu2/', '').replace('.png', '')
  acc[key] = modules[cur]
  return acc
}, {} as Record<string, string>)

interface Props {
  node: CardNode
  isDock?: boolean
}
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
    <!-- {{ node.zIndex }}-{{ node.type }} -->
    <!-- {{ node.id }} -->
    <img :src="IMG_MAP[node.type]" width="40" height="40" :alt="`${node.type}`">
    <div v-if="isFreeze" class="mask" />
  </div>
</template>

<style scoped>
.card{
  width: 40px;
  height: 40px;
  /* border: 1px solid red; */
  background: #f9f7e1;
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
  background-color: rgba(0, 0, 0, 0.55);
  width: 40px;
  height: 40px;
  pointer-events: none;
}
</style>
