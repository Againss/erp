<!--
 * @Descripttion:客样分析列表
 * @version:
 * @Author: shujing
 * @Date: 2020-11-16 12:01:41
-->
<template>
  <div class="guest-application">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>

    <!-- tab页签切换 -->
    <div class="tabchange">
      <div class="tabchange_he">
        <el-tabs v-model="activeName" class="puactive_class" @tab-click="handleClick">

          <el-tab-pane name="0">
            <span slot="label" class="labelIndex" tabindex="0">{{ `全部(${totalNum.all || 0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label" class="labelIndex" tabindex="1">{{ `待提交(${totalNum.draft || 0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="labelIndex" tabindex="2">{{ `进行中(${totalNum.processing || 0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label" class="labelIndex" tabindex="3">{{ `已完结(${totalNum.completed || 0})` }} </span>
          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label" class="labelIndex" tabindex="4">{{ `已取消(${totalNum.cancelled || 0})` }}</span>
          </el-tab-pane>

          <!-- <el-tab-pane :label="`全部(${totalNum.all || 0})`" name="0" />
          <el-tab-pane :label="`待提交(${totalNum.draft || 0})`" name="1" />
          <el-tab-pane :label="`进行中(${totalNum.processing || 0})`" name="2" />
          <el-tab-pane :label="`已完结(${totalNum.completed || 0})`" name="3" />
          <el-tab-pane :label="`已取消(${totalNum.cancelled || 0})`" name="4" /> -->
        </el-tabs>
        <!-- 新建 -->
        <div class="createbutton">
          <el-button
            v-permission="['customerOrder:sampleAnalysisApply:add']"
            size="small"
            type="primary"
            @click="addHandler"
          >新建</el-button>
        </div>
      </div>
    </div>

    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
  </div>
</template>
<script>
// import logMethods from '@/views/product-center/mixin/log-methods.js'
import { pageList, guestapplyCommit, guestapplyCancel, ListNum } from './api/index.js'
export default {
  name: 'GuestApplicationList',
  data() {
    const searchData = [
      {
        prop: 'id',
        itemType: 'input',
        label: '申请单号:'
        // itemStyle: { width: '25%' },
        // placeholder: ''
      },
      {
        prop: 'customerServiceName',
        itemType: 'input',
        label: '客服:'
        // itemStyle: { width: '25%' },
        // placeholder: ''
      },
      {
        prop: 'customerRequireId',
        itemType: 'input',
        label: '需求单号:'
        // itemStyle: { width: '25%' },
        // placeholder: ''
      },

      {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '申请日期:',
        itemStyle: { width: '360px' },
        // pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params.dateRange) {
            params.createdStartTime = params.dateRange[0]
            params.createdEndTime	 = params.dateRange[1]
          } else {
            params.createdStartTime = null
            params.createdEndTime	 = null
          }
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]

    // 表格信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '40',
        showOverflowTooltip: true
      },
      {
        prop: 'id',
        label: '申请单号',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push({
            name: 'guestApplicationDetail',
            params: { id: scope.row.id, edit: 'show' }
          })
        },
        style: {
          color: '#1890FF',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerServiceName',
        label: '客服',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'requireFrom',
        label: '需求来源',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'customerRequireId',
        label: '需求单号',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'analysisId',
        label: '分析编号',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: (scope) => {
          // const code = scope.row.id
          this.jumpAnalysis(scope.row)
        },
        formater: (scope) => {
          return this.getStatusList(scope.row)
        }
        // style: {
        //   color: '#0000FF',
        //   cursor: 'pointer'
        // }
      },
      // {
      //   prop: 'sename',
      //   label: '状态',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'customerName',
        label: '申请时间',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'targetCompletedTime',
        label: '要求完成时间',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.targetCompletedTime ? this.$filters.parseTime(scope.row.targetCompletedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
      // {
      //   prop: 'gename',
      //   label: '工艺分析进度',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // }
    ]

    // 具体操作信息
    const dataList = [
      {
        label: '编辑',
        permitTag: ['customerOrder:sampleAnalysisApply:modify'],
        isShow: (scope) => {
          // return true
          return scope.row.status === 1
        },
        handle: params => {
          // params.row.analysisTarget = params.row.analysisTarget && params.row.analysisTarget.split('|') || []
          this.$router.push({
            name: 'guestApplicationDetail',
            params: { id: params.row.id, edit: 'edit' }
          })
        }
      },
      // {
      //   label: '提交',
      //   permitTag: ['customerOrder:sampleAnalysisApply:submit'],
      //   isShow: (scope) => {
      //     // return true
      //     return scope.row.status === 1
      //   },
      //   handle: params => {
      //     this.$confirm('提交后将不可撤回，请确认是否提交?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //       center: true
      //     })
      //       .then(() => {
      //         this.commit({ id: params.row.id })
      //       })
      //   }
      // },
      {
        label: '取消',
        permitTag: ['customerOrder:sampleAnalysisApply:cancel'],
        isShow: (scope) => {
          // return true
          return scope.row.status === 2
        },
        handle: params => {
          this.$confirm('取消后将不可撤回，请确认是否取消?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.cancel({ id: params.row.id })
            })
        }
      }
    ]
    // 操作信息
    const popOperates = {
      label: '操作',
      width: '250',
      dataSource: this.$filterPermission(dataList)
    }

    // 分页配置
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      activeName: '2',
      totalNum: {},
      formOtions: {
        size: 'small',
        inline: true
      },
      searchData,
      columns,
      dataSource: [],
      popOperates,
      pagination,
      dataList
    }
  },
  created() {
    this.getList()
    // this.getStatusNum({})
    // this.getPermission()
  },
  methods: {
    // 处理状态数据
    getStatus(data) {
      let str = ''
      switch (data.status) {
        case 1:
          str = `<span style="color:#888E9E">草稿</span>`
          break
        case 2:
          str = `<span style="color:#FF9214">进行中</span>`
          break
        case 3:
          str = `<span style="color:#00BCC5">已完结</span>`
          break
        case 4:
          str = `<span style="color:#666666">已取消</span>`
          break
        default:
          break
      }
      return str
    },
    // tab页签切换
    handleClick() {
      if (this.activeName - 0 !== 1 && this.activeName - 0 !== 3 && this.activeName - 0 !== 4) {
        if (this.columns[this.columns.length - 1].label !== '工艺分析进度') {
          this.columns.push({
            prop: 'analysisProgress',
            label: '工艺分析进度',
            minWidth: '80',
            formater: (scope) => {
              return this.getAnalysisProgress(scope.row.analysisProgress)
            }
          })
        }
      } else {
        if (this.columns[this.columns.length - 1].label === '工艺分析进度') {
          this.columns.pop()
        }
      }

      if (this.activeName - 0 !== 2 && this.activeName - 0 !== 3 && this.activeName - 0 !== 4) {
        if (this.columns[6].label !== '状态') {
          this.columns.splice(6, 0, {
            prop: 'status',
            label: '状态',
            minWidth: '80',
            formater: (scope) => {
              return this.getStatus(scope.row)
            }
          })
        }
      } else {
        if (this.columns[6].label === '状态') {
          this.columns.splice(6, 1)
        }
      }

      if (this.activeName - 0 === 3 || this.activeName - 0 === 4) {
        this.popOperates = null
      } else {
        const that = this
        this.popOperates = {
          label: '操作',
          width: '250',
          dataSource: this.$filterPermission(that.dataList)
        }
      }

      this.getList()
    },
    // 列表状态数量
    async getStatusNum(data = {}) {
      const res = await ListNum({
        ...this.searchFormDatas,
        ...data
      })

      this.totalNum = res.data || {}
    },
    // 处理工艺分析进度
    getAnalysisProgress(data) {
      let str = ''
      switch (data) {
        case 0:
          str = `<span style="color:#FF9214">待分析</span>`
          break
        case 1:
          str = `<span style="color:#FF9214">分析中</span>`
          break
        case 2:
          str = `<span style="color:#FF9214">待审核</span>`
          break
        case 3:
          str = `<span style="color:#FF9214">分析中</span>`
          break
        default:
          break
      }
      return str
    },
    // 获取列表
    async getList(data = {}) {
      const obj = { status: this.activeName - 0 }
      const res = await pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })

      this.dataSource =
        (res.data.list && res.data.list.map((item, index) => {
          item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          return item
        })) || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.getStatusNum({})
    },

    // 提交
    async commit(data = {}) {
      await guestapplyCommit({ ...data })
        .then(() => {
          this.getList()
        })
        .catch(() => {
        //   this.$message({
        //   message: '提交失败！',
        //   type: 'warning'
        // });
        })
    },

    // 取消
    async cancel(data = {}) {
      await guestapplyCancel({ ...data })
        .then(() => {
        //   this.$message({
        //   message: '取消成功！',
        //   type: 'success'
        //  });
          this.getList()
        })
        .catch(() => {
        //   this.$message({
        //   message: '取消失败！',
        //   type: 'warning'
        // });
        })
    },
    // 新建
    addHandler() {
      this.$router.push({
        name: 'guestApplicationCreate'
      })
    },
    // 分析编号跳转客样分析工艺单
    jumpAnalysis(dataArray) {
      console.log('Sssss', dataArray)
      if (dataArray && dataArray.id && Number(dataArray.status) === 3) {
        this.$router.push(`/customer-order/analysis-application/guest-application/weaveTechPrint?id=${dataArray.id}`)
      }
    },
    getStatusList(dataArray) {
      if (dataArray && Number(dataArray.status) === 3) {
        return `<span style="color: #1890FF;cursor:pointer">${dataArray.analysisId || ''}</span>`
      } else {
        return `<span>${dataArray.analysisId || ''}</span>`
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.guest-application {
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
        /deep/  .labelIndex{
          padding: 0 15px;
          border: 0 none;
          outline: none;
        }
      }
    }
  }

</style>
<style lang='scss'>
//  .guest-application{
//    .table_4_column_29 span{
//      color: #0000FF;
//    }
//   .tabchange{
//     display: flex;
//     position: relative;
//     padding:20px;
//     padding-bottom: 0;
//     background-color: #fff;
//     .el-tabs{
//       flex: 1;
//     }
//     .el-tabs__nav-wrap::after{
//       height: 0px !important;
//     }
//     .el-tabs__active-bar{
//        background-color:transparent !important;
//     }
//     .el-tabs__header{
//        margin: 0;
//     }
//   }
// }
</style>
