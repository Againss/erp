<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:freight:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
  freightPage,
  freightAdd,
  freightDetail,
  freightModify,
  freightDelete,
  freightEnabled,
  getSearchSelect
} from '../api/index.js'
// import { setSearchData } from '@/views/price-center/common/index'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import { portsOption, priceTermsOption, shipMethodOption } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'International',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'priceClause',
        itemType: 'select',
        label: '价格条款:',
        labelWidth: '80px',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'transportWay',
        itemType: 'select',
        label: '运输方式:',
        labelWidth: '80px',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'startPlace',
        itemType: 'select',
        label: '起运港:',
        labelWidth: '80px',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'destinationPlace',
        itemType: 'select',
        label: '目地港:',
        labelWidth: '80px',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'transitDirectType',
        itemType: 'select',
        label: '中转/直航:',
        labelWidth: '80px',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '中转',
            value: 'T'
          },
          {
            label: '直航',
            value: 'D'
          }
        ]
      },
      {
        prop: 'tightnessType',
        itemType: 'select',
        label: '松/紧:',
        labelWidth: '80px',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '松',
            value: 'L'
          },
          {
            label: '紧',
            value: 'T'
          }
        ]
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '启用/禁用:',
        labelWidth: '80px',
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
        prop: 'priceClauseName',
        label: '价格条款',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运港',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目地港',
        showOverflowTooltip: true
      },
      {
        prop: 'transitDirectType',
        label: '中转/直航',
        showOverflowTooltip: true,
        formater: scope => scope.row.transitDirectType === 'T' ? '中转' : scope.row.transitDirectType === 'D' ? '直航' : ''
      },
      {
        prop: 'tightnessType',
        label: '松/紧',
        showOverflowTooltip: true,
        formater: scope => scope.row.tightnessType === 'L' ? '松' : scope.row.tightnessType === 'T' ? '紧' : ''
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        showOverflowTooltip: true
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
          permitTag: 'price:freight:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'priceClause',
        itemType: 'select',
        label: '价格条款:',
        valueType: 'object',
        rules: [commonBlurReg],
        dataSource: [],
        filterable: true
      },
      {
        prop: 'transportWay',
        itemType: 'select',
        label: '运输方式:',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'transitDirectType',
        itemType: 'select',
        label: '中转/直航:',
        dataSource: [
          {
            label: '中转',
            value: 'T'
          },
          {
            label: '直航',
            value: 'D'
          }
        ]
      },
      {
        prop: 'startPlace',
        itemType: 'select',
        valueType: 'object',
        label: '起运港:',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'destinationPlace',
        itemType: 'select',
        label: '目地港:',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'tightnessType',
        itemType: 'select',
        label: '松/紧:',
        dataSource: [
          {
            label: '松',
            value: 'L'
          },
          {
            label: '紧',
            value: 'T'
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'freightCoefficient',
        label: '运费系数:',
        maxlength: 25,
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入运费系数'
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
        permitTag: ['price:freight:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.editList({ id: scope.row.id })
          this.$set(this.popOptions, 'saveAndadd', undefined)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:freight:delete'],
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
      title: '新增国外运费',
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
        inline: true,
        layout: true
      },
      formDatas: {
        status: '',
        transitDirectType: '',
        tightnessType: '',
        transportWayId: ''
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
    this.getPortsOption()
  },
  mounted() {},
  methods: {
    // 获取下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect({ freightType: 'I' })).data || []
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 港口和价格条款下拉选项
    async getPortsOption(data = {}) {
      const portsRes = await portsOption(data)
      this.$set(this.commonContent[3], 'dataSource', portsRes)
      this.$set(this.commonContent[4], 'dataSource', portsRes)
      const priceRes = await priceTermsOption(data)
      this.$set(this.commonContent[0], 'dataSource', priceRes)
    },
    // 运输方式下拉选项
    async getShipMethodOption(data = {}) {
      const id = this.popOptions.formDatas.transportWay ? this.popOptions.formDatas.transportWay.value : ''
      const select = this.popOptions.content[1].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await shipMethodOption(data, { id, data: [], type: this.type })
        this.$set(this.commonContent[1], 'dataSource', res)
        console.log(res)
      }
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新增国外运费')
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.getShipMethodOption()
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
            await freightAdd({ ...params, freightType: 'I' })
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/freight/add'), { ...params, freightType: 'I' }, JSON.stringify({ beforeText: `在'价格中心-运输成本-国际,新增一条记录`, beforeCode: { ...params, freightType: 'I' }}))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'freightType', 'transportWay', 'startPlace', 'destinationPlace', 'minWeight', 'maxWeight', 'freightCoefficient', 'priceClause', 'tightnessType', 'transitDirectType']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await freightModify({ ...obj, freightType: 'I' })
            const { beforeCode, afterCode } = this.compareData(this.oldForm, { ...obj, freightType: 'I' }, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/freight/freight/modify'), { ...obj, freightType: 'I' }, JSON.stringify({ beforeText: `在'价格中心-运输成本-国际,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$message.success('保存成功')
          this.$set(this.popOptions, 'formDatas', {})
          this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      const res = await freightPage({ ...this.formDatas, ...data, freightType: 'I' })
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
      const res = await freightDetail(data)
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
        this.PopDialogHandle('编辑国际运费')
      }, 0)
    },
    // 删除
    async deleteData(id) {
      const res = await freightDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.formDatas = {}
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/freight/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-运输成本-国际'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await freightEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/freight/status'), data, JSON.stringify({ beforeText: `在'价格中心-运输成本-国际'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    }
  }
}
</script>
<style lang='scss' scoped>
.paymentPage {
  // padding: 20px;
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
