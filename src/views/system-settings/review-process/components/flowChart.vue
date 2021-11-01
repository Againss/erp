<template>
  <div id="drawProcessDesign">
    <!-- <el-button @click="getData">提交</el-button> -->
    <flow-chart
      ref="flow"
      :flow-config="FlowConfig"
      class="flow FlowClass"
      @clickNode="clickNode"
    />
    <cs-custom-pop v-if="options.visible" ref="pop" :options="options" />
  </div>
</template>

<script>
import flowChart from '@/components/flowChart/src/flowChart'
import setApprover from '@/views/system-settings/review-process/components/setApprover.vue'
import setCondition from '@/views/system-settings/review-process/components/setCondition.vue'

export default {
  name: 'Home',
  components: {
    flowChart
  },
  props: {
    flowConfigProp: {
      type: String,
      default: ''
    },
    msgNotifyType: {
      type: Number,
      default: 0
    }
  },
  data() {
    const conditionOptions = {
      itemType: 'drawer',
      className: 'condition',
      visible: false,
      modalAppendToBody: true,
      lockScroll: false,
      title: '条件',
      showClose: false,
      size: '600px',
      okText: '保存',
      cancelText: '取消',
      ok: (params) => {
        if (!this.conditionResult.length) {
          this.$message({
            message: '请添加条件',
            type: 'warning'
          })
          return
        }
        if (!this.node.type === '3') {
          return
        }
        const data = this.conditionResult
        for (var i = 0; i < data.length; i++) {
          const el = data[i]
          if (!el.param_1 || !el.condition_1 || !el.value) {
            this.$message({
              message: '请补充全条件内容',
              type: 'warning'
            })
            return
          }
        }
        var content = ''
        const dataResult = []
        var contentArr = []
        data.forEach((i) => {
          const param = JSON.parse(i.param_1)
          const condition = JSON.parse(i.condition_1)
          content = `${content}\n ${param.label}  ${condition.label}  ${i.value}`
          contentArr.push(`${param.label}  ${condition.label}  ${i.value}`)
          const obj = {
            param: param.value,
            condition: condition.value,
            value: i.value,
            param_1: i.param_1,
            condition_1: i.condition_1
          }
          dataResult.push(obj)
        })
        this.$set(this.node, 'data', { conditionList: dataResult })
        if (contentArr.length > 1) {
          this.$set(this.node, 'content', `${contentArr.length}个条件`)
        } else {
          this.$set(this.node, 'content', content)
        }
        this.$refs.flow.nodeChange(this.node)
        this.$set(this.conditionOptions, 'visible', false)
        this.conditionResult = []
      },
      cancel: (params) => {
        this.$set(this.conditionOptions, 'visible', false)
      },
      content: {
        _setCondition: {
          prop: '_setCondition',
          components: { setCondition },
          formDatas: null,
          componentsOptions: {
            get: (val) => {
              this.conditionResult = val
            }
          }
        }
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      modalAppendToBody: true,
      lockScroll: false,
      title: '审批人',
      showClose: false,
      size: '600px',
      okText: '保存',
      cancelText: '取消',
      ok: (params) => {
        if (!this.result.person.length) {
          this.$message({
            message: '请选择成员',
            type: 'warning'
          })
          return
        }
        // 审核人 auditUserList  抄送人 copyUserList
        // 抄送人 type 4  条件 type 3  审批人 type 2
        var data = {}
        var person = []
        var content = []
        this.result.person.forEach((el) => {
          person.push(el)
          content.push(el.realName)
          el = JSON.stringify(el)
        })
        if (this.node.type === '1' || this.node.type === '3') return
        if (this.node.type === '2') {
          data = {
            auditUserList: person,
            opera: this.result.opera === 0 || !this.result.opera ? 0 : 1, // 删除所有成员后为undefined，因此undefined为默认会签
            notifyApplyUser: this.result.notifyApplyUser
          }
          if (this.result.title === '') {
            return
          } else if (this.result.title) {
            this.$set(this.node, 'title', this.result.title)
          }
        } else if (this.node.type === '4') {
          data = {
            copyUserList: person
          }
        }
        this.$set(this.node, 'data', data)
        if (content.length && content.length === 1) {
          this.$set(this.node, 'content', content.join())
        } else if (content.length && content.length > 1) {
          const opera = (data.opera === 0) ? '会签' : (data.opera === 1 ? '或签' : '抄送')
          const c = `${content.length}人${opera}`
          this.$set(this.node, 'content', c)
        }
        this.$set(this.popOptions, 'visible', false)
        this.$refs.flow.nodeChange(this.node)
        this.close()
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
        this.close()
      },
      content: {
        _setApprover: {
          components: { setApprover },
          msgNotifyType: this.msgNotifyType,
          formDatas: null,
          componentsOptions: {
            get: (property, val) => {
              this.result[property] = val
            }
          }
        }
      }
    }
    return {
      result: {
        person: [],
        opera: 0
      },
      FlowConfig: [
        {
          id: 'root',
          groupId: null,
          type: '1',
          title: '发起人',
          content: '请选择',
          isRow: true,
          isRoot: true,
          data: {}
        }
      ],
      popOptions,
      conditionOptions,
      options: {},
      node: null,
      conditionResult: [
        // {
        //   param: '',
        //   condition: '',
        //   value: ''
        // }
      ]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  watch: {
    flowConfigProp(value) {
      // console.log('watch:', value)
      if (value) {
        this.FlowConfig = JSON.parse(value)
        // 应需求先隐藏发起人信息
        this.FlowConfig[0].content = ''
        this.$nextTick(() => {
          this.$refs.flow.init()
        })
      }
    },
    msgNotifyType(v) {
      this.$set(this.popOptions.content._setApprover, 'msgNotifyType', v)
    }
  },
  created() {
    this.init()
    // 应需求先隐藏发起人信息
    // this.FlowConfig[0].content = this.userInfo.realName
    this.FlowConfig[0].content = ''
  },
  methods: {
    getData() {
      const res = this.$refs.flow.getResData()
      var tip = true
      for (let i = 0; i < res.length; i++) {
        if (i !== 0) {
          const arr = Object.keys(res[i].data)
          for (let j = 0; j < arr.length; j++) {
            const obj = res[i].data
            if (!obj[arr[j]] && obj[arr[j]] !== 0) {
              tip = false
            }
          }
          if ((arr.length && !tip) || !arr.length) {
            this.$message({
              message: '请补充流程节点信息',
              type: 'warning'
            })
            return false
          }
        }
      }
      return JSON.stringify(res)
      // console.info('这是返回的一维数组', JSON.stringify(res))
    },
    /**
     * 1、创建一个row length 1
     * 2、创建一个col节点
     * 3、创建一组col length 1
     * return [{pid id type}]
     */
    getNodeArr() {
      this.FlowConfig = this.$refs.flow.getNodeArr()
      return this.FlowConfig
    },
    async init() {
      // await this.getWorkflowInfo({ workflowId: '' })
      // this.FlowConfig = this.transform(this.FlowConfig);
    },
    clickNode(node) {
      // node.content = '123'
      // this.$refs.flow.nodeChange(node)
      console.info('当前点击节点', node)
      this.node = node
      if (this.node.type === '1') {
        return
      } else if (this.node.type === '3') {
        this.options = this.conditionOptions
        this.$set(
          this.conditionOptions.content._setCondition,
          'formDatas',
          this.node
        )
        this.$set(this.conditionOptions, 'visible', true)
      } else {
        this.options = this.popOptions
        this.$set(this.popOptions.content._setApprover, 'formDatas', this.node)
        this.$set(this.popOptions, 'visible', true)
        this.$set(
          this.popOptions,
          'title',
          this.node.type === '2' ? '审批人' : '抄送人'
        )
      }
    },
    close() {
      this.result = {
        person: [],
        opera: 0
      }
    }
  }
}
</script>

<style  lang="scss">
#drawProcessDesign .flow {
  .node-wrap-box .content .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
#drawProcessDesign
  .condition
  .el-drawer__container
  .el-drawer.customDrawerclass
  .content {
  padding: 0 30px;
}
#drawProcessDesign {
  .FlowClass {
    .node-wrap-box-1,
    .node-wrap-box-2 {
      background: #5e88fc;
    }
    .node-wrap-box-4 {
      background: #ffbd39;
    }
    .node-wrap-box {
      border-radius: 6px;
      .title {
        height: 38px;
        color: #ffffff;
        background: none;
      }
      .content {
        padding: 0 8px 10px;
        .text {
          padding-left: 10px;
          background: #fff;
          color: #666666;
          border-radius: 4px;
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .condition-node .condition-node-box .auto-judge {
      border: 1px solid rgba(187, 194, 208, 0.5);
      padding: 0;
      .close {
        right: 12px;
        top: 8px;
      }
      .title-wrapper {
        border-bottom: 1px solid rgba(187, 194, 208, 0.5);
        height: 34px;
        .editable-title {
          display: inline-block;
          line-height: 34px;
          padding-left: 14px;
        }
        .editable-title:hover {
          border-bottom: none;
        }
      }
      .content {
        color: #666666;
        padding-left: 14px;
        line-height: 38px;
        height: 38px;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .add-branch {
      background: #ffffff;
      border: 1px solid #03b2bb;
      border-radius: 14px;
      color: #03b2bb;
      width: 88px;
    }
  }
}
</style>
<style lang="scss" scoped>
#drawProcessDesign {
  background: #f0f2f5;
}
</style>
