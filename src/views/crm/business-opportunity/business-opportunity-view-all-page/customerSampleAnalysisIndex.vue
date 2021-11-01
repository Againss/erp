<template>
  <div class="sample-analysis-view-all-page">
    <div class="sampleAnalysisHeader">
      <span v-if="sampleAnalysisName" class="sampleAnalysisText">{{ sampleAnalysisName }}</span>
      <!-- <div class="button">
        <el-button size="mini" type="primary" plain @click="viewAllAdd">新建</el-button> -->
      <!-- <el-button @click="$router.back()">返回</el-button> -->
      <!-- </div> -->
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="sampleAnalysisDataSource"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="businessPopOptions" />
    </div>
  </div>
</template>

<script>
import { SampleAnalysisRelevant } from '../../customer-sample-analysis/components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import { businessOpportunityInfo } from '../api/index.js'
import status from '@/views/crm/public/config/status.js'
export default {
  mixins: [SampleAnalysisRelevant, PublicCrm],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

    // 格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'customerRequireId',
        label: '客样分析申请编号',
        width: '140',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/customer-sample-analysis/customer-sample-analysis-details-page/${scope.row.customerRequireId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      // {
      //   prop: 'businessOpportunityName',
      //   label: '商机',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   handle: scope => {
      //     console.log('scope', scope)
      //     this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.id}`)
      //   },
      //   style: {
      //     color: '#1890ff',
      //     cursor: 'pointer'
      //   }
      // },
      {
        prop: 'endTime',
        label: '要求完成日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'sellerTeamName',
        label: '销售部门',
        minWidth: '80',
        showOverflowTooltip: true
        // formater: scope => {
        //   return scope.row[scope.column.property] === 'M' ? '男' : scope.row[scope.column.property] === 'W' ? '女' : ''
        // }
      },
      {
        prop: 'sellerName',
        label: '销售员',
        minWidth: '70',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '客样分析状态',
        width: '120',
        formater: scope => {
          // const tempArray = []
          return status[scope.row[scope.column.property]]
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getSampleAnalysisPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getSampleAnalysisPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // let handleConf = [
    //   {
    //     label: '编辑',
    //     // permitTag: ['userCenter:sysDataMaskingRule:modify'],
    //     isShow: true,
    //     handle: params => {
    //       this.type = 'edit'
    //       console.log('编辑', params)
    //       this.PopDialogHandle(this.businessPopOptions, '编辑商机')
    //       this.getSampleAnalysisInfo({ id: params.row.id })
    //     }
    //   },
    //   {
    //     label: '删除',
    //     // permitTag: ['userCenter:sysDataMaskingRule:modify'],
    //     isShow: true,
    //     handle: params => {
    //       this.$confirm(' 你确认要删除该商机吗？', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning',
    //         center: true
    //       })
    //         .then(() => {
    //           this.deleteSampleAnalysis({ id: params.row.id })
    //         })
    //         .catch(() => {
    //           this.$message({
    //             type: 'info',
    //             message: '已取消删除'
    //           })
    //         })
    //     }
    //   }
    // ]
    // handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    // const popOperates = {
    //   label: '操作',
    //   width: '100',
    //   dataSource: handleConf
    // }

    // pop弹出框配置信息
    const businessPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const salesAmount = params.salesAmount && (params.salesAmount * 10000).toFixed()
        // const sampleAnalysisId = params.sampleAnalysisName
        this.addOrEditSampleAnalysis({ ...params, salesAmount })
      },
      cancel: params => {
        this.closePopDialogHandle(this.businessPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          maxlength: 50,
          label: '商机名称',
          rules: [commonBlurReg],
          placeholder: '请输入商机名称'
        },
        {
          prop: 'sampleAnalysisId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '客户',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: this.remoteSearch,
          rules: [commonChangeReg],
          placeholder: '请查找客户',
          dataSource: []
        },
        {
          prop: 'salesAmount',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          maxlength: 12,
          label: '销售金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入销售金额'
        },
        {
          itemType: 'date',
          prop: 'endDate',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '结束日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'businessStageId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '商机阶段',
          change: this.stageChange,
          rules: [commonChangeReg],
          placeholder: '请输入商机阶段',
          dataSource: []
        },
        {
          prop: 'probability',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '20px' },
          label: '赢单概率',
          readonly: true,
          disabled: true,
          rules: [commonBlurReg]
          // placeholder: '请输入座机号'
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '97%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          label: '备注',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入备注'
        }
      ]
    }
    return {
      formDatas: {
        dataTag: 'ALL'
      },
      formOtions: {
        inline: true
      },
      columns,
      pagination,
      // popOperates,
      sampleAnalysisDataSource: [],
      type: 'edit',
      businessPopOptions,
      searchFormDatas: {
        businessOpportunityId: this.$route.params.id
      },
      businessOpportunityStage: [],
      sampleAnalysisName: ''
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getBusinessOpportunityInfo({ id: this.routeId })
    this.getSampleAnalysisPage({ businessOpportunityId: this.routeId })
  },
  methods: {
    viewAllAdd() {
      this.type = 'add'
      this.PopDialogHandle(this.businessPopOptions, '新建商机')
    },
    // 获取商机详情
    async getBusinessOpportunityInfo(data = {}) {
      const res = await businessOpportunityInfo(data)
      console.log('详情', res)
      this.sampleAnalysisName = res.data.name
      // const endDate = res.data.endDate ? this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}') : null
      // this.setFormDatas(this.businessPopOptions, { ...res.data, endDate })
      // this.stageChange(res.data.businessStageId)
    }
  }
}
</script>

<style lang='scss' scoped>
.sample-analysis-view-all-page {
    padding:20px;

    .sampleAnalysisHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        background-color: #fff;
        display: flex;
        align-items: center;
    }

    .sampleAnalysisText {
      font-size: 18px;
      font-weight: 400;
      flex:1;
      margin-left: 20px;
    }

    .button {
        display: flex;
        margin-right: 20px;
    }
}
</style>
