<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:printingLossInfo:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
    <div class="pop printing-loss">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  printingLossInfoPage,
  printingLossInfoAdd,
  printingLossInfoDetail,
  printingLossInfoModify,
  printingLossInfoDelete,
  printingLossInfoEnabled,
  getSearchSelect
} from './api/index.js'
import enableSwitch from '../../components/enableSwitch'
import { checkMin, checkMax } from '@/views/price-center/common/index'
import { requirementsPrinting } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // 最大100正则
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(\d{1,2}(\.[0-9]{1,2})?)$|^100$/, message: '请输入100以内，最多可保留2位小数', trigger: ['blur'] })
    const minFn = (rule, value, callback) => {
      const datas = this.$refs.popForm.$refs.popComponents.formDatas
      const res = checkMin(value, datas)
      if (res) return callback(new Error(res))
      // this.$refs.popForm.$refs.popComponents.form.clearValidate()
      callback()
    }
    const maxFn = (rule, value, callback) => {
      const datas = this.$refs.popForm.$refs.popComponents.formDatas
      const res = checkMax(value, datas)
      if (res) return callback(new Error(res))
      // this.$refs.popForm.$refs.popComponents.form.clearValidate()
      callback()
    }
    // const checkFn = (rule, value, callback) => {
    //   const datas = this.$refs.popForm.$refs.popComponents.formDatas
    //   const res = checkValues(value, datas)
    //   if (res) return callback(new Error(res))
    //   this.$refs.popForm.$refs.popComponents.form.clearValidate()
    //   callback()
    // }
    // const maxReg = this.$getRules({
    //   type: 'number', pattern: /^[1-9]\d*$/,
    //   message: '正整数(最多9个字符)', trigger: ['blur']
    // })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'printingTech',
        itemType: 'select',
        label: '印花工艺:',
        valueType: 'object',
        filterable: true,
        dataSource: []
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
        prop: 'printingTechName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
        // formater: scope => (scope.row.minWeight || '') +
        //   (scope.row.maxWeight && scope.row.minWeight ? '~' : '') + (scope.row.maxWeight || '')
      },
      {
        prop: 'printingLossPct',
        label: '印花损耗百分比',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.printingLossPct + '%'
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '150',
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
        label: '启用/禁用',
        width: '100',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:printingLossInfo:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'printingTech',
        itemType: 'select',
        label: '印花工艺',
        dataSource: [],
        labelWidth: '125px',
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'minWeight',
        label: '重量区间(千克)',
        maxlength: 9,
        clearable: true,
        itemStyle: { width: '60%', display: 'inline-block' },
        labelWidth: '125px',
        itemClassName: 'labeClassName',
        placeholder: '0~999999999',
        rules: [{ validator: minFn, trigger: 'blur' }]
        // rules: [maxReg],
        // blur: (scope, form, formDatas, setDatas) => {
        //   const maxWeight = formDatas.maxWeight ? formDatas.maxWeight * 1 : 0
        //   const minWeight = formDatas.minWeight ? formDatas.minWeight * 1 : 0
        //   if (minWeight > maxWeight) {
        //     this.$set(this.commonContent[1], 'error', '前值不能大于后值')
        //   } else {
        //     this.$set(this.commonContent[1], 'error', '')
        //     this.$set(this.commonContent[2], 'error', '')
        //   }
        // }
      },
      {
        itemType: 'input',
        prop: 'maxWeight',
        label: '至',
        // maxlength: 9,
        clearable: true,
        itemStyle: { width: '40%', display: 'inline-block' },
        labelWidth: '40px',
        placeholder: '0.001~999999999.999',
        rules: [{ validator: maxFn, trigger: 'blur' }]
        // rules: [maxReg],
        // blur: (scope, form, formDatas, setDatas) => {
        //   const maxWeight = formDatas.maxWeight ? formDatas.maxWeight * 1 : 0
        //   const minWeight = formDatas.minWeight ? formDatas.minWeight * 1 : 0
        //   if (minWeight > maxWeight) {
        //     this.$set(this.commonContent[2], 'error', '前值不能大于后值')
        //   } else {
        //     this.$set(this.commonContent[1], 'error', '')
        //     this.$set(this.commonContent[1], 'error', '')
        //   }
        // }
      },
      {
        itemType: 'input',
        prop: 'printingLossPct',
        label: '印花损耗百分比',
        maxlength: 25,
        labelWidth: '125px',
        clearable: true,
        rules: [commonBlurReg, max100Reg],
        placeholder: '请输入印花损耗'
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['price:printingLossInfo:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.PopDialogHandle('编辑印花损耗')
          this.$set(this.popOptions, 'saveAndadd', undefined)
          this.editList({ id: scope.row.id })
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:printingLossInfo:delete'],
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
      title: '新增印花损耗',
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
      content: copyContent
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        status: ''
      },
      searchData,
      commonContent,
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
    // 获取印花工艺下拉选项
    async getRequirementsPrinting(data = {}) {
      const id = this.popOptions.formDatas.printingTech ? this.popOptions.formDatas.printingTech.value : ''
      const select = this.popOptions.content[0].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await requirementsPrinting(data, { id, data: [], type: this.type })
        this.$set(this.commonContent[0], 'dataSource', res)
        console.log(res)
      }
    },
    // 获取搜索栏下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect()).data || []
      this.$set(this.searchData[0], 'dataSource', res.printingTech || [])
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增印花损耗')
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
      if ((params.maxWeight ? params.maxWeight * 1 : 0) < (params.minWeight ? params.minWeight * 1 : 0)) return this.$message.error('重量区间 前值不可大于后值')
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            // 新增
            await printingLossInfoAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/printingLossInfo/add'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花损耗,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'printingTech', 'minWeight', 'maxWeight', 'printingLossPct']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await printingLossInfoModify(obj)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/printingLossInfo/modify'), obj, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花损耗,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
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
      const res = await printingLossInfoPage({ ...this.formDatas, ...data })
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
      const res = await printingLossInfoDetail(data)
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
    // 删除
    async deleteData(id) {
      const res = await printingLossInfoDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.formDatas = {}
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/printingLossInfo/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花损耗'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await printingLossInfoEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/printingLossInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花损耗'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    }

  }
}
</script>
<style lang='scss' scoped>
.paymentPage {
  padding: 20px;
  padding-bottom: 0px;
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
