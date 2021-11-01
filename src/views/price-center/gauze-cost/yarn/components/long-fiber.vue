<!--
  @Description 长丝
-->
<template>
  <div class="app-container pl-0">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOptions" :form-datas="searchFormDatas" />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['price:yarn:add']"
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
  getSearchSelectLong,
  getLongPage,
  deleteLong,
  editLong,
  enabledLong,
  addLong,
  getLongDetail
} from '../api/index.js'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import { getSelectData, getChengFen, getYarnBrand } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'LongFiber',
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
        prop: 'fineness',
        itemType: 'select',
        label: '细度:',
        valueType: 'object',
        placeholder: '请选择细度',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'composition',
        itemType: 'select',
        label: '成分/组合成份:',
        rules: [commonBlurReg],
        valueType: 'object',
        placeholder: '请选择成分/组合成份',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'gloss',
        itemType: 'select',
        label: '光泽度:',
        valueType: 'object',
        placeholder: '请选择光泽度',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'function',
        itemType: 'select',
        label: '功能:',
        valueType: 'object',
        placeholder: '请选择功能',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'goods',
        itemType: 'select',
        label: '丝类:',
        valueType: 'object',
        placeholder: '请选择丝类',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'color',
        itemType: 'select',
        label: '颜色:',
        valueType: 'object',
        placeholder: '请选择颜色',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'yarnBrand',
        itemType: 'select',
        label: '品牌:',
        valueType: 'object',
        placeholder: '请选择品牌',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'yarnPrice',
        itemType: 'input',
        label: '纱价格:',
        placeholder: '请输入纱价格',
        rules: [commonBlurReg, max999Reg]
      }
    ]
    // 查询表单配置信息
    const searchData = [
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
        prop: 'gloss',
        itemType: 'select',
        label: '光泽度:',
        valueType: 'object',
        placeholder: '请选择光泽度',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'function',
        itemType: 'select',
        label: '功能:',
        valueType: 'object',
        placeholder: '请选择功能',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'goods',
        itemType: 'select',
        label: '丝类:',
        valueType: 'object',
        placeholder: '请选择丝类',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'color',
        itemType: 'select',
        label: '颜色:',
        valueType: 'object',
        placeholder: '请选择颜色',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'yarnBrand',
        itemType: 'select',
        label: '品牌:',
        valueType: 'object',
        placeholder: '请选择品牌',
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
        prop: 'glossName',
        label: '光泽度',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'functionName',
        label: '功能',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'goodsName',
        label: '丝类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'colorName',
        label: '颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnBrandName',
        label: '品牌',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnPrice',
        label: '纱价格',
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
          permitTag: 'price:yarn:status',
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
        permitTag: ['price:yarn:modify'],
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:yarn:delete'],
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
          pageNmu: this.pagination.pageNum || 1,
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
      oldForm: {} // 旧详情数据
    }
  },
  created() {
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
      this.PopDialogHandle('编辑长丝')
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
      this.$nextTick(() => {
        this.$refs.popForm.$refs.popComponents.form.clearValidate()
      })
      this.PopDialogHandle('新增长丝')
    },
    // 获取数据
    async getLongPageFn(data = {}, isSearch) {
      const res = await getLongPage({ ...this.searchFormDatas, ...data })
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
      const res = (await getSearchSelectLong()).data || {}
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop].filter(e => JSON.stringify(e) !== JSON.stringify({})) || [])
        }
      })
      console.log(this.searchData)
    },
    // 启用/禁用
    async enableStatus(data, scope) {
      await enabledLong(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/filamentInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 新增或者修改印花
    addOrEdit(params, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await addLong(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/filamentInfo/add'), params, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            await editLong(params)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, params, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/filamentInfo/modify'), params, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$message.success('保存成功')
          this.getLongPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
          this.$set(this.popOptions, 'formDatas', {})
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 删除
    async deleteFn(data = {}) {
      await deleteLong(data)
      this.$message.success('删除成功')
      this.getLongPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/filamentInfo/delete'), data, JSON.stringify({ beforeText: `在'价格中心-纱成本-纱线'删除一条记录`, beforeCode: data }))
    },
    // 设置弹框下拉数据
    setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const arr = [
        [getSelectData, 0, { categoryId: 12 }],
        [getChengFen, 1],
        [getSelectData, 2, { categoryId: 5 }],
        [getSelectData, 3, { categoryId: 14 }],
        [getSelectData, 4, { categoryId: 4 }],
        [getSelectData, 5, { categoryId: 18 }],
        [getYarnBrand, 6, { status: '1' }]
      ]
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
  .pl-0 {
    padding: 0 !important;
  }
</style>
