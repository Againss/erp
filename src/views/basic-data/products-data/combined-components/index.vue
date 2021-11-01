<!--
 * @Author: Do not edit
 * @Date: 2020-10-13 09:13:35
 * @LastEditTime: 2021-05-10 18:27:17
 * @LastEditors: Againss
 **  组合成分页面
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
    <div class="button">
      <el-button
        v-permission="['basic:assemblyIngredients:store']"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addList"
      >新增</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
        tooltip-effect="dark"
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
import { combinedList, combinedAdd, combinedEdit, combinedUpdate, combinedDelete, combinedApprove, combinedEnabled, combinedSelect, wastageCategory } from './api/index.js'
import { dataComparision, filterOptions } from '@/views/basic-data/common/index'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
export default {
  name: 'CombinedComponent',
  components: {},
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 验证组合
    const lengthData = (rule, value, callback) => {
      if (value && value.length < 2 || value && value.length > 10) {
        callback(new Error('中文组合请选择 2-10 个单元组合'))
      } else {
        callback()
      }
    }
    // 验证大写
    const checkData = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('简称必须为两位字母'))
      } else {
        callback()
      }
    }

    const qzcheckData = (rule, value, callback) => {
      const re = /^\d(\.\d)?$/
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
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '中文名/英文名'
      },
      {
        prop: 'names',
        itemType: 'input',
        label: '组合:',
        placeholder: '中文名组合/英文名组合'
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
        prop: 'code',
        label: '序号',
        minWidth: '50'
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
        prop: 'names',
        label: '中文组合',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'namesEn',
        label: '英文组合',
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
          return scope.row.wastageCategory.name
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
          permitTag: 'basic:assemblyIngredients:enabled',
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
          return scope.row.status
            ? scope.row.status.describe === '已审核'
              ? `<span style="color:#00BCC5;">${scope.row.status && scope.row.status.describe
              }</span>`
              : `<span style="color:#FF9B02">${scope.row.status && scope.row.status.describe
              }</span>`
            : ''
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
        prop: 'names',
        itemType: 'select',
        label: '中文组合',
        placeholder: '请选择',
        multiple: true,
        filterable: true,
        clearable: true,
        rules: [commonBlurReg, { validator: lengthData, required: true, message: '中文组合请选择 2-10 个单元组合' }],
        dataSource: [],
        change: (value) => {
          this.getName(value)
        },
        visibleChange: (value) => {
          if (value) {
            this.getOption()
          }
        }
      },
      {
        prop: 'namesEn',
        itemType: 'select',
        filterable: true,
        label: '英文组合',
        clearable: true,
        placeholder: '请选择',
        rules: [commonBlurReg, { required: true, message: '请选择英文组合方式' }],
        dataSource: [],
        disabled: true
      },
      {
        itemType: 'input',
        prop: 'name',
        label: '中文名',
        maxlength: 512,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 512 个字符以内', trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'nameEn',
        label: '英文名',
        maxlength: 512,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 512 个字符以内', trigger: ['blur'] }]
      },
      {
        prop: 'typical',
        itemType: 'select',
        type: 'radio',
        label: '纤维类型',
        clearable: true,
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
        permitTag: ['basic:assemblyIngredients:approve'],
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
        permitTag: ['basic:assemblyIngredients:update'],
        isShow: true,
        handle: async scope => {
          this.idsData = scope.row.ids
          if (scope.row.status.code === 'P') {
            this.$set(this.copyContent[1], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', true)
            this.$set(this.copyContent[4], 'disabled', true)
            this.$set(this.copyContent[5], 'disabled', true)
            this.$set(this.copyContent[6], 'disabled', true)
          } else {
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
            this.$set(this.copyContent[4], 'disabled', false)
            this.$set(this.copyContent[5], 'disabled', false)
            this.$set(this.copyContent[6], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑组合成份')
          this.getOption()
          await this.editList({ id: scope.row.id }, scope.row.code)
          this.getWastageCategory()
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:assemblyIngredients:destroy'],
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
      title: '新增组合成份',
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
      idsData: [], // 接收数组
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
      namesEn: '',
      dataOption: [],
      copyName: [],
      copyData: [],
      nameInput: false,
      namingInput: false,
      nameOption: '',
      oldForm: {} // 旧详情数据
    }
  },
  created() { },
  mounted() {
    this.getRulePage()
    this.getOption()
    this.getWastageCategory()
  },
  methods: {
    // 点击打开新增窗口
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增组合成份')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[1], 'disabled', false)
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
        // 把拿到得中文组合字符串在新增时赋值给names
        params.names = this.copyData
        params.names = params.names.join('/')
        const obj = {}
        const pamraskey = ['ids', 'names', 'namesEn', 'name', 'nameEn', 'typical', 'abbr', 'remark', 'wastageCategoryUuid', 'lessHeavy']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') { // 走编辑接口
        const newName = []
        params.ids.forEach(item => {
          this.copyName.forEach(row => {
            if (item === row.value) {
              newName.push(row.label)
            }
          })
        })
        params.names = newName.join('/')
        const obj = {}
        const pamraskey = ['id', 'ids', 'names', 'namesEn', 'name', 'nameEn', 'typical', 'abbr', 'remark', 'wastageCategoryUuid', 'lessHeavy']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
        this.nameInput = false
      }
    },
    // 组合成分列表
    async getRulePage(data = {}) {
      const res = await combinedList({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
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
      const res = await combinedAdd(data)
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
    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await combinedEdit(data)
      if (!res || res.code !== 200) {
        return false
      }
      res.data.typical = res.data.typical.code
      res.data.names = res.data.ids
      // res.data.lessHeavy = res.data.lessHeavy.replace('%', '')
      res.data.wastageCategoryUuid = res.data.wastageCategory && res.data.wastageCategory.uuid || ''
      console.log(res.data)
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
      const res = await combinedUpdate(data)
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
      const res = await combinedApprove({ id: id })
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
      const res = await combinedDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 页面启用/禁用
    async changeEnable(data = {}, scope) {
      const res = await combinedEnabled(data).catch(() => {
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
    // 详情页面--中文组合下拉
    async getOption(data = {}) {
      const res = await combinedSelect(data)
      if (res.code !== 200) {
        return false
      }
      this.dataOption = filterOptions(this.idsData, res.data, this.type)
      // this.dataOption = res.data
      this.copyName = res.data
      this.dataOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })

      this.$set(this.copyContent[1], 'dataSource', this.dataOption)
    },
    // 详情页面--损耗分类
    async getWastageCategory(data = {}) {
      const res = await wastageCategory(data)
      if (res.code !== 200) {
        return false
      }
      const datas = filterOptions(this.oldForm.wastageCategoryUuid, res.data, this.type, { id: 'uuid' }).map((item, index) => {
        item.label = item.name
        item.value = item.uuid
        item.disabled = item.enabled !== 'Y'
        return item
      })

      this.$set(this.copyContent[8], 'dataSource', datas)
    },
    // 获取中文名和英文组合、英文名
    getName(data) {
      const choiceArr = data; const listArr = [...this.dataOption]
      const nameData = [] // 中文名
      const nameEnData = [] // 英文组合、英文名
      for (const i in choiceArr) {
        for (const j in listArr) {
          if (choiceArr[i] === listArr[j].id) {
            nameEnData.push(listArr[j].nameEn)
            nameData.push(listArr[j].name)
            // this.copyData.push(listArr[j].name)
          }
        }
      }
      this.copyData = [...nameData]

      this.setFormDatas({ ids: data })
      this.setFormDatas({ name: nameData.join('/') })
      this.setFormDatas({ nameEn: nameEnData.join('/') })
      this.setFormDatas({ namesEn: nameEnData.join('/') })
    }
  }
}
</script>
<style lang='scss' scoped>
.componentPage {
  padding: 20px;
  padding-bottom: 0px;
}
</style>
<style lang="scss">
.componentPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
