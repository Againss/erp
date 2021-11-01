<!--
 * @Author: Do not edit
 * @Date: 2021-04-01 09:13:35
 * @LastEditTime: 2021-06-09 11:59:49
 * @LastEditors: admin
 **  复期管理页面
 -->
<template>
  <div class="renewal-manage page-main">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOptions" :form-datas="formDatas" />
    </div>
    <!-- table表格 -->
    <div class="page-content">
      <el-tabs v-model="activeName" @tab-click="activeClick">
        <el-tab-pane :label="`全部(${totalNum.all || 0})`" name="all" />
        <el-tab-pane :label="`待复期(${totalNum.pending || 0})`" name="0" />
        <el-tab-pane :label="`已复期(${totalNum.restored || 0})`" name="1" />
      </el-tabs>
    </div>
    <div class="page-table">
      <cs-custom-table
        :key="activeName"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { renewalPage, renewalCount, renewalDetail, renewalUpdate } from './api/index.js'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import { dataComparision } from '@/views/pms/public/dialog'
import { fetchLog } from '@/views/pms/public/fetchLog'

export default {
  name: 'RenewalManagement',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 当前时间之前的时间不能选择
    const timeBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    const itemStyle = { width: '33%' }
    // 查询/重置表单配置信息
    const searchData = {
      _orderNumber: {
        prop: 'orderNumber',
        itemType: 'input',
        label: '订单号',
        placeholder: '请输入订单号',
        clearable: true,
        itemStyle
      },
      _materiel: {
        prop: 'materiel',
        itemType: 'input',
        label: '纱线编号',
        placeholder: '请输入纱线编号',
        clearable: true,
        itemStyle
      },
      _isUrgent: {
        prop: 'isUrgent',
        itemType: 'select',
        label: '急单',
        clearable: true,
        itemStyle,
        dataSource: [
          {
            label: '请选择',
            value: ''
          },
          {
            label: 'Y',
            value: 'Y'
          },
          {
            label: 'N',
            value: 'N'
          }
        ]
      },
      _inquirerName: {
        prop: 'inquirerName',
        itemType: 'input',
        label: '询期人',
        clearable: true,
        itemStyle,
        placeholder: '请输入询期人'
      },
      _dateRange: {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '询期时间',
        clearable: true,
        itemStyle,
        // itemStyle: { width: '365px' },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params.dateRange) {
            params.inquireDateStart = params.dateRange[0]
            params.inquireDateEnd	 = params.dateRange[1]
          } else {
            params.inquireDateStart = null
            params.inquireDateEnd	 = null
          }
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头的配置信息
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      _orderNumber: {
        prop: 'orderNumber',
        label: '订单号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _materiel: {
        prop: 'materiel',
        label: '纱线编码',
        showOverflowTooltip: true,
        minWidth: '150',
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        },
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      _materielName: {
        prop: 'materielInfo.materielName',
        label: '纱名',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielName
          } else {
            return '-'
          }
        }
      },
      _materielProperty: {
        prop: 'materielInfo.materielProperty',
        label: '纱属性',
        minWidth: '130',
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.materielProperty
          } else {
            return '-'
          }
        },
        showOverflowTooltip: true
      },
      _deliveryDate: {
        prop: 'deliveryDate',
        label: '客户交期',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.deliveryDate || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      _isUrgent: {
        prop: 'isUrgent',
        label: '急单',
        minWidth: '110',
        showOverflowTooltip: true
      },
      _demandWeight: {
        prop: 'demandWeight',
        label: '需求重量(KG)',
        minWidth: '110',
        align: 'right',
        showOverflowTooltip: true
      },
      _targetDate: {
        prop: 'targetDate',
        label: '目标采购交期',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.targetDate || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      _purchaseDate: {
        prop: 'purchaseDate',
        label: '采购排产交期',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.purchaseDate ? this.$filters.parseTime(
            scope.row.purchaseDate || 0,
            '{y}-{m}-{d}'
          ) : '-'
        }
      },
      _inquirerName: {
        prop: 'inquirerName',
        label: '询期人',
        minWidth: '110',
        showOverflowTooltip: true
      },
      _inquireDate: {
        prop: 'inquireDate',
        label: '询期时间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.inquireDate ? this.$filters.parseTime(
            scope.row.inquireDate || 0,
            '{y}-{m}-{d} {h}:{i}:{s}'
          ) : '-'
        }
      },
      _restorerName: {
        prop: 'restorerName',
        label: '复期人',
        minWidth: '110',
        isShow: () => {
          return this.activeName !== '0'
        },
        showOverflowTooltip: true
      },
      _restoreDate: {
        prop: 'restoreDate',
        label: '复期时间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.restoreDate ? this.$filters.parseTime(
            scope.row.restoreDate || 0,
            '{y}-{m}-{d} {h}:{i}:{s}'
          ) : '-'
        },
        isShow: () => {
          return this.activeName !== '0'
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        formater: (scope) => {
          return this.getStatus(scope.row)
        },
        isShow: () => {
          return this.activeName === 'all'
        }
      }
    }
    // 新增弹窗中的字段
    const commonContent = {
      '_orderNumber': {
        prop: 'orderNumber',
        itemType: 'input',
        label: '订单号'
      },
      '_materiel': {
        prop: 'materiel',
        itemType: 'input',
        label: '纱线编码'
      },
      '_materielName': {
        itemType: 'input',
        prop: 'materielName',
        label: '纱名'
      },
      '_materielProperty': {
        itemType: 'input',
        prop: 'materielProperty',
        label: '纱属性'
      },
      '_deliveryDate': {
        itemType: 'input',
        prop: 'deliveryDate',
        label: '客户交期'
      },
      '_isUrgent': {
        itemType: 'input',
        prop: 'isUrgent',
        label: '急单'
      },
      '_demandWeight': {
        itemType: 'input',
        prop: 'demandWeight',
        label: '需求重量（KG）'
      },
      '_targetDate': {
        itemType: 'input',
        prop: 'targetDate',
        label: '目标采购交期'
      },
      '_purchaseDate': {
        prop: 'purchaseDate',
        label: '采购排产交期',
        itemType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        placeholder: '请选择日期',
        clearable: true,
        pickerOptions: timeBefore,
        rules: [commonBlurReg]
      }
    }
    const copyContent = {
      ...commonContent
    }
    let popOperatesDataSource = [
      {
        label: '复期',
        permitTag: ['pms:renewal:restore'],
        isShow: (scope) => {
          return scope.row.status !== 1
        },
        handle: scope => {
          this.$set(this.copyContent._orderNumber, 'disabled', true)
          this.$set(this.copyContent._materiel, 'disabled', true)
          this.$set(this.copyContent._materielName, 'disabled', true)
          this.$set(this.copyContent._materielProperty, 'disabled', true)
          this.$set(this.copyContent._deliveryDate, 'disabled', true)
          this.$set(this.copyContent._isUrgent, 'disabled', true)
          this.$set(this.copyContent._demandWeight, 'disabled', true)
          this.$set(this.copyContent._targetDate, 'disabled', true)
          this.PopDialogHandle('复期')
          this.$set(this.popOptions, 'content', copyContent)
          this.editList({ id: scope.row.id }, scope.row.index)
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '复期',
      okText: '复期',
      ok: params => {
        this.editRenewal(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, 'edit')
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, 'edit')
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    return {
      activeName: '0',
      formOptions: {
        layout: true,
        size: 'small',
        inline: true
      },
      totalNum: {}, // 总数量
      formDatas: {},
      searchData,
      columns,
      copyContent,
      dataSource: [],
      pagination,
      popOperates,
      popOperatesDataSource,
      popOptions,
      visible: false,
      rowInfoMessages: {}, // 日志先后拿到的信息
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  mounted() {},
  methods: {
    activeClick() {
      // 操作栏的显隐
      if (this.activeName === '1') {
        this.popOperates = null
      } else {
        this.popOperates = {
          label: '操作',
          width: '80',
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      }
      this.getRulePage()
    },
    getStatus(data) {
      let status = ''
      switch (data.status) {
        case 0:
          status = `<span style="color:#FF9214">待复期</span>`
          break
        case 1:
          status = `<span style="color:#00BCC5">已复期</span>`
          break
      }
      return status
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改弹出框点击确认按钮的接口事件
    editRenewal(params) {
      const obj = {}
      const pamraskey = ['id', 'orderNumber', 'materiel', 'materielName', 'materielProperty', 'deliveryDate', 'isUrgent', 'demandWeight', 'targetDate', 'purchaseDate']
      pamraskey.forEach(v => {
        obj[v] = params[v]
      })
      this.addUpdate(obj)
    },
    //
    async getRulePage(data = {}) {
      let obj
      if (this.activeName === 'all') {
        obj = {}
      } else {
        obj = { status: this.activeName - 0 }
      }
      const res = await renewalPage({ ...this.searchFormDatas, ...data, ...obj })
      this.dataSource =
        (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      console.log(this.searchFormDatas)
      // 总数量接口
      const numRes = await renewalCount({
        ...this.searchFormDatas,
        ...data
      })
      this.totalNum = numRes.data || {}
    },
    // 点击编辑获取详情
    async editList(data = {}, code) {
      console.log(data, code)
      const res = await renewalDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      editData.deliveryDate = editData.deliveryDate ? this.$filters.parseTime(editData.deliveryDate + '', '{y}-{m}-{d}') : ''
      editData.targetDate = editData.targetDate ? this.$filters.parseTime(editData.targetDate + '', '{y}-{m}-{d}') : ''
      if (editData.materielInfo) {
        editData.materielName = editData.materielInfo.materielName ? editData.materielInfo.materielName : ''
        editData.materielProperty = editData.materielInfo.materielProperty ? editData.materielInfo.materielProperty : ''
      }
      this.rowInfoMessages = { ...editData }
      this.oldForm = { ...editData, index: code }
      this.setFormDatas({ ...editData, index: code })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            this.$set(this.popOptions, 'visible', false)
          })
          .catch(_ => {
            this.$set(this.popOptions, 'visible', true)
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await renewalUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      // 日志--修改
      const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, data, 'id')
      this.fetchLog(this.getLogMessages('UPDATE', '/pms/renewal/restore'), data, JSON.stringify({ beforeText: `在'采购管理-复期管理,修改一条记录`, ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '复期成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.renewal-manage{
  /deep/.el-tabs__header{
    margin-bottom: 0.5px;
    }
  .list-tab {
  background: #fff;
  /deep/.el-tabs__nav .el-tabs__item {
    height: 60px;
    line-height: 60px;
  }

  }
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
<style lang="scss">
.page-main {
    .page-content{
      border-radius: 0px;
      -webkit-border-radius: 0px;
  }
  }
</style>
