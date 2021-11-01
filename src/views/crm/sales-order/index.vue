<template>
  <div class="sales-order">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createSalesOrder">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="salesOrderDataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="salesOrderPopOptions" />
    </div>

    <!-- 选择样板开发pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="modelDevelopPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { SalesOrder } from './components/index'
import { SalesOrderRelevant } from './components/relevantIndex'
import { PublicCrm } from '@/views/crm/public/index'
import status from '@/views/crm/public/config/status.js'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import uploadSlotTip from './components/upload-slot-tip.vue'
import radioButton from './components/radio-button.vue'
export default {
  mixins: [SalesOrder, PublicCrm, SalesOrderRelevant],
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
        placeholder: '销售订单单号/客户/品牌商'
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
          this.getSalesOrderPage(params)
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
        label: '销售订单申请编号',
        width: '160',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/sales-order/sales-order-details-page/${scope.row.customerRequireId}`)
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
        prop: 'totalAmount',
        label: '合计金额',
        width: '120',
        align: 'right',
        formater: scope => {
          const number = scope.row[scope.column.property]
          return number && this.numRecursion(number / 10000)
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
        label: '销售订单状态',
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
        this.getSalesOrderPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getSalesOrderPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 样板开发分页配置信息
    const modelDevelopPagination = {
      // currentPage: 1,
      // pageSize: 20,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getModelDevelopPage({ pageSize: this.modelDevelopPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getModelDevelopPage({ pageNum: this.modelDevelopPagination.pageNum || 1, pageSize: val })
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
          this.PopDialogHandle(this.salesOrderPopOptions, '编辑销售订单申请')
          this.$set(this.salesOrderPopOptions.content[0], 'disabled', true)
          // this.$set(this.salesOrderPopOptions.content[0], 'disabled', true)
          this.getSalesOrderInfo({ id: params.row.id })
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
          this.$confirm(' 你确认要删除该销售订单申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteSalesOrder({ id: params.row.id })
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
    const salesOrderPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        // const analysisTarget = params.analysisTarget.join('/')
        const brandId = params.brandId.value
        const brandName = params.brandId.label
        // const businessOpportunityId = params.businessOpportunityId.value
        // const businessOpportunityName = params.businessOpportunityId.label
        // const customerId = params.businessOpportunityId.customerId  taxType
        const sellerTeamId = params.sellerTeamId.value
        const sellerTeamName = params.sellerTeamId.label
        // const taxType = params.taxType.value
        // const sellerTeamName = params.taxType.label
        const payCondition = params.payCondition.value
        const payConditionName = params.payCondition.label
        const priceTerm = params.priceTerm.value
        const priceTermName = params.priceTerm.label
        const orderFilePath = (params.orderFilePath && params.orderFilePath[0]) ? params.orderFilePath[0].response ? params.orderFilePath[0].response.data : params.orderFilePath[0].url : null
        const styleFilePath = (params.styleFilePath && params.styleFilePath[0]) ? params.styleFilePath[0].response ? params.styleFilePath[0].response.data : params.styleFilePath[0].url : null
        const otherFilePath = (params.otherFilePath && params.otherFilePath[0]) ? params.otherFilePath[0].response ? params.otherFilePath[0].response.data : params.otherFilePath[0].url : null
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.addOrEditSalesOrder({ ...params, brandId, brandName, sellerTeamId, sellerTeamName, orderFilePath, styleFilePath, otherFilePath, totalAmount, payCondition, payConditionName, priceTerm, priceTermName })
      },
      cancel: params => {
        this.closePopDialogHandle(this.salesOrderPopOptions)
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
          prop: 'modelDevelopId',
          itemType: 'input',
          readonly: true,
          label: '样板开发申请',
          focus: params => {
            this.PopDialogHandle(this.modelDevelopPopOptions, '选择样板开发申请')
            this.getModelDevelopPage()
          },
          rules: [commonChangeReg],
          placeholder: '选择样板开发申请'
        },
        {
          prop: 'orderType',
          itemType: 'select',
          label: '销售订单类型',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '大货',
              value: 'B'
            },
            {
              label: '销售版',
              value: 'S'
            },
            {
              label: '测试样',
              value: 'T'
            },
            {
              label: '快反单',
              value: 'F'
            },
            {
              label: '备成品',
              value: 'A'
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
          placeholder: '查找并选择样板开发后自动获取'
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
          rules: [commonChangeReg],
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
          rules: [commonChangeReg],
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
          prop: 'taxType',
          itemType: 'select',
          label: '税种',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'I',
              label: '价内税'
            },
            {
              value: 'E',
              label: '价外税'
            }
          ]
        },
        {
          prop: 'payCondition',
          itemType: 'select',
          label: '付款条件',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'priceTerm',
          itemType: 'select',
          label: '价格条款',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
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
              this.$set(this.salesOrderPopOptions.formDatas, 'orderFilePath', [])
              this.deleteAttachment({ bizType: 'SALES_ORDER_ORDER', url: file.response.data })
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
            bizType: 'SALES_ORDER_ORDER'
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
              this.$set(this.salesOrderPopOptions.formDatas, 'styleFilePath', [])
              this.deleteAttachment({ bizType: 'SALES_ORDER_STYLE', url: file.response.data })
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
            bizType: 'SALES_ORDER_STYLE'
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
              this.$set(this.salesOrderPopOptions.formDatas, 'otherFilePath', [])
              this.deleteAttachment({ bizType: 'SALES_ORDER_OTHER', url: file.response.data })
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
            bizType: 'SALES_ORDER_OTHER'
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
            this.modelDevelopId = value
            // scope.row.status = scope.row.status === '0' ? '1' : '0'
            // console.log('zx', this.listGroup)
          }
        }
      },
      {
        prop: 'customerRequireId',
        label: '样板开发申请编号',
        width: '140',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'businessOpportunityName',
      //   label: '商机',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'brandName',
        label: '品牌商',
        minWidth: '80',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'endTime',
      //   label: '要求完成日期',
      //   width: '120',
      //   formater: scope => {
      //     return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
      //   }
      // },
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

    // 选择样板开发弹出框
    const modelDevelopPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1020px',
      ok: params => {
        // console.log(params, this.modelDevelopList)
        const checkedInfo = this.modelDevelopList.filter(item => item.customerRequireId === this.modelDevelopId)
        if (checkedInfo.length !== 0) {
          this.$set(this.salesOrderPopOptions.formDatas, 'modelDevelopId', checkedInfo[0].customerRequireId)
          this.$set(this.salesOrderPopOptions.formDatas, 'customerName', checkedInfo[0].customerName)
          this.$set(this.salesOrderPopOptions.formDatas, 'customerId', checkedInfo[0].customerId)
          this.$set(this.salesOrderPopOptions.formDatas, 'sellerTeamId', { value: checkedInfo[0].sellerTeamId, label: checkedInfo[0].sellerTeamName })
          this.$set(this.salesOrderPopOptions.formDatas, 'year', checkedInfo[0].year)
          this.$set(this.salesOrderPopOptions.formDatas, 'quarter', checkedInfo[0].quarter)
          this.getBrandBusiness({ customerId: checkedInfo[0].customerId })
        }
        this.closePopDialogHandle(this.modelDevelopPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.modelDevelopPopOptions)
        this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
        this.$set(this.modelDevelopPopOptions.formDatas, 'search', '')
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
              // this.$set(this.modelDevelopPopOptions.formDatas, 'search', value)
              this.getData = this.$utils.debounce(this.getModelDevelopPage, 300)
            }
            if (!value) {
              this.$set(this.sampleAnalysisPopOptions.formDatas, 'search', '')
            }
            this.getData({ keyword: value })
          },
          labelWidth: '600px',
          placeholder: '请输入样板开发编号、客户名称或品牌商名称'
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
          pagination: modelDevelopPagination
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
      modelDevelopPagination,
      popOperates,
      salesOrderDataSource: [],
      type: 'edit',
      salesOrderPopOptions,
      modelDevelopPopOptions,
      searchFormDatas: {},
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
      fileList: [],
      modelDevelopList: [],
      modelDevelopId: ''
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getSalesOrderPage()
    this.getPaymentTermsList()
    this.getPriceTermsList()
  },
  methods: {
    createSalesOrder() {
      this.type = 'add'
      const userInfo = this.userInfo
      const saleOrgs = (userInfo.orgs && userInfo.orgs.length !== 0) ? userInfo.orgs.filter(item => item.functionTag === 'SAL').map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      }) : []
      // console.log(userInfo, saleOrgs)
      this.$set(this.salesOrderPopOptions.content[0], 'disabled', false)
      // this.$set(this.salesOrderPopOptions.content[12], 'fileList', [])
      this.$set(this.salesOrderPopOptions, 'formDatas', {})
      this.$set(this.salesOrderPopOptions.formDatas, 'sellerName', userInfo.realName)
      // this.$set(this.salesOrderPopOptions.formDatas, 'fillPath', null)
      this.$set(this.salesOrderPopOptions.formDatas, 'sellerId', userInfo.userId)
      this.$set(this.salesOrderPopOptions.content[2], 'dataSource', saleOrgs)
      this.PopDialogHandle(this.salesOrderPopOptions, '新建销售订单申请')
    }
  }
}
</script>

<style lang='scss' scoped>
.sales-order {
  padding: 20px;

}
</style>

<style lang="scss">
.sales-order {
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

