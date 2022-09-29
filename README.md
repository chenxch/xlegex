<img src="https://cdn.staticaly.com/gh/chenxch/pic-image@master/20220929/image-31.5wzs9gnp33k.webp" />

# xlegex / x了个X

This is a match-3 game, a simplified version of the sheep, currently based on rabbits, you can customize your own game based on this.

这是一个三消类的游戏，简化版的羊了个羊，目前是以兔子为素材，你可以基于这个定制你自己的游戏。



[Online Demo / 在线demo](https://chenxch.github.io/xlegex/)

## Game screenshot / 游戏截图
![QQ浏览器截图20220922214942](https://cdn.staticaly.com/gh/chenxch/pic-image@master/20220929/tutu.4jhzwxilnfs0.gif)


## Core Code / 核心代码
```ts
// useGame.ts
useGame(config: GameConfig): Game{
  ...
}
```

### 
```ts
// type.d.ts
interface Game {
  nodes: Ref<CardNode[]>
  selectedNodes: Ref<CardNode[]>
  removeList: Ref<CardNode[]>
  removeFlag: Ref<boolean>
  backFlag: Ref<boolean>
  handleSelect: (node: CardNode) => void
  handleSelectRemove: (node: CardNode) => void
  handleBack: () => void
  handleRemove: () => void
  initData: (config?: GameConfig) => void
}
interface GameConfig {
  container?: Ref<HTMLElement | undefined> // cardNode容器
  cardNum: number // card类型数量
  layerNum: number // card层数
  trap?: boolean //  是否开启陷阱
  delNode?: boolean //  是否从nodes中剔除已选节点
  events?: GameEvents //  游戏事件
}

interface GameEvents {
  clickCallback?: () => void
  dropCallback?: () => void
  winCallback?: () => void
  loseCallback?: () => void
}
```

## Application / 应用
```ts
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
  initData,
} = useGame({
  container: containerRef,
  cardNum: 4,
  layerNum: 2,
  trap: false,
  events: {
    clickCallback: handleClickCard,
    dropCallback: handleDropCard,
    winCallback: handleWin,
    loseCallback: handleLose,
  },
})

initData()
```

## Related Articles / 相关文章
[juejin/掘金](https://juejin.cn/post/7147245442172977189)