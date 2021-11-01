<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['finance:payment:paymentApplication:export']"
        type="primary"
        size="small"
        @click="bulkImport"
      >导出</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :autoresize="false"
        tooltip-effect="dark"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index.js'
import { paymentList, paymentDetail, paymentModify, paymentData, receiptData, paymentExport, matchData } from './api/index.js'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg1 = this.$getRules({
      message: '请选择收款账户银行',
      trigger: ['blur']
    })
    const commonBlurReg2 = this.$getRules({
      message: '请选择收款银行账号',
      trigger: ['blur']
    })
    const commonBlurReg3 = this.$getRules({
      message: '请选择付款公司名称',
      trigger: ['blur']
    })
    const commonBlurReg4 = this.$getRules({
      message: '请选择付款公司银行',
      trigger: ['blur']
    })
    const commonBlurReg5 = this.$getRules({
      message: '请选择付款公司银行账号',
      trigger: ['blur']
    })
    const commonBlurReg6 = this.$getRules({
      message: '请填写付款附言',
      trigger: ['blur']
    })
    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'collectionAccountHolder',
        itemType: 'input',
        label: '收款账户名称:',
        itemStyle: { width: '20%' },
        placeholder: '请输入收款账户名称'
      },
      {
        prop: 'collectionBankAccount',
        itemType: 'input',
        label: '收款账号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入收款账户'
      },
      {
        prop: 'collectionBeneficiaryBank',
        itemType: 'input',
        label: '收款银行:',
        itemStyle: { width: '20%' },
        placeholder: '请输入收款银行'
      },
      {
        prop: 'paymentAccountHolder',
        itemType: 'input',
        label: '付款公司名称:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款公司名称'
      },
      {
        prop: 'paymentBeneficiaryBank',
        itemType: 'input',
        label: '付款公司银行名称:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款公司银行'
      },
      {
        prop: 'paymentBankAccount',
        itemType: 'input',
        label: '付款公司银行账号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款银行账号'
      },
      {
        prop: 'businessId',
        itemType: 'input',
        label: '审批编号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入审批编号'
      },
      {
        prop: 'eventType',
        itemType: 'select',
        label: '费用类型:',
        itemStyle: { width: '20%' },
        dataSource: []
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '付款单状态:',
        itemStyle: { width: '20%' },
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '待确认',
            value: 'C'
          },
          {
            label: '待付款',
            value: 'W'
          },
          {
            label: '发送中',
            value: 'G'
          },
          {
            label: '付款中',
            value: 'P'
          },
          {
            label: '支付完成',
            value: 'F'
          },
          {
            label: '支付失败',
            value: 'E'
          },
          {
            label: '已拒绝',
            value: 'R'
          },
          {
            label: '待重传',
            value: 'S'
          }
        ]
      },
      {
        prop: 'cashier',
        itemType: 'input',
        label: '执行出纳:',
        itemStyle: { width: '20%' },
        placeholder: '请输入执行出纳'
      },
      {
        prop: 'source',
        itemType: 'select',
        label: '付款单来源:',
        itemStyle: { width: '20%' },
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '钉钉',
            value: '钉钉'
          },
          {
            label: '其他',
            value: '其他'
          }
        ]
      },
      {
        prop: 'paymentApplicant',
        itemType: 'input',
        label: '付款申请人:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款申请人'
      },
      {
        prop: 'paymentType',
        itemType: 'select',
        label: '对公对私:',
        itemStyle: { width: '20%' },
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '对公',
            value: 'Y'
          },
          {
            label: '对私',
            value: 'N'
          }
        ]
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'plannedPaymentTime',
        label: '计划付款日期:',
        itemStyle: { width: '365px' },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const startPlannedPaymentTime = params.plannedPaymentTime && params.plannedPaymentTime[0]
          const endPlannedPaymentTime = params.plannedPaymentTime && params.plannedPaymentTime[1]
          this.searchFormDatas = { ...params, startPlannedPaymentTime, endPlannedPaymentTime }
          this.getList({ ...params })
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
        width: '50',
        fixed: 'left',
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      {
        prop: 'eventType',
        fixed: 'left',
        label: '费用类型',
        showOverflowTooltip: true,
        minWidth: '160'
      },
      {
        prop: 'businessId',
        fixed: 'left',
        label: '审批编号',
        showOverflowTooltip: true,
        minWidth: '160'
      },
      {
        prop: 'paymentApplicant',
        fixed: 'left',
        label: '付款申请人',
        showOverflowTooltip: true,
        minWidth: '160'
      },
      {
        prop: 'paymentAmount',
        label: '付款金额',
        minWidth: '100'
      },
      {
        prop: 'currency',
        label: '币别',
        minWidth: '90'
      },
      {
        prop: 'collectionAccountHolder',
        label: '收款账户名称',
        showOverflowTooltip: true,
        minWidth: '180'
      },
      {
        prop: 'collectionBeneficiaryBank',
        label: '收款人开户行',
        showOverflowTooltip: true,
        minWidth: '200'
      },
      {
        prop: 'collectionBankAccount',
        label: '收款人银行账号',
        minWidth: '180'
      },
      {
        prop: 'paymentAccountHolder',
        label: '付款公司名称',
        showOverflowTooltip: true,
        minWidth: '180'
      },
      {
        prop: 'paymentBeneficiaryBank',
        label: '付款公司银行名称',
        showOverflowTooltip: true,
        minWidth: '200'
      },
      {
        prop: 'paymentBankAccount',
        label: '付款公司银行账号',
        minWidth: '180'
      },
      {
        prop: 'paymentType',
        label: '对公对私',
        minWidth: '90',
        formater: scope => scope.row[scope.column.property] === 'Y' ? '对公' : (scope.row[scope.column.property] === 'N' ? '对私' : '')
      },
      {
        prop: 'paymentCause',
        label: '付款事由',
        showOverflowTooltip: true,
        minWidth: '150'
      },
      {
        prop: 'paymentAbstract',
        label: '付款摘要',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'paymentPostscript',
        label: '付款附言',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'plannedPaymentTime',
        label: '计划支付日期',
        minWidth: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') : '-'
        }
      },
      {
        prop: 'source',
        label: '付款单来源',
        minWidth: '120'
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '80',
        formater: scope => this.getStatusText(scope.row)
      },
      {
        prop: 'cashier',
        label: '执行出纳',
        minWidth: '90'
      },
      {
        prop: 'actualPaymentCompletionTime',
        label: '实际付款完成时间',
        minWidth: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : '-'
        }
      }]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    const dataList = [
      {
        label: '处理',
        isShow: val => val.row.status === 'C',
        permitTag: ['finance:payment:paymentApplication:modify-attache'],
        handle: params => {
          this.clickIndex = params.$index
          const arr = [4, 5, 7, 8, 9]
          arr.forEach(ele => {
            this.$set(this.content[ele], 'itemType', 'input')
            this.$set(this.content[ele], 'rules', undefined)
            this.$set(this.content[ele], 'change', undefined)
            this.$set(this.content[ele], 'dataSource', undefined)
          })
          this.$set(this.popOptions, 'content', content)
          this.$set(this.popOptions, 'okHidden', false)
          this.$set(this.popOptions, 'cancelHidden', false)
          this.$set(this.content[15], 'disabled', false)
          this.$set(this.content[16], 'disabled', false)
          this.$set(this.popOptions, 'content', content)
          this.getAccountInfo({ id: params.row.id })
          this.PopDialogHandle('付款计划确认')
        }
      },
      {
        label: '处理',
        isShow: val => val.row.status === 'W' || val.row.status === 'S',
        permitTag: ['finance:payment:paymentApplication:modify-cashier'],
        handle: params => {
          this.clickIndex = params.$index
          const arr = [
            { i: 4, fn: sBankChange, ru: commonBlurReg1 },
            { i: 5, fn: sCodeChange, ru: commonBlurReg2 },
            { i: 7, fn: fNameChange, ru: commonBlurReg3 },
            { i: 8, fn: fBankChange, ru: commonBlurReg4 },
            { i: 9, fn: fCodeChange, ru: commonBlurReg5 }
          ]
          arr.forEach(ele => {
            this.$set(this.content[ele.i], 'itemType', 'select')
            this.$set(this.content[ele.i], 'rules', ele.ru)
            this.$set(this.content[ele.i], 'change', ele.fn)
            this.$set(this.content[ele.i], 'dataSource', [])
          })
          this.$set(this.popOptions, 'okHidden', false)
          this.$set(this.popOptions, 'cancelHidden', false)
          this.$set(this.content[15], 'disabled', false)
          this.$set(this.content[16], 'disabled', false)
          this.$set(this.popOptions, 'content', this.content)
          this.getAccountInfo({ id: params.row.id })
          this.getSelectData(params.row.collectionAccountHolder ? params.row.collectionAccountHolder : params.row.paymentApplicant)
          this.PopDialogHandle('付款支付确认')
        }
      },
      {
        label: '查看结果',
        isShow: val => {
          const permits = this.$store.getters && this.$store.getters.permits
          const str1 = 'finance:payment:paymentApplication:modify-cashier'
          const str2 = 'finance:payment:paymentApplication:modify-attache'
          const type1 = permits.some(ele => ele === str1)
          const type2 = permits.some(ele => ele === str2)
          if (val.row.status === 'C' && type2) {
            return false
          } else if ((val.row.status === 'W' || val.row.status === 'S') && type1) {
            return false
          }
          return true
        },
        handle: params => {
          if (params.row.status === 'F' && params.row.bankReceiptUrl) { // 已完成
            const flag = params.row.bankReceiptUrl.startsWith('http')
            const url = flag ? params.row.bankReceiptUrl : 'https://' + params.row.bankReceiptUrl
            window.open(url)
          } else {
            this.$set(this.popOptions, 'formDatas', {})
            const arr = [4, 5, 7, 8, 9]
            arr.forEach(ele => {
              this.$set(this.content[ele], 'itemType', 'input')
              this.$set(this.content[ele], 'rules', undefined)
              this.$set(this.content[ele], 'change', undefined)
              this.$set(this.content[ele], 'dataSource', undefined)
            })
            params.row.plannedPaymentTime = params.row.plannedPaymentTime ? this.$filters.parseTime(params.row.plannedPaymentTime, '{y}-{m}-{d}') : ''
            this.$nextTick(() => {
              this.$set(this.popOptions, 'content', content)
              this.$set(this.popOptions, 'formDatas', params.row)
              this.$set(this.popOptions, 'okHidden', true)
              this.$set(this.popOptions, 'cancelHidden', true)
              this.$set(this.content[15], 'disabled', true)
              this.$set(this.content[16], 'disabled', true)
            })
            const str = params.row.status === 'C' ? '付款计划确认' : (params.row.status === 'W' || params.row.status === 'S' ? '付款支付确认' : this.getStatusText(params.row))
            this.PopDialogHandle(str)
          }
        }
      }
    ]

    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: this.$filterPermission(dataList)
    }
    // 切换收款银行
    const sBankChange = val => {
      const obj = this.Slist.find(ele => ele.id === val)
      this.$set(this.popOptions.formDatas, 'collectionBankAccount', '')
      this.$set(this.popOptions.formDatas, 'lineNumber', '')
      this.$set(this.popOptions.formDatas, 'collectionBeneficiaryBank', obj.bankName)
      this.$set(this.popOptions.formDatas, 'collectionAccountHolder', obj.companyName)
      const arr = this.Slist.filter(ele => ele.bankName === obj.bankName)
      const arr1 = arr.map(ele => ({ label: ele.companyAccount, value: ele.id }))
      this.$set(this.popOptions.content[5], 'dataSource', arr1)
    }
    // 切换收款账号
    const sCodeChange = val => {
      const obj = this.Slist.find(ele => ele.id === val)
      this.$set(this.popOptions.formDatas, 'lineNumber', obj.lineNumber)
      this.$set(this.popOptions.formDatas, 'collectionAccountHolder', obj.companyName)
      this.$set(this.popOptions.formDatas, 'collectionBankAccount', obj.companyAccount)
      this.$set(this.popOptions.formDatas, 'collectionBeneficiaryBank', obj.bankName)
    }
    // 切换付款公司名称
    const fNameChange = val => {
      const obj = this.Flist.find(ele => ele.id === val)
      this.$set(this.popOptions.formDatas, 'paymentBankAccount', '')
      this.$set(this.popOptions.formDatas, 'paymentBeneficiaryBank', '')
      this.$set(this.popOptions.formDatas, 'paymentAccountHolder', obj.companyName)
      const arr = this.Flist.filter(ele => ele.companyName === obj.companyName)
      const arr1 = arr.map(ele => ({ label: ele.bankName, value: ele.id }))
      const arr2 = arr.map(ele => ({ label: ele.companyAccount, value: ele.id }))
      this.$set(this.popOptions.content[8], 'dataSource', this.arrFun(arr1))
      this.$set(this.popOptions.content[9], 'dataSource', arr2)
    }
    // 切换付款公司银行
    const fBankChange = val => {
      const obj = this.Flist.find(ele => ele.id === val)
      this.$set(this.popOptions.formDatas, 'paymentAccountHolder', obj.companyName)
      this.$set(this.popOptions.formDatas, 'paymentBeneficiaryBank', obj.bankName)
      this.$set(this.popOptions.formDatas, 'paymentBankAccount', '')
      const arr = this.Flist.filter(ele => ele.bankName === obj.bankName && ele.companyName === obj.companyName)
      const arr1 = arr.map(ele => ({ label: ele.companyAccount, value: ele.id }))
      this.$set(this.popOptions.content[9], 'dataSource', arr1)
    }
    // 切换付款公司账号
    const fCodeChange = val => {
      const obj = this.Flist.find(ele => ele.id === val)
      this.$set(this.popOptions.formDatas, 'paymentBankAccount', obj.companyAccount)
      this.$set(this.popOptions.formDatas, 'paymentAccountHolder', obj.companyName)
      this.$set(this.popOptions.formDatas, 'paymentBeneficiaryBank', obj.bankName)
    }
    // 公共弹出框内容
    const content = [
      {
        prop: 'eventType',
        itemType: 'input',
        label: '费用类型:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'paymentApplicant',
        itemType: 'input',
        label: '申请人:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'businessId',
        itemType: 'input',
        label: '审批编号:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'collectionAccountHolder',
        itemType: 'input',
        label: '收款账户名称:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'collectionBeneficiaryBank',
        itemType: 'input',
        label: '收款账户银行:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'collectionBankAccount',
        itemType: 'input',
        label: '收款银行账号:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'lineNumber',
        itemType: 'input',
        label: '收款银行联行号:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'paymentAccountHolder',
        itemType: 'input',
        label: '付款公司名称:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'paymentBeneficiaryBank',
        itemType: 'input',
        label: '付款公司银行名称:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'paymentBankAccount',
        itemType: 'input',
        label: '付款公司银行账号:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'paymentAmount',
        itemType: 'input',
        label: '付款金额:',
        readonly: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'currency',
        itemType: 'input',
        label: '币别:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'plannedPaymentTime',
        itemType: 'input',
        label: '计划付款日期:',
        readonly: true,
        size: 'mini',
        itemStyle: {
          width: '32%'
        }
      },
      {
        prop: 'paymentCause',
        itemType: 'input',
        label: '付款事由:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '62%'
        }
      },
      {
        prop: 'paymentAbstract',
        itemType: 'input',
        label: '付款摘要:',
        readonly: true,
        title: true,
        size: 'mini',
        itemStyle: {
          width: '96%'
        }
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'paymentPostscript',
        placeholder: '请输入付款附言',
        maxlength: 600,
        rules: [commonBlurReg6],
        rows: 4,
        size: 'mini',
        itemStyle: {
          width: '90%'
        },
        label: '付款附言:',
        trim: value => {
          this.$set(this.popOptions.formDatas, 'paymentPostscript', value)
        },
        blur: (e) => {
          this.$set(this.popOptions.formDatas, 'paymentPostscript', e.target.value)
        }
      },
      {
        prop: 'process',
        itemType: 'radio-group',
        label: '处理结果:',
        change: value => {
          this.$set(this.popOptions.formDatas, 'process', value)
          if (this.popOptions.content[4].itemType === 'select') {
            this.$set(this.content[4], 'rules', value === 'N' ? undefined : commonBlurReg1)
            this.$set(this.content[5], 'rules', value === 'N' ? undefined : commonBlurReg2)
            this.$set(this.content[7], 'rules', value === 'N' ? undefined : commonBlurReg3)
            this.$set(this.content[8], 'rules', value === 'N' ? undefined : commonBlurReg4)
            this.$set(this.content[9], 'rules', value === 'N' ? undefined : commonBlurReg5)
          }
        },
        dataSource: [
          {
            label: '同意',
            value: 'Y'
          },
          {
            label: '拒绝',
            value: 'N'
          }
        ]
      }
    ]
    // pop弹出框配置信息（处理）
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '',
      width: '900px',
      okText: '确认',
      customClass: 'paymentPop',
      formOptions: {
        inline: true
      },
      formDatas: {},
      ok: params => {
        if (!params.process) {
          this.$message({
            message: '请选择处理结果',
            type: 'error'
          })
          return
        }
        const obj = deepClone(params)
        delete obj.createdTime
        delete obj.updatedTime
        delete obj.creator
        // 拒绝状态传R， 出纳同意状态传G
        obj.process = params.process
        if (obj.process === 'N') {
          obj.status = 'R'
        } else if (this.popOptions.content[4].itemType === 'select') {
          obj.status = 'G'
        } else {
          obj.status = 'W'
        }
        obj.paymentPostscript = params.paymentPostscript
        obj.lineNumber = params.lineNumber
        if (this.popOptions.content[4].itemType === 'select') {
          obj.cashier = this.$store.getters.realName
          obj.paymentBankAccount = params.paymentBankAccount
          obj.paymentBeneficiaryBank = params.paymentBeneficiaryBank
          obj.paymentAccountHolder = params.paymentAccountHolder
          obj.collectionBankAccount = params.collectionBankAccount
          obj.collectionBeneficiaryBank = params.collectionBeneficiaryBank
        }
        this.clickOk(obj)
      },
      cancel: params => {
        this.PopDialogHandle()
      }
    }
    return {
      searchData,
      formOtions: {
        size: 'small',
        layout: true,
        inline: true
      },
      columns,
      dataSource: [],
      popOperates,
      pagination,
      popOptions,
      searchFormDatas: {},
      content,
      formDatas: {
        paymentType: '',
        eventType: '',
        source: '',
        status: ''
      },
      clickIndex: -1,
      Flist: [],
      Slist: [],
      macthList: [],
      searchArrSelect: []
    }
  },
  created() {
    this.getList()
    this.getMatchData()
  },
  methods: {
    // 获取收款联行号
    async getLianHang(val) {
      const res = (await receiptData({ companyAccount: val })).data[0].lineNumber || ''
      this.$set(this.popOptions.formDatas, 'lineNumber', res)
    },
    // 获取付款类型
    async getMatchData() {
      const res = (await matchData({ status: 'Y' })).data || []
      const arr = this.searchArrSelect = res.map(ele => ({ label: ele.paymentName, value: ele.paymentName }))
      arr.unshift({ label: '全部', value: '' })
      this.$set(this.searchData[7], 'dataSource', arr)
    },
    // 显示状态
    getStatusText(val) {
      let str = ''
      switch (val.status) {
        case 'C': str = '待确认'
          break
        case 'W': str = '待付款'
          break
        case 'P': str = '付款中'
          break
        case 'F': str = '支付完成'
          break
        case 'E': str = '支付失败'
          break
        case 'R': str = '已拒绝'
          break
        case 'S': str = '待重传'
          break
        case 'G': str = '发送中'
          break
        default: str = ''
      }
      return val.status === 'P' && !val.cbsBusinessNo ? '超时' : str
    },
    // 获取收付款信息下拉选数据
    async getSelectData(name) {
      this.Flist = (await paymentData({ status: 'Y' })).data || []
      this.Slist = (await receiptData({ companyName: name, status: 'Y' })).data || []
      const sBankArr = this.Slist.map(ele => ({ label: ele.bankName, value: ele.id })) || []
      const sCodeArr = this.Slist.map(ele => ({ label: ele.companyAccount, value: ele.id })) || []
      const fNameArr = this.Flist.map(ele => ({ label: ele.companyName, value: ele.id })) || []
      const fBankArr = this.Flist.map(ele => ({ label: ele.bankName, value: ele.id })) || []
      const fCodeArr = this.Flist.map(ele => ({ label: ele.companyAccount, value: ele.id })) || []
      this.$set(this.popOptions.content[4], 'dataSource', this.arrFun(sBankArr))
      this.$set(this.popOptions.content[5], 'dataSource', sCodeArr)
      this.$set(this.popOptions.content[7], 'dataSource', this.arrFun(fNameArr))
      this.$set(this.popOptions.content[8], 'dataSource', this.arrFun(fBankArr))
      this.$set(this.popOptions.content[9], 'dataSource', fCodeArr)
    },
    // 过滤名字相同的账号
    arrFun(arr) {
      return arr.reduce((cur, next) => {
        cur.some(ele => ele.label === next.label) ? '' : cur.push(next)
        return cur
      }, [])
    },
    // 付款单处理
    async clickOk(data) {
      if (data.process === 'Y' && this.popOptions.content[4].itemType === 'select') {
        const res = (await receiptData({ companyAccount: data.collectionBankAccount })).data || []
        if (!res.length || !data.lineNumber) {
          this.$message({
            message: '请将收款账户信息补充完整!',
            type: 'error'
          })
          return
        } else if (res[0].status === 'N') {
          this.$message({
            message: '该收款账户已被禁用!',
            type: 'error'
          })
          return
        }
      }
      await paymentModify(data)
      this.$message({
        message: '处理成功',
        type: 'success'
      })
      this.getList()
      this.PopDialogHandle()
    },
    // 付款单详情
    async getAccountInfo(data) {
      const res = (await paymentDetail(data)).data || {}
      res.plannedPaymentTime = res.plannedPaymentTime ? this.$filters.parseTime(res.plannedPaymentTime, '{y}-{m}-{d}') : ''
      res.paymentAccountHolder = ''
      res.paymentBeneficiaryBank = ''
      res.paymentBankAccount = ''
      // 出纳操作 没有收款名称就拿申请人填充并清空收款银行、账号、联行号
      if (!res.collectionAccountHolder && this.popOptions.content[4].itemType === 'select') {
        res.collectionAccountHolder = res.paymentApplicant
      }
      // 有收款银行账号没有联行号就取匹配联行号
      if (!res.lineNumber && res.collectionBankAccount) {
        this.getLianHang(res.collectionBankAccount)
      }
      this.$set(this.popOptions, 'formDatas', { ...res })
    },
    // 导出
    async bulkImport() {
      const res = await paymentExport(this.searchFormDatas)
      this.$utils.downloadStream(res)
    },
    // 修改弹出层的判断
    PopDialogHandle(str) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (str) {
        this.$set(this.popOptions, 'title', str)
      }
    },
    // 获取分页列表
    async getList(data = {}) {
      const res = await paymentList({ ...this.searchFormDatas, ...data })
      const List = res.data.list || []
      this.dataSource = List
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    }
  }
}
</script>

<style lang="scss">
.app-container {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}

.paymentPop .el-form-item__content > .el-input [readonly='readonly'] {
  padding: 0;
  border: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}
</style>

