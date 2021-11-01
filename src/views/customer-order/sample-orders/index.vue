<!--
 * @Descripttion: 样板订单列表
 * @Author: admin
 * @Date: 2021-03-04 14:01:19
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-27 18:26:57
-->
<template>
  <div class="sample-orders">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- tab页签切换-->
    <div class="tabchange">
      <div class="tabchange_he">
        <el-tabs v-model="activeName" class="puactive_class" @tab-click="handleClick">
          <el-tab-pane name="-1">
            <span slot="label" class="labelIndex" tabindex="-1">{{ `全部 (${totalNum.all||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="0">
            <span slot="label" class="labelIndex" tabindex="0">{{ `待提交(${totalNum.waitSubmit||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label" class="labelIndex" tabindex="1">{{ `待审核(${totalNum.waitAudit||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="labelIndex" tabindex="2">{{ `进行中(${totalNum.processing||0})` }} </span>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label" class="labelIndex" tabindex="3">{{ `已完结(${totalNum.finished||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label" class="labelIndex" tabindex="4">{{ `已取消(${totalNum.cancelled||0})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 新建 -->
        <div class="createbutton">
          <div class="createbutton_btn">
            <div class="cr_btn_left">
              <el-button
                v-permission="['customerOrder:modelDevelopOrder:add']"
                size="small"
                type="primary"
                @click="addHandler"
              >新建</el-button>
            </div>
            <div class="cr_btn_right">
              <el-button
                size="small"
                @click="openpup"
              >列表字段</el-button>
              <div v-if="ispup" class="cr_btn_cm">
                <popupinfo :pupcolumns="columns" :pupoperates="popOperates" @okHandleClick="okClick" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        ref="filterTable"
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        @filter-change="filterChange"
      />
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { list, sellTeamselect, salerListselect, orderTypeselect, orderStatusNum, orderDeletHold } from './api/index'
import popupinfo from '../public/components/popupInformation'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
export default {
  name: 'SampleOrders',
  components: {
    popupinfo
  },
  mixins: [setOrderFun],
  props: {},
  data() {
    // {forEachColumns columns} back
    const searchData = {
      _code: {
        prop: 'code',
        itemType: 'input',
        itemStyle: { width: '33%' },
        label: '订单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.code = ''
        },
        clearable: true
      },
      _orderTypeId: {
        prop: 'orderTypeId',
        itemType: 'select',
        label: '订单类型',
        valueType: 'object',
        itemStyle: { width: '33%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.orderTypeId = ''
        },
        visibleChange: (value, val) => {
          if (value) {
            this.orderTypy()
          }
        },
        dataSource: []
      },
      _brandName: {
        prop: 'brandName',
        itemType: 'input',
        itemStyle: { width: '33%' },
        label: '品牌商',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.brandName = ''
        },
        clearable: true
      },
      _garmentFactoryName: {
        prop: 'garmentFactoryName',
        itemType: 'input',
        itemStyle: { width: '33%' },
        label: '制衣厂',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.garmentFactoryName = ''
        },
        clearable: true
      },
      _salesTeamId: {
        prop: 'salesTeamId',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '销售团队',
        valueType: 'object',
        itemStyle: { width: '33%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.salesTeamId = ''
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOrg()
          }
        },
        dataSource: []
      },
      _customerServiceId: {
        prop: 'customerServiceId',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '客服',
        valueType: 'object',
        itemStyle: { width: '33%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.customerServiceId = ''
        },
        visibleChange: (value, val) => {
          if (value) {
            this.salerListPut()
          }
        },
        dataSource: []
      },
      _dateRange: {
        itemType: 'date',
        type: 'daterange',
        itemStyle: { width: '33%' },
        prop: 'dateRange',
        label: '创建日期',
        clearable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.createdStartTime = null
          this.searchFormDatas.createdEndTime = null
        },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _demandCode: {
        prop: 'demandCode',
        itemType: 'input',
        itemStyle: { width: '33%' },
        label: '需求单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.demandCode = ''
        },
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const newData = JSON.parse(JSON.stringify(params))
          // console.log(newData, 'newData')
          if (params.dateRange) {
            newData.createdStartTime = params.dateRange[0]
            newData.createdEndTime = params.dateRange[1]
          } else {
            newData.createdStartTime = null
            newData.createdEndTime = null
          }
          if (params.orderTypeId) {
            newData.orderTypeId = params.orderTypeId.value + ''
          } else {
            newData.orderTypeId = ''
          }
          if (params.salesTeamId) {
            newData.salesTeamId = params.salesTeamId.value + ''
          } else {
            newData.salesTeamId = ''
          }
          if (params.customerServiceId) {
            newData.customerServiceId = params.customerServiceId.value + ''
          } else {
            newData.customerServiceId = ''
          }
          this.searchFormDatas = newData
          this.list(newData)
        },

        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 待提交状态选项
    const submitStatus = [{ text: '草稿', value: '0' }, { text: '已驳回', value: '4' }]
    // 待审核状态选项
    const reviewStatus = [{ text: '新单待审', value: '1' }, { text: 'hold单审核中', value: '10' }, { text: '变更审核中', value: '8' }, { text: '取消审核中', value: '5' }]
    // 进行中状态选项
    const handStatus = [{ text: '已审核', value: '2' }, { text: 'Hold单', value: '12' }]
    // 已完结  已取消
    const finished = [{ text: '已完结 ', value: '13' }, { text: '已取消', value: '7' }]
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        fixed: true
      },
      _code: {
        prop: 'code',
        label: '订单号',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/customer-order/sample-orders/detail/${scope.row.id}/show`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _orderTypeName: {
        prop: 'orderTypeName',
        label: '订单类型',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.orderTypeName || '-'
      },
      _demandSource: {
        prop: 'demandSource',
        label: '需求来源',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.demandSource || '-'
      },
      _demandCode: {
        prop: 'demandCode',
        label: '需求单号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.demandCode || '-'
      },
      _brand: {
        prop: 'brand',
        label: '品牌商',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.brand && scope.row.brand.label || '-'
      },
      _salesTeam: {
        prop: 'salesTeam',
        label: '销售团队',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.salesTeam && scope.row.salesTeam.label || '-'
      },
      _seller: {
        prop: 'seller',
        label: '销售员',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.seller && scope.row.seller.label || '-'
      },
      _customerService: {
        prop: 'customerService',
        label: '客服',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.customerService && scope.row.customerService.label || '-'
      },
      _quantityAndUnit: {
        prop: 'quantityAndUnit',
        label: '数量/单位',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.quantityAndUnit || '-'
        }
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        sortable: false,
        columnKey: 'status',
        className: 'status-arrow-down',
        filters: handStatus,
        formater: (scope) => {
          return this.getStatus(scope.row.status) || '-'
        }
      }
    }
    // 表格全量的配置信息
    const allColumns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        fixed: true
      },
      _code: {
        prop: 'code',
        label: '订单号',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push(
            `/customer-order/sample-orders/detail/${scope.row.id}/show`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _orderTypeName: {
        prop: 'orderTypeName',
        label: '订单类型',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.orderTypeName || '-'
      },
      _demandSource: {
        prop: 'demandSource',
        label: '需求来源',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.demandSource || '-'
      },
      _demandCode: {
        prop: 'demandCode',
        label: '需求单号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.demandCode || '-'
      },
      _brand: {
        prop: 'brand',
        label: '品牌商',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.brand && scope.row.brand.label || '-'
      },
      _customer: {
        prop: 'customer',
        label: '客户',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.customer && scope.row.customer.label || '-'
      },
      _garmentFactory: {
        prop: 'garmentFactory',
        label: '制衣厂',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.garmentFactory && scope.row.garmentFactory.label || '-'
      },
      _salesTeam: {
        prop: 'salesTeam',
        label: '销售团队',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.salesTeam && scope.row.salesTeam.label || '-'
      },
      _sellQuarterName: {
        prop: 'sellQuarterName',
        label: '销售季节',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.sellQuarterName || '-'
      },
      _sellYear: {
        prop: 'sellYear',
        label: '销售年度',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.sellYear || '-'
      },
      _currencyName: {
        prop: 'currencyName',
        label: '币别',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.currencyName || '-'
      },
      _pricingTermName: {
        prop: 'pricingTermName',
        label: '价格条款',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.pricingTermName && scope.row.pricingTermName.label || '-'
      },
      _paymentTerm: {
        prop: 'paymentTerm',
        label: '付款条件',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.paymentTerm && scope.row.paymentTerm.label || '-'
      },
      _customerService: {
        prop: 'customerService',
        label: '客服',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.customerService && scope.row.customerService.label || '-'
      },
      _quantityAndUnit: {
        prop: 'quantityAndUnit',
        label: '数量/单位',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.quantityAndUnit || '-'
      },
      _seller: {
        prop: 'seller',
        label: '销售员',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.seller && scope.row.seller.label || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _cancelledTime: {
        prop: 'cancelledTime',
        label: '取消时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cancelledTime ? this.$filters.parseTime(scope.row.cancelledTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _finishedTime: {
        prop: 'finishedTime',
        label: '完结时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.finishedTime ? this.$filters.parseTime(scope.row.finishedTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        columnKey: 'status',
        className: 'status-arrow-down',
        sortable: false,
        filters: handStatus,
        formater: (scope) => {
          return this.getStatus(scope.row.status) || '-'
        }
      }
    }
    // 正则验证
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // permitTag: ['customerOrder:modelDevelopOrder:modify'],
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['customerOrder:modelDevelopOrder:modify'],
        isShow: (scope) => {
          return scope.row.status === '0' || scope.row.status === '4'
        },
        handle: (scope) => {
          console.log(scope)
          this.$router.push(`/customer-order/sample-orders/detail/${scope.row.id}/edit`)
        }
      },
      {
        label: '变更',
        permitTag: ['customerOrder:modelDevelopOrder:change'],
        isShow: (scope) => {
          return scope.row.status === '2'
        },
        handle: (scope) => {
          console.log(scope)
          this.$router.push(`/customer-order/sample-orders/detail/${scope.row.id}/edit?statusIndex=${scope.row.status}`)
        }
      },
      {
        label: '解hold',
        isShow: (scope) => {
          return scope.row.status === '12'
        },
        permitTag: ['customerOrder:modelDevelopOrder:removeHold'],
        handle: (scope) => {
          this.deletHold({ orderId: scope.row.id })
        }
      }
    ]

    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    // 列表操作栏按钮
    const popOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      moreOptions: {
        maxLength: 2// 最大超过多少个显示more功能，默认为2
      },
      dataSource: popOperatesDataSource
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      customClass: 'popOptionsClass',
      ok: params => {
        // console.log(params)
        this.edit(params)
      },
      okText: '保存',
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {},
      formOptions: {
      },
      content: {
        '_appSysName': {
          prop: 'appSysName',
          itemType: 'input',
          label: '名称:',
          rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
          placeholder: '请输入名称'
        },
        '_enName': {
          prop: 'enName',
          itemType: 'input',
          label: '英文名称:',
          rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
          placeholder: '请输入英文名称'
        },
        '_description': {
          prop: 'description',
          itemType: 'input',
          label: '描述:',
          rules: [commonBlurReg, { max: 20, message: '长度在 20 个字符以内', trigger: ['blur'] }],
          placeholder: '请输入描述'
        },
        '_serverSelectionList': {
          prop: 'serverSelectionList',
          itemType: 'select',
          label: '服务端选择:',
          placeholder: '请输入服务端选择'
        },
        '_type': {
          prop: 'type',
          itemType: 'select',
          label: '系统类型:',
          placeholder: '请输入系统类型'
        }
      }
    }

    const pagination = {
      currentChange: val => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        const op = JSON.parse(JSON.stringify(this.activeName))
        this.list(com, false, this.isArrayData || [], !!this.isArrayData.length, op)
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        const op = JSON.parse(JSON.stringify(this.activeName))
        this.list(com, false, this.isArrayData || [], !!this.isArrayData.length, op)
      }
    }
    return {
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      },
      activeName: '-1',
      searchData,
      dataSource: [],
      columns,
      row: {},
      popOptions,
      popOperates,
      pagination,
      popOperatesDataSource,
      type: 'add',
      sellTeamData: [],
      totalNum: {},
      allColumns,
      submitStatus,
      handStatus,
      reviewStatus,
      isArrayData: [],
      ispup: false, // is弹窗
      finished
      // allStatus: [{text: '待提交', value: '待提交'}, {text: '待审核', value: '待审核'}, {text: '进行中', value: '进行中'}]
    }
  },
  watch: {
    popOperates: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  },
  created() {
    this.orderTypy()
    this.getOrg()
    this.salerListPut()
    this.list({}, true)
  },
  mounted() {},
  methods: {
    // tab页签切换
    handleClick(tabsObj) {
      this.ispup = false
      const tabIndex = tabsObj.name
      this.$refs.filterTable.$refs.table.clearFilter()
      this.isArrayData = []
      if (this.activeName === '1') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._finishedTime
        delete omCom._cancelTime
        omCom._status = {
          prop: 'status',
          label: '状态',
          minWidth: '110',
          sortable: false,
          columnKey: 'status',
          className: 'status-arrow-down',
          filters: this.reviewStatus,
          formater: (scope) => {
            return this.getStatus(scope.row.status)
          }
        }
        this.columns = omCom
        this.popOperates = null
      } else if (this.activeName === '0') {
        const omCom = this.$utils.deepClone(this.columns)
        omCom._status = {
          prop: 'status',
          label: '状态',
          minWidth: '110',
          sortable: false,
          columnKey: 'status',
          className: 'status-arrow-down',
          filters: this.submitStatus,
          formater: (scope) => {
            return this.getStatus(scope.row.status)
          }
        }
        this.columns = omCom
        this.popOperates = {
          label: '操作',
          width: '80',
          moreOptions: {
            maxLength: 2// 最大超过多少个显示more功能，默认为2
          },
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      } else if (this.activeName === '-1') {
        const omCom = this.$utils.deepClone(this.columns)
        omCom._status = {
          prop: 'status',
          label: '状态',
          minWidth: '110',
          sortable: false,
          columnKey: 'status',
          className: 'status-arrow-down',
          filters: [...this.submitStatus, ...this.reviewStatus, ...this.handStatus, ...this.finished],
          formater: (scope) => {
            return this.getStatus(scope.row.status)
          }
        }
        this.columns = omCom
        this.popOperates = {
          label: '操作',
          width: '80',
          moreOptions: {
            maxLength: 2// 最大超过多少个显示more功能，默认为2
          },
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      } else if (this.activeName === '3') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._status
        delete omCom._cancelTime
        omCom._finishedTime = {
          prop: 'finishedTime',
          label: '完成时间',
          minWidth: '150',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.finishedTime ? this.$filters.parseTime(scope.row.finishedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
          }
        }
        this.columns = omCom
        this.popOperates = null
      } else if (this.activeName === '4') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._status
        delete omCom._finishedTime
        omCom._cancelTime = {
          prop: 'cancelledTime',
          label: '取消时间',
          minWidth: '150',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.cancelledTime ? this.$filters.parseTime(scope.row.cancelledTime + '', '{y}-{m}-{d} {h}:{i}') : ''
          }
        }
        this.columns = omCom
        this.popOperates = null
      } else {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._finishedTime
        delete omCom._cancelTime
        omCom._status = {
          prop: 'status',
          label: '状态',
          minWidth: '110',
          sortable: false,
          columnKey: 'status',
          className: 'status-arrow-down',
          filters: this.handStatus,
          formater: (scope) => {
            return this.getStatus(scope.row.status)
          }
        }
        this.columns = omCom
        this.popOperates = {
          label: '操作',
          width: '80',
          moreOptions: {
            maxLength: 2// 最大超过多少个显示more功能，默认为2
          },
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      }

      this.list({}, false, [], false, tabIndex)
    },
    // 销售团队下拉
    async getOrg() {
      const res = await sellTeamselect({ functionTag: 'SAL' })
      if (res.code !== 200) {
        return false
      }
      const sellTeamData = res.data || []
      this.sellTeamData = sellTeamData.length && sellTeamData.map((item, index) => {
        return {
          label: item.name,
          value: '' + item.orgId
        }
      })
      this.$set(this.searchData._salesTeamId, 'dataSource', this.sellTeamData)
    },
    // 客服下拉
    async salerListPut() {
      const res = await salerListselect({})
      if (res.code !== 200) {
        return false
      }
      let sellerData = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          sellerData = list.map(item => ({ value: item.userId, label: item.realName }))
        }
      }
      this.$set(this.searchData._customerServiceId, 'dataSource', sellerData)
    },
    // 订单类型下拉
    async orderTypy() {
      const res = await orderTypeselect({ fieldName: '订单类型', pageName: '样板开发单' })
      if (res.code !== 200) {
        return false
      }
      let orderTypeData = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          orderTypeData = list.map(item => ({ value: item.fieldValueId, label: item.fieldValue }))
        }
      }
      this.$set(this.searchData._orderTypeId, 'dataSource', orderTypeData)
    },
    // 解hold
    async deletHold(data = {}) {
      const res = await orderDeletHold(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('解hold成功')
      this.list({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },
    addHandler() {
      this.$router.push(`/customer-order/sample-orders/create`)
    },

    // 获取列表数据
    async list(data = {}, fresh, isStstus = [], tup = false, tabIndex = '-1') {
      this.ispup = false
      let obj = { status: [] }
      if (isStstus.length) {
        obj = { status: isStstus }
      } else {
        if (this.activeName === '2' || fresh) {
          obj = { status: [2, 6, 9, 11, 12] }
        } else if (this.activeName === '-1') {
          obj = { status: [] }
        } else if (this.activeName === '0') {
          obj = { status: [0, 4] }
        } else if (this.activeName === '1') {
          obj = { status: [1, 5, 8, 10] }
        } else if (this.activeName === '3') {
          obj = { status: [13] }
        } else {
          obj = { status: [7] }
        }
      }
      const res = await list({ ...data, ...obj, ...this.searchFormDatas })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      let dataObj = { ...data, ...this.searchFormDatas }
      if (tup) {
        dataObj = { ...data, ...obj, ...this.searchFormDatas }
      }
      const amountRes = await orderStatusNum(dataObj)
      if (fresh) {
        this.activeName = '2'
      }
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
    },

    // 设置表单数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 设置弹窗标题及显示隐藏
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 发送日志信息
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 获取日志信息
    getLog(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP', // 日誌類型
        appId: 'userCenter', // 系統id
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    },
    compareData(oldData, newData, id) {
      const comparedKeys = Object.keys(newData).filter(item => {
        if (Array.isArray(newData[item])) {
          return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
        } else {
          return oldData[item] !== newData[item]
        }
      })
      const oldObj = {}
      const newObj = {}
      comparedKeys.forEach(item => {
        oldObj[item] = oldData[item]
        newObj[item] = newData[item]
      })
      return {
        beforeCode: { ...oldObj, [id]: newData[id] },
        afterCode: { ...newObj, [id]: newData[id] }
      }
    },
    openpup() {
      this.ispup = !this.ispup
    },
    okClick(val) { // 弹窗点击确定的
      if (val.data && val.data.length) {
        const pupdata = val.data
        const result = Object.keys(this.allColumns).reduce((a, n) => {
          const bool = pupdata.includes(this.allColumns[n].label)
          if (bool) {
            a[n] = this.allColumns[n]
          }
          return a
        }, {})
        if (!val.data.includes('操作')) {
          this.popOperates = null
        }
        this.columns = {}
        this.columns = result
      }
      this.ispup = false
    },
    filterChange(row) {
      this.isborder = true
      const op = JSON.parse(JSON.stringify(this.activeName))
      this.isArrayData = row.status
      this.list({}, false, this.isArrayData || [], true, op)
    }
  }
}
</script>

<style >

</style>
<style lang="scss" scoped>
  .sample-orders {
    padding: 20px;
    padding-bottom: 0;
    .el-table_1_column_1 span{
      color: #0000FF;
    }
    .tabchange{
      display: flex;
      position: relative;
      padding-bottom: 0;
      background-color: #fff;
      border-bottom: 1px solid #dfe6ec;
      .tabchange_he{
        display: flex;
        width: 100%;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #3C4043;
        text-align: center;
        /deep/ .el-tabs__header {
          margin-bottom: 0px;
        }
        /deep/ .el-tabs__nav-wrap::after{
          height: 0px !important;
        }
        /deep/ .el-tabs__item {
          height: 60px;
          line-height: 60px;
          padding: 0 26px;
        }
      }
      .createbutton{
        line-height: 60px;
        margin-right: 20px;
      }
     .puactive_class{
        flex: 1;
      }
    }
    /deep/  .labelIndex{
      padding: 0 15px;
      border: 0 none;
      outline: none;
    }
    /deep/ .status-arrow-down{
      .el-icon-arrow-down{
        margin-left: 5px;
      }
    }
  }
  .popOptionsClass {
      .el-textarea__inner{
          resize: none;
      }
  }
  .createbutton_btn{
    display: flex;
    .cr_btn_left{
      margin-right: 20px;
    }
    .cr_btn_right{
      position: relative;
      .cr_btn_cm{
        position: absolute;
        right: -20px;
        top: 59px;
        z-index: 1000;
      }
    }
  }
  .page-table /deep/ .el-table--medium th{
    height: 44px;
    padding:  0 !important;
  }
</style>
