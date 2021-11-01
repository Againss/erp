<!--
 * @Date: 2021-04-22 09:18:15
 * @Author: Againss
 * @LastEditTime: 2021-05-08 10:33:03
 * @LastEditors: anthony
 * @Descripttion:纱长区间
-->
<template>
  <div class="processPage">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['catalog:Api:Range:yarnLength:store']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
    </div>
    <!-- table表格  :operates="popOperates"-->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        lazy
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popOptionsTable" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { yarnList, yarnAdd, yarnEdit, yarnUpdate, yarnDelete, yarnApprove, yarnEnabled } from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import logMethods from '@/views/product-center/mixin/log-methods'
// import enableSwitch from '@/views/basic-data/components/enableSwitch'
export default {
  components: {},
  mixins: [logMethods],
  data() {
    const searchData = [
      {
        prop: 'minVal',
        itemType: 'input',
        label: '数值区间:',
        itemStyle: { width: '170px', 'margin-right': '15px !important' }
      },
      {
        prop: 'maxVal',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '115px' }
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['change'] })
    // 验证大写
    const checkData = (rule, value, callback) => {
      const res = /^(([1-9][0-9]{0,3})(\.\d)?|0\.[1-9])$/g
      const formDatas = this.$refs.popOptionsTable.$children && this.$refs.popOptionsTable.$children.length && this.$refs.popOptionsTable.$children[0].formDatas
      if (!res.test(value)) {
        callback(new Error('请输入小于10000且至多一位小数的数字'))
      } else if ((rule.field === 'minVal' || rule.field === 'maxVal') && formDatas.minVal && formDatas.maxVal) {
        if (formDatas.minVal - formDatas.maxVal >= 0) {
          callback(new Error('"小于"的值必须大于"大于等于"的值'))
        } else {
          callback()
        }
      } else if (rule.field === 'midVal' && formDatas.midVal && formDatas.minVal && formDatas.maxVal) {
        if (formDatas.minVal - formDatas.midVal > 0 || formDatas.midVal - formDatas.maxVal >= 0) {
          callback(new Error('归类值不能小于"大于等于"的值，且不能大于等于"小于"的值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9\.]/g, '')
      data = data.replace('_', '')
      return data
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        showOverflowTooltip: true
      },
      {
        prop: 'minVal',
        label: '大于等于',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'maxVal',
        label: '小于',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'midVal',
        label: '归类',
        minWidth: '80'
      },
      {
        prop: 'updator',
        label: '更新人',
        showOverflowTooltip: true,
        minWidth: '80',
        formater: (scope) => {
          return scope.row.creator ? scope.row.creator.name + '/' + scope.row.creator.realName : ''
        }
      },
      {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '80',
        formater: (scope) => {
          return scope.row.createdTime && this.$filters.parseTime(
            scope.row.updatedTime || scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          ) || ''
        }
      }
      // {
      //   prop: 'status.code',
      //   label: '启用/禁用',
      //   components: {
      //     enableSwitch
      //   },
      //   componentsOptions: {
      //     permitTag: 'catalog:Api:Range:yarnLength:enabled',
      //     changeStatus: (scope) => {
      //       this.changeEnable({ id: scope.row.id }, scope)
      //     }
      //   }
      // },
      // {
      //   prop: 'status.describe',
      //   label: '状态',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row.status.describe
      //   }
      // }
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
        prop: 'minVal',
        label: '大于等于',
        clearable: true,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkData, trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'maxVal',
        label: '小于',
        clearable: true,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkData, trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'midVal',
        label: '归类',
        clearable: true,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkData, trigger: ['blur'] }]
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['catalog:Api:Range:yarnLength:approve'],
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
        permitTag: ['catalog:Api:Range:yarnLength:update'],
        isShow: true,
        handle: scope => {
          if (scope.row.status.code === 'P') {
            this.$set(this.copyContent[1], 'disabled', true)
            this.$set(this.copyContent[2], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', true)
          } else {
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑纱长区间')
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['catalog:Api:Range:yarnLength:destroy'],
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
        this.getList({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getList({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增纱长区间',
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
      copyContent,
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      visible: false,
      searchData,
      formOtions: {
        layout: false,
        inline: true,
        size: 'small'
      },
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增纱长区间')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await yarnAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getList()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      // 日志功能
      this.fetchLog(
        this.getLogMessages(
          'INSERT',
          `product/api/range/yarnLength/store`
        ),
        data,
        JSON.stringify({
          beforeText: `在'产品目录库-数据配置-纱长区间'新增一条记录`,
          beforeCode: data
        })
      )
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
        const pamraskey = ['minVal', 'maxVal', 'midVal']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') { // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'minVal', 'maxVal', 'midVal']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // =列表查询
    async getList(data = {}) {
      const res = await yarnList({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = ((res.data.page - 1) * res.data.pageSize + index + 1) })
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
      const res = await yarnEdit(data)
      if (!res || res.code !== 200) {
        return false
      }
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
      const res = await yarnUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getList({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核
    async approveData(id) {
      const res = await yarnApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getList({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteData(id) {
      const res = await yarnDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getList({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 页面启用禁用
    async changeEnable(data = {}, scope) {
      const res = await yarnEnabled(data)
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
    }
  }
}
</script>
<style lang='scss' scoped>
.processPage {
  padding: 20px;
  padding-bottom: 0px;
}
</style>
<style lang="scss">
.processPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
</style>
