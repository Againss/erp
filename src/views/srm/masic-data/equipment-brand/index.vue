<!-- 设备品牌 -->

<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['srm:basicData:equipmentBrand:add']"
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
  name: 'EquipmentBrand',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'brandName',
        itemType: 'input',
        label: '品牌名称:',
        placeholder: '请输入品牌名称',
        maxlength: 50,
        rules: [commonBlurReg]
      },
      {
        prop: 'equipmentType',
        itemType: 'select',
        label: '设备类型:',
        clearable: true,
        rules: [commonBlurReg],
        dataSource: [
          {
            label: '染色',
            value: 1
          },
          {
            label: '织机',
            value: 2
          },
          {
            label: '特整',
            value: 3
          },
          {
            label: '印花',
            value: 4
          },
          {
            label: '纺纱',
            value: 5
          }
        ]
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        rows: 3,
        maxlength: 50,
        placeholder: '请输入备注'
      }
    ]
    // 查询表单配置信息
    const searchData = [
      {
        prop: 'brandName',
        itemType: 'input',
        label: '品牌名称:',
        placeholder: '请输入品牌名称'
      },
      {
        prop: 'equipmentType',
        itemType: 'select',
        label: '设备类型:',
        clearable: true,
        dataSource: [
          {
            label: '染色',
            value: 1
          },
          {
            label: '织机',
            value: 2
          },
          {
            label: '特整',
            value: 3
          },
          {
            label: '印花',
            value: 4
          },
          {
            label: '纺纱',
            value: 5
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.getPageFn(params)
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
        prop: 'brandName',
        align: 'left',
        label: '品牌名称',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'equipmentType',
        align: 'left',
        label: '设备类型',
        minWidth: 160,
        formater: scope => {
          const obj = {
            '1': '染色',
            '2': '织机',
            '3': '特整',
            '4': '印花',
            '5': '纺纱'
          }
          return obj[scope.row['equipmentType']] || '没有...'
        }
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
          permission: 'srm:basicData:equipmentBrand:enable' // 付款方式启/禁用
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
      permitTag: ['srm:basicData:equipmentBrand:modify'],
      handle: scope => {
        this.type = 'edit'
        const data = { ...scope.row }
        this.$set(this.popOptions, 'formDatas', data)
        this.PopDialogHandle('编辑')
      }
    }, {
      label: '删除',
      isShow: true,
      permitTag: ['srm:basicData:equipmentBrand:delete'],
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
      formOptions: {
        size: 'small',
        inline: true
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      searchFormDatas: {
        status: ''
      },
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
      const res = await api.equipmentBrandDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(this.getLogMessages('DEL', '/srm/equipmentBrand/delete'), { id }, JSON.stringify({ beforeText: `在'供应商采购管理-设备品牌,删除一条记录`, beforeCode: { id }}))
      this.getPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
    },
    // 获取数据
    async getPageFn(data = {}) {
      const res = await api.getPage({ ...this.searchFormDatas, ...data })
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
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/equipmentBrand/enabled'), data, JSON.stringify({ beforeText: `在'供应商采购管理-设备品牌'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
      })
    },
    // 新增或者修改印花
    async addOrEdit(params) {
      if (this.type === 'add') {
        await api.addItem(params)
        this.fetchLog(this.getLogMessages('INSERT', '/srm/equipmentBrand/add'), params, JSON.stringify({ beforeText: `在'供应商采购管理-设备品牌,新增一条记录`, beforeCode: params }))
      } else if (this.type === 'edit') {
        // 修改
        const obj = {}
        const pamraskey = ['id', 'brandName', 'equipmentType', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        await api.editItem(obj)
        const item = this.dataSource.find(ele => ele.id === obj.id)
        const { beforeCode, afterCode } = this.compareData(item, obj, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/equipmentBrand/modify'), obj, JSON.stringify({ beforeText: `在'供应商采购管理-设备品牌,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      }
      this.$message.success('保存成功')
      this.$set(this.popOptions, 'visible', false)
      this.$set(this.popOptions, 'formDatas', {})
      this.getPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
    }
  }
}
</script>

<style lang='scss' scopd>

</style>

