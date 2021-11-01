<template>
  <div class="model-develop">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createModelDevelop">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="modelDevelopDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="modelDevelopPopOptions" />
    </div>

    <!-- 选择客样分析pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="sampleAnalysisPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { ModelDevelop } from './components/index'
import { ModelDevelopRelevant } from './components/relevantIndex'
import { PublicCrm } from '@/views/crm/public/index'
import status from '@/views/crm/public/config/status.js'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import uploadSlotTip from './components/upload-slot-tip.vue'
import radioButton from './components/radio-button.vue'
export default {
  mixins: [ModelDevelop, PublicCrm, ModelDevelopRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

    // 颜色提示
    const style = {
      'font-size': '14px',
      'color': '#FF7027',
      'position': 'absolute',
      'top': '9px'
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
        placeholder: ' 样板开发编号/客户/品牌'
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
            label: '生产中',
            value: 'P'
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
          this.getModelDevelopPage(params)
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
        label: '样板开发申请编号',
        width: '160',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/model-develop/model-develop-details-page/${scope.row.customerRequireId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'sampleAnalysisId',
        label: '客样分析申请',
        width: '140',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/customer-sample-analysis/customer-sample-analysis-details-page/${scope.row.sampleAnalysisId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/customer/customer-details-page/${scope.row.customerId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'brandName',
        label: '品牌商',
        minWidth: '80',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/brand-business/brand-business-details-page/${scope.row.brandId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
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
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '样板开发状态',
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
        width: '100'
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getModelDevelopPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getModelDevelopPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 客样分析分页配置信息
    const sampleAnalysisPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.sampleAnalysisPopOptions)
        this.getSampleAnalysisPage({ pageSize: this.sampleAnalysisPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getSampleAnalysisPage({ pageNum: this.sampleAnalysisPagination.pageNum || 1, pageSize: val })
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
          this.PopDialogHandle(this.modelDevelopPopOptions, '编辑样板开发申请')
          this.$set(this.modelDevelopPopOptions.content[0], 'disabled', true)
          // this.$set(this.modelDevelopPopOptions.content[0], 'disabled', true)
          this.getModelDevelopInfo({ id: params.row.id })
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
          this.$confirm(' 你确认要删除该样板开发申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteModelDevelop({ id: params.row.id })
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
    const modelDevelopPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const brandId = params.brandId.value
        const brandName = params.brandId.label
        const sellerTeamId = params.sellerTeamId.value
        const sellerTeamName = params.sellerTeamId.label
        const orderFilePath = (params.orderFilePath && params.orderFilePath[0]) ? params.orderFilePath[0].response ? params.orderFilePath[0].response.data : params.orderFilePath[0].url : null
        const styleFilePath = (params.styleFilePath && params.styleFilePath[0]) ? params.styleFilePath[0].response ? params.styleFilePath[0].response.data : params.styleFilePath[0].url : null
        const otherFilePath = (params.otherFilePath && params.otherFilePath[0]) ? params.otherFilePath[0].response ? params.otherFilePath[0].response.data : params.otherFilePath[0].url : null
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.addOrEditModelDevelop({ ...params, brandId, brandName, sellerTeamId, sellerTeamName, orderFilePath, styleFilePath, otherFilePath, totalAmount })
      },
      cancel: params => {
        this.closePopDialogHandle(this.modelDevelopPopOptions)
        // console.log(params)
      },
      formDatas: {
        orderFilePath: null,
        styleFilePath: null,
        otherFilePath: null
      },
      formOptions: {
      },
      content: [
        {
          prop: 'sampleAnalysisId',
          itemType: 'input',
          readonly: true,
          label: '客样分析申请',
          focus: params => {
            this.PopDialogHandle(this.sampleAnalysisPopOptions, '选择客样分析申请')
            this.getSampleAnalysisPage()
          },
          rules: [commonChangeReg],
          placeholder: '选择客样分析申请'
        },
        {
          prop: 'developType',
          itemType: 'select',
          label: '样板开发类型',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '品质办',
              value: 'Q'
            },
            {
              label: 'Fit Sample',
              value: 'F'
            },
            {
              label: 'AD Sample',
              value: 'A'
            },
            {
              label: '试纱办',
              value: 'G'
            },
            {
              label: '试规格办',
              value: 'S'
            },
            {
              label: 'LA Sample',
              value: 'L'
            }
          ]
        },
        {
          prop: 'sellerTeamId',
          itemType: 'select',
          label: '销售部门',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'sellerName',
          itemType: 'input',
          disabled: true,
          label: '销售员',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonBlurReg],
          placeholder: '请输入销售员'
        },
        {
          prop: 'customerName',
          itemType: 'input',
          disabled: true,
          label: '客户',
          rules: [commonBlurReg],
          placeholder: '查找并选择客样分析后自动获取'
        },
        {
          prop: 'brandId',
          itemType: 'select',
          label: '品牌商',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'year',
          itemType: 'select',
          label: '销售年度',
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
          label: '销售季度',
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
          prop: 'totalAmount',
          itemType: 'input',
          label: '合计金额',
          maxlength: 12,
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入数字'
        },
        {
          prop: 'remark',
          itemType: 'input',
          type: 'textarea',
          maxlength: 1000,
          autosize: { minRows: 2, maxRows: 4 },
          label: '注意事项',
          placeholder: '请输入',
          dataSource: []
        },
        {
          prop: 'orderFilePath',
          itemType: 'upload',
          label: '客户订单',
          className: 'upload-demo',
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.modelDevelopPopOptions.formDatas, 'orderFilePath', [])
              this.deleteAttachment({ bizType: 'MODEL_DEVELOP_ORDER', url: file.response.data })
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
            bizType: 'MODEL_DEVELOP_ORDER'
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
        },
        {
          prop: 'styleFilePath',
          itemType: 'upload',
          label: '成衣款式',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.modelDevelopPopOptions.formDatas, 'styleFilePath', [])
              this.deleteAttachment({ bizType: 'MODEL_DEVELOP_STYLE', url: file.response.data })
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
            bizType: 'MODEL_DEVELOP_STYLE'
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
        },
        {
          prop: 'otherFilePath',
          itemType: 'upload',
          label: '其他',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.modelDevelopPopOptions.formDatas, 'otherFilePath', [])
              this.deleteAttachment({ bizType: 'MODEL_DEVELOP_OTHER', url: file.response.data })
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
            bizType: 'MODEL_DEVELOP_OTHER'
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

    // dialog弹出框表格表头的配置信息
    const columnsInfos = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          radioButton
        },
        componentsOptions: {
          // radio: 1,
          changeMethods: (value) => {
            console.log('组件', value)
            this.sampleAnalysisId = value
            // scope.row.status = scope.row.status === '0' ? '1' : '0'
            // console.log('zx', this.listGroup)
          }
        }
      },
      {
        prop: 'customerRequireId',
        label: '客样分析申请编号',
        width: '140',
        showOverflowTooltip: true
      },
      {
        prop: 'businessOpportunityName',
        label: '商机',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'endTime',
        label: '要求完成日期',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'sellerTeamName',
        label: '销售部门',
        width: '80',
        showOverflowTooltip: true
        // formater: scope => {
        //   return scope.row[scope.column.property] === 'M' ? '男' : scope.row[scope.column.property] === 'W' ? '女' : ''
        // }
      },
      {
        prop: 'sellerName',
        label: '销售员',
        width: '80',
        showOverflowTooltip: true
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
        width: '80'
      }
    ]

    // 选择客样分析弹出框
    const sampleAnalysisPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1020px',
      ok: params => {
        console.log(params)
        const checkedInfo = this.sampleAnalysisList.filter(item => item.customerRequireId === this.sampleAnalysisId)
        if (checkedInfo.length !== 0) {
          this.$set(this.modelDevelopPopOptions.formDatas, 'sampleAnalysisId', checkedInfo[0].customerRequireId)
          this.$set(this.modelDevelopPopOptions.formDatas, 'customerName', checkedInfo[0].customerName)
          this.$set(this.modelDevelopPopOptions.formDatas, 'customerId', checkedInfo[0].customerId)
          this.$set(this.modelDevelopPopOptions.formDatas, 'sellerTeamId', { value: checkedInfo[0].sellerTeamId, label: checkedInfo[0].sellerTeamName })
          this.$set(this.modelDevelopPopOptions.formDatas, 'year', checkedInfo[0].year)
          this.$set(this.modelDevelopPopOptions.formDatas, 'quarter', checkedInfo[0].quarter)
          this.getBrandBusiness({ customerId: checkedInfo[0].customerId })
        }
        this.closePopDialogHandle(this.sampleAnalysisPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.sampleAnalysisPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
        this.$set(this.sampleAnalysisPopOptions.formDatas, 'search', '')
      },
      formDatas: {},
      formOptions: {},
      content: [
        {
          itemType: 'view',
          text: `温馨提示：只显示已完成状态的数据`,
          style
        },
        {
          prop: 'search',
          itemType: 'input',
          label: ' ',
          change: value => {
            if (!this.getData) {
              // this.$set(this.sampleAnalysisPopOptions.formDatas, 'search', value)
              this.getData = this.$utils.debounce(this.getSampleAnalysisPage, 300)
            }
            if (!value) {
              this.$set(this.sampleAnalysisPopOptions.formDatas, 'search', '')
            }
            this.getData({ keyword: value })
          },
          labelWidth: '600px',
          placeholder: '请输入客样分析申请编号或商机名称'
        },
        {
          prop: 'table',
          itemType: 'table',
          label: '',
          labelWidth: '0',
          dataSource: [],
          // rules: [commonChangeReg],
          columns: columnsInfos,
          tooltipEffect: 'dark',
          pagination: sampleAnalysisPagination
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
      columnsInfos,
      pagination,
      sampleAnalysisPagination,
      popOperates,
      modelDevelopDataSource: [],
      type: 'edit',
      modelDevelopPopOptions,
      sampleAnalysisPopOptions,
      searchFormDatas: {},
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
      fileList: [],
      sampleAnalysisList: [],
      sampleAnalysisId: ''
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getModelDevelopPage()
  },
  methods: {
    createModelDevelop() {
      this.type = 'add'
      const userInfo = this.userInfo
      const saleOrgs = (userInfo.orgs && userInfo.orgs.length !== 0) ? userInfo.orgs.filter(item => item.functionTag === 'SAL').map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      }) : []
      // console.log(userInfo, saleOrgs)
      this.$set(this.modelDevelopPopOptions.content[0], 'disabled', false)
      // this.$set(this.modelDevelopPopOptions.content[12], 'fileList', [])
      this.$set(this.modelDevelopPopOptions, 'formDatas', {})
      this.$set(this.modelDevelopPopOptions.formDatas, 'sellerName', userInfo.realName)
      // this.$set(this.modelDevelopPopOptions.formDatas, 'fillPath', null)
      this.$set(this.modelDevelopPopOptions.formDatas, 'sellerId', userInfo.userId)
      this.$set(this.modelDevelopPopOptions.content[2], 'dataSource', saleOrgs)
      // this.getSampleAnalysisPage()
      this.PopDialogHandle(this.modelDevelopPopOptions, '新建样板开发申请')
    }
  }
}
</script>

<style lang='scss' scoped>
.model-develop {
  padding: 20px;

}
</style>

<style lang="scss">
.model-develop {
  .popOptionsClass {
    .el-textarea__inner { //el_input中的隐藏属性
      resize: none;  //主要是这个样式
    }
  }
  .search {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
  }
}

</style>

