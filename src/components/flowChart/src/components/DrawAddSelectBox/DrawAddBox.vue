/**
 * @Description: 添加新增节点按钮
 * @author Roman
 * @date 2021-03-12 11:55:21
 * @edit 2021-03-12 11:55:21
*/
<script  type="text/jsx">
/* eslint-disable no-unused-vars */
import './addBox.scss'
import { NextNode } from './NextNode'
import { HashCode } from '../../utils'
export default {
  name: 'AddBox',
  props: {
    nodeConfig: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      boxArr: [
        {
          type: '2',
          value: '审批人',
          isRow: true,
          calssName: 'approver',
          icon: 'systemSettings-approver'
        },
        {
          type: '4',
          value: '抄送人',
          isRow: true,
          calssName: 'notifier',
          icon: 'systemSettings-recipient-1'
        },
        {
          type: '3',
          value: '条件分支',
          isRow: false,
          calssName: 'route',
          icon: 'systemSettings-condition-1'
        }
      ]
    }
  },
  methods: {
    clickSelectBox(item) {
      console.log(item)
      this.getNexttBox(item)
    },
    getNexttBox(item) {
      console.log(item)
      const nodeConfig = this.nodeConfig
      console.log(nodeConfig)
      if (item.value === '流转至') {
        this.nodeConfig.isFlowTo = true
      }
      const { id, prevId, type, isRow, value } = Object.assign(nodeConfig, item)
      const nextNode = new NextNode({ id, prevId, type, isRow, title: value })
      console.log(nextNode)
      this.$emit('clickSelectBox', nextNode)
    },
    renderAddSBox() {
      return (
        <div class='add-node-popover'>
          <div class='add-node-popover-body'>
            {this.boxArr.map(item => {
              return (
                <a
                  onClick={() => {
                    this.clickSelectBox(item)
                  }}
                  class={['add-node-popover-item', item.calssName]}
                >
                  <div class='item-wrapper'>
                    <i class='iconfont'>
                      <svg-icon icon-class={item.icon} />
                    </i>
                  </div>
                  <span>{item.value}</span>
                </a>
              )
            })}
          </div>
        </div>
      )
    }
  },
  render() {
    return this.renderAddSBox()
  }
}
</script>

<style scoped lang="scss">
.add-node-popover-item.notifier{
  .iconfont{
    margin-top:2px;
    margin-left: -6px;
  }
}
.add-node-popover-item.route{
   .iconfont{
    font-size: 30px;
    margin-left: 2px;
  }
}
.approver,.approver,.notifier{
  svg.icon{
    font-size: 40px;
  }
  // background:red
}
</style>
