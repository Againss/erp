<!--
 * @Author: Do not edit
 * @Date: 2021-04-06 09:13:35
 * @LastEditTime: 2021-06-09 11:58:27
 * @LastEditors: admin
 **  合同管理
 -->
<template>
  <div class="page-main contract-manage">
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
          :label="`待上传(${totalNum.toUpload || 0})`"
          name="1"
        />
        <el-tab-pane
          :label="`已上传(${totalNum.uploaded || 0})`"
          name="2"
        />
      </el-tabs>

    </div>
    <div class="page-table">
      <cs-custom-table
        :key="activeName"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
  </div>
</template>

<script>
import {
  contractNotePage,
  contractNoteCount,
  deliveryNoteDownload,
  downFile
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
      _contractNumber: {
        prop: 'contractNumber',
        itemType: 'input',
        label: '合同编号',
        itemStyle,
        placeholder: '请输入合同编号',
        clearable: true
      },
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        itemType: 'input',
        label: '采购订单号',
        placeholder: '请输入采购订单号',
        itemStyle,
        clearable: true
      },
      _supplierName: {
        prop: 'supplierName',
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
        label: '下单日期',
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
            params.submitBeginDate = params.dateRange[0]
            params.submitEndDate = params.dateRange[1]
          } else {
            params.submitBeginDate = null
            params.submitEndDate = null
          }
          if (params.supplierName) {
            params.supplierName = params.supplierName.label
          } else {
            params.supplierName = ''
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
      _contractNumber: {
        prop: 'contractNumber',
        label: '合同编号',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        label: '采购订单号',
        minWidth: '160',
        showOverflowTooltip: true
      },

      _purchaseWeight: {
        prop: 'purchaseWeight',
        label: '采购重量（KG）',
        minWidth: '150',
        align: 'right',
        showOverflowTooltip: true
      },
      _rmbTotalPrice: {
        prop: 'rmbTotalPrice',
        label: '订单金额（元）',
        minWidth: '150',
        align: 'right',
        showOverflowTooltip: true
      },

      _supplierName: {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _submitDate: {
        prop: 'submitDate',
        label: '下单日期',
        minWidth: '190',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.submitDate
            ? this.$filters.parseTime(
              scope.row.submitDate || 0,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
            : '-'
        }
      },

      _uploaderName: {
        prop: 'uploaderName',
        label: '上传人',
        minWidth: '110',
        isShow: () => {
          return this.activeName !== '1'
        }
      },
      _uploadDate: {
        prop: 'uploadDate',
        label: '上传时间',
        minWidth: '190',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName !== '1'
        },
        formater: (scope) => {
          return scope.row.uploadDate
            ? this.$filters.parseTime(
              scope.row.uploadDate || 0,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
            : '-'
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
      },
      _contractName: {
        prop: 'contractName',
        label: '合同',
        minWidth: '150',
        fixed: 'right',
        isShow: () => {
          return this.activeName !== '1'
        },
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          console.log(scope)
          const contractId = scope.row.contractKey || ''
          this.uploadContract({ id: contractId })
          // this.$router.push({
          //   path: '/pms/delivery-note/detail/',
          //   query: {
          //     id: scope.row.id,
          //     status: scope.row.status,
          //     pageType: 'detail'
          //   }
          // })
        },
        showOverflowTooltip: true
      }

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
      pagination
    }
  },
  created() {
    this.getRulePage()
    this.supplierList()
  },
  mounted() {},
  methods: {

    // 状态的返回
    getStatus(data) {
      let status = ''
      switch (data.contractStatus) {
        case 1:
          status = `<span style="color:#FF9214">待上传</span>`
          break
        case 2:
          status = `<span style="color:#00BCC5">已上传</span>`
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
        this.$set(this.searchData._supplierName, 'dataSource', supplierData)
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
      const res = await contractNotePage({
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
      const numRes = await contractNoteCount({
        ...this.searchFormDatas,
        ...data
      })
      this.totalNum = numRes.data || {}
    },
    // 下载合同
    // 文件下载
    async uploadContract(data) {
      const res = await downFile(data)
      // console.log(res);
      this.$utils.downloadStream(res)
    },
    async downPdf(data) {
      const res = await deliveryNoteDownload(data)
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
.contract-manage {
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
