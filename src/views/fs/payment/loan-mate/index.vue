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
        v-permission="['finance:payment:paymentMatch:add']"
        type="primary"
        size="small"
        @click="add"
      >新增</el-button>
      <el-button
        v-permission="['finance:payment:paymentMatch:export']"
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
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index.js'
import { paymentList, paymentExport, paymentAdd, paymentModify } from './api/index.js'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg1 = this.$getRules({
      message: '请填写付款名称',
      trigger: ['blur']
    })
    const commonBlurReg2 = this.$getRules({
      message: '请填写付款类型',
      trigger: ['blur']
    })
    const commonBlurReg3 = this.$getRules({
      message: '请填写状态',
      trigger: ['blur']
    })
    const commonBlurReg4 = this.$getRules({
      message: '请填写申请人',
      trigger: ['blur']
    })
    const commonBlurReg5 = this.$getRules({
      message: '请填写付款金额',
      trigger: ['blur']
    })
    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'paymentName',
        itemType: 'input',
        label: '付款名称:',
        placeholder: '请输入付款名称'
      },
      {
        prop: 'paymentType',
        itemType: 'select',
        label: '付款类型:',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '对私',
            value: 'N'
          },
          {
            label: '对公',
            value: 'Y'
          }
        ]
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        itemStyle: { width: '13%' },
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '已生效',
            value: 'Y'
          },
          {
            label: '已禁用',
            value: 'N'
          }
        ]
      },
      {
        prop: 'updator',
        itemType: 'input',
        label: '维护人:',
        placeholder: '请输入维护人'
      },
      {
        prop: 'creator',
        itemType: 'input',
        label: '创建人:',
        placeholder: '请输入创建人'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.getList(params)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }]
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'id',
        label: '序号',
        width: '50',
        formater: scope => {
          return (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'paymentName',
        label: '付款名称',
        minWidth: '150'
      },
      {
        prop: 'paymentType',
        label: '付款类型',
        minWidth: '120',
        formater: scope => scope.row[scope.column.property] === 'Y' ? '对公' : '对私'
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '80',
        formater: scope => {
          return scope.row[scope.column.property] === 'Y'
            ? '<span style="color: #2ac06d;">已生效</span>'
            : '<span style="color: #ff0000;">已禁用</span>'
        }
      },
      {
        prop: 'creator',
        label: '创建人',
        minWidth: '90'
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '120',
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}')
        }
      },
      {
        prop: 'updator',
        label: '最近维护人',
        minWidth: '90'
      },
      {
        prop: 'updatedTime',
        label: '最近维护时间',
        minWidth: '120',
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}')
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
    const dataList = [{
      label: '编辑',
      isShow: true,
      permitTag: ['finance:payment:paymentMatch:modify'],
      handle: params => {
        this.type = 'edit'
        this.PopDialogHandle('编辑')
        const obj = deepClone(params.row)
        delete obj.creator
        delete obj.createdTime
        delete obj.updatedTime
        this.$set(this.popOptions, 'formDatas', obj)
      }
    }]
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: this.$filterPermission(dataList)
    }
    const itemStyle = {
      width: '50%',
      display: 'inline-block'
    }
    const itemStyle3 = {
      marginBottom: '16px'
    }
    const itemStyle2 = {
      width: '50%',
      marginBottom: '20px',
      display: 'inline-block',
      fontSize: '16px',
      fontWeight: '600'
    }
    // 公共弹出框内容
    const content = [
      {
        prop: 'paymentName',
        itemType: 'input',
        label: '付款名称:',
        labelWidth: '84px',
        maxlength: 64,
        rules: [commonBlurReg1],
        placeholder: '请输入付款名称',
        itemStyle
      },
      {
        prop: 'paymentType',
        itemType: 'select',
        label: '付款类型:',
        labelWidth: '84px',
        rules: [commonBlurReg2],
        placeholder: '请选择付款类型',
        itemStyle,
        dataSource: [
          {
            label: '对私',
            value: 'N'
          },
          {
            label: '对公',
            value: 'Y'
          }
        ]
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        labelWidth: '84px',
        rules: [commonBlurReg3],
        itemStyle,
        dataSource: [
          {
            label: '生效',
            value: 'Y'
          },
          {
            label: '禁用',
            value: 'N'
          }
        ]
      },
      {
        itemType: 'view'
      },
      {
        itemType: 'view',
        text: '标准字段名',
        style: Object.assign({ paddingLeft: '20px' }, itemStyle2)
      },
      {
        itemType: 'view',
        text: '对比字段名',
        style: itemStyle2
      },
      {
        prop: 'proposer',
        itemType: 'input',
        label: '申请人:',
        maxlength: 32,
        rules: [commonBlurReg4],
        itemStyle: itemStyle3
      },
      {
        prop: 'amount',
        itemType: 'input',
        itemStyle: itemStyle3,
        rules: [commonBlurReg5],
        maxlength: 32,
        label: '付款金额:'
      },
      {
        prop: 'currency',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '币别:'
      },
      {
        prop: 'department',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '申请人所在部门:'
      },
      {
        prop: 'company',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '申请人所属公司:'
      },
      {
        prop: 'payee',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '收款人名称:'
      },
      {
        prop: 'payeeBank',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '收款人开户行:'
      },
      {
        prop: 'payeeAccount',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '收款人银行账号:'
      },
      {
        prop: 'paymentCompany',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '付款公司名称:'
      },
      {
        prop: 'paymentCompanyBank',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '付款公司银行名称:'
      },
      {
        prop: 'paymentCompanyAccount',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '付款公司银行账号:'
      },
      {
        prop: 'paymentReason',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '付款事由:'
      },
      {
        prop: 'planPaymentDate',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '计划支付日期:'
      },
      {
        prop: 'paymentSummary',
        itemType: 'input',
        itemStyle: itemStyle3,
        maxlength: 32,
        label: '付款摘要:'
      },
      {
        itemType: 'input',
        type: 'input',
        prop: 'remark',
        maxlength: 32,
        itemStyle: itemStyle3,
        label: '备注:'
      }
    ]
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '',
      okText: '保存',
      ok: params => {
        this.AddOrEdit(params)
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      content: content
    }
    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      columns,
      dataSource: [],
      popOperates,
      pagination,
      popOptions,
      formDatas: {
        paymentType: '',
        status: ''
      },
      searchFormDatas: {},
      content,
      type: 'add'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    async AddOrEdit(data = {}) {
      if (this.type === 'add') {
        await paymentAdd(data)
      } else if (this.type === 'edit') {
        await paymentModify(data)
      }
      this.$set(this.popOptions, 'visible', false)
      this.getList()
      this.$message({
        message: this.type === 'add' ? '新增成功' : '编辑成功',
        type: 'success'
      })
    },
    // 新增按钮
    add() {
      this.type = 'add'
      const obj = {
        paymentName: '',
        paymentType: '',
        status: 'Y',
        proposer: '',
        amount: '',
        currency: '',
        department: '',
        payee: '',
        company: '',
        payeeBank: '',
        payeeAccount: '',
        paymentCompany: '',
        paymentCompanyBank: '',
        paymentCompanyAccount: '',
        paymentReason: '',
        planPaymentDate: '',
        paymentSummary: '',
        remark: ''
      }
      this.$set(this.popOptions, 'formDatas', obj)
      this.PopDialogHandle('新增')
    },
    // 导出
    async bulkImport() {
      const res = await paymentExport(this.searchFormDatas)
      this.$utils.downloadStream(res)
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
</style>

