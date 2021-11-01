<!--
 * @name: 成品验布列表
 * @description: 成品验布列表
 * @author: panmr
 * @time: 2021-06-23 10:38:56
-->
<template>
  <div class="product-list-content">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- tab切换 -->
    <div class="tabchange">
      <el-tabs v-model="activeIdx" @tab-click="handleClick">
        <el-tab-pane v-for="(item, i) in status" :key="i" :name="item.value + ''">
          <span slot="label" :tabindex="item.value" class="labelIndex">{{ `${item.label}(${item.count || 0})` }}</span>
        </el-tab-pane>
      </el-tabs>
      <el-button v-if="$permission(['qa:qaYarnInspectionTesting:add'])" type="primary" size="small" style="margin-left: auto;" @click="handleAdd">平板模式</el-button>
    </div>

    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table ref="tableList" tooltip-effect="dark" table-scrollx :columns="columns" :data-source="dataSource" :pagination="pagination" edit-type="pop" @sort-change="changeSort" />
    </div>
  </div>
</template>

<script>
import { pageList, pageCount, getAllUser } from './api/index.js'
import LABEL from './label'

import popoverSelect from './components/popover-select'
export default {
  data() {
    // 分页配置信息
    const pagination = {
      pageSizes: [10, 20, 50, 80, 100],
      currentChange: val => {
        this.load({ ...this.formDatas, pageNum: val, pageSize: this.pagination.pageSize || 10 })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.load({ ...this.formDatas, pageNum: 1, pageSize: val })
      }
    }
    return {
      searchData: {
        _taskNo: { prop: 'taskNo', itemType: 'input', label: '验布编号', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入验布编号' },
        _produceOrderCode: { prop: 'produceOrderCode', itemType: 'input', label: '生产订单', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入生产订单' },
        _dyelotNo: { prop: 'dyelotNo', itemType: 'input', label: '缸号', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入缸号' },
        _factoryName: { prop: 'factoryName', itemType: 'input', label: '印染厂', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入印染厂' },
        _fabricResultList: { prop: 'fabricResultList', itemType: 'select', label: '验布结果', itemStyle: { width: '25%' }, clearable: true,
          dataSource: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }], multiple: true
        },
        _opearationUserNames: { prop: 'opearationUserNames', itemType: 'select', valueType: 'object', label: '验布员', itemStyle: { width: '25%' }, clearable: true, dataSource: [], multiple: true, filterable: true,
          visibleChange: (value, val) => value && this.getAllUser()
        },
        _opearationTimes: { prop: 'opearationTimes', itemType: 'date', type: 'daterange', label: '验布时间', valueFormat: 'timestamp', startPlaceholder: '开始日期', endPlaceholder: '结束日期', format: 'yyyy-MM-dd',
          defaultTime: ['00:00:00', '23:59:59'], itemStyle: { width: '25%' }, clearable: true, placeholder: '请选择' },
        _operate: { itemType: 'operate', submitText: '查询',
          submitHandle: params => {
            this.formDatas = params
            if (params.opearationTimes && params.opearationTimes.length) {
              this.formDatas.beginDate = params.opearationTimes[0]
              this.formDatas.endDate = params.opearationTimes[1]
            } else {
              this.formDatas.beginDate = undefined
              this.formDatas.endDate = undefined
            }
            this.load(this.formDatas)
          },
          resetHandle: () => {
            this.$refs['searchForm'].form.resetFields()
            this.$refs.tableList.$refs.table.clearSort()
          }
        }
      },
      formOtions: {
        size: 'small',
        inline: true,
        layout: true
      },
      formDatas: {
        status: '',
        pageNum: 1,
        pageSize: 10,
        taskNo: undefined,
        produceOrderCode: undefined,
        dyelotNo: undefined,
        factoryName: undefined,
        fabricResultList: [],
        opearationUserList: [],
        opearationTimes: [],
        opearationUserNames: [],
        beginDate: undefined,
        endDate: undefined
      },
      activeIdx: '2',
      columns: [
        { prop: 'code', label: '序号', minWidth: '50', fixed: 'left' },
        { prop: 'taskNo', label: '验布编号', minWidth: '140', fixed: 'left', showOverflowTooltip: true, permitTag: ['techManage:tmKnitTech:page'], style: { color: '#1890ff', cursor: 'pointer' },
          handle: (scope) => this.$router.push(`/quality-manage/finished-product-testing/finished-fabric-inspection/detail/${scope.row.id}`)
        },
        { prop: 'dyelotNo', label: '缸号', showOverflowTooltip: true, minWidth: '120' },
        { prop: 'productOrderNo', label: '生产订单', minWidth: '180', showOverflowTooltip: true },
        { prop: 'orderType', label: '订单类型', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaGreigeInspectionInfoResponse && LABEL.getLabelByKey(LABEL.dict.ORDER_TYPES, scope.row.qaGreigeInspectionInfoResponse.orderType) },
        { prop: 'isHeadBatch', label: '是否头缸', minWidth: '90', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.isHeadBatch === 1 ? '是' : '否' },
        { prop: 'currentProgress', label: '当前进度', width: '120', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.currentProgress },
        { prop: 'factoryName', label: '印染厂', showOverflowTooltip: true, minWidth: '220', formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.factoryName },
        { prop: 'productNo', label: '产品编码', showOverflowTooltip: true, minWidth: '180', formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.productNo },
        { prop: 'fabricType', label: '布类', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.fabricType },
        { prop: 'customerColor', label: '客户颜色', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.customerColor },
        { prop: 'fabricType1', label: '成品规格', width: '120', formater: scope => {
          return `${scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.realWidth || ''}${LABEL.getLabelByKey(LABEL.dict.UNITS, scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.unit) || ''}-${(scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.realWeight || '')}g/㎡`
        } },
        { prop: 'castVatQty', label: '总匹/总重(投坯)', width: '150', formater: scope => scope.row.qaGreigeInspectionInfoResponse && `${scope.row.qaGreigeInspectionInfoResponse.castVatVolumes || ''} / ${scope.row.qaGreigeInspectionInfoResponse.castVatQty || ''}` },
        { prop: 'finishQty', label: '总匹/总重(成品)', width: '150', formater: scope => scope.row.qaGreigeInspectionInfoResponse && `${scope.row.qaGreigeInspectionInfoResponse.finishVolumes || ''} / ${scope.row.qaGreigeInspectionInfoResponse.finishQty || ''}` },
        { prop: 'inspectionRate1', label: '已检匹数', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaFinishFabricRecordList && scope.row.qaFinishFabricRecordList.length },
        { prop: 'inspectionRate', label: '检验率', showOverflowTooltip: true, minWidth: '120' },
        { prop: 'fabricResult', label: '验布结果', showOverflowTooltip: true, minWidth: '120' },
        { prop: 'comment', label: '评语', showOverflowTooltip: true, minWidth: '150' },
        { prop: 'createdTime', label: '创建时间', showOverflowTooltip: true, width: '140',
          formater: (scope) => scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime, '{y}-{m}-{d} {h}:{i}') : ''
        },
        { prop: 'opearationUserName', label: '验布员', minWidth: '150', components: { popoverSelect }, componentsOptions: { prop: 'opearationUserName', callback: () => this.load({ ...this.formDatas, pageSize: this.pagination.pageSize || 10, pageNum: this.pagination.page || 1 }) }, formater: scope => scope.row.opearationUserName },
        { prop: 'opearationTime', label: '验布时间', showOverflowTooltip: true, width: '140',
          formater: (scope) => scope.row.opearationTime ? this.$filters.parseTime(scope.row.opearationTime, '{y}-{m}-{d} {h}:{i}') : ''
        },
        { prop: 'opearationUserName', label: '跟单员', showOverflowTooltip: true, minWidth: '120' },
        { prop: 'status', label: '状态', width: '100', fixed: 'right', isShow: this.isShow, formater: (scope) => `<span style="color: ${LABEL.getColorByKey(this.status, scope.row.status)}">${LABEL.getLabelByKey(this.status, scope.row.status)}</span>` }
      ],
      dataSource: [],
      pagination,
      // 状态 0：待提交，1：待处理，2：处理中，3：已处理
      status: LABEL.dict.STATUS
    }
  },
  created() {
    this.load()
  },
  methods: {
    isShow() {
      return Number(this.activeIdx) === -1
    },
    // 点击前往平板模式
    handleAdd() {
      this.$router.push(`/finished-ipad/finished-ipad-list`)
    },
    // 排序点击事件
    changeSort(e) {
      // 申请时间
      if (e.prop === 'createdTime') {
        if (e.order === 'ascending') {
          this.formDatas.applyTimeOrder = 0
        } else {
          this.formDatas.applyTimeOrder = 1
        }
      }
      this.load()
    },
    handleClick(e) {
      this.formDatas.status = e.name
      this.formDatas.pageSize = 10
      this.formDatas.pageNum = 1
      this.load(this.formDatas)
    },
    // 分页查询数量统计
    async getPageCount(params = {}) {
      const { code = 0, data = [] } = await pageCount({ pageSize: this.pagination.pageSize || 10, pageNum: this.pagination.page || 1, ...params, status: '' })
      if (code === 200) {
        this.status.forEach(statusItem => {
          statusItem.count = 0
          data.forEach(item => {
            if (statusItem.value === item.status) {
              statusItem.count = item.num
            }
          })
        })
      }
    },
    // 列表数据
    async load(data = {}) {
      let res = await pageList({ ...data, opearationUserList: this.formDatas.opearationUserNames.map(n => n.label), status: Number(this.activeIdx) === -1 ? '' : Number(this.activeIdx) })
      res = res.data || {}
      if (this.activeIdx !== '-1' && !res.list || res.list.length === 0) {
        this.activeIdx = '-1'
        this.load({ ...data, opearationUserList: this.formDatas.opearationUserNames.map(n => n.label), status: Number(this.activeIdx) === -1 ? '' : Number(this.activeIdx) })
      }
      res.list && res.list.map((item, index) => { item.code = (res.pageNum - 1) * res.pageSize + index + 1 })
      this.dataSource = res.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.total,
        ...data,
        currentPage: res.pageNum,
        pageSize: res.pageSize,
        page: res.pageNum
      }
      this.getPageCount({ ...data, opearationUserList: this.formDatas.opearationUserNames.map(n => n.label) })
    },
    // 获取所有的员工
    async getAllUser() {
      const { code = 0, data = { list: [] }} = await getAllUser()
      if (code === 200) {
        this.searchData['_opearationUserNames'].dataSource = data.list.map(n => ({ value: n.userId, label: n.realName }))
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tabchange{
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d0d6da;
  padding-right: 20px;
  background: #fff;
  .labelIndex{
    padding: 0 10px;
    border: 0 none;
    outline: none;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
  /deep/ .el-tabs__item{
    height: 57px;
    line-height: 57px;
    padding-left: 20px !important;
  }
  /deep/ .el-tabs__active-bar{
    height: 3px;
  }
  /deep/ .el-tabs__nav-wrap::after{
    height: 1px;
    z-index: 8;
  }
}
</style>
