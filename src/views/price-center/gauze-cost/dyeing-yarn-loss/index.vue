<!--
  @Description 纱成本-染纱损耗
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
    <div class="search search-box">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOptions" :form-datas="searchFormDatas" />
    </div>
    <!-- 新增按钮 -->
    <div class="button">
      <el-button
        v-permission="['price:dyedYarnLossInfo:add']"
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
        :columns="columns"
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
  getLongPage,
  deleteLong,
  editLong,
  enabledLong,
  addLong,
  getSearchSelect,
  getLongDetail
} from './api/index.js'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import { checkMin, checkMax } from '@/views/price-center/common/index'
import { getRanSha, getChengFen } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const max100Reg = this.$getRules({
      type: 'number', pattern: /^(\d{1,2}(\.[0-9]{1,2})?)$|^100$/,
      message: '请输入100以内，最多可保留2位小数', trigger: ['blur']
    })
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
    // 公共弹出框内容
    const commonContent = [
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
        prop: 'minWeight',
        itemType: 'input',
        label: '重量区间(千克):',
        maxlength: 9,
        placeholder: '0~999999999',
        itemStyle: {
          width: '60%',
          display: 'inline-block'
        },
        rules: [{ validator: minFn, trigger: 'blur' }]
      },
      {
        prop: 'maxWeight',
        itemType: 'input',
        label: '至:',
        // maxlength: 9,
        itemStyle: {
          width: '40%',
          display: 'inline-block'
        },
        labelWidth: '40px',
        placeholder: '0.001~999999999.999',
        rules: [{ validator: maxFn, trigger: 'blur' }]
      },
      {
        prop: 'dyedyarnLossPct',
        itemType: 'input',
        label: '染纱损耗百分比:',
        placeholder: '请输入染纱损耗百分比',
        rules: [commonBlurReg, max100Reg]
      }
    ]
    // 查询表单配置信息
    const searchData = [
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
        prop: 'composition',
        itemType: 'select',
        label: '成分/组合成份:',
        valueType: 'object',
        placeholder: '请选择成分/组合成份',
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
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
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
        prop: 'minWeigth',
        label: '重量区间（千克）',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => (scope.row.minWeight !== null ? scope.row.minWeight : '') +
          (scope.row.maxWeight !== null && scope.row.minWeight !== null ? '~' : '') + (scope.row.maxWeight !== null ? scope.row.maxWeight : '')
      },
      {
        prop: 'dyedyarnLossPct',
        label: '染纱损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] + '%'
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
          permitTag: 'price:dyedYarnLossInfo:status',
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
        permitTag: ['price:dyedYarnLossInfo:modify'],
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:dyedYarnLossInfo:delete'],
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
      size: '600px',
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
      activeName: '',
      formOptions: {
        size: 'small',
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
  mounted() {
    this.activeName = 'S'
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
      const res = await getLongPage({ ...this.searchFormDatas, ...data, dyedYarnLossType: this.activeName })
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
      const res = (await getSearchSelect({ dyedYarnLossType: this.activeName })).data || {}
      // const r = setSearchData(res, { key: 'dyedYarnLossType', value: this.activeName })
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop].filter(e => JSON.stringify(e) !== JSON.stringify({})) || [])
        }
      })
    },
    // 启用/禁用
    async enableStatus(data, scope) {
      await enabledLong({
        ...data,
        dyedYarnLossType: this.activeName
      }).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyedYarnLossInfo/status'), { ...data, dyedYarnLossType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染色损耗'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: { ...data, dyedYarnLossType: this.activeName }}))
    },
    // 新增或者修改
    addOrEdit(params, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await addLong({ ...params, dyedYarnLossType: this.activeName })
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/dyedYarnLossInfo/add'), { ...params, dyedYarnLossType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染色损耗,新增一条记录`, beforeCode: { ...params, dyedYarnLossType: this.activeName }}))
          } else if (this.type === 'edit') {
            await editLong({ ...params, dyedYarnLossType: this.activeName })
            const { beforeCode, afterCode } = this.compareData(this.oldForm, { ...params, dyedYarnLossType: this.activeName }, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyedYarnLossInfo/modify'), { ...params, dyedYarnLossType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染色损耗,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
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
      await deleteLong({ ...data, dyedYarnLossType: this.activeName })
      this.$message.success('删除成功')
      this.getLongPageFn({ pageSize: this.pagination.pageSize || 20, pageNum: this.pagination.pageNum || 1 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/dyedYarnLossInfo/delete'), { ...data, dyedYarnLossType: this.activeName }, JSON.stringify({ beforeText: `在'价格中心-纱成本-染色损耗'删除一条记录`, beforeCode: { ...data, dyedYarnLossType: this.activeName }}))
    },
    // 设置弹框下拉数据
    setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const arr = [[getRanSha, 0], [getChengFen, 1]]
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
  .search-box{
    /deep/ .el-form-item{
      width: 20%;
    }
  }
</style>
