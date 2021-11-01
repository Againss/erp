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
        v-permission="['finance:payment:collectionAccount:add']"
        type="primary"
        size="small"
        @click="add"
      >新增</el-button>
      <el-button
        v-permission="['finance:payment:collectionAccount:export']"
        size="small"
        @click="bulkImport"
      >导出</el-button>
      <el-button
        v-permission="['finance:payment:collectionAccount:import']"
        size="small"
        @click="bulkImportIn"
      >导入</el-button>
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
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 导入pop弹出层(导入) -->
    <div class="importPop">
      <cs-custom-pop :options="importPopOptions" />
    </div>
    <!-- 导入结果弹 -->
    <div class="importPop">
      <cs-custom-pop :options="importPopRes" />
    </div>
  </div>
</template>

<script>
import { paymentSList, paymentExport, paymentAdd, paymentModify, paymentStatus } from './api/index.js'
import downloadTemplate from './components/download-template.vue'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import importRes from './components/import-res.vue'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg1 = this.$getRules({
      message: '请填写收款公司名称',
      trigger: ['blur']
    })
    const commonBlurReg2 = this.$getRules({
      message: '请填写收款账号',
      trigger: ['blur']
    })
    const commonBlurReg3 = this.$getRules({
      message: '请填写收款银行',
      trigger: ['blur']
    })
    const commonBlurReg4 = this.$getRules({
      message: '请填写联行号',
      trigger: ['blur']
    })
    const commonBlurReg5 = this.$getRules({
      message: '请选择账户类型',
      trigger: ['blur']
    })
    // 查询/重置 form表单配置信息
    const searchData = [
      {
        prop: 'companyName',
        itemType: 'input',
        label: '收款公司名称:',
        itemStyle: { width: '20%' },
        placeholder: '请输入收款公司名称'
      },
      {
        prop: 'companyAccount',
        itemType: 'input',
        label: '收款账号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入收款账号'
      },
      {
        prop: 'bankName',
        itemType: 'input',
        label: '收款银行:',
        itemStyle: { width: '20%' },
        placeholder: '请输入收款银行'
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
        prop: 'source',
        itemType: 'select',
        label: '来源:',
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
            label: '手动维护',
            value: '手动维护'
          },
          {
            label: '其他平台',
            value: '其他平台'
          }
        ]
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
        prop: 'accountType',
        itemType: 'select',
        label: '账户类型:',
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
        prop: 'updator',
        itemType: 'input',
        label: '维护人:',
        itemStyle: { width: '20%' },
        placeholder: '请输入维护人'
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
      }
    ]
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
        prop: 'companyName',
        label: '收款公司名称',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'companyAccount',
        label: '收款账号',
        minWidth: '180'
      },
      {
        prop: 'bankName',
        label: '收款银行',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'lineNumber',
        label: '联行号',
        minWidth: '160'
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
        minWidth: '70',
        formater: scope => {
          return scope.row[scope.column.property] === 'Y'
            ? '<span style="color: #2ac06d;">已生效</span>'
            : '<span style="color: #ff0000;">已禁用</span>'
        }
      },
      {
        prop: 'accountType',
        label: '账户类型',
        minWidth: '90',
        formater: scope => scope.row[scope.column.property] === 'Y' ? '对公' : (scope.row[scope.column.property] === 'N' ? '对私' : '')
      },
      {
        prop: 'source',
        label: '来源',
        minWidth: '120'
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
        minWidth: '150',
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
    const dataList = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['finance:payment:collectionAccount:modify'],
        handle: params => {
          this.type = 'edit'
          const obj = {
            id: params.row.id,
            companyName: params.row.companyName,
            companyAccount: params.row.companyAccount,
            bankName: params.row.bankName,
            lineNumber: params.row.lineNumber,
            accountType: params.row.accountType,
            status: params.row.status,
            source: params.row.source,
            remark: params.row.remark
          }
          if (params.row.source === '手动维护') {
            for (let i = 0; i < 5; i++) {
              this.$set(this.popOptions.content[i], 'disabled', false)
            }
          } else if (params.row.source === '钉钉') {
            this.$set(this.popOptions.content[0], 'disabled', true)
            this.$set(this.popOptions.content[1], 'disabled', true)
            this.$set(this.popOptions.content[2], 'disabled', true)
            this.$set(this.popOptions.content[3], 'disabled', false)
            this.$set(this.popOptions.content[4], 'disabled', false)
          } else {
            for (let i = 0; i < 5; i++) {
              this.$set(this.popOptions.content[i], 'disabled', true)
            }
          }
          this.$set(this.popOptions, 'formDatas', obj)
          this.PopDialogHandle('编辑收款账户')
        }
      },
      {
        label: '禁用',
        isShow: params => params.row.status === 'Y',
        permitTag: ['finance:payment:collectionAccount:modify'],
        handle: params => {
          this.$confirm('确认要禁用该条数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            const obj = {
              id: params.row.id,
              status: 'N'
            }
            this.changeStatus(obj, params.$index)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      },
      {
        label: '启用',
        isShow: params => params.row.status === 'N',
        permitTag: ['finance:payment:collectionAccount:modify'],
        handle: params => {
          const obj = {
            id: params.row.id,
            status: 'Y'
          }
          this.changeStatus(obj, params.$index)
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
    // 公共弹出框内容
    const content = [
      {
        prop: 'companyName',
        itemType: 'input',
        label: '收款公司名称:',
        maxlength: 100,
        rules: [commonBlurReg1],
        placeholder: '请输入收款公司名称'
      },
      {
        prop: 'companyAccount',
        itemType: 'input',
        label: '收款账号:',
        maxlength: 100,
        rules: [commonBlurReg2],
        placeholder: '请输入收款账号'
      },
      {
        prop: 'bankName',
        itemType: 'input',
        label: '收款银行:',
        maxlength: 100,
        rules: [commonBlurReg3],
        placeholder: '请输入收款银行'
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
        prop: 'accountType',
        itemType: 'select',
        label: '账户类型:',
        rules: [commonBlurReg5],
        placeholder: '请选择账户类型',
        dataSource: [
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
      ok: params => {
        this.AddOrEdit(params)
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      content: content
    }
    const resStyle = {
      'font-size': '16px',
      'line-height': '40px'
    }
    // 导入结果弹窗
    const importPopRes = {
      itemType: 'dialog',
      visible: false,
      title: '',
      cancelHidden: true,
      width: '360px',
      ok: params => {
        this.$set(this.importPopRes, 'visible', !this.importPopRes.visible)
      },
      content: [
        {
          itemType: 'view',
          style: resStyle,
          text: ''
        },
        {
          itemType: 'view',
          style: resStyle,
          text: ''
        },
        {
          itemType: 'view',
          style: resStyle,
          text: ''
        },
        {
          components: {
            importRes
          },
          componentsOptions: {
            click: () => {
              window.open(this.filePath)
              this.$set(this.importPopRes, 'visible', !this.importPopRes.visible)
            }
          }
        }
      ]
    }
    // 批量导入pop弹出框的配置信息
    const importPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '导入收款账户',
      cancelHidden: true,
      okHidden: true,
      width: '560px',
      formDatas: {},
      content: [
        {
          itemType: 'view',
          text: '第一步：下载模板，填写信息'
        },
        {
          components: {
            downloadTemplate
          }
        },
        {
          itemType: 'view',
          text: '第二步：上传填写好的文件，并导入'
        },
        {
          prop: 'upload',
          itemType: 'upload',
          label: '',
          onSuccess: (res, file) => {
            // this.fetchLog(this.getLogMessages('IMPORT', '/userCenter/sysUser/batch/add'), file, JSON.stringify({ beforeText: `在'用户中心-员工管理'批量导入成功` }))
            this.importPopDialogHandle()
            this.getList()
            this.filePath = 'https://' + res.data.filePath
            this.$set(this.importPopRes.content[0], 'text', '导入文件记录总数: ' + res.data.sumTotal + ' 条')
            this.$set(this.importPopRes.content[1], 'text', '导入成功记录数: ' + res.data.successTotal + ' 条')
            this.$set(this.importPopRes.content[2], 'text', '导入失败记录数: ' + res.data.loseTotal + ' 条')
            setTimeout(() => {
              this.$set(this.importPopRes, 'visible', !this.importPopRes.visible)
            }, 300)
          },
          onError: (res, file) => {
            console.log(res, '导入res ++')
          },
          action: `/finance/collection/account/import/excel`,
          accept: '.xlsx,.xls,XLSX,.XLS',
          showFileList: false,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            }
          ]
        }
      ]
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
      importPopOptions,
      formDatas: {
        accountType: '',
        source: '',
        status: ''
      },
      importPopRes,
      type: 'add',
      filePath: ''
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
        id: undefined,
        companyName: '',
        companyAccount: '',
        bankName: '',
        lineNumber: '',
        accountType: '',
        source: '手动维护',
        status: 'Y',
        remark: ''
      }
      if (this.popOptions.content[0].disabled) {
        for (let i = 0; i < 5; i++) {
          this.$set(this.popOptions.content[i], 'disabled', false)
        }
      }
      this.$set(this.popOptions, 'formDatas', obj)
      this.PopDialogHandle('新增收款账户')
    },
    // 导出
    async bulkImport() {
      const res = await paymentExport(this.searchFormDatas)
      this.$utils.downloadStream(res)
    },
    // 导入
    bulkImportIn() {
      this.importPopDialogHandle()
    },
    // 修改弹出层的判断
    importPopDialogHandle(val) {
      this.$set(this.importPopOptions, 'visible', !this.importPopOptions.visible)
      if (val) {
        this.$set(this.importPopOptions, 'title', val)
      }
    },
    // 获取分页列表
    async getList(data = {}) {
      const res = await paymentSList({ ...this.searchFormDatas, ...data })
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
.importPop {
  .el-dialog__body {
    padding: 10px 20px !important;
  }
}

.app-container {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>

