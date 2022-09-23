import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { ceil, floor, random, shuffle } from 'lodash-es'
import { fireworks } from './utils'

export function useGame(container: Ref<HTMLElement | undefined>, cardNum: number, layerNum: number, trap = true) {
  const histroyList = ref<CardNode[]>([])
  const backFlag = ref(false)
  const removeFlag = ref(false)
  const removeList = ref<CardNode[]>([])
  const preNode = ref<CardNode | null>(null)
  const size = 40
  const isTrap = trap && floor(random(0, 100)) !== 50

  const itemTypes = (new Array(cardNum).fill(0)).map((_, index) => index + 1)
  let itemList: number[] = []
  const selectedNodes = ref<CardNode[]>([])
  for (let i = 0; i < 3 * layerNum; i++)
    itemList = [...itemList, ...itemTypes]

  if (isTrap) {
    const len = itemList.length
    itemList.splice(len - cardNum, len)
  }
  itemList = shuffle(itemList)

  let len = 0
  let floorIndex = 1
  const floorList: number[][] = []
  const itemLength = itemList.length
  while (len <= itemLength) {
    const maxFloorNum = floorIndex * floorIndex
    const floorNum = ceil(random(maxFloorNum / 2, maxFloorNum))
    floorList.push(itemList.splice(0, floorNum))
    len += floorNum
    floorIndex++
  }

  const nodes = ref<CardNode[]>([])
  const indexSet = new Set()
  let perFloorNodes: CardNode[] = []
  onMounted(() => {
    const containerWidth = container.value!.clientWidth
    const containerHeight = container.value!.clientHeight
    const width = containerWidth / 2
    const height = containerHeight / 2 - 60

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
          top: height + (size * row - (size / 2) * index),
          left: width + (size * column - (size / 2) * index),
          parents: [],
          state: 0,
        }
        const xy = [node.top, node.left]
        perFloorNodes.forEach((e) => {
          if (Math.abs(e.top - xy[0]) <= size && Math.abs(e.left - xy[1]) <= size)
            e.parents.push(node)
        })
        floorNodes.push(node)
        indexSet.add(i)
      })
      nodes.value = nodes.value.concat(floorNodes)
      perFloorNodes = floorNodes
    })

    updateState()
  })

  function updateState() {
    nodes.value.forEach((o) => {
      o.state = o.parents.every(p => p.state > 0) ? 1 : 0
    })
  }

  function handleSelect(node: CardNode) {
    if (selectedNodes.value.length === 7)
      return
    node.state = 2
    histroyList.value.push(node)
    preNode.value = node
    const index = nodes.value.findIndex(o => o.id === node.id)
    if (index > -1) {
      nodes.value.splice(index, 1)
      if (nodes.value.length === 0)
        fireworks()
    }
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
        alert('槽位已满，再接再厉~')
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
      const node = selectedNodes.value.shift()
      if (!node)
        return
      removeList.value.push(node)
    }
  }

  return {
    nodes,
    selectedNodes,
    handleSelect,
    handleBack,
    backFlag,
    handleRemove,
    removeFlag,
    removeList,
    handleSelectRemove,
  }
}
