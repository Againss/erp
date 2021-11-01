<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:paymentMethod:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
  paymentMethodPage,
  paymentMethodAdd,
  paymentMethodDetail,
  paymentMethodModify,
  paymentMethodDelete,
  paymentMethodEnabled

} from './api/index.js'
import { dataComparision } from '../../common/index'
import { paymentTermsList, paymentTermsSearch } from '@/views/price-center/common/basisApi'
import enableSwitch from '../../components/enableSwitch'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大999.99正则
    // const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(\d{1,2}(\.[0-9]{1,2})?)$|^100$/, message: '请输入100以内，最多可保留2位小数', trigger: ['blur'] })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'paymentMethod',
        itemType: 'select',
        label: '付款条件',
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
          this.searchFormDatas = { ...params, enabled }

          this.getRulePage({ ...params, enabled }, true)
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
        width: '80'
      },
      {
        prop: 'paymentMethodName',
        label: '付款条件',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'paymentPct',
        label: '付款条件百分比',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => scope.row.paymentPct + '%'
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '150',
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
          permitTag: 'price:paymentMethod:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'paymentMethod',
        itemType: 'select',
        label: '付款条件',
        dataSource: [],
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'paymentPct',
        label: '付款条件百分比',
        maxlength: 25,
        clearable: true,
        rules: [commonBlurReg, max100Reg],
        placeholder: '请输入付款条件百分比'
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
        permitTag: ['price:paymentMethod:modify'],
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
        permitTag: ['price:paymentMethod:delete'],
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
      itemType: 'drawer',
      visible: false,
      title: '新增付款条件',
      okText: '保存',
      saveAndaddText: '保存并继续',
      ok: params => {
        this.addOrEdit(params, true)
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
    // this.getPaymentTermsSearch()
    this.getRulePage()
  },
  mounted() {},
  methods: {
    // 获取付款条件搜索下拉选项
    async getPaymentTermsSearch(data = {}) {
      const res = await paymentTermsSearch(data)
      if (this.$pub.responseValidate(res)) {
        this.$set(this.searchData[0], 'dataSource', res.data.paymentMethod || [])
      }
    },
    // 获取付款条件下拉选项
    async getPaymentTermsList(data = {}) {
      const id = this.popOptions.formDatas.paymentMethod ? this.popOptions.formDatas.paymentMethod.value : ''
      const select = this.popOptions.content[0].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await paymentTermsList(data, { id, data: [], type: this.type })
        this.$set(this.commonContent[0], 'dataSource', res)
        // this.$set(this.searchData[0], 'dataSource', res)
        console.log(res)
      }
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增付款条件')
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.getPaymentTermsList()
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
            // 新增
            await paymentMethodAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/paymentMethod/add'), params, JSON.stringify({ beforeText: `在'价格中心-财务成本,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'paymentMethod', 'paymentPct']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await paymentMethodModify(obj)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/paymentMethod/modify'), obj, JSON.stringify({ beforeText: `在'价格中心-财务成本,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
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
      const res = await paymentMethodPage({ ...this.searchFormDatas, ...data })
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
        this.getPaymentTermsSearch()
      }
    },
    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await paymentMethodDetail(data)
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
        this.PopDialogHandle('编辑付款条件')
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
    // 删除
    async deleteData(id) {
      const res = await paymentMethodDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/paymentMethod/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-财务成本'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await paymentMethodEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/paymentMethod/status'), data, JSON.stringify({ beforeText: `在'价格中心-财务成本'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
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
</style>
