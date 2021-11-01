<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:dyeingLossInfo:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
  dyeingLossPage,
  dyeingLossList,
  dyeingLossAdd,
  dyeingLossModify,
  dyeingLossDelete,
  dyeingLossEnabled,
  dyeingLossDetail
} from './api/index.js'
import enableSwitch from '../../components/enableSwitch'
import { checkMin, checkMax } from '@/views/price-center/common/index'
import { getShenQian } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
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
    // const minReg = this.$getRules({
    //   type: 'number', pattern: /^[0-9]\d{0,8}?$/,
    //   message: '正整数(最多9个字符)', trigger: ['blur']
    // })
    // const maxReg = this.$getRules({
    //   type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,3})?$/,
    //   message: '1~999999999.999', trigger: ['blur']
    // })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'dyeingTechType',
        itemType: 'select',
        valueType: 'object',
        label: '染色工艺:',
        filterable: true,
        dataSource: []
      },
      {
        prop: 'colorDepth',
        itemType: 'select',
        label: '颜色深浅:',
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
        prop: 'dyeingTechType',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          return scope.row[scope.column.property] && dyeingType[scope.row[scope.column.property]] || ''
        }
      },
      {
        prop: 'colorDepthName',
        label: '颜色深浅',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => (scope.row.minWeight !== null ? scope.row.minWeight : '') +
          (scope.row.maxWeight !== null && scope.row.minWeight !== null ? '~' : '') + (scope.row.maxWeight !== null ? scope.row.maxWeight : '')
      },
      {
        prop: 'dyeingFinishedLossPct',
        label: '染色损耗百分比',
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
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '启用/禁用',
        width: '200',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:dyeingLossInfo:status',
          changeStatus: scope => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status * 1 }, scope)
          }
        }
      }
    ]
    const commont = [
      {
        prop: 'dyeingTechType',
        itemType: 'select',
        valueType: 'object',
        label: '染色工艺',
        dataSource: [
          {
            label: '洗水',
            value: 'W'
          },
          {
            label: '漂白',
            value: 'B'
          },
          {
            label: '半漂',
            value: 'H'
          },
          {
            label: '染色',
            value: 'D'
          }
        ],
        rules: [commonBlurReg]
      },
      {
        prop: 'colorDepth',
        itemType: 'select',
        label: '颜色深浅',
        dataSource: [],
        valueType: 'object',
        rules: [commonBlurReg],
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'minWeight',
        label: '重量区间',
        maxlength: 9,
        itemStyle: { width: '60%', display: 'inline-block' },
        labelWidth: '125px',
        placeholder: '0~999999999',
        rules: [{ validator: minFn, trigger: 'blur' }]
        // rules: [minReg],
        // blur: (scope, form, formDatas, setDatas) => {
        //   const maxWeight = formDatas.maxWeight ? formDatas.maxWeight * 1 : 0
        //   const minWeight = formDatas.minWeight ? formDatas.minWeight * 1 : 0
        //   // if (!maxWeight) return this.$set(this.commont[3], 'error', '前值不能大于后值')
        //   // if (!maxWeight) return this.$set(this.commont[3], 'error', '1~999999999.999')
        //   if (minWeight && maxWeight && (minWeight > maxWeight)) {
        //     this.$set(this.commont[2], 'error', '前值不能大于后值')
        //   } else {
        //     this.$set(this.commont[2], 'error', '')
        //     this.$set(this.commont[3], 'error', '')
        //   }
        // }
      },
      {
        itemType: 'input',
        prop: 'maxWeight',
        label: '至',
        itemStyle: { width: '40%', display: 'inline-block' },
        labelWidth: '40px',
        // maxlength: 9,
        placeholder: '0.001~999999999.999',
        rules: [{ validator: maxFn, trigger: 'blur' }]
        // rules: [maxReg],
        // blur: (scope, form, formDatas, setDatas) => {
        //   // if (formDatas.maxWeight * 1 === 0) {
        //   //   this.$set(this.commont[3], 'error', '1~999999999.999')
        //   // }
        //   // debugger
        //   const maxWeight = formDatas.maxWeight ? formDatas.maxWeight * 1 : 0
        //   const minWeight = formDatas.minWeight ? formDatas.minWeight * 1 : 0
        //   // if (!minWeight) return this.$set(this.commont[2], 'error', '前值不能大于后值')
        //   if (!maxWeight) return this.$set(this.commont[3], 'error', '1~999999999.999')
        //   if (minWeight && maxWeight && (minWeight > maxWeight)) {
        //     this.$set(this.commont[3], 'error', '前值不能大于后值')
        //   } else {
        //     this.$set(this.commont[2], 'error', '')
        //     this.$set(this.commont[3], 'error', '')
        //   }
        // }
      },
      {
        itemType: 'input',
        prop: 'dyeingFinishedLossPct',
        label: '染整损耗百分比',
        rules: [commonBlurReg, max100Reg],
        placeholder: '请输入染整损耗'
      }
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['price:dyeingLossInfo:modify'],
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
        permitTag: ['price:dyeingLossInfo:delete'],
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
      size: '600px',
      visible: false,
      title: '新增染色损耗 ',
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
      searchData,
      columns,
      commont,
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
    async editFn(id) {
      const data = (await dyeingLossDetail({ id })).data || {}
      this.oldForm = data
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      this.$set(this.popOptions, 'saveAndadd', undefined)
      this.PopDialogHandle('编辑染色损耗')
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增染色损耗 ')
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
      if ((params.maxWeight ? params.maxWeight * 1 : 0) < (params.minWeight ? params.minWeight * 1 : 0)) return this.$message.error('重量区间 前值不可大于后值')
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await dyeingLossAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/dyeingLossInfo/add'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色损耗,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            await dyeingLossModify(params)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, params, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyeingLossInfo/modify'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色损耗,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$message.success('保存成功')
          this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      const res = await dyeingLossPage({ ...this.searchFormDatas, ...data })
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
      const res = (await dyeingLossList({})).data || {}
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 删除
    async deleteData(id) {
      await dyeingLossDelete(id)
      this.$message.success('删除成功')
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/dyeingLossInfo/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色损耗'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await dyeingLossEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyeingLossInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色损耗'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 设置弹框下拉数据
    async setSelectData() {
      // arr [ [0]接口获取选项的fn, [1]弹框配置的第几项, [2]接口需要的参数 ]
      const row = this.popOptions.formDatas
      const select = this.popOptions.content[1].dataSource
      const id = row && row[this.popOptions.content[1].prop] && row[this.popOptions.content[1].prop].value || ''
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const data = await getShenQian({}, { id, data: [], type: this.type })
        this.$set(this.popOptions.content[1], 'dataSource', data)
      }
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
