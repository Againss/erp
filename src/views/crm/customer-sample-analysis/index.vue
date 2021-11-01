<template>
  <div class="sample-analysis">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createSampleAnalysis">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="sampleAnalysisDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="sampleAnalysisPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { SampleAnalysis } from './components/index'
import { SampleAnalysisRelevant } from './components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import status from '@/views/crm/public/config/status.js'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import uploadSlotTip from './components/upload-slot-tip.vue'
export default {
  mixins: [SampleAnalysis, PublicCrm, SampleAnalysisRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 商机搜索
    const businessSearch = value => {
      if (value === '') {
        this.$set(this.sampleAnalysisPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData2) {
          this.getData2 = this.$utils.debounce(this.remoteBusinessPage, 300)
        }
        this.getData2({ name: value, dataTag: 'ALL' }, 0, this.sampleAnalysisPopOptions)
      }
    }

    // 商机change事件
    const businessChange = (object, form, formDatas, setFormDatas) => {
      console.log(object, form, formDatas, setFormDatas)
      this.$set(this.sampleAnalysisPopOptions.formDatas, 'customerName', object.customerName)
      this.getBrandBusiness({ customerId: object.customerId })
    }

    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'dataTag',
        itemType: 'select',
        label: '范围:',
        dataSource: [
          {
            value: 'ALL',
            label: '全部'
          },
          {
            value: 'ME',
            label: '我的'
          }
        ]
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        prop: 'keyword',
        itemType: 'input',
        label: '请输入:',
        placeholder: '客样分析申请编号/商机名'
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '草稿',
            value: 'D'
          },
          {
            label: '已提交',
            value: 'S'
          },
          {
            label: '分析中',
            value: 'A'
          },
          {
            label: '已完成',
            value: 'C'
          },
          {
            label: '已取消',
            value: 'R'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getSampleAnalysisPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息/以下五个都是table的配置信息
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
        width: '160',
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
      {
        prop: 'businessOpportunityName',
        label: '商机',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/business-opportunity/business-opportunity-details-page/${scope.row.businessOpportunityId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'endTime',
        label: '要求完成日期',
        width: '150',
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
          return scope.row[scope.column.property] ? status[scope.row[scope.column.property]] : ''
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
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: scope => {
          return scope.row.status === 'D'
        },
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params, this.userInfo)
          this.PopDialogHandle(this.sampleAnalysisPopOptions, '编辑客样分析申请')
          this.$set(this.sampleAnalysisPopOptions.content[0], 'disabled', true)
          // this.$set(this.sampleAnalysisPopOptions.content[0], 'disabled', true)
          this.getSampleAnalysisInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: scope => {
          return scope.row.status === 'D'
        },
        handle: params => {
          this.$confirm(' 你确认要删除该客样分析申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.deleteSampleAnalysis({ id: params.row.id })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: handleConf
    }

    // pop弹出框配置信息
    const sampleAnalysisPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const analysisTarget = params.analysisTarget.join('|')
        const brandId = params.brandId.value
        const brandName = params.brandId.label
        const businessOpportunityId = params.businessOpportunityId.value
        const businessOpportunityName = params.businessOpportunityId.label
        const customerId = params.businessOpportunityId.customerId
        const sellerTeamId = params.sellerTeamId.value
        const sellerTeamName = params.sellerTeamId.label
        const endTime = params.endTime ? new Date(params.endTime).getTime() : null
        const filePath = (params.filePath && params.filePath[0]) ? params.filePath[0].response ? params.filePath[0].response.data : params.filePath[0].url : null
        this.addOrEditSampleAnalysis({ ...params, analysisTarget, brandId, brandName, businessOpportunityId, businessOpportunityName, customerId, sellerTeamId, sellerTeamName, filePath, endTime })
      },
      cancel: params => {
        this.closePopDialogHandle(this.sampleAnalysisPopOptions)
        // console.log(params)
      },
      formDatas: {
        filePath: null,
        analysisTarget: []
        // sellerId: this.userInfo.userId
        // sellerId: this.userInfo.realName
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'businessOpportunityId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: businessSearch,
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机',
          change: businessChange,
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找商机'
        },
        {
          prop: 'customerName',
          itemType: 'input',
          // labelWidth: '121px',
          disabled: true,
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          rules: [commonBlurReg],
          placeholder: '查找并选择商机后自动获取'
        },
        {
          prop: 'sellerTeamId',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '销售部门',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'sellerName',
          itemType: 'input',
          // labelWidth: '121px',
          disabled: true,
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '销售员',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonBlurReg],
          placeholder: '请输入销售员'
        },
        {
          prop: 'brandId',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '品牌商',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'year',
          itemType: 'select',
          // labelWidth: '121px',
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '销售年度',
          // rules: [commonChangeReg],
          dataSource: [
            {
              value: '2019',
              label: '2019'
            },
            {
              value: '2020',
              label: '2020'
            },
            {
              value: '2021',
              label: '2021'
            },
            {
              value: '2022',
              label: '2022'
            }
          ]
        },
        {
          prop: 'quarter',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '销售季度',
          // rules: [commonChangeReg],
          dataSource: [
            {
              value: 'Spr',
              label: 'Spr'
            },
            {
              value: 'Sum',
              label: 'Sum'
            },
            {
              value: 'Fall',
              label: 'Fall'
            },
            {
              value: 'Winter',
              label: 'Winter'
            }
          ]
        },
        {
          prop: 'endTime',
          itemType: 'date',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          // labelWidth: '121px',
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '完成日期',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'hasSample',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '是否有客样',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'true',
              label: '是'
            },
            {
              value: 'false',
              label: '否'
            }
          ]
        },
        {
          prop: 'sampleId',
          itemType: 'input',
          // labelWidth: '121px',
          maxlength: 20,
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客来板编号',
          // rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'analysisTarget',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '分析目的',
          multiple: true,
          collapseTags: true,
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'O',
              label: '报价'
            },
            {
              value: 'D',
              label: '样板开发'
            },
            {
              value: 'S',
              label: '大货'
            }
          ]
        },
        {
          prop: 'customerRequirement',
          itemType: 'input',
          type: 'textarea',
          maxlength: 1000,
          autosize: { minRows: 2, maxRows: 4 },
          // itemStyle: { 'width': '100%', 'marginRight': '0px' },
          label: '客户要求',
          // rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'filePath',
          itemType: 'upload',
          label: '文件上传',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
            // this.$set(this.sampleAnalysisPopOptions.formDatas, 'filePath', res.data)
            // this.fetchLog(this.getLogMessages('IMPORT', '/userCenter/sysUser/batch/add'), file, JSON.stringify({ beforeText: `在'用户中心-员工管理'批量导入成功` }))
            // this.importPopDialogHandle()
            // this.closePopDialogHandle(this.enclosurePopOptions)
            // this.getfilePage()
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            console.log('beforeRemove', file, fileList)
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              console.log(this.sampleAnalysisPopOptions.formDatas)
              // this.sampleAnalysisPopOptions.formDatas.filePath = null
              this.$set(this.sampleAnalysisPopOptions.formDatas, 'filePath', [])
              this.deleteAttachment({ bizType: 'SAMPLE_ANALYSIS', url: file.response.data })
            }) : true
          },
          beforeUpload: (file) => {
            // console.log(file.type.split('/')[1])
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            console.log(file, fileType, regexp, isXls)
            const isLt1M = file.size / 1024 / 1024 <= 10
            if (!isXls) {
              this.$message.error('上传文件只能是 pdf/word/excel/ppt/jpg/png 格式!')
            } else if (!isLt1M) {
              this.$message.error('上传文件大小不能超过 10MB!')
            }
            return isXls && isLt1M
          },
          action: `/crm/attachment/upload`,
          data: {
            // bizId: this.routeId,
            // follower: this.follower,
            bizType: 'SAMPLE_ANALYSIS'
          },
          accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
          showFileList: true,
          fileList: this.fileList,
          limit: 1,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            },
            {
              slot: 'tip',
              component: uploadSlotTip
            }
          ]
        }
      ]
    }
    return {
      searchData,
      formDatas: {
        dataTag: 'ALL'
      },
      formOtions: {
        size: 'small',
        inline: true
      },
      columns,
      pagination,
      popOperates,
      sampleAnalysisDataSource: [],
      type: 'edit',
      sampleAnalysisPopOptions,
      searchFormDatas: {},
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
      fileList: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getSampleAnalysisPage()
  },
  methods: {
    createSampleAnalysis() {
      this.type = 'add'
      const userInfo = this.userInfo
      const saleOrgs = (userInfo.orgs && userInfo.orgs.length !== 0) ? userInfo.orgs.filter(item => item.functionTag === 'SAL').map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      }) : []
      // console.log(userInfo, saleOrgs)
      this.$set(this.sampleAnalysisPopOptions.content[0], 'disabled', false)
      // this.$set(this.sampleAnalysisPopOptions.content[12], 'fileList', [])
      this.$set(this.sampleAnalysisPopOptions, 'formDatas', {})
      this.$set(this.sampleAnalysisPopOptions.formDatas, 'sellerName', userInfo.realName)
      // this.$set(this.sampleAnalysisPopOptions.formDatas, 'analysisTarget', [])
      // this.$set(this.sampleAnalysisPopOptions.formDatas, 'fillPath', null)
      this.$set(this.sampleAnalysisPopOptions.formDatas, 'sellerId', userInfo.userId)
      this.$set(this.sampleAnalysisPopOptions.content[2], 'dataSource', saleOrgs)
      this.$set(this.sampleAnalysisPopOptions.content[0], 'dataSource', [])
      this.PopDialogHandle(this.sampleAnalysisPopOptions, '新建客样分析申请')
    }
  }
}
</script>

<style lang='scss' scoped>
.sample-analysis {
  padding: 20px;

}
</style>

<style lang="scss">
.popOptionsClass {
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}
</style>
