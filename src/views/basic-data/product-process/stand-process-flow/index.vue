<!--
 * @Author: Sanmao
 * @Date: 2021-05-21 10:20:57
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-08 16:06:12
 * @Descripttion: 通用基础数据-生产工艺-标准工序流程
-->
<template>
  <div class="product-list-content stand-process-flow">
    <!-- 搜索 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="{ size: 'small', inline: true }"
      />
    </div>

    <div class="button">
      <el-button
        v-permission="['basic:standardProcessFlow:store']"
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
        :table-scrollx="true"
        :pagination="pagination"
        tooltip-effect="dark"
        edit-type="pop"
        lazy
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="customPop" :options="popOptions" />
    </div>
  </div>
</template>
<script>
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import {
  standProcessFlowList,
  standProcessFlowAdd,
  standProcessFlowEdit,
  standProcessFlowUpdate,
  standProcessFlowDelete,
  standProcessFlowApprove,
  standProcessFlowEnabled,
  selectData } from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
export default {
  name: 'StandProcessFlow',
  data() {
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'flowCode',
        itemType: 'input',
        label: '流程编码:',
        clearable: true
      }, {
        prop: 'dyeTypeName',
        itemType: 'input',
        label: '染整类型:',
        clearable: true
      }, {
        prop: 'dyeIngredientName',
        itemType: 'input',
        label: '染色成份:',
        clearable: true
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
          this.getPageData(params)
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
        prop: 'id',
        label: '#',
        minWidth: '50'
      },
      {
        prop: 'flowCode',
        label: '流程编码',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'dyeType.name',
        label: '染整类型',
        showOverflowTooltip: true,
        minWidth: '80',
        formater: scope => {
          return scope.row.dyeType && scope.row.dyeType.name ? scope.row.dyeType.name : ''
        }
      },
      // {
      //   prop: 'names',
      //   label: '染色成份',
      //   showOverflowTooltip: true,
      //   minWidth: '120',
      //   formater: scope => {
      //     const nameArr = []
      //     if (scope.row.dyeIngredient && scope.row.dyeIngredient.length) {
      //       scope.row.dyeIngredient.forEach(item => {
      //         item.name && nameArr.push(item.name)
      //       })
      //     }
      //     return nameArr.join(',')
      //   }
      // },
      {
        prop: 'combination.name',
        label: '染整工艺组合',
        showOverflowTooltip: true,
        minWidth: '120',
        formater: scope => {
          return scope.row.combination && scope.row.combination.name ? scope.row.combination.name : ''
        }
      },
      {
        prop: 'typical.describe',
        label: '工序流程',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          const nameArr = []
          if (scope.row.processFlow && scope.row.processFlow.length) {
            scope.row.processFlow.forEach(item => {
              item.name && nameArr.push(item.name)
            })
          }
          return nameArr.join(' —> ')
        }
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'updator',
        label: '操作人',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.updatedBy
            ? scope.row.updatedBy.name
              ? scope.row.updatedBy.name + '/' + scope.row.updatedBy.realName
              : scope.row.updatedBy.realName
            : scope.row.createdBy
              ? scope.row.createdBy.name
                ? scope.row.createdBy.name + '/' + scope.row.createdBy.realName
                : scope.row.createdBy.realName
              : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'operatedTime',
        label: '操作时间',
        minWidth: '140',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.updatedTime || scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'status.code',
        label: '启用/禁用',
        minWidth: '120',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:standardProcessFlow:enabled',
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
        prop: 'id',
        itemType: 'input',
        label: '序号',
        disabled: true,
        placeholder: '保存后自动生成'
      },
      {
        prop: 'flowCode',
        itemType: 'input',
        label: '流程编码',
        disabled: true,
        placeholder: '保存后自动生成'
      },
      {
        prop: 'dyeTypeUuid',
        itemType: 'select',
        label: '染整类型',
        placeholder: '请选择染整类型',
        clearable: true,
        filterable: true,
        valueKey: 'name',
        rules: [{ required: true, message: '请选择染整类型', trigger: 'change' }],
        dataSource: [],
        visibleChange: (value) => {
          if (value && this.type === 'add') {
            this.getSelectData(2)
          }
        }
        // change: (uuid) => {
        //   console.log(uuid)
        //   this.$refs.customPop.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
        //     { dyeTypeUuid: uuid }
        //   )
        // }
      },
      // {
      //   prop: 'dyeIngredient',
      //   itemType: 'select',
      //   label: '染色成份',
      //   placeholder: '请选择染色成份',
      //   multiple: true,
      //   filterable: true,
      //   clearable: true,
      //   valueKey: 'uuid',
      //   valueType: 'object',
      //   rules: [{ required: true, message: '请选择染色成份', trigger: 'change' }],
      //   dataSource: [],
      //   visibleChange: (value) => {
      //     if (value && this.type === 'add') {
      //       this.getSelectData(3)
      //     }
      //   }
      // },
      {
        prop: 'combinationUuid',
        itemType: 'select',
        label: '染整工艺组合',
        placeholder: '请选择染整工艺组合',
        popperClass: 'craft-search', // 自定义类名
        clearable: true,
        filterable: true,
        rules: [{ required: true, message: '请选择染整工艺组合', trigger: 'change' }],
        dataSource: [],
        visibleChange: (value) => {
          if (value && this.type === 'add') {
            this.getSelectData(3)
          }
        },
        renderOptions: (row) => {
          return `<span title="${row.name}">${row.name}</h1>`
        }
      },
      {
        prop: 'processFlow',
        itemType: 'select',
        label: '工艺流程',
        filterable: true,
        placeholder: '请选择工艺流程',
        multiple: true,
        clearable: true,
        drag: true,
        valueKey: 'uuid',
        valueType: 'object',
        className: 'name-select',
        rules: [{ required: true, message: '请选择工艺流程', trigger: 'change' }],
        dataSource: [],
        visibleChange: (value) => {
          if (value && this.type === 'add') {
            this.getSelectData(4)
          }
        }
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
    const copyContent = [
      ...commonContent
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:standardProcessFlow:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.approveData(scope.row.id)
            })
            .catch(() => {})
        }
      },
      {
        label: '编辑',
        permitTag: ['basic:standardProcessFlow:update'],
        isShow: true,
        handle: async scope => {
          this.idsData = scope.row.ids
          if (scope.row.status.code === 'P') {
            this.$set(this.copyContent[2], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', true)
            this.$set(this.copyContent[4], 'disabled', true)
          } else {
            this.$set(this.copyContent[2], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
            this.$set(this.copyContent[4], 'disabled', false)
          }
          this.getSelectData(2)
          this.getSelectData(3)
          this.getSelectData(4)
          // this.getSelectData(5)
          this.type = 'edit'
          this.$set(this.popOptions, 'content', copyContent)
          await this.editList({ id: scope.row.id }, scope.row.code)
          this.popDialogHandle('编辑标准工序流程')
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:standardProcessFlow:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
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
            .catch(() => {})
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getPageData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getPageData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增标准工艺流程',
      ok: params => {
        this.$confirm('确定保存当前数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.addOrEdit(params)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
      },
      okText: '保存',
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.compaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.compaCallback(flag)
      },
      formDatas: {
        dyeIngredient: [],
        processFlow: []
      },
      formOptions: {

      },
      content: copyContent
    }
    return {
      searchData,
      columns,
      dataSource: [],
      popOperates,
      pagination,
      popOptions,
      copyContent,
      type: 'add',
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getPageData()
  },
  methods: {
    // 获取列表数据
    async getPageData(data = {}) {
      const res = await standProcessFlowList({ ...this.searchFormDatas, ...data })
      // res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
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
    // 点击打开新增窗口
    addList() {
      this.type = 'add'
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.copyContent[4], 'disabled', false)
      this.oldForm = this.copyContent.formDatas || {}
      this.popDialogHandle('新增标准工序流程')
    },
    // 设置新增编辑窗口
    popDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 页面启用/禁用
    async changeEnable(data = {}, scope) {
      const res = await standProcessFlowEnabled(data).catch(() => {
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
    // 根据id获取详情
    async editList(data = {}, code) {
      const res = await standProcessFlowEdit(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.oldForm = { ...editData }
      this.setFormDatas({ ...editData })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 弹框取消数据比较回调
    compaCallback(hadInput) {
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
      const res = await standProcessFlowUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getPageData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核
    async approveData(id) {
      const res = await standProcessFlowApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getPageData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteData(id) {
      const res = await standProcessFlowDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getPageData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 判断走新增还是编辑
    addOrEdit(params) {
      const obj = {}
      if (this.type === 'add') {
        const pamraskey = ['remark', 'combinationUuid', 'dyeIngredient', 'dyeTypeUuid', 'processFlow']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(params)
      } else if (this.type === 'edit') { // 走编辑接口
        const pamraskey = ['id', 'remark', 'combinationUuid', 'dyeIngredient', 'dyeTypeUuid', 'processFlow']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await standProcessFlowAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getPageData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 获取染整类型下拉数据
    async getSelectData(index) {
      let selectUrl = ''
      switch (index) {
        case 2:
          // 染整类型
          selectUrl = '/basis/api/printingDyeingType/option'
          break
        // case 3:
        //   // 染色成份
        //   selectUrl = '/basis/api/dyeIngredient/option'
        //   break
        case 3:
          // 染整工艺组合
          selectUrl = '/basis/api/requirementsCombination/option'
          break
        default:
          // 工序流程
          selectUrl = '/basis/api/processFlow/option'
      }
      const res = await selectData(selectUrl, { enabled: 'Y' })
      if (res.code !== 200) {
        return false
      }
      let data = []
      if (res && res.data.length) {
        data = res.data.map((item) => {
          item.label = item.name
          item.value = item.uuid
          return item
        })
      }
      // console.log(index, '-----------2染整类型, 3染整工艺, 4工序', data)
      this.$set(this.copyContent[index], 'dataSource', data)
    }

  }
}
</script>
<style lang="scss" scoped>
  .stand-process-flow {
    .pop /deep/ .name-select .el-select__tags span {
      cursor: pointer;
    }
  }
</style>
<style lang="scss">
  body{
    .craft-search{
      max-width: 400px;
    }
  }
</style>
