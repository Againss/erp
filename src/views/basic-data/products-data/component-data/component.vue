<!--
 * @Author: Do not edit
 * @Date: 2020-09-23 09:13:35
 * @LastEditTime: 2021-01-22 10:14:04
 * @LastEditors: Sanmao
 **  成分页面
 -->
<template>
  <div class="componentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 新增菜单按钮 -->
    <!-- <div class="button">
      <el-button v-permission="['basic:ingredients:store']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
    </div> -->
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
        :pagination="pagination"
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
import { wastageCategory, componentList, componentAdd, componentDetail, componentUpdate, componentDelete, componentApprove, componentEnabled, componentSelect, classifySelect } from './api/index.js'
import { dataComparision, filterOptions } from '@/views/basic-data/common/index'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
export default {
  name: 'ComponentList',
  components: {},
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    // 限制字母输入大写
    const checkData = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('简称必须为两个字母'))
      } else {
        callback()
      }
    }
    const qzcheckData = (rule, value, callback) => {
      // const re = /^(0|[0-9]\d{0,1})?$/g
      const re = /^\d(\.\d)?$/g
      if (!re.test(value)) {
        callback(new Error('请输入大于等于0小于10且至多一位小数的数字'))
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
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'category_name',
        itemType: 'input',
        label: '成份大类:',
        clearable: true,
        placeholder: '请输入名称'
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '中文名/英文名'
      },
      {
        prop: 'enabled',
        itemType: 'select',
        label: '启用/禁用:',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 'Y'
          },
          {
            label: '禁用',
            value: 'N'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'ids',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'category.name',
        label: '成份大类',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.category.name
        }
      },
      {
        prop: 'classifications.name',
        label: '成份分类',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.classifications.name
        }
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
        prop: 'typical.describe',
        label: '纤维类型',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.typical.describe
        }
      },
      {
        prop: 'abbr',
        label: '简称',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'lessHeavy',
        label: '欠重',
        showOverflowTooltip: true,
        minWidth: '80',
        formater: scope => {
          return scope.row.lessHeavy + '%'
        }
      },
      {
        prop: 'wastageCategory',
        label: '损耗分类',
        showOverflowTooltip: true,
        minWidth: '80',
        formater: scope => {
          return scope.row.wastageCategory ? scope.row.wastageCategory.name : ''
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
        minWidth: '120',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:ingredients:enabled',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'ids',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'pid',
        itemType: 'select',
        filterable: true,
        label: '成份大类',
        placeholder: '请选择',
        rules: [commonChangeReg],
        dataSource: [],
        clearable: true,
        visibleChange: (value) => {
          if (value) {
            this.getOption()
          }
        }
      },
      {
        prop: 'cid',
        itemType: 'select',
        filterable: true,
        label: '成份分类',
        placeholder: '请选择',
        rules: [commonChangeReg],
        dataSource: [],
        clearable: true,
        visibleChange: (value) => {
          if (value) {
            this.getCidOption()
          }
        }
      },
      {
        itemType: 'input',
        prop: 'name',
        label: '中文名',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 20 个字符以内', trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'nameEn',
        label: '英文名',
        maxlength: 30,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 30 个字符以内', trigger: ['blur'] }]
      },
      {
        prop: 'typical',
        itemType: 'radio-group',
        type: 'radio',
        label: '纤维类型',
        rules: [commonBlurReg],
        dataSource: [
          {
            label: '短纤',
            value: 'S'
          },
          {
            label: '长丝',
            value: 'L'
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'abbr',
        label: '简称',
        trim: ruleTrim,
        maxlength: 2,
        clearable: true,
        rules: [commonBlurReg, { validator: checkData, message: '简称必须为两个大写字母', trigger: ['change'] }],
        placeholder: '请输入两位大写字母'
      },
      {
        itemType: 'input',
        prop: 'lessHeavy',
        label: '欠重',
        maxlength: 3,
        clearable: true,
        rules: [commonBlurReg, { validator: qzcheckData, trigger: ['change'] }]
      },
      {
        prop: 'wastageCategoryUuid',
        itemType: 'select',
        filterable: true,
        label: '损耗分类',
        clearable: true,
        placeholder: '请选择',
        rules: [commonBlurReg, { required: true, message: '请选择损耗分类' }],
        dataSource: [],
        disabled: false,
        change: (value) => {
          this.setFormDatas({ wastageCategoryUuid: value })
        },
        visibleChange: (value) => {
          if (value) {
            this.getWastageCategory()
          }
        }
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
        permitTag: ['basic:ingredients:approve'],
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
        permitTag: ['basic:ingredients:update'],
        isShow: true,
        handle: async scope => {
          this.pidData = '' + scope.row.category.id
          this.cidData = '' + scope.row.classifications.id
          if (scope.row.status.code === 'P') {
            this.$set(this.copyContent[1], 'disabled', true)
            this.$set(this.copyContent[2], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', true)
            this.$set(this.copyContent[4], 'disabled', true)
            this.$set(this.copyContent[5], 'disabled', true)
            this.$set(this.copyContent[6], 'disabled', true)
          } else {
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
            this.$set(this.copyContent[4], 'disabled', false)
            this.$set(this.copyContent[5], 'disabled', false)
            this.$set(this.copyContent[6], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑成份')
          this.getCidOption()
          this.getOption()
          await this.editList({ id: scope.row.id }, scope.row.ids)
          this.getWastageCategory()
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:ingredients:destroy'],
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
        this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑成份',
      ok: params => {
        this.addOrEdit(params)
      },
      okText: '保存',
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
      pidData: '', // 成份大类
      cidData: '', // 成份分类
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        enabled: ''
      },
      searchData,
      columns,
      copyContent,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      visible: false,
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  mounted() {
  },
  methods: {
    // 详情页面--损耗分类
    async getWastageCategory(data = {}) {
      const res = await wastageCategory(data)
      if (res.code !== 200) {
        return false
      }
      console.log(this.oldForm.wastageCategoryUuid, 'this.oldForm.wastageCategoryUuid-')
      const datas = filterOptions(this.oldForm.wastageCategoryUuid, res.data, this.type, { id: 'uuid' }).map((item, index) => {
        item.label = item.name
        item.value = item.uuid
        item.disabled = item.enabled !== 'Y'
        return item
      })
      console.log(datas, 'datas')
      this.$set(this.copyContent[8], 'dataSource', datas)
    },
    // 点击打开新增窗口
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增成份')
      this.getWastageCategory()
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.copyContent[4], 'disabled', false)
      this.$set(this.copyContent[5], 'disabled', false)
      this.$set(this.copyContent[6], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 判断走新增还是编辑
    addOrEdit(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['pid', 'cid', 'name', 'nameEn', 'typical', 'abbr', 'lessHeavy', 'wastageCategoryUuid', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') { // 走编辑接口
        delete params.category
        delete params.classifications
        delete params.createdTime
        delete params.enabled
        delete params.status
        delete params.updatedTime
        const obj = {}
        const pamraskey = ['id', 'pid', 'cid', 'name', 'nameEn', 'typical', 'abbr', 'lessHeavy', 'wastageCategoryUuid', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 成分搜索
    async getRulePage(data = {}) {
      const res = await componentList({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.ids = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize,
        page: res.data.page
      }
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await componentAdd(data)
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
    // 编辑获取详情
    async editList(data = {}, code) {
      const res = await componentDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      res.data.pid = res.data.category.id
      res.data.cid = res.data.classifications.id
      res.data.typical = res.data.typical.code
      // res.data.lessHeavy = res.data.lessHeavy.replace('%', '')
      res.data.wastageCategoryUuid = res.data.wastageCategory && res.data.wastageCategory.uuid || ''
      const editData = res.data || {}
      this.oldForm = { ...editData, ids: code }
      this.setFormDatas({ ...editData, ids: code })
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
      const res = await componentUpdate(data)
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
      const res = await componentApprove({ id: id })
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
      const res = await componentDelete({ id: id })
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
      const res = await componentEnabled(data).catch(() => {
        scope.row.enabled.code = scope.row.enabled.code === 'Y' ? 'N' : 'Y'
      })
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
    // 成分大类下拉
    async getOption(data = {}) {
      const res = await componentSelect(data)
      if (res.code !== 200) {
        return false
      }
      const dataCopy = filterOptions(this.pidData, res.data, this.type)
      dataCopy.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.copyContent[1], 'dataSource', dataCopy)
    },
    // 成分分类下拉
    async getCidOption(data = {}) {
      const res = await classifySelect(data)
      if (res.code !== 200) {
        return false
      }
      const dataCopy = filterOptions(this.cidData, res.data, this.type)
      dataCopy.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.copyContent[2], 'dataSource', dataCopy)
    }
  }
}
</script>
<style lang="scss">
.componentPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
