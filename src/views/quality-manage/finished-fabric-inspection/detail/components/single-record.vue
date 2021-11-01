<!--
 * @name: 单匹记录
 * @description: 单匹记录
 * @author: panmr
 * @time: 2021-06-26 11:03:05
-->
<template>
  <div class="single-record-wrpa">
    <cs-custom-table :columns="singleColumns" :border="true" :stripe="false" :header-cell-style="headerRowStyle" :cell-style="cellStyle" :data-source="singleDataSource" />
  </div>
</template>

<script>
import { qaFinishFabricInspectionTaskList } from '../api/index'

export default {
  name: 'SingleRecord',
  data() {
    return {
      headerRowStyle: {
        'background': '#F5F7FA',
        'height': '30'
      },
      singleColumns: [], // 表头
      singleDataSource: [] // 表格数据源
    }
  },
  mounted() {
  },
  methods: {
    cellStyle({ column }) {
      if (column.property === 'greigeNumber') { // 第一列
        return { 'background': '#F5F7FA' }
      } else {
        return { 'background': '#fff' }
      }
    },
    // 处理数据
    handleData(list, qaFinishFabricRecordList) {
      this.singleColumns = [] // 表头字段
      qaFinishFabricRecordList.length && this.singleColumns.push({ prop: 'greigeNumber', label: '匹号', width: '130' })
      for (let i = 0; i < qaFinishFabricRecordList.length; i++) { // greigeNumber 匹号
        // 构造表头 table_header
        const table_header = { prop: `greigeNumber_${qaFinishFabricRecordList[i].greigeNumber}`, label: qaFinishFabricRecordList[i].greigeNumber, minWidth: '120',
          formater: (scope = { row: {}, column: { property: '' }}) => {
            if (scope.row[scope.column.property] && scope.row[scope.column.property].includes('/') && scope.row[scope.column.property].split('/').length === 4) {
              let html = '<div style="display: flex">'
              scope.row[scope.column.property].split('/').forEach((n, index, self) => {
                if (index === self.length - 1) {
                  html += `<div style="width: 25%;text-align: center">${n ? (n + '') === '0' ? '&nbsp;' : n : '&nbsp;'}</div>`
                } else {
                  html += `<div style="width: 25%;text-align: center;border-right: 1px solid #dfe6ec">${n ? (n + '') === '0' ? '&nbsp;' : n : '&nbsp;'}</div>`
                }
              })
              html += '</div>'
              return html
            }
            if (scope.row[scope.column.property] && scope.row[scope.column.property].includes(',')) {
              let html = '<div style="display: flex">'
              scope.row[scope.column.property].split(',').forEach((n, index, self) => {
                if (index === self.length - 1) {
                  html += `<div style="width: 25%;text-align: center">${n ? (n + '') === '0' ? '&nbsp;' : n : '&nbsp;'}</div>`
                } else {
                  html += `<div style="width: 25%;text-align: center;border-right: 1px solid #dfe6ec">${n ? (n + '') === '0' ? '&nbsp;' : n : '&nbsp;'}</div>`
                }
              })
              html += '</div>'
              return html
            }
            return `<div style="text-align: center">${scope.row[scope.column.property] ? (scope.row[scope.column.property] + '') === '0' ? '&nbsp;' : scope.row[scope.column.property] : '&nbsp;'}</div>`
          }
        }
        this.singleColumns.push(table_header)
      }
      // 构造表格数据源（取第一匹的疵点四分List的方式）
      for (let j = 0; j < list.length; j++) {
        const obj = { greigeNumber: list[j].name } // 模板 { greigeNumber: '疵点\\扣分', greigeNumber_1: '1/2/3/4', greigeNumber_2: '4/5/6/8', greigeNumber_3: '4/5/6/80' }
        for (let i = 0; i < qaFinishFabricRecordList.length; i++) { // 验布信息list
          for (let ii = 0; ii < qaFinishFabricRecordList[i].finishFabricDefectFourList.length; ii++) { // 疵点四分List
            if (list[j].name === qaFinishFabricRecordList[i].finishFabricDefectFourList[ii].deductionItemsName && list[j].id === qaFinishFabricRecordList[i].finishFabricDefectFourList[ii].deductionItemsId) {
              obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].finishFabricDefectFourList[ii].deductionItemsDistribution
            }
          }
          for (let ii = 0; ii < qaFinishFabricRecordList[i].finishFabricDefectInformationList.length; ii++) { // 疵点信息List
            if (list[j].name === qaFinishFabricRecordList[i].finishFabricDefectInformationList[ii].otherItemsName && list[j].id === qaFinishFabricRecordList[i].finishFabricDefectInformationList[ii].otherItemsId) {
              obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].finishFabricDefectInformationList[ii].otherItemsValue
            }
          }
          if (list[j].name === '疵点扣分' && list[j].id === '0') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = '1/2/3/4'
          }
          if (list[j].name === '实封/边封' && list[j].id === '1') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].realWidth} / ${qaFinishFabricRecordList[i].realBorderWidth}`
          }
          if (list[j].name === '重量/码长' && list[j].id === '2') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].weight} / ${qaFinishFabricRecordList[i].realCodeLength}`
          }
          if (list[j].name === '克重g/m2' && list[j].id === '3') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].fabricWeight}`
          }
          if (list[j].name === '回后克重g/m2' && list[j].id === '4') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].returnFabricWeight}`
          }
          if (list[j].name === '含潮测试' && list[j].id === '5') {
            const arr = qaFinishFabricRecordList[i].moistureTest.split(',') || []
            const average = arr.length && (arr.map(Number).reduce((n, m) => n + m) / arr.length)
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = (Math.round(average * 100) / 100) + '' // 四舍五入保留两位小数
          }
          if (list[j].name === '总分' && list[j].id === '6') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].sumnumber
          }
          if (list[j].name === '平方分100码' && list[j].id === '7') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].averageHundred
          }
          if (list[j].name === '验布结果(匹)' && list[j].id === '8') {
            obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].fabricResult
          }
        }
        this.singleDataSource.push(obj)
      }
      // 构造表格数据源 (原来请求列表接口的处理方式)
      // for (let j = 0; j < list.length; j++) {
      //   const obj = { greigeNumber: list[j].name } // 模板 { greigeNumber: '疵点\\扣分', greigeNumber_1: '1/2/3/4', greigeNumber_2: '4/5/6/8', greigeNumber_3: '4/5/6/80' }
      //   for (let i = 0; i < qaFinishFabricRecordList.length; i++) { // 验布信息list
      //     for (let ii = 0; ii < qaFinishFabricRecordList[i].finishFabricDefectFourList.length; ii++) { // 疵点四分List
      //       if (list[j].name === qaFinishFabricRecordList[i].finishFabricDefectFourList[ii].deductionItemsName) {
      //         obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].finishFabricDefectFourList[ii].deductionItemsDistribution
      //       }
      //     }
      //     for (let ii = 0; ii < qaFinishFabricRecordList[i].finishFabricDefectInformationList.length; ii++) { // 疵点信息List
      //       if (list[j].name === qaFinishFabricRecordList[i].finishFabricDefectInformationList[ii].otherItemsName) {
      //         obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].finishFabricDefectInformationList[ii].otherItemsValue
      //       }
      //     }
      //     if (list[j].name === '实封/边封') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].realWidth || ''}/${qaFinishFabricRecordList[i].realBorderWidth}`
      //     }
      //     if (list[j].name === '重量/码长') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].weight || ''}/${qaFinishFabricRecordList[i].realCodeLength}`
      //     }
      //     if (list[j].name === '克重g/m2') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].fabricWeight || ''}`
      //     }
      //     if (list[j].name === '回后克重g/m2') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = `${qaFinishFabricRecordList[i].returnFabricWeight || ''}`
      //     }
      //     if (list[j].name === '含潮测试') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].moistureTest
      //     }
      //     if (list[j].name === '总分') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].sumnumber
      //     }
      //     if (list[j].name === '平方分100码') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].averageHundred
      //     }
      //     if (list[j].name === '验布结果(匹)') {
      //       obj['greigeNumber_' + qaFinishFabricRecordList[i].greigeNumber] = qaFinishFabricRecordList[i].fabricResult
      //     }
      //   }
      //   this.singleDataSource.push(obj)
      // }
      // console.log('--singleDataSource--')
      // console.log(this.singleDataSource)
    },
    async getList(qaFinishFabricRecordList) {
      const { code = 0, data = [] } = await qaFinishFabricInspectionTaskList({ singleOrEntire: '单匹', isEnabled: 1, status: 'Y' })
      if (code === 200) {
        this.handleData(data, qaFinishFabricRecordList)
      }
    },
    // 初始化
    init(data = {}) {
      // 拿第一匹的数据
      if (data) {
        let list = []
        if (data.qaFinishFabricRecordList && data.qaFinishFabricRecordList.length) {
          const finishFabricDefectFourList_names = data.qaFinishFabricRecordList[0].finishFabricDefectFourList.map(n => ({ id: n.deductionItemsId, name: n.deductionItemsName }))
          const finishFabricDefectInformationList_names = data.qaFinishFabricRecordList[0].finishFabricDefectInformationList.map(n => ({ id: n.otherItemsId, name: n.otherItemsName }))
          list = [...finishFabricDefectFourList_names, ...finishFabricDefectInformationList_names]
          list.unshift({ id: '0', name: '疵点扣分' })
          list.push({ id: '1', name: '实封/边封' })
          list.push({ id: '2', name: '重量/码长' })
          list.push({ id: '3', name: '克重g/m2' })
          list.push({ id: '4', name: '回后克重g/m2' })
          list.push({ id: '5', name: '含潮测试' })
          list.push({ id: '6', name: '总分' })
          list.push({ id: '7', name: '平方分100码' })
          list.push({ id: '8', name: '验布结果(匹)' })
        }
        this.handleData(list, data.qaFinishFabricRecordList || [])
      }
      // this.getList(data.qaFinishFabricRecordList || [])
    }
  }
}
</script>
<style lang="scss" scoped>
.cell {
  width: 25%;
  text-align: center;
  border: 1px solid red;
}
</style>
<style lang="scss">
  .single-record-wrpa{
    .el-table__body td{
      padding: 0;
    }
    .el-table .cell{
      padding: 0;
      line-height: 30px;
    }
    .el-table--border th{
      padding: 0;
      .cell{
        text-align: center;

      }
    }
  }
</style>
