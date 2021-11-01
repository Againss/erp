<!--
 * @Author: Do not edit
 * @Date: 2020-09-23 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  计量单位页面
 -->
<template>
  <div class="measurePage">
    <div class="button">
      <el-button v-permission="['basic:units:store']" icon="el-icon-plus" size="small" type="primary" @click="addList">新增</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { measureList, measureAdd, measureDetail, measureUpdate, measureDelete, measureApprove, measureEnable, measureSelect } from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
export default {
  name: 'Measurement',
  components: {},
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        showOverflowTooltip: true
      },
      {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'abbr',
        label: '简称',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'type.name',
        label: '类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.type.name
        }
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'status.code',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:units:enabled',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id }, scope)
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
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        itemType: 'input',
        prop: 'name',
        label: '中文名',
        maxlength: 15,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 15 个字符以内', trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'nameEn',
        label: '英文名',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 20 个字符以内', trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'abbr',
        label: '简称',
        maxlength: 10,
        clearable: true,
        rules: [commonBlurReg],
        formater: scope => {
          return scope.row.abbr.replace(/[^a-zA-Z]/g, '')
        }
      },
      {
        prop: 'typical',
        itemType: 'select',
        filterable: true,
        label: '类型',
        clearable: true,
        placeholder: '请选择',
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getOption()
          }
        },
        dataSource: []
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注',
        trim: (value) => {
          return value
        },
        maxlength: 100
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:units:approve'],
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
              this.approveData(scope.row.id)
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
        permitTag: ['basic:units:update'],
        isShow: true,
        handle: scope => {
          if (scope.row.status.code === 'P') {
            this.$set(this.copyContent[1], 'disabled', true)
            this.$set(this.copyContent[2], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', true)
            this.$set(this.copyContent[4], 'disabled', true)
          } else {
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
            this.$set(this.copyContent[4], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑计量单位')
          this.getOption()
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:units:destroy'],
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
              this.deleteData(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getRulePage({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增计量单位',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
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
      content: copyContent
    }
    return {
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      copyContent,
      type: 'add',
      visible: false,
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  mounted() {},
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增计量单位')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.copyContent[4], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await measureAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params) {
      // 走新增接口
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['name', 'nameEn', 'abbr', 'typical', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') { // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'name', 'nameEn', 'abbr', 'typical', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 计量单位列表
    async getRulePage(data = {}) {
      const res = await measureList({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize,
        page: res.data.page
      }
    },
    // 点击编辑
    async editList(data = {}, code) {
      const res = await measureDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      // res.data.typical = res.data.type.id
      console.log('打印res.data.type.id', res.data.type.id)
      console.log('打印typical', res.data.typical)
      const editData = res.data || {}
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
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
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await measureUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核
    async approveData(id) {
      const res = await measureApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getRulePage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteData(id) {
      const res = await measureDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 页面启用禁用
    async changeEnable(data = {}, scope) {
      const res = await measureEnable(data)
      if (res.code === 200) {
        this.$message({
          message: res.message ? res.message : '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
    },
    async getOption(data = {}) {
      const res = await measureSelect({ pid: 4 })
      if (res.code !== 200) {
        return false
      }
      const dataCopy = res.data
      dataCopy.map((item, index) => {
        item.label = item.name
        item.value = item.id
      })
      this.$set(this.copyContent[4], 'dataSource', dataCopy)
    }
  }
}
</script>
<style lang='scss' scoped>
.measurePage {
  padding: 20px;
  padding-bottom: 0px;
}
</style>
<style lang="scss">
.measurePage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
</style>
