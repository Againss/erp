<!--
  @Description 纱成本-染纱
-->

<template>
  <div class="app-container">
    <div class="t-tab-container tab-wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane v-if="$permission(['basic:requirementsPrinting:index'])" label="短纤" name="shortFiber"> -->
        <el-tab-pane label="短纤" name="S" />
        <el-tab-pane label="长丝" name="F" />
      </el-tabs>
    </div>
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchDataCopy"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['price:dyedYarnInfo:add']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addFn"
      >新增</el-button>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        table-scrollx
        tooltip-effect="dark"
        :columns="columnsCopy"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  getSearchSelect,
  getLongPage,
  deleteLong,
  editLong,
  enabledLong,
  addLong,
  getLongDetail
} from './api/index.js'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import { getSelectData, getChengFen, getRanSha, getDengJi } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/,
      message: '输入3位整数或保留1到2位小数',
      trigger: ['blur']
    })
    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'yarnsBranch',
        itemType: 'select',
        label: '纱支:',
        placeholder: '请选择纱支',
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'composition',
        itemType: 'select',
        label: '成分/组合成份:',
        valueType: 'object',
        rules: [commonBlurReg],
        placeholder: '请选择成分/组合成份',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'dyedYarnColor',
        itemType: 'select',
        label: '染纱颜色:',
        placeholder: '请选择染纱颜色',
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'fabricGrade',
        itemType: 'select',
        label: '布类等级:',
        placeholder: '请选择布类等级',
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'dyedYarnPrice',
        itemType: 'input',
        label: '染纱价格:',
        placeholder: '请输入染纱价格',
        rules: [commonBlurReg, max999Reg]
      }
    ]
    // 查询表单配置信息
    const searchData = [
      {
        prop: 'yarnsBranch',
        itemType: 'select',
        label: '纱支:',
        valueType: 'object',
        placeholder: '请选择纱支',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'fineness',
        itemType: 'select',
        label: '细度:',
        valueType: 'object',
        placeholder: '请选择细度',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'composition',
        itemType: 'select',
        label: '成分/组合成份:',
        valueType: 'object',
        placeholder: '请选择成分/组合成份',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'dyedYarnColor',
        itemType: 'select',
        label: '染纱颜色:',
        valueType: 'object',
        placeholder: '请选择染纱颜色',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'fabricGrade',
        itemType: 'select',
        label: '布类等级:',
        valueType: 'object',
        placeholder: '请选择布类等级',
        filterable: true,
        dataSource: []
      },
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
          this.getLongPageFn(params, true)
        },
        resetHandle: () => {
          this.searchFormDatas = {
            status: ''
          }
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
        prop: 'yarnsBranchName',
        label: '纱支',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'finenessName',
        label: '细度',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
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
          permitTag: 'price:dyedYarnInfo:status',
          changeStatus: scope => {
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
        permitTag: ['price:dyedYarnInfo:modify'],
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:dyedYarnInfo:delete'],
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
        this.getLongPageFn({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getLongPageFn({
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
      ok: params => {
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
      activeName: 'S',
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {
        status: ''
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      oldForm: {}
    }
  },
  computed: {
    columnsCopy() {
      const columns = [...this.columns]
      if (this.activeName === 'S') {
        columns.splice(2, 1)
      } else {
        columns.splice(1, 1)
      }
      return columns
    },
    // popOptionsCopy() {
    //   const popOptions = JSON.parse(JSON.stringify(this.popOptions))
    //   if (this.activeName === 'S') {
    //     popOptions.content.splice(1, 1)
    //   } else {
    //     popOptions.content.splice(0, 1)
    //   }
    //   return {
    //     ...popOptions,
    //     ok: params => {
    //       this.addOrEdit(params, true)
    //     },
    //     cancel: params => {
    //       this.PopDialogHandle()
    //     }
    //   }
    // },
    searchDataCopy() {
      const searchData = [...this.searchData]
      if (this.activeName === 'S') {
        searchData.splice(1, 1)
      } else {
        searchData.splice(0, 1)
      }
      return searchData
    }
  },
  mounted() {
    this.getLongPageFn()
  },
  methods: {
    async editFn(id) {
      const data = (await getLongDetail({ id })).data || {}
      this.oldForm = data
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      this.$set(this.popOptions, 'saveAndadd', undefined)
      this.PopDialogHandle('编辑' + (this.activeName === 'S' ? '短纤' : '长丝'))
    },
    // 点击tab
    handleClick() {
      this.searchFormDatas = { status: '' }
      const item = {
        prop: 'fineness',
        itemType: 'select',
        label: '细度:',
        placeholder: '请选择',
        valueType: 'object',
        filterable: true,
        rules: [this.$getRules({ trigger: ['blur'] })],
        dataSource: []
      }
      if (this.activeName === 'S') {
        this.$set(this.popOptions.content, 0, { ...item, prop: 'yarnsBranch', label: '纱支:' })
      } else {
        this.$set(this.popOptions.content, 0, { ...item })
      }
      this.getLongPageFn()
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
      this.PopDialogHandle('新增' + (this.activeName === 'S' ? '短纤' : '长丝'))
    },
    // 获取数据
    async getLongPageFn(data = {}, isSearch) {
      const res = await getLongPage({ ...this.searchFormDatas, ...data, dyedYarnType: this.activeName })
      this.dataSource = res.data && res.data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data && res.data.total || 0,
        ...data,
        currentPage: res.data && res.data.pageNum || 1,
        pageSize: res.data && res.data.pageSize || 20
      }
      if (!isSearch) {
        this.setSearchSelect()
      }
    },
    // 获取搜索栏下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect({ dyedYarnType: this.activeName })).data || {}
      // debugger
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          // this.$set(this.searchData[i], 'dataSource', res[ele.prop].filter(e => JSON.stringify(e) !== JSON.stringify({})) || [])
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 启用/禁用
    async enableStatus(data, scope) {
      await enabledLong({
        ...data,
        dyedYarnType: this.activeName
      }).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyedYarnInfo/status'), { ...data, dyedYarnType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染纱'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: { ...data, dyedYarnType: this.activeName }}))
    },
    // 新增或者修改
    addOrEdit(params, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await addLong({ ...params, dyedYarnType: this.activeName })
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/dyedYarnInfo/add'), { ...params, dyedYarnType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染纱,新增一条记录`, beforeCode: { ...params, dyedYarnType: this.activeName }}))
          } else if (this.type === 'edit') {
            await editLong({ ...params, dyedYarnType: this.activeName })
            const { beforeCode, afterCode } = this.compareData(this.oldForm, { ...params, dyedYarnType: this.activeName }, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyedYarnInfo/modify'), { ...params, dyedYarnType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染纱,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$message.success('保存成功')
          this.$set(this.popOptions, 'formDatas', {})
          this.getLongPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 删除
    async deleteFn(data = {}) {
      await deleteLong({ ...data, dyedYarnType: this.activeName })
      this.$message.success('删除成功')
      this.getLongPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/dyedYarnInfo/delete'), { ...data, dyedYarnType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染纱'删除一条记录`, beforeCode: { ...data, dyedYarnType: this.activeName }}))
    },
    // 设置弹框下拉数据getSelectData, 0, { categoryId: 12 }
    setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const arr = [
        [getSelectData, 0, { categoryId: 9 }],
        [getChengFen, 1],
        [getRanSha, 2],
        [getDengJi, 3]
      ]
      arr[0][2].categoryId = this.activeName === 'S' ? 9 : 12
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

<style lang="scss" scoped>
  .app-container {
    padding: 20px;
    padding-bottom: 0;
  }
  .tab-wrap {
    position: relative;
    /deep/.el-tabs__nav-wrap {
      padding-left: 20px;
      background: #fff;
      &::after {
        height: 1px;
      }
    }
    /deep/ .el-tabs__header {
      margin-bottom: 1px;
    }
    /deep/ .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
  }
</style>
