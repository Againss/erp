<!-- 供应商证件 -->

<template>
  <div class="app-container">
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['srm:basicData:supplierCertdential:add']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addFn"
      >新增</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :table-scrollx="true"
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
import * as api from './api/index.js'
import SwitchStatus from '../../public/components/switch-status'
import { fetchLog } from '@/views/srm/public/fetchLog'
export default {
  name: 'SupplierCertificate',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 公共弹出框内容
    const commonContent = [{
      prop: 'certdentialName',
      itemType: 'input',
      label: '证件名称',
      maxlength: 50,
      rules: [commonBlurReg]
    }, {
      prop: 'remark',
      label: '备注',
      itemType: 'input',
      type: 'textarea',
      maxlength: 50
    }]
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
        prop: 'certdentialName',
        align: 'left',
        label: '证件名称',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        align: 'left',
        label: '状态',
        width: 150,
        components: {
          SwitchStatus
        },
        componentsOptions: {
          formatter: (scope) => scope.row.status === 1 ? '1' : '0',
          changeHandel: scope => {
            this.enableStatus({ id: scope.row.id, status: scope.row.status * 1 ? 0 : 1 })
          },
          permission: 'srm:basicData:supplierCertdential:enable' // 付款方式启/禁用
        }
      },
      {
        prop: 'remark',
        align: 'left',
        label: '备注',
        minWidth: 260,
        showOverflowTooltip: true
      },
      {
        prop: 'createdBy',
        align: 'left',
        label: '创建人',
        showOverflowTooltip: true,
        minWidth: 160
      },
      {
        prop: 'createdTime',
        align: 'left',
        label: '创建日期',
        showOverflowTooltip: true,
        minWidth: 160,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    ]
    const popDataSouece = this.$filterPermission([{
      label: '编辑',
      isShow: true,
      permitTag: ['srm:basicData:supplierCertdential:modify'],
      handle: scope => {
        this.type = 'edit'
        const data = { ...scope.row }
        this.$set(this.popOptions, 'formDatas', data)
        this.PopDialogHandle('编辑')
      }
    }, {
      label: '删除',
      isShow: true,
      permitTag: ['srm:basicData:supplierCertdential:delete'],
      style: { 'color': '#FE4949' },
      handle: scope => {
        this.$confirm('确认删除当前数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'customClass'
        })
          .then(() => {
            this.deleteData(scope.row.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }])
    const popOperates = {
      label: '操作',
      width: '110',
      dataSource: popDataSouece
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getPageFn({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getPageFn({
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
      ok: params => {
        this.addOrEdit(params)
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      formOptions: {},
      content: commonContent
    }
    return {
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add'
    }
  },
  created() {
    this.getPageFn()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增
    addFn() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新增')
    },
    // 删除
    async deleteData(id) {
      const res = await api.supplierCertdentialDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(this.getLogMessages('DEL', '/srm/supplierCertdential/delete'), { id }, JSON.stringify({ beforeText: `在'供应商采购管理-供应商证件,删除一条记录`, beforeCode: { id }}))
      this.getPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
    },
    // 获取数据
    async getPageFn(data = {}) {
      const res = await api.getPage({ ...data })
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
    async enableStatus(data) {
      await api.enabledItem(data).then(e => {
        this.$message.success('更新状态成功')
        this.getPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierCertdential/enabled'), data, JSON.stringify({ beforeText: `在'供应商采购管理-供应商证件'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
      })
    },
    // 新增或者修改印花
    async addOrEdit(params) {
      if (this.type === 'add') {
        await api.addItem(params)
        this.fetchLog(this.getLogMessages('INSERT', '/srm/supplierCertdential/add'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商证件,新增一条记录`, beforeCode: params }))
      } else if (this.type === 'edit') {
        // 修改
        const obj = {}
        const pamraskey = ['id', 'certdentialName', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        await api.editItem(obj)
        const item = this.dataSource.find(ele => ele.id === obj.id)
        const { beforeCode, afterCode } = this.compareData(item, obj, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierCertdential/modify'), obj, JSON.stringify({ beforeText: `在'供应商采购管理-供应商证件,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      }
      this.$message.success('保存成功')
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'visible', false)
      this.getPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
    }
  }
}
</script>

<style lang='scss' scopd>

</style>

