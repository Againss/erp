/**
 * @Description: 面料大类
 * @author ll
 * @date 2020/10/21
*/
<template>
  <div class="fabricTypes">
    <!-- 新增 -->
    <div class="button">
      <el-button v-permission="['basic:fabricCategory:store']" size="small" icon="el-icon-plus" type="primary" @click="addClothAttribute">新增</el-button>
    </div>
    <!-- 布种表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <!-- 导入布种pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'
import { sysDataGroupPage, sysDataGroupAdd, sysDataGroupModify, sysDataGroupApprove, sysDataGroupEnabled, sysDataGroupDelete, sysDataGroupDetail } from './api/index.js'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkFrequency = (rule, value, callback) => {
      if (value.length !== 1) {
        callback(new Error('简称必须为一个字母'))
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^a-zA-Z]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    const content = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 200,
        rules: [commonBlurReg, { min: 1, max: 200, message: '长度在1 到200 个字符', trigger: 'blur' }]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        placeholder: '请输入一位大写字母',
        maxlength: 1,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkFrequency, trigger: 'change' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true
      },
      {
        prop: 'abbr',
        label: '简称'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled.code',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:fabricCategory:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id })
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:fabricCategory:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.approveFabricTypes(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      },
      {
        label: '编辑',
        permitTag: ['basic:fabricCategory:update'],
        isShow: true,
        handle: scope => {
          if (scope.row.status.code === 'P') {
            this.$set(this.content[1], 'disabled', true)
            this.$set(this.content[2], 'disabled', true)
            this.$set(this.content[3], 'disabled', true)
          } else {
            this.$set(this.content[1], 'disabled', false)
            this.$set(this.content[2], 'disabled', false)
            this.$set(this.content[3], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', content)
          this.type = 'edit'
          this.PopDialogHandle('编辑面料大类')
          this.getGroupInfo({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:fabricCategory:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteFabricTypes(scope.row.id)
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
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '240',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.fabricTypesOption(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: content
    }
    return {
      type: 'add',
      columns,
      content,
      pagination,
      popOperates,
      popOptions,
      dataSource: [],
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    async getListData(data = {}) {
      const res = await sysDataGroupPage(data)
      res.data && res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
      const dataList = res.data ? res.data.list : []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize,
        page: res.data.page
      }
    },
    // 面料大类启用、禁用
    async enableStatus(data = {}) {
      const res = await sysDataGroupEnabled(data)
      if (res.code === 200) {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
    },
    // 点击新增
    addClothAttribute() {
      this.type = 'add'
      this.oldForm = this.content.formDatas || {}
      this.$set(this.content[1], 'disabled', false)
      this.$set(this.content[2], 'disabled', false)
      this.$set(this.content[3], 'disabled', false)
      this.PopDialogHandle('新增面料大类')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增、编辑面料大类
    fabricTypesOption(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['name', 'nameEn', 'abbr', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.fabricTypesAdd(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'name', 'nameEn', 'abbr', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.fabricTypesEdit(obj)
      }
    },
    // 面料大类新增
    async fabricTypesAdd(data = {}) {
      const res = await sysDataGroupAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getListData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 面料大类编辑
    async fabricTypesEdit(data = {}) {
      const res = await sysDataGroupModify(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核面料大类
    async approveFabricTypes(id) {
      const res = await sysDataGroupApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除面料大类
    async deleteFabricTypes(id) {
      const res = await sysDataGroupDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 面料大类详情
    async getGroupInfo(data = {}, code) {
      const res = await sysDataGroupDetail(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      this.oldForm = { ...dataList, code: code }
      this.setFormDatas({ ...dataList, code: code })
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            this.$set(this.popOptions, 'visible', false)
          })
          .catch(_ => {
            this.$set(this.popOptions, 'visible', true)
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fabricTypes {
  padding: 20px;
  padding-bottom: 0;
}
</style>

