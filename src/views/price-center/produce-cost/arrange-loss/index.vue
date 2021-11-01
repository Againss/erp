<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:afterfinishLoss:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
    <div class="pop popperClass">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  afterfinishingLossPage,
  afterfinishingLossList,
  afterfinishingLossAdd,
  afterfinishingLossModify,
  afterfinishingLossDelete,
  afterfinishingLossEnabled,
  afterfinishingLossDetail
} from './api/index.js'
import enableSwitch from '../../components/enableSwitch'
// import { getRanZheng } from '@/views/price-center/common/basisApi'
import * as selectData from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/,
      message: '请输入最大3位整数或保留1到2位小数',
      trigger: ['blur']
    })
    const max100Reg = this.$getRules({
      type: 'number', pattern: /^(\d{1,2}(\.[0-9]{1,2})?)$|^100$/,
      message: '请输入100以内，最多可保留2位小数', trigger: ['blur']
    })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'afterfinishTech',
        itemType: 'select',
        label: '后整工艺:',
        valueType: 'object',
        labelWidth: '100px',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'fabricGrade',
        itemType: 'select',
        label: '布类等级:',
        valueType: 'object',
        labelWidth: '100px',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '启用/禁用:',
        labelWidth: '100px',
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
          this.searchFormDatas = { ...params }
          this.getRulePage(params, true)
        },
        resetHandle: params => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      {
        prop: 'afterfinishTechName',
        label: '后整工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'afterfinishTechPrice',
        label: '后整工艺价格',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'afterfinishLossPct',
        label: '后整工艺损耗百分比',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] + '%'
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
          permitTag: 'price:afterfinishLoss:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status * 1 }, scope)
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'afterfinishTech',
        itemType: 'select',
        label: '后整工艺',
        labelWidth: '110px',
        valueType: 'object',
        popperClass: 'popperClassPrice',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'fabricGrade',
        itemType: 'select',
        label: '布类等级',
        labelWidth: '110px',
        valueType: 'object',
        popperClass: 'popperClassPrice',
        rules: [commonBlurReg],
        filterable: true,
        dataSource: []
      },
      {
        prop: 'afterfinishTechPrice',
        itemType: 'input',
        label: '后整工艺价格',
        maxlength: 25,
        labelWidth: '110px',
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入后整工艺价格'
      },
      {
        itemType: 'input',
        prop: 'afterfinishLossPct',
        label: '后整工艺损耗',
        maxlength: 25,
        labelWidth: '110px',
        rules: [commonBlurReg, max100Reg],
        placeholder: '请输入后整工艺损耗'
      }
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['price:afterfinishLoss:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:afterfinishLoss:delete'],
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => this.deleteData({ id: scope.row.id }))
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
      itemType: 'drawer',
      visible: false,
      title: '新增印花证书',
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
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        status: ''
      },
      searchData,
      columns,
      commonContent,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  methods: {
    // 获取编辑详情信息
    async editFn(id) {
      const data = (await afterfinishingLossDetail({ id })).data || {}
      this.oldForm = data
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      this.$set(this.popOptions, 'saveAndadd', undefined)
      this.PopDialogHandle('编辑后整损耗')
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增后整损耗')
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.setSelectData()
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params = {}, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await afterfinishingLossAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/afterfinishLoss/add'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-后整损耗,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            await afterfinishingLossModify(params)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, params, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/afterfinishLoss/modify'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-后整损耗,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$message.success('保存成功')
          this.$set(this.popOptions, 'formDatas', {})
          this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      const res = await afterfinishingLossPage({ ...this.searchFormDatas, ...data })
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
      const res = (await afterfinishingLossList({})).data || {}
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 删除
    async deleteData(id) {
      await afterfinishingLossDelete(id)
      this.$message.success('删除成功')
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/afterfinishLoss/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-后整损耗'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await afterfinishingLossEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/afterfinishLoss/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-后整损耗'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 设置弹框下拉数据
    // async setSelectData() {
    //   // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
    //   const row = this.popOptions.formDatas
    //   const select = this.popOptions.content[0].dataSource
    //   const id = row && row[this.popOptions.content[0].prop] && row[this.popOptions.content[0].prop].value || ''
    //   const bool = id && !select.find(item => item.value === id)
    //   // 当下拉选为空 或 编辑时当前值不在下拉列表中
    //   if (!select.length || bool) {
    //     const data = await getRanZheng({}, { id, data: [], type: this.type })
    //     this.$set(this.popOptions.content[0], 'dataSource', data)
    //   }
    // }
    // 设置弹框下拉数据
    setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const arr = [
        [selectData.getRanZheng, 0],
        [selectData.getDengJi, 1]
      ]
      arr.forEach(async e => {
        const row = this.popOptions.formDatas
        const select = this.popOptions.content[e[1]].dataSource
        const id = row && row[this.popOptions.content[e[1]].prop] && row[this.popOptions.content[e[1]].prop].value || ''
        const bool = id && !select.find(item => item.value === id)
        // 当下拉选为空 或 编辑时当前值不在下拉列表中
        if (!select.length || bool) {
          const data = await e[0](e[2] || {}, { id, data: [], type: this.type })
          console.log(data)
          this.$set(this.popOptions.content[e[1]], 'dataSource', data)
        }
      })
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
  .popperClassPrice{
    max-width: 300px !important;
  }
</style>
