<!--
 * @name: 验布信息
 * @description: 验布信息
 * @author: panmr
 * @time: 2021-06-23 14:33:26
-->
<template>
  <div>
    <div class="order-header">
      <span>验布信息</span>
    </div>
    <div class="search">
      <div style="margin-bottom: 15px">
        <span style="font-size: 16px;color: #151130;">单匹记录</span>
      </div>
      <div style="padding: 15px 0;">
        <single-record ref="singleRecord" />
      </div>
      <div style="margin: 15px 0">
        <span style="font-size: 16px;color: #151130;">整缸记录</span>
      </div>
      <div style="padding: 15px 0">
        <whole-cylinder-record ref="wholeCylinderRecord" />
      </div>
    </div>
  </div>
</template>

<script>
import singleRecord from './single-record'
import wholeCylinderRecord from './whole-cylinder-record'

export default {
  name: 'InspectionFabricInfo',
  components: { singleRecord, wholeCylinderRecord },
  props: {
  },
  data() {
    return {
      data: {
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
    // 初始化
    init(data = {}) {
      this.load(data)
    },
    load(data = {}) {
      this.$refs['singleRecord'].init(data)
      this.$refs['wholeCylinderRecord'].init(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.order-header {
  background: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #EEEFF0;
}
</style>
