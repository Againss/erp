<template>
  <div class="paymentPage tab-wrap">
    <el-tabs v-model="techType" @tab-click="tabHandleClick">
      <el-tab-pane label="主要" name="M" />
      <el-tab-pane label="次要" name="S" />
    </el-tabs>
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:printingTechInfo:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
    </div>

    <!-- table表格 -->
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
  printingProcessInfoPage,
  printingProcessInfoAdd,
  printingProcessInfoDetail,
  printingProcessInfoModify,
  printingProcessInfoDelete,
  printingProcessInfoEnabled,
  getSearchSelect
} from './api/index.js'
import { requirementsPrinting } from '@/views/price-center/common/basisApi'
import enableSwitch from '../../components/enableSwitch'
import { fetchLog } from '@/views/price-center/common/fetchLog'
// import { compareValues } from '@/views/price-center/common/index'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // 正整数
    const numberBlurReg = this.$getRules({
      type: 'number', pattern: /^[1-9]\d{0,2}?$/,
      message: '正整数最多3位', trigger: ['blur']
    })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    const max100Reg = this.$getRules({
      type: 'number', pattern: /^(\d{1,2}(\.[0-9]{1,2})?)$|^100$/,
      message: '请输入100以内，最多可保留2位小数', trigger: ['blur']
    })
    const printingType = { M: '主要', S: '次要' }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'printing',
        itemType: 'select',
        label: '印花工艺:',
        dataSource: [],
        valueType: 'object',
        filterable: true
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '启用/禁用:',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: '1'
          },
          {
            label: '禁用',
            value: '0'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const enabled = params.enabled && params.enabled === '' ? null : params.enabled
          this.formDatas = { ...params, enabled }

          this.getRulePage({ ...params, enabled })
        },
        resetHandle: (params) => {
          this.formDatas = {}
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
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minPrintingareaPct',
        label: '印花面积百分比区间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => (scope.row.minPrintingareaPct !== null ? scope.row.minPrintingareaPct + '%' : '') +
          (scope.row.maxPrintingareaPct !== null && scope.row.minPrintingareaPct !== null ? '~' : '') + (scope.row.maxPrintingareaPct !== null ? scope.row.maxPrintingareaPct + '%' : '')
      },
      {
        prop: 'minPrintingNumber',
        label: '印花颜色数量区间（个）',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => (scope.row.minPrintingNumber || '') +
          (scope.row.maxPrintingNumber && scope.row.minPrintingNumber ? '~' : '') + (scope.row.maxPrintingNumber || '')
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.createdTime) {
            return this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}')
          }
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
        label: '启用/禁用',
        width: '100',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:printingTechInfo:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    const commont = [
      {
        prop: 'printing',
        itemType: 'select',
        label: '印花工艺',
        dataSource: [],
        valueType: 'object',
        labelWidth: '125px',
        rules: [commonBlurReg],
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'minPrintingareaPct',
        label: '印花面积区间',
        maxlength: 5,
        clearable: true,
        itemStyle: { width: '57%', display: 'inline-block' },
        labelWidth: '125px',
        placeholder: '请输入',
        rules: [max100Reg],
        blur: (scope, form, formDatas, setDatas) => {
          const maxWeight = formDatas.maxWeight ? formDatas.maxWeight * 1 : 0
          const minWeight = formDatas.minWeight ? formDatas.minWeight * 1 : 0
          if (minWeight > maxWeight) {
            this.$set(this.commont[1], 'error', '前值不能大于后值')
          } else {
            this.$set(this.commont[1], 'error', '')
            this.$set(this.commont[2], 'error', '')
          }
        }
      },
      {
        itemType: 'input',
        prop: 'maxPrintingareaPct',
        label: '至',
        maxlength: 5,
        clearable: true,
        itemStyle: { width: '43%', display: 'inline-block' },
        labelWidth: '40px',
        placeholder: '请输入',
        rules: [max100Reg],
        blur: (scope, form, formDatas, setDatas) => {
          const maxWeight = formDatas.maxPrintingareaPct ? formDatas.maxPrintingareaPct * 1 : 0
          const minWeight = formDatas.minPrintingareaPct ? formDatas.minPrintingareaPct * 1 : 0
          if (minWeight > maxWeight) {
            this.$set(this.commont[2], 'error', '前值不能大于后值')
          } else {
            this.$set(this.commont[1], 'error', '')
            this.$set(this.commont[2], 'error', '')
          }
        }
      },
      {
        itemType: 'input',
        prop: 'minPrintingNumber',
        label: '印花颜色区间',
        maxlength: 3,
        clearable: true,
        itemStyle: { width: '57%', display: 'inline-block' },
        labelWidth: '125px',
        placeholder: '正整数（最多3个字符）',
        rules: [numberBlurReg],
        blur: (scope, form, formDatas, setDatas) => {
          const maxWeight = formDatas.maxPrintingNumber ? formDatas.maxPrintingNumber * 1 : 0
          const minWeight = formDatas.minPrintingNumber ? formDatas.minPrintingNumber * 1 : 0
          if (minWeight > maxWeight) {
            this.$set(this.commont[3], 'error', '前值不能大于后值')
          } else {
            this.$set(this.commont[3], 'error', '')
            this.$set(this.commont[4], 'error', '')
          }
        }
      },
      {
        itemType: 'input',
        prop: 'maxPrintingNumber',
        label: '至',
        maxlength: 3,
        clearable: true,
        itemStyle: { width: '43%', display: 'inline-block' },
        labelWidth: '40px',
        placeholder: '正整数（最多3个字符）',
        rules: [numberBlurReg],
        blur: (scope, form, formDatas, setDatas) => {
          const maxWeight = formDatas.maxPrintingNumber ? formDatas.maxPrintingNumber * 1 : 0
          const minWeight = formDatas.minPrintingNumber ? formDatas.minPrintingNumber * 1 : 0
          if (minWeight > maxWeight) {
            this.$set(this.commont[4], 'error', '前值不能大于后值')
          } else {
            this.$set(this.commont[3], 'error', '')
            this.$set(this.commont[4], 'error', '')
          }
        }
      },
      {
        itemType: 'input',
        prop: 'printingPrice',
        label: '印花工艺价格',
        labelWidth: '125px',
        clearable: true,
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入印花工艺价格'
      }
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['price:printingTechInfo:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'

          this.$set(this.popOptions, 'saveAndadd', undefined)
          this.editList({ id: scope.row.id })
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:printingTechInfo:delete'],
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
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      size: '600px',
      itemType: 'drawer',
      visible: false,
      title: '新增印花工艺 - 主要',
      okText: '保存',
      saveAndaddText: '保存并继续',
      ok: params => {
        this.addOrEdit(params, true)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: commont
    }

    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        status: ''
      },
      techType: 'M',
      printingType,
      searchData,
      columns,
      columnsCopy: [...columns],
      commont,
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
    // 获取搜索栏下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect({ techType: this.techType })).data || []
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 获取印花工艺下拉选项
    async getRequirementsPrinting(data = {}) {
      const id = this.popOptions.formDatas.printing ? this.popOptions.formDatas.printing.value : ''
      const select = this.popOptions.content[0].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await requirementsPrinting(data, { id, data: [], type: this.type })
        this.$set(this.popOptions.content[0], 'dataSource', res)
      }
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增印花工艺 - ' + this.printingType[this.techType])
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.getRequirementsPrinting()
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params = {}, go) {
      if ((params.maxPrintingareaPct ? params.maxPrintingareaPct * 1 : 0) < (params.minPrintingareaPct ? params.minPrintingareaPct * 1 : 0)) {
        return this.$message.error('印花面积区间 前值不可大于后值')
      } else if ((params.maxPrintingNumber ? params.maxPrintingNumber * 1 : 0) < (params.minPrintingNumber ? params.minPrintingNumber * 1 : 0)) {
        return this.$message.error('印花颜色区间 前值不可大于后值')
      }
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            // 新增
            await printingProcessInfoAdd({ ...params, techType: this.techType })
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/printingTechInfo/add'), { ...params, techType: this.techType }, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花工艺,新增一条记录`, beforeCode: { ...params, techType: this.techType }}))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'techType', 'printing', 'minPrintingareaPct', 'maxPrintingareaPct', 'minPrintingNumber', 'maxPrintingNumber', 'printingPrice']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await printingProcessInfoModify(obj)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/printingTechInfo/modify'), obj, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花工艺,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$message.success('保存成功')
          this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      const res = await printingProcessInfoPage({ ...this.formDatas, ...data, techType: this.techType })
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
      if (!isSearch) {
        this.setSearchSelect()
      }
    },
    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await printingProcessInfoDetail(data)
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
        this.PopDialogHandle('编辑印花工艺 - ' + this.printingType[this.techType])
      }, 0)
    },
    // 删除
    async deleteData(id) {
      const res = await printingProcessInfoDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功!')
      this.formDatas = {}
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/printingTechInfo/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花工艺'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await printingProcessInfoEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/printingTechInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花工艺'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 切换tab事件
    tabHandleClick(e) {
      this.formDatas = {}
      if (e.name === 'M') {
        this.columns = this.columnsCopy
        this.$set(this.popOptions, 'content', this.commont)
      } else {
        // 处理弹框
        const arr = [...this.commont]
        const arrNew = [arr[0], arr[arr.length - 1]]
        this.$set(this.popOptions, 'content', arrNew)
        // 处理表格
        const arrTab = [...this.columns]
        arrTab.splice(2, 2)
        this.columns = arrTab
      }

      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    }
  }
}
</script>
<style lang='scss' scoped>
.paymentPage {
  padding: 20px;
  padding-bottom: 0px;
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
<style lang="scss">
.paymentPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
.printing-loss{
  .el-form-item{
    .el-form-item__label{
      // line-height: 16px;
    }
  }
}
</style>
