<!--
 * @name: 整缸记录
 * @description: 整缸记录
 * @author: panmr
 * @time: 2021-06-26 10:17:04
-->
<template>
  <!-- <cs-custom-table :columns="wholeCylinderColumns" :border="true" :stripe="true" :cell-style="cellStyle" :header-cell-style="headerRowStyle" :data-source="wholeCylinderDataSource" /> -->
  <div class="whole-cylinder">
    <div class="box">
      <div v-for="(item,index) in qaFinishFabricDefectInformationList" :key="index" class="left-item">
        <div class="lable-text">{{ item.otherItemsName }}</div>
        <div class="data-text line-limit-length"><span style="color:#151222">{{ item.otherItemsValue }}</span><span v-if="item.remark" :title="item.remark" style="color:#777777">({{ item.remark }})</span></div>
      </div>
      <div class="left-item">
        <div class="lable-text">实际平均含潮率</div>
        <div v-if="data.qualifiedMoisture + '' === '1'" class="data-text"><span style="color:#151222">{{ data.realMoisture }}</span><span style="color:#00C4CD">(合格)</span></div>
        <div v-else class="data-text"><span style="color:#151222">{{ data.realMoisture }}</span><span style="color:#FF574F">(不合格)</span></div>
      </div>
      <div class="left-item">
        <div class="lable-text">实际平均规格</div>
        <div v-if="(data.qualifiedWidth + '' === '0') || (data.qualifiedWeight + '' === '0')" class="data-text"><span style="color:#151222">{{ `${data.realAverageWidth}${data.qaGreigeInspectionInfoResponse && LABEL.getLabelByKey(LABEL.dict.UNITS, data.qaGreigeInspectionInfoResponse.unit) || ''}-${(data.realAverageWeight) + 'g/m²'}` }}</span><span style="color:#FF574F">(不合格)</span></div>
        <div v-else class="data-text"><span style="color:#151222">{{ `${data.realAverageWidth}${data.qaGreigeInspectionInfoResponse && LABEL.getLabelByKey(LABEL.dict.UNITS, data.qaGreigeInspectionInfoResponse.unit) || ''}-${(data.realAverageWeight) + 'g/m²'}` }}</span><span style="color:#00C4CD">(合格)</span></div>
      </div>
      <div class="left-item">
        <div class="lable-text">验布结果（缸）</div>
        <div v-if="['C', 'c'].includes(data.fabricResult)" class="data-text line-limit-length"><span style="color:#FF574F">{{ data.fabricResult }}</span><span v-if="data.fabricResultProblem" style="color:#717171">({{ data.fabricResultProblem || '' }})</span></div>
        <div v-else class="data-text"><span style="color:#00C4CD">{{ data.fabricResult }}</span><span v-if="data.fabricResultProblem" :title="data.fabricResultProblem" style="color:#717171">({{ data.fabricResultProblem || '' }})</span></div>
      </div>
    </div>
  </div>
</template>
<script>

import LABEL from '../../label'

export default {
  name: 'InspectionFabricInfo',
  components: {},
  props: {
    // data: {
    //   type: Object,
    //   default: () => ({
    //     realMoisture: '',
    //     qualifiedMoisture: 0, // 含潮率是否合格 0不合格 1合格
    //     realAverageWidth: '', // 实际平均幅宽
    //     realAverageWeight: '', // 实际平均克重
    //     qualifiedWidth: 0, // 幅宽是否合格 0不合格 1合格
    //     qualifiedWeight: 0, // 克重是否合格 0不合格 1合格
    //     fabricResultProblem: '', // 验布结果问题
    //     qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
    //     qaFinishFabricRecordList: [], // 验布信息list
    //     qaGreigeInspectionInfoResponse: {} // 加工基础信息
    //   })
    // }
  },
  data() {
    return {
      headerRowStyle: {
        'background': '#F5F7FA',
        'height': '30'
      },
      wholeCylinderColumns: [],
      textMap: { '0': '不合格', '1': '合格' }, // 0不合格 1合格
      wholeCylinderDataSource: [],
      LABEL,
      data: {
        fabricResult: '',
        realMoisture: '',
        qualifiedMoisture: 0, // 含潮率是否合格 0不合格 1合格
        realAverageWidth: '', // 实际平均幅宽
        realAverageWeight: '', // 实际平均克重
        qualifiedWidth: 0, // 幅宽是否合格 0不合格 1合格
        qualifiedWeight: 0, // 克重是否合格 0不合格 1合格
        fabricResultProblem: '', // 验布结果问题
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 加工基础信息
      },
      qaFinishFabricDefectInformationList: []
    }
  },
  computed: {

  },
  watch: {
    // data: {
    //   handler(data) {
    //     this.$nextTick(() => {
    //       this.handleData(data)
    //       // this.load(data)
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  mounted() {
  },
  methods: {
    cellStyle() {
      return { 'background': '#fff' }
    },
    init(data = {}) {
      this.handleData(data)
      // this.load(data)
    },
    handleData(data = { qaFinishFabricDefectInformationList: [] }) {
      this.data = data
      this.qaFinishFabricDefectInformationList = data.qaFinishFabricDefectInformationList || [] // 成品验布疵点整缸信息
    },
    load(data = {}) {
      this.wholeCylinderDataSource = [] // 表格数据源
      this.wholeCylinderColumns = [] // 表格头
      const obj = {}
      const qaFinishFabricDefectInformationList = data.qaFinishFabricDefectInformationList || [] // 成品验布疵点整缸信息
      this.getList = qaFinishFabricDefectInformationList
      for (const item of qaFinishFabricDefectInformationList) {
        Object.keys(item).map(key => { obj[item.otherItemsName + '_' + key] = item[key] })
        // 构造表头数据
        this.wholeCylinderColumns.push({ prop: item.otherItemsName, label: item.otherItemsName, isShow: true, showOverflowTooltip: true, minWidth: '80', formater: scope => scope.row[item.otherItemsName + '_otherItemsValue'] })
      }
      // 实际平均含潮率
      obj['实际平均含潮率_otherItemsValue'] = data.realMoisture
      this.wholeCylinderColumns.push({ prop: '实际平均含潮率', label: '实际平均含潮率', isShow: true, showOverflowTooltip: true, minWidth: '200', formater: scope => {
        if (data.qualifiedMoisture + '' === '1') { // 合格
          return `${scope.row['实际平均含潮率_otherItemsValue']}<span style="color:#00C4CD">(${this.textMap[data.qualifiedMoisture]})</span>`
        } else { // 不合格
          return `${scope.row['实际平均含潮率_otherItemsValue']}<span style="color:#FF574F">(${this.textMap[data.qualifiedMoisture]})</span>`
        }
      } })
      // 实际平均规格 幅宽-克重
      obj['实际平均规格_otherItemsValue'] = `${data.realAverageWidth}${data.qaGreigeInspectionInfoResponse && LABEL.getLabelByKey(LABEL.dict.UNITS, data.qaGreigeInspectionInfoResponse.unit) || ''}-${(data.realAverageWeight) + 'g/m²'}`
      this.wholeCylinderColumns.push({ prop: '实际平均规格', label: '实际平均规格', isShow: true, showOverflowTooltip: true, minWidth: '200', formater: scope => {
        if ((data.qualifiedWidth + '' === '0') || (data.qualifiedWeight + '' === '0')) { // 不合格
          return `${scope.row['实际平均规格_otherItemsValue']}<span style="color:#FF574F">(不合格)</span>`
        } else { // 合格
          return `${scope.row['实际平均规格_otherItemsValue']}<span style="color:#00C4CD">(合格)</span>`
        }
      } })
      // 验布结果(缸)
      obj['验布结果(缸)_otherItemsValue'] = data.fabricResult
      this.wholeCylinderColumns.push({ prop: '验布结果(缸)', label: '验布结果(缸)', isShow: true, showOverflowTooltip: true, minWidth: '200', formater: scope => {
        if (data.fabricResult === 'C') { // 不合格
          return `<span style="color:#FF574F">${scope.row['验布结果(缸)_otherItemsValue']}</span><span style="color:#717171">${data.fabricResultProblem ? `(${data.fabricResultProblem})` : ''}</span>`
        } else {
          return `<span style="color:#00C4CD">${scope.row['验布结果(缸)_otherItemsValue']}</span><span style="color:#717171">${data.fabricResultProblem ? `(${data.fabricResultProblem})` : ''}</span>`
        }
      } })
      // 构建表格数据源
      this.wholeCylinderDataSource.push(obj)
    }
  }
}
</script>
<style lang="scss" scoped>
  .whole-cylinder{
    font-size: 14px;
    display: flex;
    color: #606266;
    .box{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .left-item{
      width: 33.33%;
      height: 40px;
      display: flex;
      align-items: center;
      border: 1px solid #dfe6ec;
      margin-top: -1px;
      margin-left: -1px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      .lable-text{
        display: flex;
        align-items: center;
        height: 40px;
        width: 130px;
        flex-shrink: 0;
        background-color: #f5f7fa;
        padding: 0 8px;
        border: 1px solid #dfe6ec;
        margin-left: -1px;
      }
      .data-text{
        flex: 1;
        padding: 0 8px;
      }
      .line-limit-length {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
