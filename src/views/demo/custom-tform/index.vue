/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div style="padding: 20px">
    <div style="background: #fff;padding: 10px">
      <cs-custom-form-demo-chunk />
      <!--    <cs-custom-table-inline-demo-chunk />-->
      <cs-print-demo-chunk />
      <drag-sort-demo />
      <div class="custom-demo-title">
        <a style="color: #0F89F3"><router-link to="/flow-chart">审核流程</router-link></a>
      </div>
      <div class="custom-demo-title">
        <a style="color: #0F89F3"><router-link to="/nginx-kafka">nginx-kafka操作日志配置</router-link></a>
      </div>
      <cs-charts-demo-chunk />
      <cs-custom-table-pop-demo-chunk />
      <code-chunk />
      <cs-document-chunk />
      <div>此组件有疑问请钉钉咨询:Roman</div>
      <el-backtop />
    </div>
  </div>
</template>

<script>

import csCustomFormDemoChunk from './components/cs-custom-form-demo'
// import csCustomTableInlineDemoChunk from './components/cs-custom-table-inline-demo'
// import csPrintDemoChunk from './components/cs-print-demo'
// import DragSortDemo from './components/drag-sort-demo'
// import csChartsDemoChunk from './components/cs-charts-demo'
// import csCustomTablePopDemoChunk from './components/cs-custom-table-pop-demo'
// import codeChunk from './components/code'
// import csDocumentChunk from './components/cs-document-demo'

export default {
  name: 'Tform',
  components: {
    csCustomFormDemoChunk,
    // csCustomTableInlineDemoChunk,
    csPrintDemoChunk: () => import('./components/cs-print-demo'),
    DragSortDemo: () => import('./components/drag-sort-demo'),
    csChartsDemoChunk: () => import('./components/cs-charts-demo'),
    csCustomTablePopDemoChunk: () => import('./components/cs-custom-table-pop-demo'),
    codeChunk: () => import('./components/code'),
    csDocumentChunk: () => import('./components/cs-document-demo')
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
