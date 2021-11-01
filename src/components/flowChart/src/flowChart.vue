/**
 * @Description: 生成流程绘制 基本节点(审批 抄送)组装逻辑
 * @author Roman
 * @date 2021-03-12 11:58:17
 * @edit 2021-03-12 11:58:17
*/
<script type="text/jsx">
import AddNodeBtn from './components/AddNodeBtn'
import RowFactory from './components/DrawRow/FactoryRow'

import {
  RowNode,
  ConditionNode,
  CopyNode
} from './components/NodeConfigFactory/NodeFactory'
import FlowFactory from './components/factory'
import { HashCode, transToTreeDat, getPidArr } from './utils'
import FlowNode from './components/DrawRow/FlowNode'
export default {
  name: 'FlowChart',
  components: {
    AddNodeBtn,
    FlowNode
  },
  props: {
    flowConfig: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      rectTypeDic: {
        1: '审批节点',
        2: '规则节点',
        3: '抄送人',
        4: '开始节点'
      },
      isColList: ['3', '5'],
      selfConfig: null,
      currentNode: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 节点数据变化事件
    nodeChange(node) {
      console.log(this.currentNode, node)
      this.currentNode.title = node.title
      this.currentNode.content = node.content
      this.selfConfig.forEach((i) => {
        console.log(i)
        if (i.id === this.currentNode.id) {
          i.data = node.data
          i.title = node.title
          i.content = node.content
        }
      })
      this.$forceUpdate()
    },
    /**
     * 添加条件框
     */
    addBranch(node) {
      const newNode = new CopyNode(node[0])
      this.selfConfig = this.selfConfig.concat([newNode])
    },
    /**
     * 获取传参数据结构
     */
    getResData() {
      const list = JSON.parse(JSON.stringify(this.selfConfig))
      getPidArr(list)
      const keyIndex = {}
      list.forEach((v, i) => {
        keyIndex[v.id] = i
        v.next = []
      })
      list.forEach((v) => {
        v.pids.forEach((o) => {
          if (o) {
            list[keyIndex[o]].next.push(v.id)
          }
        })
      })
      return list
    },
    /**
     * 初始化 数据私有化
     */
    init() {
      console.log(this.flowConfig)
      this.selfConfig = this.$utils.deepClone(this.flowConfig)
    },
    /**
     *  @param data  源数组一维数组
     *  @requires  tree 二维数组
     */
    transformTree(data) {
      return transToTreeDat(data)
    },
    clickSelectBox(nextNode) {
      console.log(nextNode)
      const { node, selfConfig } = this.getNodeFactory(nextNode)
      console.log(node, selfConfig)
      this.selfConfig = selfConfig.concat(node)
    },
    /**
     * 根据isRow去判断row或者rol
     */
    getNodeFactory(nextNode) {
      console.log(nextNode)
      if (!nextNode.isRow) {
        const { node, selfConfig } = this.getColNode(nextNode)
        return { node, selfConfig }
      } else {
        const { node, selfConfig } = this.getRowNode(nextNode)
        console.log(node, selfConfig)
        return { node, selfConfig }
      }
    },
    /**
     * 获取row节点
     */
    getRowNode(nextNode) {
      const node = [new RowNode(nextNode)]
      console.log(node, nextNode)
      const selfConfig = this.repickArr(node[0])
      console.log(node[0])
      this.currentNode = node[0]
      // this.clickNode(node[0])
      return { node, selfConfig }
    },
    /**
     * 获取col节点
     */
    getColNode(nextNode) {
      const groupId = HashCode()
      const node = [
        new ConditionNode({ groupId, ...nextNode }),
        new ConditionNode({ groupId, ...nextNode })
      ]
      const repickConfig = {
        groupId: node[0].groupPid,
        id: node[0].id
      }
      const selfConfig = this.repickArr(repickConfig)
      this.locationScroll()
      return { node, selfConfig }
    },
    /**
     * 定位滚动条
     */
    locationScroll() {
      // window.location.hash = ".bottom-right-cover-line";
      const el = document.getElementsByClassName('dingflow-design')[0]
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth - el.clientWidth + 340
      }, 0)
    },
    /**
     * 重定位数组
     */
    repickArr(repickConfig) {
      const selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
      selfConfig.forEach((i) => {
        if (i.isRow) {
          if (i.groupId === repickConfig.groupId) {
            i.groupId = repickConfig.id
          }
        } else {
          if (i.groupPid === repickConfig.groupId) {
            i.groupPid = repickConfig.id
          }
        }
      })
      return selfConfig
    },
    // 点击节点
    clickNode(nodeConfig) {
      console.log(nodeConfig)
      this.currentNode = nodeConfig
      this.$emit('clickNode', nodeConfig)
    },
    // 点击关闭节点
    closeNode(node) {
      console.log(node)
      if (node.id === 'root') {
        return
      }
      const repickConfig = {}
      if (node.isRow) {
        repickConfig.groupId = node.groupId
        repickConfig.id = node.id
        const selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
        this.selfConfig = this.deleteNode(selfConfig, node)
        this.repickDeleteArr(repickConfig)
      } else {
        this.deleteColNode(node)
      }
    },
    // 删除节点
    deleteNode(selfConfig, node) {
      selfConfig = selfConfig.map((i) => i.id !== node.id && i).filter(Boolean)
      return selfConfig
    },
    // 单独删除col下node
    deleteColNode(node) {
      let selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
      const nodeArr = selfConfig.filter(
        (i) => i.groupId === node.groupId && !i.isRow
      )
      let deleteArr = []
      let repickConfig
      if (nodeArr.length > 2) {
        // 递归删除所有关联子节点
        deleteArr = [node]
        this.deleteLoop(selfConfig, node, deleteArr)
        repickConfig = {
          id: node.id,
          groupId: node.groupId
        }
      } else {
        // 删除整个group
        const allCol = selfConfig
          .map((i) => i.groupId === node.groupId && !i.isRow && i)
          .filter(Boolean)
        deleteArr = allCol
        allCol.forEach((i) => {
          this.deleteLoop(selfConfig, i, deleteArr)
        })
        repickConfig = {
          id: node.groupId,
          groupId: node.groupPid
        }
      }
      deleteArr.forEach((i) => {
        selfConfig = this.deleteNode(selfConfig, i)
      })
      this.selfConfig = selfConfig
      this.repickDeleteArr(repickConfig)
      return selfConfig
    },
    // 循环遍历删除组下关联节点
    deleteLoop(selfConfig, node, deleteArr) {
      console.log(selfConfig, node, 'selfConfig')
      const currentDeleteArr = selfConfig.filter((i) => {
        if (i.isRow) {
          return i.groupId === node.id
        } else {
          return i.groupPid === node.id
        }
      })
      if (currentDeleteArr.length) {
        currentDeleteArr.forEach((i) => {
          deleteArr.push(i)
          this.deleteLoop(selfConfig, i, deleteArr)
        })
      } else {
        return
      }
    },
    // 判断是否是row
    judgeNodeIsRow(node) {
      return node.isRow
    },
    // 删除后重组数组
    repickDeleteArr(repickConfig) {
      const selfConfig = JSON.parse(JSON.stringify(this.selfConfig))
      selfConfig.forEach((i) => {
        if (i.isRow && i.groupId === repickConfig.id) {
          i.groupId = repickConfig.groupId
        } else if (!i.isRow && i.groupPid === repickConfig.id) {
          i.groupPid = repickConfig.groupId
        }
      })
      this.selfConfig = selfConfig
      console.log(selfConfig, repickConfig, 'groupPid')
    },
    // 绘制body
    drawBody(h, node) {
      if (node.childNode) {
        return FlowFactory.getFactory.bind(this, h, node.childNode)()
      } else {
        return <div></div>
      }
    }
  },
  render(h) {
    // this.init();
    let FlowConfig = this.selfConfig
    FlowConfig = this.transformTree(FlowConfig)
    const root = JSON.parse(JSON.stringify(this.selfConfig[0]))
    return (
      <div class='design-engine'>
        <div class='dingflow-design'>
          <div class='ie-polyfill-container'>
            <div class='box-scale' id='box-scale'>
              {RowFactory.nodeWrapRender.bind(this, h, root)()}
              {this.drawBody(h, FlowConfig[0])}
              <div class='end-node'>
                <div class='end-node-circle'></div>
                <div class='end-node-text'>
                  <div>流程结束</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
.design-engine {
  position: relative;
  height: 100%;
  .dingflow-design {
    width: 100%;
    // background-color: #f5f5f7;
    overflow: auto;
    height: 100%;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    /deep/ .ant-popover-arrow {
      display: none !important;
    }
    .ie-polyfill-container {
      display: -ms-grid;
      -ms-grid-columns: min-content;
      .box-scale {
        transform: scale(1);
        display: inline-block;
        position: relative;
        width: 100%;
        padding: 54.5px 0;
        -webkit-box-align: start;
        -ms-flex-align: start;
        align-items: flex-start;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        min-width: -webkit-min-content;
        min-width: -moz-min-content;
        min-width: min-content;
        // background-color: #f5f5f7;
        -webkit-transform-origin: 0 0 0;
        transform-origin: 50% 0px 0px;
        .end-node {
          border-radius: 50%;
          font-size: 14px;
          color: rgba(25, 31, 37, 0.4);
          text-align: left;
          .end-node-circle {
            width: 10px;
            height: 10px;
            margin: auto;
            border-radius: 50%;
            background: #dbdcdc;
          }
          .end-node-text {
            margin-top: 5px;
            text-align: center;
            display: flex;
            justify-content: center;
            > div {
              color:#fff;
              width: 212px;
              height: 42px;
              line-height: 42px;
              background: #bbc2d0;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
}
</style>
