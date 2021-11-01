<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search search-box">
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
import { checkMin, checkMax } from '@/views/price-center/common/index'
import enableSwitch from '@/views/price-center/components/enableSwitch'
import { areasOption, shipMethodOption } from '@/views/price-center/common/basisApi'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Domestic',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // const numberReg = this.$getRules({
    //   type: 'number', pattern: /^[1-9]\d{0,8}?$/,
    //   message: '正整数最多9位', trigger: ['blur']
    // })
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
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'startPlace',
        itemType: 'select',
        label: '起运地:',
        dataSource: [],
        valueType: 'object',
        filterable: true
      },
      {
        prop: 'destinationPlace',
        itemType: 'select',
        label: '目的地:',
        valueType: 'object',
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
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运地',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的地',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
        // formater: scope => (scope.row.minWeight || '') +
        //   (scope.row.maxWeight && scope.row.minWeight ? '~' : '') + (scope.row.maxWeight || '')
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
        prop: 'startPlace',
        itemType: 'select',
        label: '起运地',
        placeholder: '省',
        labelWidth: '115px',
        valueType: 'object',
        itemStyle: {
          width: '58%',
          display: 'inline-block'
        },
        rules: [commonBlurReg],
        dataSource: [],
        filterable: true,
        change: (value, form, formDatas, setFormDatas) => {
          if (value && value.value) {
            formDatas.startCity = null
            this.setProvince(value.value, 'start')
          }
        }
      },
      {
        prop: 'startCity',
        itemType: 'select',
        label: '-',
        placeholder: '市',
        valueType: 'object',
        itemStyle: {
          width: '42%',
          display: 'inline-block'
        },
        labelWidth: '33px',
        filterable: true
      },
      {
        prop: 'destinationPlace',
        itemType: 'select',
        label: '目的地',
        placeholder: '省',
        labelWidth: '115px',
        valueType: 'object',
        itemStyle: {
          width: '58%',
          display: 'inline-block'
        },
        rules: [commonBlurReg],
        dataSource: [],
        filterable: true,
        change: (value, form, formDatas, setFormDatas) => {
          // console.log(value, form, formDatas, setFormDatas)
          if (value && value.value) {
            formDatas.destinationCity = null
            this.setProvince(value.value, 'destination')
          }
        }
      },
      {
        prop: 'destinationCity',
        itemType: 'select',
        label: '-',
        placeholder: '市',
        valueType: 'object',
        itemStyle: {
          width: '42%',
          display: 'inline-block'
        },
        labelWidth: '33px',
        filterable: true
      },
      {
        prop: 'transportWay',
        itemType: 'select',
        label: '运输方式',
        labelWidth: '115px',
        valueType: 'object',
        rules: [commonBlurReg],
        dataSource: [],
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'minWeight',
        label: '重量区间(千克)',
        maxlength: 9,
        clearable: true,
        itemStyle: { width: '56%', display: 'inline-block' },
        labelWidth: '115px',
        // placeholder: '正整数（最多9个字符）',
        placeholder: '0~999999999',
        rules: [{ validator: minFn, trigger: 'blur' }]
        // rules: [numberReg],
        // blur: (scope, form, formDatas, setDatas) => {
        //   const reg = /^[1-9]{1,9}$/
        //   const maxWeight = formDatas.maxWeight
        //   const minWeight = formDatas.minWeight
        //   if ((minWeight && !reg.test(minWeight)) || (maxWeight && !reg.test(maxWeight))) {
        //     return this.$set(this.commonContent[3], 'error', '请输入最多9位正整数')
        //   }
        //   if ((minWeight ? minWeight * 1 : 0) > (maxWeight ? maxWeight * 1 : 0)) {
        //     return this.$set(this.commonContent[3], 'error', '前值不能大于后值')
        //   }
        //   this.$set(this.commonContent[3], 'error', '')
        //   this.$set(this.commonContent[4], 'error', '')
        // }

      },
      {
        itemType: 'input',
        prop: 'maxWeight',
        label: '至',
        // maxlength: 9,
        clearable: true,
        itemStyle: { width: '44%', display: 'inline-block' },
        labelWidth: '40px',
        placeholder: '0.001~999999999.999',
        rules: [{ validator: maxFn, trigger: 'blur' }]
        // placeholder: '正整数（最多9个字符）',
        // rules: [numberReg],
        // blur: (scope, form, formDatas, setDatas) => {
        //   const reg = /^[1-9]{1,9}$/
        //   const maxWeight = formDatas.maxWeight
        //   const minWeight = formDatas.minWeight
        //   if ((minWeight && !reg.test(minWeight)) || (maxWeight && !reg.test(maxWeight))) {
        //     return this.$set(this.commonContent[4], 'error', '请输入最多9位正整数')
        //   }
        //   if ((minWeight ? minWeight * 1 : 0) > (maxWeight ? maxWeight * 1 : 0)) {
        //     return this.$set(this.commonContent[4], 'error', '前值不能大于后值')
        //   }
        //   this.$set(this.commonContent[3], 'error', '')
        //   this.$set(this.commonContent[4], 'error', '')
        // }
      },
      {
        itemType: 'input',
        prop: 'freightCoefficient',
        label: '运费系数',
        labelWidth: '115px',
        maxlength: 25,
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入运费系数'
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    // 操作栏修改isShow为方法使得修改按钮木有
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
      size: '600px',
      title: '新增国内运费',
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
    this.getAreasOption()
  },
  mounted() {},
  methods: {
    // 获取下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect({ freightType: 'D' })).data || []
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 获取省市下拉选项
    async getAreasOption(data = { parentId: 0 }) {
      const areasRes = await areasOption(data)
      this.$set(this.commonContent[0], 'dataSource', areasRes)
      this.$set(this.commonContent[2], 'dataSource', areasRes)
    },
    // 获取并设置市的下拉选项
    async setProvince(params, type) {
      const res = await areasOption({ parentId: params })
      if (type === 'start') {
        this.$set(this.commonContent[1], 'dataSource', res || [])
      } else if (type === 'destination') {
        this.$set(this.commonContent[3], 'dataSource', res || [])
      }
    },
    // 运输方式下拉选项
    async getShipMethodOption(data = {}) {
      const id = this.popOptions.formDatas.transportWay ? this.popOptions.formDatas.transportWay.value : ''
      const select = this.popOptions.content[4].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await shipMethodOption(data, { id, data: [], type: this.type })
        this.$set(this.commonContent[4], 'dataSource', res)
      }
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新增国内运费')
      this.$set(this.commonContent[1], 'dataSource', [])
      this.$set(this.commonContent[3], 'dataSource', [])
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
      if (params.minWeight !== null && params.maxWeight !== null) {
        if ((params.maxWeight ? params.maxWeight * 1 : 0) < (params.minWeight ? params.minWeight * 1 : 0)) return this.$message.error('重量区间 前值不可大于后值')
      }
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            // 新增
            await freightAdd({ ...params, freightType: 'D' })
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/freight/add'), { ...params, freightType: 'D' }, JSON.stringify({ beforeText: `在'价格中心-运输成本-国内,新增一条记录`, beforeCode: { ...params, freightType: 'D' }}))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'freightType', 'transportWay', 'startPlace', 'startCity', 'destinationPlace', 'destinationCity', 'minWeight', 'maxWeight', 'freightCoefficient']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await freightModify({ ...obj, freightType: 'D' })
            const { beforeCode, afterCode } = this.compareData(this.oldForm, { ...obj, freightType: 'D' }, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/freight/modify'), { ...obj, freightType: 'D' }, JSON.stringify({ beforeText: `在'价格中心-运输成本-国内,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
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
      const res = await freightPage({ ...this.formDatas, ...data, freightType: 'D' })
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
        if (params.startPlace && params.startPlace.value) {
          this.setProvince(params.startPlace.value, 'start')
        }
        if (params.destinationPlace && params.destinationPlace.value) {
          this.setProvince(params.destinationPlace.value, 'destination')
        }
        this.$set(this.popOptions, 'formDatas', params)
        this.PopDialogHandle('编辑国内运费')
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
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/freight/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-运输成本-国内'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await freightEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/freight/status'), data, JSON.stringify({ beforeText: `在'价格中心-运输成本-国内'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
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
.search-box{
    /deep/ .el-form-item{
      width: 17%;
    }
  }
</style>
