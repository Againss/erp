<template>
  <div id="drawProcessDesign">
    <el-button @click="getData">提交</el-button>
    <flow-chart
      ref="flow"
      :flow-config="FlowConfig"
      @clickNode="clickNode"
    />
  </div>
</template>
<style lang="scss" scoped>
    #drawProcessDesign {
        background: #f0f2f5;
    }
</style>

<script>
import flowChart from '@/components/flowChart/src/flowChart'
export default {
  name: 'Home',
  components: {
    flowChart
  },
  data() {
    return {
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
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    getData() {
      console.log(this.$refs.flow)
      const res = this.$refs.flow.getResData()
      console.info('这是返回的一维数组', res)
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
    init() {
      // this.FlowConfig = this.transform(this.FlowConfig);
    },
    clickNode(node) {
      // node.content = '123'
      // this.$refs.flow.nodeChange(node)
      console.info('当前点击节点', node)
    }
  }
}
</script>
