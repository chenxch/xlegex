<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ceil, floor, random, shuffle } from 'lodash-es'
import Card from './components/card.vue'

const container = ref<HTMLElement>()
const histroyList = ref<CardNode[]>([])
const backFlag = ref(false)
const removeFlag = ref(false)
const removeList = ref<CardNode[]>([])
const preNode = ref<CardNode | null>(null)

const itemTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
const num = 6
let itemList: number[] = []
const selectedNodes = ref<CardNode[]>([])
for (let i = 0; i < 3 * num; i++)
  itemList = [...itemList, ...itemTypes]

console.log(shuffle(itemList))
itemList = shuffle(itemList)

let len = 0
let floorIndex = 1
const floorList = []
const itemLength = itemList.length
while (len <= itemLength) {
  const maxFloorNum = floorIndex * floorIndex
  const floorNum = ceil(random(maxFloorNum / 2, maxFloorNum))
  console.log(floorNum)
  floorList.push(itemList.splice(0, floorNum))
  len += floorNum
  floorIndex++
}
console.log(floorList)
const nodes = ref<CardNode[]>([])
const indexSet = new Set()
let perFloorNodes: CardNode[] = []
onMounted(() => {
  const containerWidth = container.value!.clientWidth
  const containerHeight = container.value!.clientHeight
  const width = containerWidth / 2
  const height = containerHeight / 2 - 60
  console.log(width, height)
  floorList.forEach((o, index) => {
    indexSet.clear()
    let i = 0
    const floorNodes: CardNode[] = []
    o.forEach((k) => {
      i = floor(random(0, (index + 1) ** 2))
      while (indexSet.has(i))
        i = floor(random(0, (index + 1) ** 2))
      const row = floor(i / (index + 1))
      const column = index ? i % index : 0
      const node: CardNode = {
        id: `${index}-${i}`,
        type: k,
        zIndex:
        index,
        index: i,
        row,
        column,
        top: height + (40 * row - 20 * index),
        left: width + (40 * column - 20 * index),
        parents: [],
        state: 0,
      }
      const xy = [node.top, node.left]
      perFloorNodes.forEach((e) => {
        if (Math.abs(e.top - xy[0]) <= 40 && Math.abs(e.left - xy[1]) <= 40)
          e.parents.push(node)
      })
      floorNodes.push(node)
      indexSet.add(i)
    })
    nodes.value = nodes.value.concat(floorNodes)
    perFloorNodes = floorNodes
  })

  console.log(nodes.value)
})
function updateState() {
  nodes.value.forEach((o) => {
    o.state = o.parents.every(p => o.state > 0) ? 1 : 0
  })
}

updateState()

function handleSelect(node: CardNode) {
  if (selectedNodes.value.length === 7)
    return
  node.state = 2
  histroyList.value.push(node)
  preNode.value = node
  const index = nodes.value.findIndex(o => o.id === node.id)
  if (index > -1)
    nodes.value.splice(index, 1)
  if (selectedNodes.value.filter(s => s.type === node.type).length === 2) {
    for (let i = 0; i < 2; i++) {
      const index = selectedNodes.value.findIndex(o => o.type === node.type)
      selectedNodes.value.splice(index, 1)
    }
    preNode.value = null
  }
  else {
    const index = selectedNodes.value.findIndex(o => o.type === node.type)
    if (index > -1)
      selectedNodes.value.splice(index, 0, node)
    else
      selectedNodes.value.push(node)
  }

  if (selectedNodes.value.length === 7) {
    setTimeout(() => {
      alert('槽位已满, 广告开发中')
      window.location.reload()
    }, 200)
  }
}

function handleSelectRemove(node: CardNode) {
  const index = removeList.value.findIndex(o => o.id === node.id)
  if (index > -1)
    removeList.value.splice(index, 1)
  handleSelect(node)
}

function handleBack() {
  const node = preNode.value
  if (!node)
    return
  preNode.value = null
  backFlag.value = true
  node.state = 0
  nodes.value.push(node)
  const index = selectedNodes.value.findIndex(o => o.id === node.id)
  selectedNodes.value.splice(index, 1)
}

function handleRemove() {
  // 从selectedNodes.value中取出3个 到 removeList.value中

  if (selectedNodes.value.length < 3)
    return
  removeFlag.value = true
  preNode.value = null
  for (let i = 0; i < 3; i++) {
    const node = selectedNodes.value.pop()
    if (!node)
      return
    removeList.value.push(node)
  }
}
</script>

<template>
  <div flex flex-col w-full h-full>
    <div text-44px text-center w-full color="#000" fw-600 h-60px flex items-center justify-center mt-10px>
      兔了个兔
    </div>
    <div ref="container" flex-1 flex>
      <div w-full relative flex-1>
        <Card
          v-for="item in nodes" :key="item.id" :node="item"
          @click-card="handleSelect"
        />
      </div>
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
    </div>
  </div>
</template>

<style>
body{
  background-color: #c3fe8b;
}
</style>
