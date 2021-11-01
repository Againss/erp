<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:functionLossInfo:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
  functionLossInfoPage,
  functionLossInfoAdd,
  functionLossInfoDetail,
  functionLossInfoModify,
  functionLossInfoDelete,
  functionLossInfoEnabled,
  testStandardList,
  getSearchSelect
} from './api/index.js'
import { requirementsDyeOption } from '@/views/price-center/common/basisApi'
import enableSwitch from '../../components/enableSwitch'
import department from './components/department'
import { fetchLog } from '@/views/price-center/common/fetchLog'

export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    // 最大100正则
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(\d{1,2}(\.[0-9]{1,2})?)$|^100$/, message: '请输入100以内，最多可保留2位小数', trigger: ['blur'] })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'function',
        itemType: 'select',
        label: '功能:',
        popperClass: 'popperClassPrice',
        valueType: 'object',
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
        prop: 'functionName',
        label: '功能',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'tagsType',
        label: '吊牌',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const type = { 'N': '无', 'D': '国内吊牌', 'T': '第三方吊牌' }
          return type[scope.row.tagsType]
        }
      },
      {
        prop: 'funTestMiddleInfo',
        label: '测试标准',
        minWidth: '180',
        components: {
          department
        },
        componentsOptions: {
          key: 'funTestMiddleInfo',
          name: 'name'
        }
      },
      {
        prop: 'functionPrice',
        label: '功能价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'functionLossPct',
        label: '功能损耗百分比',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => scope.row.functionLossPct + '%'
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
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:functionLossInfo:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'function',
        itemType: 'select',
        label: '功能',
        dataSource: [],
        labelWidth: '110px',
        valueType: 'object',
        popperClass: 'popperClassPrice',
        rules: [commonBlurReg],
        filterable: true
      },
      {
        prop: 'tagsType',
        itemType: 'select',
        label: '吊牌',
        dataSource: [
          {
            label: '无',
            value: 'N'
          },
          {
            label: '国内吊牌',
            value: 'D'
          },
          {
            label: '第三方吊牌',
            value: 'T'
          }
        ],
        labelWidth: '110px'
      },
      {
        prop: 'funTestMiddleInfoAddReq',
        itemType: 'select',
        multiple: true,
        collapseTags: true,
        label: '测试标准',
        dataSource: [],
        labelWidth: '110px',
        valueType: 'object',
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'functionPrice',
        label: '功能价格',
        maxlength: 25,
        labelWidth: '110px',
        clearable: true,
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入功能价格'
      },
      {
        itemType: 'input',
        prop: 'functionLossPct',
        label: '功能损耗',
        maxlength: 25,
        labelWidth: '110px',
        clearable: true,
        rules: [commonBlurReg, max100Reg],
        placeholder: '请输入功能损耗百分比'
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
        permitTag: ['price:functionLossInfo:modify'],
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
        permitTag: ['price:functionLossInfo:delete'],
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
      title: '新增功能损耗',
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
      columns,
      copyContent,
      commonContent,
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
  mounted() {},
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
    // 工艺要求-染整下拉选项
    async getRequirementsPrinting(data = {}) {
      const id = this.popOptions.formDatas.function ? this.popOptions.formDatas.function.value : ''
      const select = this.popOptions.content[0].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await requirementsDyeOption(data, { id, data: [], type: this.type })
        this.$set(this.popOptions.content[0], 'dataSource', res)
      }
    },

    // 测试标准列表-下拉项
    async getTestStandardList(data = {}) {
      const list = this.popOptions.formDatas.funTestMiddleInfoAddReq ? this.popOptions.formDatas.funTestMiddleInfoAddReq : []
      const ids = list.map(v => v.value)
      const select = this.popOptions.content[2].dataSource
      const bool = ids.find(item => !select.find(e => e.value === item))
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await testStandardList(data, { id: ids, data: [], type: this.type })
        this.$set(this.popOptions.content[2], 'dataSource', res)
        console.log(res)
      }
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增功能损耗')
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.getRequirementsPrinting()
        this.getTestStandardList()
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params = {}, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        const testArr = params.funTestMiddleInfoAddReq ? params.funTestMiddleInfoAddReq : []
        if (testArr.length > 0) {
          const testStandard = testArr.map(v => {
            return {
              testStandard: {
                label: v.label,
                value: v.value
              }
            }
          })
          params.funTestMiddleInfoAddReq = testStandard
        }

        if (valid) {
          if (this.type === 'add') {
            // 新增
            await functionLossInfoAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/functionLossInfo/add'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-功能损耗,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'function', 'tagsType', 'functionPrice', 'functionLossPct', 'funTestMiddleInfoAddReq']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await functionLossInfoModify(obj)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/functionLossInfo/modify'), obj, JSON.stringify({ beforeText: `在'价格中心-生产成本-功能损耗,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
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
      const res = await functionLossInfoPage({ ...this.formDatas, ...data })
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
      const res = await functionLossInfoDetail(data)
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
        const testLis = params.funTestMiddleInfoInfoResp || []
        const newList = testLis.map(v => {
          return {
            label: v.testStandard.label,
            value: v.testStandard.value
          }
        })
        this.$set(this.popOptions.formDatas, 'funTestMiddleInfoAddReq', newList)
        this.PopDialogHandle('编辑功能损耗')
      }, 0)
    },
    // 删除
    async deleteData(id) {
      const res = await functionLossInfoDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.formDatas = {}
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/functionLossInfo/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-功能损耗'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await functionLossInfoEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/functionLossInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-功能损耗'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
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
