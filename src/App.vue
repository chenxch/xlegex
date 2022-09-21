<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ceil, floor, random, shuffle } from 'lodash-es'
import Card from './components/card.vue'

const itemTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
floorList.forEach((o, index) => {
  indexSet.clear()
  let i = 0
  const floorNodes: CardNode[] = []
  o.forEach((k) => {
    i = floor(random(0, (index + 1) ** 2))
    while (indexSet.has(i))
      i = floor(random(0, (index + 1) ** 2))
    const row = floor(i / (index + 1))
    const column = i % index
    const node: CardNode = {
      id: `${index}-${i}`,
      type: k,
      zIndex:
      index,
      index: i,
      row,
      column,
      top: 40 * row - 20 * index,
      left: 40 * column - 20 * index,
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
function updateState() {
  nodes.value.forEach((o) => {
    o.state = o.parents.every(p => o.state > 0) ? 1 : 0
  })
}
updateState()
console.log(nodes.value)

function handleSelect(node: CardNode) {
  if (selectedNodes.value.length === 7)
    return
  node.state = 2
  const index = nodes.value.findIndex(o => o.id === node.id)
  nodes.value.splice(index, 1)
  if (selectedNodes.value.filter(s => s.type === node.type).length === 2) {
    for (let i = 0; i < 2; i++) {
      const index = selectedNodes.value.findIndex(o => o.type === node.type)
      selectedNodes.value.splice(index, 1)
    }
  }
  else {
    selectedNodes.value.push(node)
  }

  if (selectedNodes.value.length === 7) {
    setTimeout(() => {
      alert('槽位已满, 广告开发中')
      window.location.reload()
    }, 200)
  }
}
</script>

<template>
  <div flex column w-full h-full>
    <div text-36px fixed top-80px center w-full left-0 color="#000" fw-600>
      朋了个友
    </div>
    <div flex items-center w-full relative flex-1>
      <Card
        v-for="item in nodes" :key="item.id" :node="item"
        @click-card="handleSelect"
      />
    </div>
    <div fixed bottom-80px left-0 w-full flex items-center justify-center>
      <div border="~ 4px dashed #000" w-295px h-44px flex>
        <Card
          v-for="item in selectedNodes" :key="item.id" :node="item"
          is-dock
          @click-card="handleSelect"
        />
      </div>
    </div>
    <div fixed bottom-20px w-full left-0 color="#000" fw-600 center>
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
  width: 100%;
  height: 100%;
  background-color: #c3fe8b;
}
</style>
