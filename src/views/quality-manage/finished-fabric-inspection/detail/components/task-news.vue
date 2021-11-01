<!--
 * @name: 任务动态
 * @description: 任务动态
 * @author: panmr
 * @time: 2021-06-23 14:33:26
-->
<template>
  <div class="task-info">
    <div class="task-info-header">
      <span>任务动态</span>
    </div>
    <div class="task-info-content">
      <cs-custom-table :columns="columns" :border="true" :stripe="false" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :data-source="dataSource" />
    </div>
  </div>
</template>

<script>

import multipleFiles from './multiple-files'

export default {
  name: 'TaskNews',
  components: {},
  props: {
  },
  data() {
    return {
      headerCellStyle: {
        'background': '#F5F7FA',
        'height': '40'
      },
      // 数据源
      dataSource: [],
      columns: [
        { prop: 'handler', label: '处理人', width: '120', showOverflowTooltip: true },
        { prop: 'time', label: '处理时间', width: '150', showOverflowTooltip: true, formater: (scope) => scope.row.time ? this.$filters.parseTime(scope.row.time, '{y}-{m}-{d} {h}:{i}') : '' },
        { prop: 'comment', label: '评论', minWidth: '150', showOverflowTooltip: true },
        { prop: 'code', label: '附件', minWidth: '150', components: { multipleFiles }, componentsOptions: { prop: 'code' }
        }
      ],
      data: {
        opearationUserId: '',
        auditUserId: '',
        opearationUserName: '',
        auditUserName: '',
        opearationTime: '',
        auditTime: '',
        comment: '',
        auditComments: '',
        opearationComments: '',
        auditAttachmentList: [],
        attachmentList: [],
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 加工基础信息
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    cellStyle({ column }) {
      return { 'background': '#fff' }
    },
    // 初始化
    init(data = {}) {
      const arr = []
      if (data.opearationUserId) {
        const first = { handler: data.opearationUserName || '-', time: data.opearationTime || '-', comment: data.comment || '-', code: data.attachmentList || [] }
        arr.push(first)
      }
      if (data.auditUserId) {
        const second = { handler: data.auditUserName || '-', time: data.auditTime || '-', comment: data.auditComments || '-', code: data.auditAttachmentList || [] }
        arr.push(second)
      }
      this.dataSource = arr
    }
  }
}
</script>
<style lang="scss" scoped>
.task-info {
  background: #ffffff;
  margin-bottom: 15px;
  .task-info-header {
    padding: 20px;
    border-bottom: 1px solid #EEEFF0;
  }
  .task-info-content{
    padding: 15px;
  }
}
</style>
