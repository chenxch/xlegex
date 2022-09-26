interface Game {
  nodes: Ref<CardNode[]>;
  selectedNodes: Ref<CardNode[]>;
  removeList: Ref<CardNode[]>;
  removeFlag: Ref<boolean>;
  backFlag: Ref<boolean>;
  handleSelect: (node: CardNode) => void;
  handleSelectRemove: (node: CardNode) => void;
  handleBack: () => void;
  handleRemove: () => void;
  initData: (config?: GameConfig) => void;
}
interface GameConfig {
  container?: Ref<HTMLElement | undefined>,   // cardNode容器
  cardNum: number,                            // card类型数量
  layerNum: number                            // card层数
  trap?:boolean,                              //  是否开启陷阱
  delNode?: boolean,                          //  是否从nodes中剔除已选节点
  events?: GameEvents                         //  游戏事件
}

interface GameEvents {
  clickCallback?: () => void, 
  dropCallback?: () => void, 
  winCallback?: () => void, 
  loseCallback?: () => void
}

// 卡片节点类型
type CardNode = {
  id: string           // 节点id zIndex-index
  type: number         // 类型
  zIndex: number       // 图层
  index: number        // 所在图层中的索引
  parents: CardNode[]  // 父节点
  row: number          // 行
  column: number       // 列
  top: number
  left: number
  state: number        // 是否可点击 0： 无状态  1： 可点击 2：已选 3：已消除
}