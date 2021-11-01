<template>
  <div class="contract">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createContract">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="contractColumns"
        :data-source="contractDataSource"
        :operates="contractPopOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="contractPopOptions" />
    </div>
  </div>
</template>

<script>
// import { competitorPage, competitorAdd } from './api/index.js'
import { Contract } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
import { ContractRelevant } from './components/relevantIndex.js'
export default {
  mixins: [Contract, PublicCrm, ContractRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 数字验证
    // const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    // 姓名正则
    // const nameReg = this.$getRules({ type: 'department', message: '最大长度为50', trigger: ['blur'] })
    // 客户搜索
    const customerSearch = value => {
      if (value === '') {
        this.$set(this.contractPopOptions.content[1], 'dataSource', [])
      } else {
        if (!this.getData1) {
          this.getData1 = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData1({ name: value, dataTag: 'ALL' }, 1, this.contractPopOptions)
      }
    }
    // 商机搜索
    // const businessSearch = value => {
    //   if (value === '') {
    //     this.$set(this.contractPopOptions.content[2], 'dataSource', [])
    //   } else {
    //     if (!this.getData2) {
    //       this.getData2 = this.$utils.debounce(this.remoteBusinessPage, 300)
    //     }
    //     this.getData2({ name: value, dataTag: 'ALL' }, 2, this.contractPopOptions)
    //   }
    // }
    // 用户搜索
    const userSearch = value => {
      if (value === '') {
        this.$set(this.contractPopOptions.content[9], 'dataSource', [])
      } else {
        if (!this.getData3) {
          this.getData3 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData3({ realName: value, name: value }, 9, this.contractPopOptions)
      }
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
        label: '名称:',
        placeholder: '请输入合同名称或客户名称'
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '合同状态:',
        dataSource: [
          {
            value: null,
            label: '全部合同状态'
          },
          {
            value: 'E',
            label: '执行中'
          },
          {
            value: 'C',
            label: '结束'
          },
          {
            value: 'D',
            label: '意外终止'
          }
        ]
        // placeholder: '请输入员工姓名或者工号'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          this.getContractPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息/以下五个都是table的配置信息
    const contractColumns = [
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
        prop: 'name',
        label: '合同名称',
        showOverflowTooltip: true,
        minWidth: '80',
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/contract/contract-details-page/${scope.row.id}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'customerName',
        label: '客户',
        showOverflowTooltip: true,
        minWidth: '80',
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
        prop: 'businessOpportunityName',
        label: '商机',
        showOverflowTooltip: true,
        minWidth: '80'
        // handle: scope => {
        //   console.log('scope', scope)
        // }
      },
      {
        prop: 'contractDate',
        label: '签约日期',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'totalAmount',
        label: '总金额',
        width: '120',
        align: 'right',
        formater: scope => {
          const number = scope.row[scope.column.property]
          return number && this.numRecursion(number / 10000)
        }
      },
      {
        prop: 'status',
        label: '合同状态',
        width: '100',
        formater: scope => {
          const status = scope.row[scope.column.property]
          return status === 'E' ? '执行中' : status === 'C' ? '结束' : status === 'D' ? '意外终止' : ''
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
        minWidth: '70',
        showOverflowTooltip: true
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getContractPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getContractPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params)
          this.PopDialogHandle(this.contractPopOptions, '编辑合同')
          this.getContractInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该合同吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteContract({ id: params.row.id })
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
    const contractPopOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: handleConf
    }

    // pop弹出框配置信息
    const contractPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params, this.userList)
        // const businessOpportunityId = params.businessOpportunityName
        // const customerId = params.customerName
        delete params.follower
        const ourSignatoryName = this.userList.length !== 0 ? this.userList.filter(item => item.userId === params.ourSignatory)[0].realName : params.ourSignatoryName
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.addOrEditContract({ ...params, ourSignatoryName, totalAmount })
      },
      cancel: params => {
        this.closePopDialogHandle(this.contractPopOptions)
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
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 50,
          label: '合同名称',
          rules: [commonBlurReg],
          placeholder: '请输入合同名称'
        },
        {
          prop: 'customerId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          change: this.customerChange,
          remoteMethod: customerSearch,
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找客户'
        },
        {
          prop: 'businessOpportunityId',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '请先查找客户'
        },
        {
          itemType: 'date',
          prop: 'contractDate',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '签约日期',
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'status',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '合同状态',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'E',
              label: '执行中'
            },
            {
              value: 'C',
              label: '结束'
            },
            {
              value: 'D',
              label: '意外终止'
            }
          ]
        },
        {
          prop: 'totalAmount',
          itemType: 'input',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          maxlength: 12,
          label: '总金额',
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入总金额'
        },
        {
          itemType: 'date',
          prop: 'startTime',
          label: '开始日期',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.endTime) {
              if (new Date(value) > new Date(formDatas.endTime)) {
                this.$message.warning('开始日期不能晚于结束日期')
                setFormDatas({ startTime: '' })
              }
            }
          },
          placeholder: '请选择日期'
        },
        {
          itemType: 'date',
          prop: 'endTime',
          label: '结束日期',
          change: (value, form, formDatas, setFormDatas) => {
            if (formDatas.startTime) {
              if (new Date(value) < new Date(formDatas.startTime)) {
                this.$message.warning('结束日期不能早于开始日期')
                setFormDatas({ endTime: '' })
              }
            }
          },
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          placeholder: '请选择日期'
        },
        {
          prop: 'customerSignatory',
          itemType: 'input',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          maxlength: 10,
          label: '客户签约人',
          rules: [commonBlurReg],
          placeholder: '请输入客户签约人'
        },
        {
          prop: 'ourSignatory',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: userSearch,
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '我方签约人',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找系统用户'
        },
        {
          prop: 'payType',
          itemType: 'select',
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '支付方式',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'B',
              label: '银行转账'
            },
            {
              value: 'C',
              label: '支票'
            },
            {
              value: 'M',
              label: '现金'
            },
            {
              value: 'O',
              label: '其他'
            }
          ]
        },
        {
          prop: 'remark',
          itemType: 'input',
          itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          label: '备注',
          // rules: [commonBlurReg, nameReg],
          placeholder: '请输入备注'
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
      contractColumns,
      pagination,
      contractPopOperates,
      contractDataSource: [],
      type: 'edit',
      contractPopOptions,
      searchFormDatas: {},
      userList: []
    }
  },
  created() {
    this.getContractPage()
  },
  methods: {
    createContract() {
      this.type = 'add'
      this.PopDialogHandle(this.contractPopOptions, '新建合同')
      this.$set(this.contractPopOptions.content[2], 'dataSource', [])
      this.$set(this.contractPopOptions.content[2], 'placeholder', '请先查找客户')
    }
  }
}
</script>

<style lang='scss' scoped>
.contract {
  padding: 20px;
  .button {
    // margin-bottom: 22px;
  }
}
</style>

<style lang="scss">
.popOptionsClass {
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }
}
.contract {
  .search {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important;
    }
  }
}
</style>

