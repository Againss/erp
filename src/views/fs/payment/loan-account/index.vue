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
        v-permission="['finance:payment:paymentAccount:add']"
        type="primary"
        size="small"
        @click="add"
      >新增</el-button>
      <el-button
        v-permission="['finance:payment:paymentAccount:export']"
        size="small"
        @click="bulkImport"
      >导出</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        tooltip-effect="dark"
        :autoresize="false"
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
import {
  paymentFList,
  paymentExport,
  paymentAdd,
  paymentModify,
  paymentStatus
} from './api/index.js'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg1 = this.$getRules({
      message: '请填写付款公司名称',
      trigger: ['blur']
    })
    const commonBlurReg2 = this.$getRules({
      message: '请填写付款账号',
      trigger: ['blur']
    })
    const commonBlurReg3 = this.$getRules({
      message: '请填写付款银行',
      trigger: ['blur']
    })
    const commonBlurReg4 = this.$getRules({
      message: '请填写联行号',
      trigger: ['blur']
    })
    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'companyName',
        itemType: 'input',
        label: '付款公司名称:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款公司名称'
      },
      {
        prop: 'companyAccount',
        itemType: 'input',
        label: '付款账号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款账号'
      },
      {
        prop: 'bankName',
        itemType: 'input',
        label: '付款银行:',
        itemStyle: { width: '20%' },
        placeholder: '请输入付款银行'
      },
      {
        prop: 'lineNumber',
        itemType: 'input',
        label: '联行号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入联行号'
      },
      {
        prop: 'creator',
        itemType: 'input',
        label: '创建人:',
        itemStyle: { width: '20%' },
        placeholder: '请输入创建人'
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        itemStyle: { width: '20%' },
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
        itemStyle: { width: '20%' },
        label: '维护人:',
        placeholder: '请输入维护人'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.searchFormDatas = params
          this.getList(params)
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
        formater: (scope) => {
          return (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'companyName',
        label: '付款公司名称',
        showOverflowTooltip: true,
        minWidth: '200'
      },
      {
        prop: 'companyAccount',
        label: '付款账号',
        minWidth: '180'
      },
      {
        prop: 'bankName',
        label: '付款银行',
        showOverflowTooltip: true,
        minWidth: '200'
      },
      {
        prop: 'lineNumber',
        label: '联行号',
        minWidth: '150'
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '80',
        formater: (scope) => {
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
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row[scope.column.property],
            '{y}-{m}-{d} {h}:{i}'
          )
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
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row[scope.column.property],
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getList({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    const dataList = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['finance:payment:paymentAccount:modify'],
        handle: (params) => {
          this.type = 'edit'
          const obj = {
            id: params.row.id,
            companyName: params.row.companyName,
            companyAccount: params.row.companyAccount,
            bankName: params.row.bankName,
            lineNumber: params.row.lineNumber,
            status: params.row.status,
            remark: params.row.remark
          }
          this.$set(this.popOptions, 'formDatas', obj)
          this.PopDialogHandle('编辑付款账户')
        }
      },
      {
        label: '启用',
        isShow: (val) => val.row.status === 'N',
        permitTag: ['finance:payment:paymentAccount:modify'],
        handle: (params) => {
          const obj = {
            id: params.row.id,
            status: 'Y'
          }
          this.changeStatus(obj, params.$index)
        }
      },
      {
        label: '禁用',
        isShow: (val) => val.row.status === 'Y',
        permitTag: ['finance:payment:paymentAccount:modify'],
        handle: (params) => {
          this.$confirm('确认要禁用该条数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              const obj = {
                id: params.row.id,
                status: 'N'
              }
              this.changeStatus(obj, params.$index)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
      }
    ]
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: this.$filterPermission(dataList)
    }
    // 公共弹出框内容
    const content = [
      {
        prop: 'companyName',
        itemType: 'input',
        label: '付款公司名称:',
        maxlength: 100,
        rules: [commonBlurReg1],
        placeholder: '请输入付款公司名称'
      },
      {
        prop: 'companyAccount',
        itemType: 'input',
        label: '付款账号:',
        maxlength: 100,
        rules: [commonBlurReg2],
        placeholder: '请输入付款账号'
      },
      {
        prop: 'bankName',
        itemType: 'input',
        label: '付款银行:',
        maxlength: 100,
        rules: [commonBlurReg3],
        placeholder: '请输入付款银行'
      },
      {
        prop: 'lineNumber',
        itemType: 'input',
        label: '联行号:',
        maxlength: 32,
        rules: [commonBlurReg4],
        placeholder: '请输入联行号'
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        rows: 4,
        maxlength: 200,
        placeholder: '请输入备注'
      },
      {
        itemType: 'switch',
        prop: 'status',
        label: '是否生效:',
        activeValue: 'Y',
        inactiveValue: 'N'
      }
    ]
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      ok: (params) => {
        this.AddOrEdit(params)
      },
      cancel: (params) => {
        this.PopDialogHandle()
      },
      formDatas: {},
      content: content
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
      formDatas: {
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
    // 禁用启用
    async changeStatus(data, index) {
      await paymentStatus(data)
      this.$set(this.dataSource[index], 'status', data.status)
      this.$message({
        message: data.status === 'Y' ? '启用成功' : '禁用成功',
        type: 'success'
      })
      this.getList()
    },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 编辑、新增点击保存
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
      this.PopDialogHandle('新增付款账户')
      const obj = {
        id: undefined,
        companyName: '',
        companyAccount: '',
        bankName: '',
        lineNumber: '',
        status: 'Y',
        remark: ''
      }
      this.$set(this.popOptions, 'formDatas', obj)
    },
    // 导出
    async bulkImport() {
      const res = await paymentExport(this.searchFormDatas)
      this.$utils.downloadStream(res)
    },
    // 获取分页列表
    async getList(data = {}) {
      const res = await paymentFList({ ...this.searchFormDatas, ...data })
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

