<!--
 * @Date: 2020-11-16
 * @Author: ll
 * @Descripttion: 客样分析结果列表
-->
<template>
  <div class="guest-sample-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane name="0">
          <span slot="label" tabindex="0" class="labelIndex">{{ `全部(${totalNum.all || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label" tabindex="1" class="labelIndex">{{ `进行中(${totalNum.underway || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" tabindex="2" class="labelIndex">{{ `待提交(${totalNum.rejected || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" tabindex="3" class="labelIndex">{{ `待审核(${totalNum.toAudited || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label" tabindex="4" class="labelIndex">{{ `已完结(${totalNum.completed || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label" tabindex="5" class="labelIndex">{{ `已取消(${totalNum.cancelled || 0})` }}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 评审、驳回弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { sysDataGroupPage, sysDataGroupNum, statusSubmit, statusApprove, statusReject, userSelet } from './api/index.js'
export default {
  data() {
    // 查询
    const searchData = [
      {
        prop: 'csSampleAnalysisApplayId',
        itemType: 'input',
        label: '申请单号',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'id',
        itemType: 'input',
        label: '分析编号',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'clothsType',
        itemType: 'input',
        label: '布种',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'fabricComposition',
        itemType: 'input',
        label: '面料成份',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'craftRequire',
        itemType: 'input',
        label: '工艺要求',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'customerServiceId',
        itemType: 'select',
        label: '客服',
        clearable: true,
        filterable: true,
        itemStyle: { width: '30%' },
        visibleChange: (value) => {
          if (value) {
            this.getCustomerSelect()
          }
        },
        dataSource: []
      },
      {
        itemStyle: { width: '30%' },
        itemType: 'date',
        prop: 'createdTime',
        label: '申请日期',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
        /*         rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }] */
      },
      {
        itemStyle: { width: '30%' },
        itemType: 'date',
        prop: 'targetCompletedTime',
        label: '要求完成日期',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
        /*         rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }] */
      },
      {
        itemStyle: { width: '30%' },
        itemType: 'date',
        prop: 'analyseTime',
        label: '分析日期',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
        /*         rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }] */
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const createdTime = params.createdTime && params.createdTime[0]
          const createdTimeEnd = params.createdTime && params.createdTime[1]
          const targetCompletedTime = params.targetCompletedTime && params.targetCompletedTime[0]
          const targetCompletedTimeEnd = params.targetCompletedTime && params.targetCompletedTime[1]
          const analyseTime = params.analyseTime && params.analyseTime[0]
          const analyseTimeEnd = params.analyseTime && params.analyseTime[1]
          // this.formDatas = { ...params, createdTime: createdTime, createdTimeEnd: createdTimeEnd, targetCompletedTime, targetCompletedTimeEnd, analyseTime, analyseTimeEnd }
          this.searchFormDatas = { ...params, createdTime: createdTime, createdTimeEnd: createdTimeEnd, targetCompletedTime, targetCompletedTimeEnd, analyseTime, analyseTimeEnd }
          this.getListData({ ...params, createdTime, createdTimeEnd, targetCompletedTime, targetCompletedTimeEnd, analyseTime, analyseTimeEnd })
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.formDatas = {}
        }
      }
    ]
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'csSampleAnalysisApplayId',
        label: '申请单号',
        width: '140',
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push(`./detail/${scope.row.csSampleAnalysisApplayId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerServiceName',
        label: '客服',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'id',
        label: '分析编号',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.status === 0 ? '' : scope.row.id
        }
      },
      {
        prop: 'clothsType',
        label: '布种',
        showOverflowTooltip: true,
        minWidth: '140'
      },
      {
        prop: 'fabricComposition',
        label: '面料成份',
        showOverflowTooltip: true,
        minWidth: '140'
      },
      {
        prop: 'craftRequire',
        label: '工艺要求',
        showOverflowTooltip: true,
        minWidth: '140'
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '80',
        formater: (scope) => {
          return this.getStatus(scope.row)
        }
      },
      {
        prop: 'createdTime',
        label: '申请时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(
            scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      {
        prop: 'targetCompletedTime',
        label: '要求完成时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.targetCompletedTime ? this.$filters.parseTime(
            scope.row.targetCompletedTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      {
        prop: 'analyseBy',
        label: '工艺员',
        showOverflowTooltip: true,
        width: '80'
      },
      {
        prop: 'updatedTime',
        label: '工艺分析时间',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.analyseTime ? this.$filters.parseTime(
            scope.row.analyseTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      }
    ]
    let popOperatesDataSource = [
      // {
      //   label: '审核',
      //   permitTag: ['techManage:sampleAnalysisResult:audit'],
      //   isShow: (scope) => {
      //     return scope.row.status === 2
      //   },
      //   handle: scope => {
      //     this.$router.push(`./detail/${scope.row.csSampleAnalysisApplayId}`)
      //     // this.approveClick(scope.row.id)
      //   }
      // },
      // {
      //   label: '驳回',
      //   permitTag: ['techManage:sampleAnalysisResult:reject'],
      //   isShow: (scope) => {
      //     return scope.row.status === 2
      //   },
      //   handle: scope => {
      //     this.$router.push(`./detail/${scope.row.csSampleAnalysisApplayId}`)
      //     // this.rejectClick(scope.row.id)
      //   }
      // },
      {
        label: '编辑',
        permitTag: ['techManage:sampleAnalysisResult:modify'],
        isShow: (scope) => {
          return scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 3 || scope.row.status === null
        },
        handle: scope => {
          this.$router.push(`./detail/${scope.row.csSampleAnalysisApplayId}?status=1`)
        }
      }
      // {
      //   label: '提交',
      //   permitTag: ['techManage:sampleAnalysisResult:submit'],
      //   isShow: (scope) => {
      //     return scope.row.status === 3
      //   },
      //   handle: scope => {
      //     this.$router.push(`./detail/${scope.row.csSampleAnalysisApplayId}`)

      //   }
      // }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getListData({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const content = [
      {
        prop: 'reviewOpinion',
        itemType: 'input',
        type: 'textarea',
        label: '审核意见',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [commonBlurReg, { min: 1, max: 100, message: '长度在1 到100 个字符', trigger: 'blur' }]
      }
    ]
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '审核意见',
      okText: '保存',
      ok: params => {
        console.log(this.optionStatus)
        if (this.optionStatus === 'approve') {
          this.approveSampleAnalysis(params.reviewOpinion)
        } else if (this.optionStatus === 'reject') {
          this.rejectSampleAnalysis(params.reviewOpinion)
        }
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      },
      formDatas: {},
      formOptions: {},
      content: content
    }
    return {
      columnId: '',
      optionStatus: '',
      searchData,
      formOtions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {},
      formDatas: {},
      activeName: '1',
      totalNum: {},
      columns,
      popOptions,
      content,
      allColumns: [],
      dataSource: [],
      pagination,
      popOperates,
      popOperatesDataSource,
      userData: []
    }
  },
  created() {
    this.getCustomerSelect()
    this.getListData()
  },
  methods: {
    // 客服下拉搜索
    async getCustomerSelect() {
      const res = await userSelet({ isEnabled: 1 })
      if (res.code !== 200) {
        return false
      }
      this.userData = res.data.list || []
      this.userData.map((item, index) => {
        item.label = item.realName
        item.value = item.userId
      })
      this.$set(this.searchData[5], 'dataSource', this.userData)
    },
    // 处理状态数据
    getStatus(data) {
      let status = ''
      switch (data.status) {
        case 0:
          status = `<span style="color:#FF9214">待分析</span>`
          break
        case 1:
          status = `<span style="color:#FF9214">分析中</span>`
          break
        case 2:
          status = `<span style="color:#FF9214">待审核</span>`
          break
        case 3:
          status = `<span style="color:#FF4444">已驳回</span>`
          break
        case 4:
          status = `<span style="color:#00BCC5">已完结</span>`
          break
        case 5:
          status = `<span style="color:#888E9E">已取消</span>`
          break
        case null:
          status = `<span style="color:#FF9214">待分析</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },
    handleClick() {
      if (this.activeName === '0' || this.activeName === '4') {
        if (this.columns[this.columns.length - 1].label === '工艺分析时间') {
          this.columns.push({
            prop: 'auditBy',
            label: '审核人',
            showOverflowTooltip: true,
            minWidth: '140'
          },
          {
            prop: 'auditTime',
            label: '审核时间',
            minWidth: '140',
            formater: (scope) => {
              return scope.row.auditTime ? this.$filters.parseTime(
                scope.row.auditTime || 0,
                '{y}-{m}-{d} {h}:{i}'
              ) : ''
            }
          })
        }
      } else {
        if (this.columns[this.columns.length - 1].label !== '工艺分析时间') {
          this.columns.splice(this.columns.length - 2, 2)
        }
      }
      if (this.activeName === '0' || this.activeName === '1' || this.activeName === '3') {
        if (this.columns[7] && this.columns[7].label !== '状态') {
          this.columns.splice(7, 0, {
            prop: 'status',
            label: '状态',
            minWidth: '80',
            formater: (scope) => {
              return this.getStatus(scope.row)
            }
          })
        }
      } else {
        if (this.columns[7].label === '状态') {
          this.columns.splice(7, 1)
        }
      }
      // 操作栏的显隐
      if (this.activeName === '4' || this.activeName === '5' || this.activeName === '2') {
        this.popOperates = null
      } else {
        this.popOperates = {
          label: '操作',
          width: '100',
          fixed: 'right',
          dataSource: this.popOperatesDataSource
        }
      }
      this.getListData()
    },
    // 列表数据
    async getListData(data = {}) {
      let obj
      if (this.activeName === '0') {
        obj = {}
      } else {
        obj = { status: this.activeName }
      }
      const res = await sysDataGroupPage({ ...data, ...this.searchFormDatas, ...obj })
      res.data.list && res.data.list.map((item, index) => { item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const dataList = res.data ? res.data.list : []
      // console.log(dataList )
      dataList && dataList.forEach((aitem, aindex) => {
        // console.log(aitem.craftRequire)
        if (aitem.craftRequire && aitem.craftRequire.includes('[')) {
          aitem.craftRequire = JSON.parse(aitem.craftRequire)
          if (aitem.craftRequire.length !== 0) {
            aitem.craftRequire = aitem.craftRequire && aitem.craftRequire.reduce((str, item) => {
              if (str) {
                // 普通已经拼好
                str += ',' + (item && (item.parent && item.type !== 1 ? (item.parent.name + ',' + item.name) : item.name))
              } else {
                str = (item && (item.parent && item.type !== 1 ? (item.parent.name + ',' + item.name) : item.name))
              }
              return str
            }, '')
          } else {
            aitem.craftRequire = ''
          }
        }
      })

      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      const amountRes = await sysDataGroupNum({ ...data, ...this.searchFormDatas })
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
    },
    // 提交客样分析状态
    async submitSampleAnalysis(data) {
      const res = await statusSubmit(data)
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '提交成功!'
      })
      this.getListData()
    },
    // 点击审核按钮
    approveClick(data) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.columnId = data
      this.optionStatus = 'approve'
    },
    // 审核客样分析状态
    async approveSampleAnalysis(data) {
      const res = await statusApprove({ id: this.columnId, reviewOpinion: data })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.getListData()
    },
    // 点击驳回按钮
    rejectClick(data) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.columnId = data
      this.optionStatus = 'reject'
    },
    // 驳回客样分析状态
    async rejectSampleAnalysis(data) {
      const res = await statusReject({ id: this.columnId, reviewOpinion: data })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '驳回成功!'
      })
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.getListData()
    }
  }
}
</script>

<style lang='scss' scoped>
// .guest-sample {
//   padding: 20px;
//   padding-bottom: 0;
// }
  .guest-sample-list{
    padding: 20px;
    .search{
      padding-left: 0px;
    }
  }
  .list-tabs{
    padding-bottom: 1px;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 26px;
      height: 60px;
      line-height: 60px;
    }
    .labelIndex{
      padding: 0 10px;
      border: 0 none;
      outline: none;
    }
  }
  /deep/ .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    font-weight: 400;
  }
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #d0d6da;
}
.standce{
  margin-right: 8.33% !important;
}
// /deep/ .page-table .el-table__row td{
//   padding: 8px 0;
// }
</style>
