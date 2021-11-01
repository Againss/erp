<template>
  <div class="gray-fabric-debit-list">
    <!-- 抽纱列表搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <div class="button">
      <el-button v-if="$permission(['aps:grayClothLoan:grey:list'])" size="small" type="primary" @click="newDebit">新建借调</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :table-scrollx="true"
        :operates="operates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import * as api from './api/index.js'
export default {
  data() {
    const numberReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位正数, 最多两位小数', trigger: ['blur'] })
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 搜索时间配置
    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
      // disabledDate(time) {
      //   return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      // }
    }
    // 搜索配置信息
    const searchData = {
      '_orderNo': {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        itemStyle: { width: '33%', 'margin-right': '0', 'padding-right': '0px' },
        placeholder: '请输入订单号'
      },
      '_greyClothCode': {
        prop: 'greyClothCode',
        itemType: 'input',
        label: '坯布编码',
        itemStyle: { width: '33%', 'margin-right': '0', 'padding-right': '0px' },
        placeholder: '请输入坯布编码'
      },
      '_loanOrderNo': {
        prop: 'loanOrderNo',
        itemType: 'input',
        label: '借调订单号',
        itemStyle: { width: '33%', 'margin-right': '0', 'padding-right': '0px' },
        placeholder: '请输入借调订单号'
      },
      '_loanGreyClothCode': {
        prop: 'loanGreyClothCode',
        itemType: 'input',
        label: '借调坯布编码',
        itemStyle: { width: '33%', 'margin-right': '0', 'padding-right': '0px' },
        placeholder: '请输入借调坯布编码'
      },
      '_loanDate': {
        itemType: 'date',
        type: 'daterange',
        prop: 'loanDate',
        label: '借调日期',
        // style: { width: '300px' },
        itemStyle: { width: '33%', 'margin-right': '0', 'padding-right': '0px' },
        pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      '_status': {
        prop: 'status',
        itemType: 'select',
        label: '状态',
        itemStyle: { width: '33%', 'margin-right': '0', 'padding-right': '0px' },
        dataSource: [
          { label: '全部', value: '' },
          { label: '待归还', value: '0' },
          { label: '已归还', value: '1' }
        ]
        // placeholder: '请输入纱名'
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          let loanDateStart = ''
          let loanDateEnd = ''
          if (params.loanDate && params.loanDate.length === 2) {
            loanDateStart = params.loanDate[0]
            loanDateEnd = params.loanDate[1]
          }

          this.searchFormDatas = { ...params, loanDateStart, loanDateEnd }
          this.getGrayFabricDebitPage()
          // this.grayYarnPageCount()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }

    // 表格表头配置
    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_billNo': {
        prop: 'billNo',
        label: '借调单号',
        width: '156',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          if (this.$permission(['aps:grayClothLoan:loan:detail'])) {
            if (scope.row.status === '1') {
              this.type = 'detail'
              this.openPopOptions('detail')
            } else {
              this.type = 'edit'
              this.openPopOptions('edit')
            }
          } else {
            this.$message.error('您没有查看权限, 请联系管理员添加')
          }

          // this.$router.push({ name: 'drawnwork-detail' })

          this.getLoanDetail({ id: scope.row.detailId })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      '_orderNo': {
        prop: 'orderNo',
        label: '订单号',
        width: '156',
        showOverflowTooltip: true
      },
      '_greyClothCode': {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_loanOrderNo': {
        prop: 'loanOrderNo',
        label: '借调订单号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_loanGreyClothCode': {
        prop: 'loanGreyClothCode',
        label: '借调坯布编码',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_loanNum': {
        prop: 'loanNUm',
        label: '借调数量(KG)',
        align: 'right',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        label: '状态',
        minWidth: '70',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            0: { text: '待归还', color: '#FF9214' },
            1: { text: '已归还', color: '#00BCC5' }
          }
          const curObj = obj[scope.row.status]
          return scope.row.status ? `<span style="color: ${curObj.color}">${curObj.text}</span>` : '-'
        }
      },
      '_loanDate': {
        prop: 'loanDate',
        label: '借调日期',
        width: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.loanDate ? this.$filters.parseTime(scope.row.loanDate, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_sendBackTime': {
        prop: 'sendBackTime',
        label: '归还日期',
        width: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.sendBackTime ? this.$filters.parseTime(scope.row.sendBackTime, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      }
    }
    let operatesList = [
      {
        label: '查看',
        isShow: () => {
          return true
        },
        permitTag: ['aps:grayClothLoan:loan:detail'],
        handle: scope => {
          this.type = 'detail'
          this.openPopOptions('detail')
          this.getLoanDetail({ id: scope.row.detailId })
        }
      },
      {
        label: '编辑',
        isShow: scope => {
          return scope.row.status === '0'
        },
        permitTag: ['aps:grayClothLoan:update'],
        handle: scope => {
          if (scope.row.tfStatus === '1') {
            this.$message.error('此分录已调拨不可以编辑')
          } else {
            this.type = 'edit'
            this.openPopOptions('edit')
            this.getLoanDetail({ id: scope.row.detailId })
          }
        }
      },
      {
        label: '归还',
        isShow: scope => {
          return scope.row.status === '0'
        },
        permitTag: ['aps:grayClothLoan:back:info'],
        handle: scope => {
          this.type = 'return'
          this.openPopOptions('return')
          this.getBackInfo({ id: scope.row.detailId })
        }
      }
    ]
    operatesList = this.$filterPermission(operatesList)
    const operates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: operatesList
    }
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.getGrayFabricDebitPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.getGrayFabricDebitPage({ pageNum: 1, pageSize: val })
      }
    }
    // 详情弹出框配置
    const detailColumns = {
      '_greyClothCode': {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '156',
        showOverflowTooltip: true
      },
      '_sourceOrderNo': {
        prop: 'sourceOrderNo',
        label: '来源订单号',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_sourceBill': {
        prop: 'sourceBill',
        label: '来源单据',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_billStatus': {
        prop: 'billStatus',
        label: '单据状态',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return '<span style="color: #00BCC5">已完成</span>'
        }
      },
      '_warehouse': {
        prop: 'warehouse',
        label: '仓库',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_storeNum': {
        prop: 'storeNum',
        label: '可借调库存(KG)',
        align: 'right',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.storeNum) ? (+scope.row.storeNum).toFixed(2) : '-'
        }
      },
      // '_yarnName2': {
      //   prop: 'yarnName2',
      //   label: '库存状态',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return '已划扣'
      //   }
      // },
      '_lastLoanNum': {
        prop: 'lastLoanNum',
        label: '借调数量(KG)',
        align: 'right',
        minWidth: '130',
        isShow: scope => {
          return this.type === 'detail'
        },
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.lastLoanNum) ? (+scope.row.lastLoanNum).toFixed(2) : '-'
        }
      },
      '_loanNum': {
        prop: 'loanNum',
        label: '借调数量(KG)',
        // align: 'right',
        minWidth: '130',
        isShow: scope => {
          return this.type === 'edit'
        },
        showOverflowTooltip: true,
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          // maxlength: 200,
          placeholder: '请输入',
          rules: [numberReg, commonBlurReg]
        }
      },
      '_clothType': {
        prop: 'clothType',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_specifications': {
        prop: 'specifications',
        label: '规格',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          const { suggestWidth, suggestWidthUnit, suggestWeight, suggestWeightUnit } = scope.row
          const str = (suggestWidth ? suggestWidth + suggestWidthUnit : '') + ((suggestWidth && suggestWeight) ? '-' : '') + (suggestWeight ? suggestWeight + suggestWeightUnit : '')
          return str
        }
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_updatedTime': {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '160',
        // isShow: scope => {
        //   return this.isDetail
        // },
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_updatedBy': {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '70',
        // isShow: scope => {
        //   return this.isDetail
        // },
        showOverflowTooltip: true
      }
    }
    // 查看弹出框配置
    const detailContent = {
      _orderInformation: {
        prop: 'orderInformation',
        itemType: 'itemview',
        itemStyle: { width: '100%', 'margin-bottom': '10px', 'margin-right': '0' },
        labelWidth: '0',
        renderContent: value => {
          return `<div class="detail-title">订单信息</div>`
        }
      },
      _orderNo: {
        prop: 'orderNo',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '订单号:'
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '坯布编码:'
      },
      _clothType: {
        prop: 'clothType',
        itemType: 'itemview',
        title: true,
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '布类:'
      },
      _delivery: {
        prop: 'delivery',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '交期:',
        renderContent: value => {
          return value ? this.$filters.parseTime(value, '{y}-{m}-{d}') : '-'
        }
      },
      _yarnName: {
        prop: 'yarnName',
        itemType: 'itemview',
        title: true,
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '纱名:'
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        itemType: 'itemview',
        title: true,
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '纱属性:'
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '客户:'
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '销售组织:'
      },
      _sendBackNum: {
        prop: 'sendBackNum',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '归还数量:'
      },
      _acrossBar: {
        prop: 'acrossBar',
        itemType: 'itemview',
        itemStyle: { width: '1000px', height: '16px', 'background-color': '#F1F7FB', position: 'absolute', top: '146px', left: '-20px' },
        label: ''
      },
      _orderInformation1: {
        prop: 'orderInformation1',
        itemType: 'itemview',
        itemStyle: { width: '100%', 'margin': '44px 0 0 0' },
        label: '',
        renderContent: value => {
          return `<div class="detail-table-title">借调订单信息</div>`
        }
      },
      _details: {
        prop: 'details',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        className: 'pop-table',
        itemType: 'table-form',
        itemStyle: { width: '100%' },
        label: '',
        labelWidth: '0',
        dataSource: [],
        selectionChange: val => {
          console.log(val)
          // this.popFlag = true
        },
        columns: detailColumns,
        tooltipEffect: 'dark'
      }
    }

    // 编辑弹框表格表头配置
    // const editColumns = {}
    // 编辑弹出框配置
    const editContent = detailContent
    // 归还弹框表格表头配置
    const returnColumns = {
      '_select': {
        prop: 'select',
        type: 'selection',
        width: '50'
      },
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      '_greyClothCode': {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '156',
        showOverflowTooltip: true
      },
      '_sourceOrderNo': {
        prop: 'sourceOrderNo',
        label: '来源订单号',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_sourceBill': {
        prop: 'sourceBill',
        label: '来源单据',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_billStatus': {
        prop: 'billStatus',
        label: '单据状态',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return '<span style="color: #00BCC5">已完成</span>'
        }
      },
      '_warehouse': {
        prop: 'warehouse',
        label: '仓库',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_storeNum': {
        prop: 'storeNum',
        label: '可借调库存(KG)',
        align: 'right',
        minWidth: '130'
        // editOptions: {
        //   labelWidth: '0',
        //   itemType: 'input',
        //   // maxlength: 200,
        //   placeholder: '请输入',
        //   rules: [numberReg, commonBlurReg]
        // }
        // showOverflowTooltip: true,
        // formater: scope => {
        //   return !isNaN(scope.row.storeNum) ? (+scope.row.storeNum).toFixed(2) : '-'
        // }
      },
      // '_yarnName2': {
      //   prop: 'yarnName2',
      //   label: '库存状态',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return '已划扣'
      //   }
      // },
      // '_lastLockNum': {
      //   prop: 'lastLockNum',
      //   label: '归还重量(KG)',
      //   align: 'right',
      //   minWidth: '130',
      //   isShow: scope => {
      //     return true
      //   },
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return !isNaN(scope.row.lastLockNum) ? (+scope.row.lastLockNum).toFixed(2) : '-'
      //   }
      // },
      '_sendBackNum': {
        prop: 'sendBackNum',
        label: '归还重量(KG)',
        // align: 'right',
        minWidth: '130',
        isShow: scope => {
          return true
        },
        // showOverflowTooltip: true,
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          // maxlength: 200,
          placeholder: '请输入',
          rules: [numberReg, commonBlurReg],
          change: (value, form, formDatas, setFormDatas, scope) => {
            const index = scope.$index
            this.returnDataInfo.details[index].sendBackNum = value
            console.log(value, form, formDatas, setFormDatas, scope)
          }
        }
      },
      '_clothType': {
        prop: 'clothType',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_specifications': {
        prop: 'specifications',
        label: '规格',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          const { suggestWidth, suggestWidthUnit, suggestWeight, suggestWeightUnit } = scope.row
          const str = (suggestWidth ? suggestWidth + suggestWidthUnit : '') + ((suggestWidth && suggestWeight) ? '-' : '') + (suggestWeight ? suggestWeight + suggestWeightUnit : '')
          return str
        }
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '120',
        showOverflowTooltip: true
      }
      // '_sellerTeamName': {
      //   prop: 'sellerTeamName',
      //   label: '销售团队',
      //   minWidth: '100',
      //   showOverflowTooltip: true
      // }
      // '_updatedTime': {
      //   prop: 'updatedTime',
      //   label: '操作时间',
      //   minWidth: '160',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
      //   }
      // },
      // '_updatedBy': {
      //   prop: 'updatedBy',
      //   label: '操作人',
      //   minWidth: '70',
      //   showOverflowTooltip: true
      // }
    }
    // 归还弹出框配置
    const returnContent = {
      _debitInformation: {
        prop: 'debitInformation',
        itemType: 'itemview',
        itemStyle: { width: '100%', 'margin-bottom': '10px', 'margin-right': '0' },
        labelWidth: '0',
        renderContent: value => {
          return `<div class="detail-title">借调信息</div>`
        }
      },
      _orderNo: {
        prop: 'orderNo',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '订单号:'
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '坯布编码:'
      },
      _loanBillNo: {
        prop: 'loanBillNo',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '借调订单号:'
      },
      _loanGreyClothCode: {
        prop: 'loanGreyClothCode',
        itemType: 'itemview',
        itemStyle: { width: '31%', 'margin': '0 1%' },
        label: '借调坯布编码:'
      },
      _loanNum: {
        prop: 'loanNum',
        itemType: 'itemview',
        itemStyle: { position: 'absolute', right: 0, 'margin-right': '0' },
        label: '',
        renderContent: value => {
          // const style = "font-size: '18px';color: '#FF9214';font-weight: '500';"
          return `<span style="font-size: 14px;color: #474747;">借调数量(KG): </span><span style="font-size: 18px;color: #FF9214;font-weight: 500;">${value || ''}</span>`
        }
      },
      _acrossBar: {
        prop: 'acrossBar',
        itemType: 'itemview',
        itemStyle: { width: '1000px', height: '16px', 'background-color': '#F1F7FB', position: 'absolute', top: '118px', left: '-20px' },
        label: ''
      },
      _grayStock: {
        prop: 'grayStock',
        itemType: 'itemview',
        itemStyle: { width: '100%', 'margin': '44px 0 0 0' },
        label: '',
        renderContent: value => {
          return `<div class="detail-table-title">坯布库存</div>`
        }
      },
      _details: {
        prop: 'details',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        className: 'pop-table',
        itemType: 'table-form',
        itemStyle: { width: '100%' },
        label: '',
        rowKey: 'index',
        labelWidth: '0',
        dataSource: [],
        selectionChange: val => {
          // console.log(val, this.$refs.popForm.$refs.popComponents.formDatas)
          const indexs = val.map(item => item.index)
          // const newDatas = this.$refs.popForm.$refs.popComponents.formDatas
          const newDatas = this.returnDataInfo
          // console.log(indexs, newDatas)
          newDatas.details && newDatas.details.forEach(item => {
            if (indexs.includes(item.index)) {
              item.sendBackNumEdit = true
            } else {
              item.sendBackNum = ''
              item.sendBackNumEdit = false
            }
          })
          // indexs.forEach(item => {
          //   newDatas.details[item].sendBackNumEdit = true
          // })
          // console.log(newDatas)
          // this.popOptions.formDatas = newDatas
          this.returnContent._details.dataSource = newDatas.details || []
          // this.popFlag = true
        },
        syncFormDatasToDataSource: false,
        columns: returnColumns,
        tooltipEffect: 'dark'
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      // okHidden: true,
      title: '查看',
      size: '1000px',
      okText: '保存',
      okHidden: false,
      cancelText: '关闭',
      className: 'popOptionsClass',
      ok: (params) => {
        console.log(params)
        if (this.type === 'edit') {
          // if (this.$permission(['aps:grayClothLoan:update'])) {
          const details = params.details
          const flag = details.some(item => item.loanNum > item.lastLoanNum)
          if (flag) {
            this.$message.error('借调数量只可改小, 不可改大')
            return
          }
          this.grayClothLoanUpdate(params)
          // } else {
          //   this.$message.success('您没有编辑权限, 请联系管理员添加')
          // }
        } else {
          // if (this.$permission(['aps:grayClothLoan:send:back'])) {
          const loanNum = params.loanNum
          const checkedDetails = params.details.filter(item => item.sendBackNumEdit)
          if (!checkedDetails.length) {
            this.$message.warning('请先勾选坯布库存记录')
            return false
          }
          params.details = checkedDetails
          const total = checkedDetails.reduce((total, item) => {
            total += item.sendBackNum * 1
            return total
          }, 0)
          if (total >= loanNum * 1 && total <= loanNum * 1.03) {
            this.sendBack(params)
          } else {
            this.$message.error('归还数量总和应≥借调数量,并≤借调数量的1.03倍')
          }
          // } else {
          //   this.$message.success('您没有归还权限, 请联系管理员添加')
          // }
        }
      },
      // close: () => {
      //   this.detailPopOptions.visible = false
      // },
      cancel: (params) => {
        this.popOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        size: 'mini',
        // layout: true,
        popError: true,
        inline: true
        // labelWidth: '110px'
      },
      content: returnContent
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },

      columns,
      operates,
      pagination,
      dataSource: [],

      popOptions,
      detailContent,
      editContent,
      returnContent,

      returnDataInfo: {},

      editBaseFormDatas: {}
      // backBaseFormDatas: {}

      // popFlag: false
    }
  },
  created() {
    this.getGrayFabricDebitPage()
  },
  methods: {
    // 新建借调按钮
    newDebit() {
      this.$router.push(`/plan-manage/gray-fabric-debit/detail`)
      console.log('新建借调')
    },
    // 三个操作按钮打开方法
    openPopOptions(operateType) {
      const typeObj = {
        detail: { content: this.detailContent, title: '查看' },
        edit: { content: this.editContent, title: '编辑' },
        return: { content: this.returnContent, title: '归还' }
      }
      this.popOptions.content = typeObj[operateType].content
      this.popOptions.title = typeObj[operateType].title
      this.popOptions.okHidden = operateType === 'detail'
      this.popOptions.visible = true
    },

    // 获取分页
    async getGrayFabricDebitPage(data = {}) {
      const res = await api.grayClothLoanPage({ ...this.searchFormDatas, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 坯布借调-查看、编辑按钮-查询
    async getLoanDetail(data = {}) {
      const res = await api.loanDetail(data)
      const dataInfo = res.data || {}
      console.log(dataInfo)
      const flag = this.type === 'edit'
      dataInfo.details = dataInfo.detail ? [dataInfo.detail] : []
      dataInfo.details.forEach(item => {
        item.edit = flag
        item.loanNumEdit = flag
        // item.loanNum = ''
        item.lastLoanNum = item.loanNum
      })
      this.editBaseFormDatas = dataInfo
      this.popOptions.formDatas = dataInfo
    },

    // 坯布借调-归还-点击查看
    async getBackInfo(data = {}) {
      const res = await api.backInfo(data)
      const dataInfo = res.data || {}
      console.log(dataInfo)
      // this.backBaseFormDatas = dataInfo
      dataInfo.details && dataInfo.details.forEach((item, index) => {
        item.edit = true
        item.index = index
        item.sendBackNumEdit = false
        item.sendBackNum = ''
      })
      this.returnDataInfo = dataInfo
      this.popOptions.formDatas = dataInfo
      this.returnContent._details.dataSource = dataInfo.details || []
    },

    // 坯布借调-借调编辑
    async grayClothLoanUpdate(data = {}) {
      const res = await api.grayClothLoanUpdate(data)
      if (res.data) {
        // console.log('成功')
        this.$message.success('修改成功')
        this.popOptions.visible = false
        this.getGrayFabricDebitPage()

        const { beforeCode, afterCode } = this.$utils.compareData(this.editBaseFormDatas, data, 'id')
        const api = `/aps/grayClothLoan/update`
        const opratorType = `UPDATE`
        const description = { beforeText: `在'计划管理-坯布借调'将`, afterText: `编辑为`, beforeCode, afterCode }
        const appId = 'aps'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })
      }
    },

    // 坯布借调-借调归还
    async sendBack(data = {}) {
      const res = await api.sendBack(data)
      if (res.data) {
        // console.log('成功')
        this.$message.success('归还成功')
        this.popOptions.visible = false
        this.getGrayFabricDebitPage()

        const api = `/aps/grayClothLoan/send/back`
        const opratorType = `SET`
        const description = { beforeText: `在'计划管理-坯布借调'归还借调数量`, beforeCode: data }
        const appId = 'aps'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })
      }
    }
  }
}
</script>

<style lang="scss">
  .gray-fabric-debit-list {
    padding: 20px;

    .popOptionsClass {

      .el-form-item {
        margin-bottom: 0px;
        color: #474747;

        .el-form-item__label {
          color: #888E9E;
        }
      }
      .detail-title, .detail-table-title {
        margin-bottom: 0;
        padding-bottom: 10px;
        font-size: 16px;
        color: #151222;
        border-bottom: 1px solid #E9EFF2;
      }

      .detail-table-title {
        border-bottom: none;
      }

      .el-form-item__content {
        width: 100%;
      }
    }

    .pop-table {
      .el-table__row {
        height: 50px;
      }
    }
  }
</style>
