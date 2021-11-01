<!--
 * @Author: Do not edit
 * @Date: 2021-04-06 09:13:35
 * @LastEditTime: 2021-06-09 11:58:48
 * @LastEditors: admin
 **  送货单页面
 -->
<template>
  <div class="page-main delivery-plan">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>
    <!-- table表格 -->
    <div class="page-content">
      <el-tabs v-model="activeName" @tab-click="activeClick">
        <el-tab-pane :label="`全部(${totalNum.allCount || 0})`" name="all" />
        <el-tab-pane
          :label="`待送货(${totalNum.notReceiveCount || 0})`"
          name="1"
        />
        <el-tab-pane
          :label="`已送货(${totalNum.receivedCount || 0})`"
          name="2"
        />
      </el-tabs>
      <div class="tab-btns">
        <el-button
          v-permission="['pms:deliveryNote:add']"
          size="small"
          type="primary"
          @click="addList"
        >新建送货单</el-button>
      </div>
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
  </div>
</template>

<script>
import {
  deliveryNotePage,
  deliveryNoteCount,
  deliveryNoteDownload
} from './api/index.js'
import * as apiPub from '@/views/pms/public/api/index.js'
import { fetchLog } from '@/views/pms/public/fetchLog'
export default {
  name: 'DeliveryNote',
  mixins: [fetchLog],
  data() {
    const itemStyle = { width: '33%' }
    // 查询/重置表单配置信息
    const searchData = {
      _deliveryNumber: {
        prop: 'deliveryNumber',
        itemType: 'input',
        label: '送货单号',
        itemStyle,
        placeholder: '请输入送货单号',
        clearable: true
      },
      _deliveryPlanNumber: {
        prop: 'deliveryPlanNumber',
        itemType: 'input',
        label: '送货计划号',
        placeholder: '请输入送货计划号',
        itemStyle,
        clearable: true
      },
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        label: '供应商',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: []
      },
      _daterange: {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '送货日期',
        // itemStyle: { width: '365px' },
        itemStyle,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          if (params.dateRange) {
            params.deliveryStartDate = params.dateRange[0]
            params.deliveryEndDate = params.dateRange[1]
          } else {
            params.deliveryStartDate = null
            params.deliveryEndDate = null
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
      _deliveryNumber: {
        prop: 'deliveryNumber',
        label: '送货单号',
        minWidth: '160',
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          this.$router.push({
            path: '/pms/delivery-note/detail/',
            query: {
              id: scope.row.id,
              status: scope.row.status,
              pageType: 'detail'
            }
          })
        }
      },
      _classification: {
        prop: 'classification',
        label: '送货类型',
        minWidth: '110',
        formater: (scope) => {
          return scope.row.classification === '1'
            ? '纱'
            : scope.row.classification === '2'
              ? '布'
              : ''
        }
      },
      _deliveryDate: {
        prop: 'deliveryDate',
        label: '送货日期',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.deliveryDate
            ? this.$filters.parseTime(
              scope.row.deliveryDate || 0,
              '{y}-{m}-{d}'
            )
            : '-'
        }
      },
      _deliveryWeight: {
        prop: 'deliveryWeight',
        label: '送货重量（KG）',
        minWidth: '150',
        align: 'right',
        showOverflowTooltip: true
      },
      _supplier: {
        prop: 'supplier',
        label: '供应商',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.supplier.label || ''
        },
        showOverflowTooltip: true
      },
      _consigneeParty: {
        prop: 'consigneeParty',
        label: '收货方',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.consigneeParty.label || ''
        },
        showOverflowTooltip: true
      },
      _drawerName: {
        prop: 'drawerName',
        label: '开单人',
        minWidth: '110'
      },
      _drawDate: {
        prop: 'drawDate',
        label: '开单日期',
        minWidth: '190',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.drawDate
            ? this.$filters.parseTime(
              scope.row.drawDate || 0,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
            : '-'
        }
      },
      _stockInNumber: {
        prop: 'stockInNumber',
        label: '入库单号',
        minWidth: '180',
        handle: (scope) => {
          const row = scope.row
          if (row.stockInNumber) {
            this.$router.push({
              path: '/wms/enter-manage/incoming-manage/details',
              query: { formNo: row.stockInNumber, type: 'details' }
            })
          }
        },
        formater: (scope) => {
          var i = ''
          i = `<span style="color:#1890ff;cursor:pointer">${scope.row.stockInNumber}</span>`
          if (!scope.row.stockInNumber) {
            i = '-'
          }
          return i
        }
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // }
      },
      _storageWeight: {
        prop: 'storageWeight',
        label: '入库重量',
        align: 'right',
        minWidth: '110'
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
    let popOperatesDataSource = [
      {
        label: '查看',
        isShow: true,
        permitTag: ['pms:deliveryNote:info'],
        handle: (scope) => {
          // 跳转到详情页面
          this.$router.push({
            path: '/pms/delivery-note/detail/',
            query: {
              id: scope.row.id,
              status: scope.row.status,
              pageType: 'detail'
            }
          })
        }
      },
      {
        label: '下载送货单',
        isShow: (scope) => {
          return scope.row.status === 1
        },
        permitTag: ['pms:deliveryNote:pdfDownload'],
        handle: (scope) => {
          this.downPdf(scope.row.id)
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    return {
      activeName: '1',
      formOptions: {
        layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {
        // enable: ''
      },
      searchData,
      columns,
      dataSource: [],
      totalNum: {}, // 总数量
      pagination,
      popOperates
    }
  },
  created() {
    this.getRulePage()
    this.supplierList()
  },
  mounted() {},
  methods: {
    addList() {
      this.$router.push({
        path: '/pms/delivery-note/detail',
        query: { pageType: 'addPage' }
      })
    },
    // 状态的返回
    getStatus(data) {
      let status = ''
      switch (data.status) {
        case 1:
          status = `<span style="color:#FF9214">待收货</span>`
          break
        case 2:
          status = `<span style="color:#00BCC5">已收货</span>`
          break
      }
      return status
    },
    activeClick() {
      this.getRulePage()
    },
    // 供应商下拉的内容--采购
    async supplierList() {
      const res = await apiPub.getAllSupplier({ supplierCategory: 0 })
      if (res.code === 200) {
        // 把搜索中的供应商填充
        const supplierData = (res.data || []).map((item) => {
          return { value: item.id, label: item.supplierName }
        })
        this.$set(this.searchData._supplier, 'dataSource', supplierData)
      }
    },
    // 列表查询
    async getRulePage(data = {}) {
      let obj
      if (this.activeName === 'all') {
        obj = {}
      } else {
        obj = { status: this.activeName - 0 }
      }
      const res = await deliveryNotePage({
        ...this.searchFormDatas,
        ...data,
        ...obj
      })
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
      // 总数量接口
      const numRes = await deliveryNoteCount({
        ...this.searchFormDatas,
        ...data
      })
      this.totalNum = numRes.data || {}
    },
    async downPdf(data) {
      const res = await deliveryNoteDownload(data)
      console.log(res.headers, 'res')
      this.$utils.downloadStream(res)
      // 日志--下载
      this.fetchLog(
        this.getLogMessages('EXPORT', '/pms/deliveryNote/pdfDownload'),
        data,
        JSON.stringify({
          beforeText: `在'采购管理-送货单, 下载一条记录`,
          beforeCode: { id: data }
        })
      )
    }
  }
}
</script>

<style lang='scss' scoped>
.delivery-plan {
  /deep/ .el-tabs__header {
    margin-bottom: 0.5px;
    // .el-tabs__item {
    //   font-weight: 400;
    //   height:60px;
    //   line-height: 60px;
    // }
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #d0d6da;
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
