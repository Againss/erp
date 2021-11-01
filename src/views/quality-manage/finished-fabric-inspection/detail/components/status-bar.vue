<template>
  <div class="status-info">
    <span style="font-size: 18px;">验布编号：{{ data.taskNo || '' }}</span>
    <div class="detail-info" style="margin-left: auto;">
      <span>创建人：{{ data.createName }}</span>
      <span>{{ data.createdTime ? $filters.parseTime(data.createdTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
      <span style="margin-left: 10px;">验布员：{{ data.opearationUserName }}</span>
      <span>{{ data.opearationTime ? $filters.parseTime(data.opearationTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
      <span>审核人：{{ data.auditUserName }}</span>
      <span :style="{color: LABEL.getColorByKey(LABEL.dict.STATUS, data.status)}">{{ LABEL.getLabelByKey(LABEL.dict.STATUS, data.status) }}</span>
    </div>
  </div>
</template>

<script>
import LABEL from '../../label'

export default {
  props: {
  },
  data() {
    return {
      LABEL,
      data: {
        createName: '',
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 加工基础信息
      }
    }
  },
  watch: {
    data: {
      handler(data) {
        this.$nextTick(() => {})
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 初始化
    init(data) {
      this.data = Object.assign({}, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.status-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  //padding: 0 20px;
  margin-bottom: 16px;
  .detail-code {
    font-size: 18px;
    color: #151222;
  }
  .copy-code {
    font-size: 12px;
    color: #777777;
  }
  .detail-info {
    font-size: 12px;
    color: #666666;
    span {
      margin-right: 10px;
    }
  }
}
</style>
