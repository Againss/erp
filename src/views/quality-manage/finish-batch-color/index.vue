<!--
 * @name: 成品批色列表
 * @description: 成品批色列表
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
    </div>

    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table ref="tableList" :columns="columns" table-scrollx :data-source="dataSource" :pagination="pagination" edit-type="pop" @sort-change="changeSort" />
    </div>
  </div>
</template>

<script>
import { pageList, pageCount, getfactoryNamesList } from './api/index.js'
import popoverSelect from './components/popover-select'
import LABEL from './label'

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
        _colorTaskNo: { prop: 'colorTaskNo', itemType: 'input', label: '批色编号', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入批色编号' },
        _produceOrderCode: { prop: 'produceOrderCode', itemType: 'input', label: '生产订单', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入生产订单' },
        _dyelotNo: { prop: 'dyelotNo', itemType: 'input', label: '缸号', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入缸号' },
        _customerName: { prop: 'customerName', itemType: 'input', label: '客户', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入客户' },
        _brandName: { prop: 'brandName', itemType: 'input', label: '品牌商', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入品牌商' },
        _createdTime: { prop: 'createdTime', itemType: 'date', type: 'daterange', label: '创建时间', startPlaceholder: '开始日期', endPlaceholder: '结束日期', format: 'yyyy-MM-dd',
          valueFormat: 'timestamp', defaultTime: ['00:00:00', '23:59:59'], itemStyle: { width: '25%' }, clearable: true, placeholder: '请选择' },
        _batchColorUser: { prop: 'batchColorUser', itemType: 'input', label: '批色员', itemStyle: { width: '25%' }, clearable: true, placeholder: '请输入批色员' },
        _dealTime: { prop: 'dealTime', itemType: 'date', type: 'daterange', label: '处理时间', startPlaceholder: '开始日期', endPlaceholder: '结束日期', format: 'yyyy-MM-dd',
          valueFormat: 'timestamp', defaultTime: ['00:00:00', '23:59:59'], itemStyle: { width: '25%' }, clearable: true, placeholder: '请选择' },
        _factoryIds: { prop: 'factoryIds', itemType: 'select', label: '染印厂', itemStyle: { width: '50%' }, clearable: true, dataSource: [], multiple: true, filterable: true,
          visibleChange: (value, val) => value && this.getfactoryNamesList()
        },
        _operate: { itemType: 'operate', submitText: '查询',
          submitHandle: params => {
            this.formDatas = params
            if (params.createdTime && params.createdTime.length) {
              this.formDatas.createdStartTime = params.createdTime[0]
              this.formDatas.createdEndTime = params.createdTime[1]
            } else {
              this.formDatas.createdStartTime = undefined
              this.formDatas.createdEndTime = undefined
            }
            if (params.dealTime && params.dealTime.length) {
              this.formDatas.dealStartTime = params.dealTime[0]
              this.formDatas.dealEndTime = params.dealTime[1]
            } else {
              this.formDatas.dealStartTime = undefined
              this.formDatas.dealEndTime = undefined
            }
            this.load(this.formDatas)
          },
          resetHandle: () => {
            this.$refs['searchForm'].form.resetFields()
            this.formDatas = {}
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
        colorTaskNo: undefined,
        produceOrderCode: undefined,
        dyelotNo: undefined,
        factoryIds: [],
        status: '',
        customerName: undefined,
        brandName: undefined,
        createdTime: [],
        createdStartTime: undefined,
        createdEndTime: undefined,
        createdTimeOrder: undefined,
        dealTime: [],
        pageNum: 1,
        pageSize: 10,
        dealStartTime: undefined,
        dealEndTime: undefined,
        dealTimeOrder: undefined
      },
      activeIdx: '0',
      columns: [
        { prop: 'code', label: '序号', minWidth: '50', fixed: 'left' },
        { prop: 'colorTaskNo', label: '批色编号', minWidth: '140', fixed: 'left', showOverflowTooltip: true, permitTag: ['techManage:tmKnitTech:page'], style: { color: '#1890ff', cursor: 'pointer' },
          handle: (scope) => this.$router.push(`/quality-manage/finished-product-testing/finish-batch-color/detail/${scope.row.id}`)
        },
        { prop: 'dyelotNo', label: '缸号', showOverflowTooltip: true, minWidth: '140', formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.dyelotNo },
        { prop: 'currentProgress', label: '当前进度', minWidth: '120', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.currentProgress },
        { prop: 'status', label: '状态', minWidth: '120', showOverflowTooltip: true, isShow: this.isShow1, formater: scope => {
          return `<span style="color:${LABEL.getColorByKey(LABEL.dict.STATUS, scope.row.status)}">${LABEL.getLabelByKey(LABEL.dict.STATUS, scope.row.status)}</span>`
        } },
        { prop: 'produceOrderCode', label: '生产订单', minWidth: '180', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.produceOrderCode },
        { prop: 'orderType', label: '订单类型', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaCustomerOrderInfoResponse && LABEL.getLabelByKey(LABEL.dict.ORDER_TYPES, scope.row.qaCustomerOrderInfoResponse.orderType) },
        { prop: 'isHeadBatch', label: '是否头缸', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaGreigeInspectionInfoResponse && LABEL.getLabelByKey(LABEL.dict.IS_HEAD_BATCH, scope.row.qaGreigeInspectionInfoResponse.isHeadBatch) },
        { prop: 'productNo', label: '产品编号', minWidth: '180', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.productNo },
        { prop: 'fabricType', label: '布类', width: '120', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.fabricType },
        { prop: 'productSize', label: '成品规格', width: '160', formater: scope => {
          return `${scope.row.qaGreigeInspectionInfoResponse && ((scope.row.qaGreigeInspectionInfoResponse.realWidth || '') + (LABEL.getLabelByKey(LABEL.dict.UNITS, scope.row.qaGreigeInspectionInfoResponse.unit) || '') + '-' + (scope.row.qaGreigeInspectionInfoResponse.realWeight || '') + 'g/㎡')}`
        } },
        { prop: 'customerColor', label: '客户颜色', width: '120', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.customerColor },
        { prop: 'factoryName', label: '染印厂', width: '120', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.factoryName },
        { prop: 'customerName', label: '客户', width: '120', showOverflowTooltip: true, formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.customerName },
        { prop: 'brandName', label: '品牌商', width: '120', showOverflowTooltip: true, formater: scope => scope.row.qaCustomerOrderInfoResponse && scope.row.qaCustomerOrderInfoResponse.brandName },
        { prop: 'bdFirstLightName', label: '1st光源', width: '120', showOverflowTooltip: true, isShow: this.isShow, formater: scope => scope.row.qaCustomerOrderInfoResponse && scope.row.qaCustomerOrderInfoResponse.bdFirstLightName },
        { prop: 'twondLightSourceName', label: '2nd光源', width: '120', showOverflowTooltip: true, isShow: this.isShow, formater: scope => scope.row.qaCustomerOrderInfoResponse && scope.row.qaCustomerOrderInfoResponse.twondLightSourceName },
        { prop: 'threerdLightSourceName', label: '3rd光源', width: '120', showOverflowTooltip: true, isShow: this.isShow, formater: scope => scope.row.qaCustomerOrderInfoResponse && scope.row.qaCustomerOrderInfoResponse.threerdLightSourceName },
        { prop: 'dealTime', label: 'CMC DE', showOverflowTooltip: true, width: '140', isShow: this.isShow,
          formater: (scope) => scope.row.informations && scope.row.informations.length ? scope.row.informations[scope.row.informations.length - 1].cmcDe : ''
        },
        { prop: 'dealTime', label: '批色结果', showOverflowTooltip: true, width: '140', isShow: this.isShow,
          formater: (scope) => {
            if (scope.row.informations && scope.row.informations.length && scope.row.informations[scope.row.informations.length - 1].batchColorResult === 0) { // fail
              return `<span style="color:#FF574F">${scope.row.informations && scope.row.informations.length ? this.rowbatchColorResultMap[scope.row.informations[scope.row.informations.length - 1].batchColorResult] : ''}</span>`
            }
            if (scope.row.informations && scope.row.informations.length && scope.row.informations[scope.row.informations.length - 1].batchColorResult === 1) { // pass
              return `<span style="color:#00C4CD">${scope.row.informations && scope.row.informations.length ? this.rowbatchColorResultMap[scope.row.informations[scope.row.informations.length - 1].batchColorResult] : ''}</span>`
            }
            if (scope.row.informations && scope.row.informations.length && scope.row.informations[scope.row.informations.length - 1].batchColorResult === 2) { // L/G
              return `<span style="color:#FF574F">${scope.row.informations && scope.row.informations.length ? this.rowbatchColorResultMap[scope.row.informations[scope.row.informations.length - 1].batchColorResult] : ''}</span>`
            }
            return `<span>${scope.row.informations && scope.row.informations.length ? this.rowbatchColorResultMap[scope.row.informations[scope.row.informations.length - 1].batchColorResult] : ''}</span>`
          }
        },
        { prop: 'dealTime', label: '评语', showOverflowTooltip: true, width: '140', isShow: this.isShow,
          formater: (scope) => scope.row.informations && scope.row.informations.length ? scope.row.informations[scope.row.informations.length - 1].comment : ''
        },
        { prop: 'createdTime', label: '创建时间', sortable: 'custom', showOverflowTooltip: true, width: '140',
          formater: (scope) => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.createdTime ? this.$filters.parseTime(scope.row.qaGreigeInspectionInfoResponse.createdTime, '{y}-{m}-{d} {h}:{i}') : ''
        },
        { prop: 'batchColorUser', label: '批色员', minWidth: '150', components: { popoverSelect }, componentsOptions: { prop: 'batchColorUser', callback: () => this.load({ ...this.formDatas, pageSize: this.pagination.pageSize || 10, pageNum: this.pagination.page || 1 }) }, formater: scope => scope.row.batchColorUser },
        { prop: 'dealTime', label: '处理时间', sortable: 'custom', showOverflowTooltip: true, width: '140', isShow: this.isShow,
          formater: (scope) => scope.row.informations && scope.row.informations.length ? this.$filters.parseTime(scope.row.informations[scope.row.informations.length - 1].dealTime, '{y}-{m}-{d} {h}:{i}') : ''
        },
        { prop: 'billMan', label: '跟单员', showOverflowTooltip: true, minWidth: '120', formater: scope => scope.row.qaGreigeInspectionInfoResponse && scope.row.qaGreigeInspectionInfoResponse.billMan }
      ],
      dataSource: [],
      pagination,
      rowbatchColorResultMap: { 0: 'Fail', 1: 'Pass', 2: 'L/G' },
      // 状态 0：待提交，1：待处理，2：处理中，3：已处理
      status: LABEL.dict.STATUS
    }
  },
  created() {
    this.load()
  },
  methods: {
    isShow() {
      return Number(this.activeIdx) !== 0
    },
    isShow1() {
      return Number(this.activeIdx) === -1
    },
    // 排序点击事件
    changeSort(e) {
      // 创建时间
      if (e.prop === 'createdTime') {
        if (e.order === 'ascending') {
          this.formDatas.createdTimeOrder = 0
        } else {
          this.formDatas.createdTimeOrder = 1
        }
      }
      // 处理时间
      if (e.prop === 'dealTime') {
        if (e.order === 'ascending') {
          this.formDatas.dealTimeOrder = 0
        } else {
          this.formDatas.dealTimeOrder = 1
        }
      }
      this.load(this.formDatas)
    },
    handleClick(e) {
      this.formDatas.status = e.name
      this.formDatas.pageSize = 10
      this.formDatas.pageNum = 1
      this.load(this.formDatas)
    },
    // 分页查询数量统计
    async getPageCount(params) {
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
    async load(params = {}) {
      if (this.formDatas.status === '-1') {
        this.formDatas.status = ''
      }
      let res = await pageList({ ...params, status: Number(this.activeIdx) === -1 ? '' : Number(this.activeIdx) })
      res = res.data || {}
      if (this.activeIdx !== '-1' && !res.list || res.list.length === 0) {
        this.activeIdx = '-1'
        this.load({ ...params, status: Number(this.activeIdx) === -1 ? '' : Number(this.activeIdx) })
      }
      res.list && res.list.map((item, index) => { item.code = (res.pageNum - 1) * res.pageSize + index + 1 })
      this.dataSource = res.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.total,
        ...params,
        currentPage: res.pageNum,
        pageSize: res.pageSize,
        page: res.pageNum
      }
      this.getPageCount(params)
    },
    // 获取染印厂下拉框列表数据
    async getfactoryNamesList() {
      const { code = 0, data = [] } = await getfactoryNamesList()
      if (code === 200) {
        this.searchData['_factoryIds'].dataSource = data.map(n => ({ value: n.id, label: n.supplierName }))
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tabchange{
  background-color: #FFFFFF;
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
