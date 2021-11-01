<template>
  <div class="DemandManagement list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div class="button spe">
        <el-button
          v-if="
            activeName === '3' && (
              $permission(['pms:purchaseOrder:add']) ||
              $permission(['pms:purchaseOrder:submit']))
          "
          size="small"
          type="primary"
          @click="submit"
        >生成采购订单</el-button>
        <el-button
          v-if="activeName === '1' && $permission(['pms:inquiry:add'])"
          size="small"
          type="primary"
          @click="enquirySubmit"
        >生成询价单</el-button>
      </div>
      <div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane>
              <span slot="label" :name="0">
                {{ `全部 (${count.allCount || 0})` }}</span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" :name="1">
                {{ `待询价 (${count.toInquireCount || 0})` }}</span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" :name="2">
                {{ `待报价 (${count.toQuoteCount || 0})` }}</span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" :name="3">
                {{ `待下单 (${count.noPurchaseCount || 0})` }}</span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" :name="4">
                {{ `已下单 (${count.purchasedCount || 0})` }}</span>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 列表 -->
        <div class="page-table">
          <cs-custom-table
            :key="activeName"
            :columns="columns"
            :table-scrollx="true"
            :data-source="dataSource"
            :pagination="pagination"
            @selection-change="selectionResult"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import * as api from './api/index'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'

export default {
  name: 'DemandManagement',
  data() {
    const itemStyle = { width: '33%' }
    const searchData = {
      _materiel: {
        prop: 'materiel',
        itemType: 'input',
        label: '纱线编码',
        placeholder: '请输入纱线编码',
        clearable: true,
        itemStyle
      },
      _demandNumber: {
        prop: 'demandNumber',
        itemType: 'input',
        label: '需求编码',
        placeholder: '请输入需求编码',
        clearable: true,
        itemStyle
      },
      _materielName: {
        prop: 'materielName',
        itemType: 'input',
        label: '纱名',
        placeholder: '请输入纱名',
        clearable: true,
        itemStyle
      },
      _materielProperty: {
        prop: 'materielProperty',
        itemType: 'input',
        label: '纱属性',
        placeholder: '请输入纱属性',
        clearable: true,
        itemStyle
      },
      _issuerName: {
        prop: 'issuerName',
        itemType: 'input',
        label: '下发人',
        placeholder: '请输入下发人',
        clearable: true,
        itemStyle
      },
      _issueDate: {
        prop: 'issueDate',
        itemType: 'date',
        type: 'daterange',
        label: '下发日期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'timestamp',
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          var issueBeginDate = ''
          var issueEndDate = ''
          if (params.hasOwnProperty('issueDate') && params.issueDate) {
            issueBeginDate = params.issueDate[0]
            issueEndDate = params.issueDate[1]
          }
          this.searchParams = {
            ...params,
            issueBeginDate,
            issueEndDate
          }
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.init()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const searchFormDatas = {}
    const columns = {
      _selection: {
        prop: 'ids',
        type: 'selection',
        fixed: 'left',
        width: '35',
        selectable: (scope) => {
          // console.log(scope)
          // 拿待下单第一次选中的数据比对，同一供应商并且是已报价
          return scope.status !== 2 && scope.status !== 3
          // return true
        }
      },
      _index: {
        label: '序号',
        prop: 'index',
        minWidth: '50',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _demandNumber: {
        prop: 'demandNumber',
        label: '需求编码',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _classification: {
        prop: 'classification',
        label: '采购类型',
        minWidth: '120',
        formater: (scope) => {
          return '纱'
        }
      },
      _materiel: {
        prop: 'materiel',
        label: '纱线编码',
        minWidth: '160',
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
        prop: 'materielName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo.materielName || ''
        }
      },
      _materielProperty: {
        prop: 'materielProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielProperty && scope.row.materielInfo.materielProperty || ''
        }
      },
      _demandWeight: {
        prop: 'demandWeight',
        label: '需求重量(KG)',
        align: 'right',
        minWidth: '120'
      },
      _purchaseDate: {
        prop: 'purchaseDate',
        label: '需求交期',
        minWidth: '140',
        formater: (scope) => {
          const time = scope.row.purchaseDate
            ? parseTime(scope.row.purchaseDate, '{y}-{m}-{d}')
            : ''
          return time
        }
      },
      _purchaseWeight: {
        prop: 'purchaseWeight',
        label: '采购重量(KG)',
        align: 'right',
        minWidth: '120',
        isShow: () => {
          // 待询价和待报价状态的采购需求隐藏“采购重量(KG)”字段
          // return this.activeName === '0'
          return this.activeName !== '1' && this.activeName !== '2'
        }
      },
      _stayPurchaseWeight: {
        prop: 'stayPurchaseWeight',
        label: '待采重量(KG)',
        align: 'right',
        minWidth: '120',
        isShow: () => {
          // 待询价和待报价状态的采购需求隐藏“待采重量（KG）”字段
          // return this.activeName === '0'
          return this.activeName !== '1' && this.activeName !== '2'
        }
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _issuerName: {
        prop: 'issuerName',
        label: '下发人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _issueDate: {
        prop: 'issueDate',
        label: '下发时间',
        minWidth: '160',
        formater: (scope) => {
          const time = scope.row.issueDate
            ? parseTime(scope.row.issueDate)
            : ''
          return time
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '120',
        formater: (scope) => {
          return this.getStatus(scope.row)
          // return scope.row.status === 1
          //   ? '<span style="color:#FF9214 ">待下单</span>'
          //   : '<span style="color:#00BCC5 ">已下单</span>'
        },
        isShow: () => {
          return this.activeName === '0'
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.init()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.init()
      }
    }
    return {
      searchParams: {},
      activeName: '1',
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas,
      dataSource: [],
      columns,
      pagination,
      // choseResult: [],
      count: {},
      enquiryChoose: [], // 生产询价单选中数据
      // firstChoseResult: [], // 待下单第一次选中数据
      isWait: false // 待下单页签生成采购订单时，只允许选择同一供应商已报价的采购需求
    }
  },
  created() {
    this.init()
  },
  // activated() {
  //   this.init()
  // },
  methods: {
    // 状态的返回
    getStatus(data) {
      let status = ''
      switch (data.status) {
        case 1:
          status = `<span style="color:#FF9214">待询价</span>`
          break
        case 2:
          status = `<span style="color:#FF9214">待报价</span>`
          break
        case 3:
          status = `<span style="color:#FF9214">待下单</span>`
          break
        case 4:
          status = `<span style="color:#00BCC5">已下单</span>`
          break
      }
      return status
    },
    selectionResult(result) {
      console.log(result, 'result')
      this.enquiryChoose = []
      // this.firstChoseResult = []
      if (this.activeName === '1') {
        this.enquiryChoose = result
      }
      // if (this.activeName === '3' && result.length === 1) {
      //   this.firstChoseResult = result
      // }
      // this.choseResult = result
    },
    handleClick(val) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = 20
      this.init()
    },
    submit() {
      // if (!this.choseResult.length) {
      //   this.$message({
      //     type: 'info',
      //     message: '请选择采购计划'
      //   })
      //   return
      // }
      // const a = JSON.stringify({ result: this.choseResult })
      // localStorage.setItem('pmsDemandList', a)
      this.$router.push('/pms/order-management/new')
    },
    enquirySubmit() {
      if (!this.enquiryChoose.length) {
        this.$message({
          type: 'info',
          message: '请选择采购需求'
        })
        return
      }
      const enquiry = JSON.stringify({ result: this.enquiryChoose })
      localStorage.setItem('pmsDemanEnuiry', enquiry)
      this.$router.push('/pms/enquiry-manage/new')
    },
    // 获取列表操作
    async init() {
      const res = await api.list(this.searchParams, {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...{ status: this.activeName !== '0' ? this.activeName : undefined }
      })
      if (res.code === 200) {
        const listData = res.data.list || []
        this.dataSource = listData
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
      } else {
        this.$message({
          message: resCount.message,
          type: 'error'
        })
      }
      const resCount = await api.count(this.searchParams)
      if (resCount.code === 200) {
        this.count = resCount.data || {}
      } else {
        this.$message({
          message: resCount.message,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/base.scss";
.DemandManagement {
  .el-tabs__nav-wrap {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-table-column--selection .cell {
  padding-left: 20px;
}
.DemandManagement {
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  /deep/ .el-table th > .cell {
    > :first-child {
      visibility: hidden;
    }
  }
}
</style>

