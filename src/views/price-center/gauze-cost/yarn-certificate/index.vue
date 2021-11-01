<!--
  @Description 纱线证书
-->
<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOptions" :form-datas="formDatas" />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['price:yarnCertInfo:add']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addFn"
      >新增</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        table-scrollx
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
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
import {
  getCertificatePage,
  deleteCertificate,
  editCertificate,
  enabledCertificate,
  addCertificate,
  getCertificateDetail
} from './api/index.js'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import { getZhengShu } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'CertificateFiber',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/,
      message: '请输入最大3位整数或保留1到2位小数',
      trigger: ['blur']
    })
    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'yarnCert',
        itemType: 'select',
        label: '纱线证书:',
        placeholder: '请选择纱线证书',
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'certResourceType',
        itemType: 'select',
        label: '证书来源:',
        clearable: true,
        rules: [commonBlurReg],
        placeholder: '请选择证书来源',
        dataSource: [
          {
            value: 'S',
            label: '自开'
          },
          {
            value: 'O',
            label: '外采'
          }
        ]
      },
      {
        prop: 'yarnCertPrice',
        itemType: 'input',
        label: '纱价格:',
        placeholder: '请输入纱价格',
        rules: [commonBlurReg, max999Reg]
      }
    ]
    // 查询表单配置信息
    const searchData = [
      {
        prop: 'status',
        itemType: 'select',
        label: '启用/禁用:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.getCertificatePageFn(params)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      {
        prop: 'yarnCertName',
        label: '纱线证书',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'certResourceType',
        label: '证书来源',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? (scope.row[scope.column.property] === 'S' ? '自开' : '外采') : ''
        }
      },
      {
        prop: 'yarnCertPrice',
        label: '证书价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'createdBy',
        label: '创建人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '禁用/启用',
        minWidth: '120',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:yarnCertInfo:status',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id, status: scope.row.status * 1 }, scope)
          }
        }
      }
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesList = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['price:yarnCertInfo:modify'],
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:yarnCertInfo:delete'],
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => this.deleteFn({ id: scope.row.id }))
        }
      }
    ]
    popOperatesList = this.$filterPermission(popOperatesList)
    const popOperates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: popOperatesList
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getCertificatePageFn({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getCertificatePageFn({
          pageNum: this.pagination.pageNum || 1,
          pageSize: val
        })
      }
    }
    // 弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      okText: '保存',
      saveAndaddText: '保存并继续',
      ok: (params) => {
        this.addOrEdit(params, true)
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      formOptions: {},
      content: commonContent
    }
    return {
      formOptions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        status: ''
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      searchFormDatas: {},
      type: 'add',
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getCertificatePageFn()
  },
  methods: {
    async editFn(id) {
      const data = (await getCertificateDetail({ id })).data || {}
      this.oldForm = data
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      this.$set(this.popOptions, 'saveAndadd', undefined)
      this.PopDialogHandle('编辑纱线证书')
    },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.setSelectData()
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增
    addFn() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增纱线证书')
    },
    // 获取数据
    async getCertificatePageFn(data = {}) {
      const res = await getCertificatePage({ ...this.searchFormDatas, ...data })
      this.dataSource = res.data && res.data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data && res.data.total || 0,
        ...data,
        currentPage: res.data && res.data.pageNum || 1,
        pageSize: res.data && res.data.pageSize || 20
      }
    },
    // 启用/禁用
    async enableStatus(data, scope) {
      await enabledCertificate(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/yarnCertInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线证书'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 新增或者修改印花
    addOrEdit(params, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await addCertificate(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/yarnCertInfo/add'), params, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线证书,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            await editCertificate(params)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, params, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/yarnCertInfo/modify'), params, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线证书,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$message.success('保存成功')
          this.$set(this.popOptions, 'formDatas', {})
          this.getCertificatePageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 删除
    async deleteFn(data = {}) {
      await deleteCertificate(data)
      this.$message.success('删除成功')
      this.getCertificatePageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/yarnCertInfo/delete'), data, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线证书'删除一条记录`, beforeCode: data }))
    },
    // 设置弹框下拉数据
    setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const arr = [[getZhengShu, 0]]
      arr.forEach(async e => {
        const row = this.popOptions.formDatas
        const select = this.popOptions.content[e[1]].dataSource
        const id = row && row[this.popOptions.content[e[1]].prop] && row[this.popOptions.content[e[1]].prop].value || ''
        const bool = id && !select.find(item => item.value === id)
        // 当下拉选为空 或 编辑时当前值不在下拉列表中
        if (!select.length || bool) {
          const data = await e[0](e[2] || {}, { id, data: [], type: this.type })
          this.$set(this.popOptions.content[e[1]], 'dataSource', data)
        }
      })
    }
  }
}
</script>

<style lang='scss' scopd>

</style>
