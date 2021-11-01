<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search search-box">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:testCost:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
  testCostPage,
  testCostAdd,
  testCostDetail,
  testCostModify,
  testCostDelete,
  testCostEnabled,
  notaryIndustryList,
  brandList,
  getSearchSelect

} from './api/index.js'
import enableSwitch from '../../components/enableSwitch'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const maxReg = this.$getRules({ type: 'number', pattern: /^[0-9]\d{0,8}?$/, message: '请输入最多9位正整数', trigger: ['blur'] })
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大8位整数或保留1到2位小数', trigger: ['blur'] })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'brand',
        itemType: 'select',
        label: '品牌/最终买家:',
        popperClass: 'popperClassPrice',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'notaryIndustry',
        itemType: 'select',
        label: '公证行:',
        valueType: 'object',
        dataSource: [],
        filterable: true
      },
      {
        prop: 'testWay',
        itemType: 'select',
        label: '测试方式:',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '全套测试',
            value: 'F'
          },
          {
            label: '附加测试',
            value: 'A'
          }
        ]
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
          this.getRulePage({ ...params, enabled }, true)
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
        prop: 'brandName',
        label: '品牌/最终买家',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'notaryIndustryName',
        label: '公证行',
        showOverflowTooltip: true
      },
      {
        prop: 'testWay',
        label: '测试方式',
        showOverflowTooltip: true,
        formater: scope => scope.row.testWay === 'F' ? '全套测试' : '附加测试'
      },
      {
        prop: 'colorCount',
        label: '颜色个数',
        showOverflowTooltip: true
      },
      {
        prop: 'testPrice',
        label: '测试价格',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
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
          permitTag: 'price:testCost:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'brand',
        itemType: 'select',
        label: '品牌/最终买家:',
        popperClass: 'popperClassPrice',
        valueType: 'object',
        rules: [commonBlurReg],
        dataSource: [],
        filterable: true
      },
      {
        prop: 'notaryIndustry',
        itemType: 'select',
        label: '公证行:',
        valueType: 'object',
        rules: [commonBlurReg],
        dataSource: [],
        filterable: true
      },
      {
        prop: 'testWay',
        itemType: 'select',
        label: '测试方式:',
        rules: [commonBlurReg],
        dataSource: [
          {
            label: '全套测试',
            value: 'F'
          },
          {
            label: '附加测试',
            value: 'A'
          }
        ]
      },
      {
        prop: 'colorCount',
        itemType: 'input',
        label: '颜色个数:',
        valueType: 'object',
        dataSource: [],
        rules: [maxReg],
        maxlength: 9,
        filterable: true
      },
      {
        itemType: 'input',
        prop: 'testPrice',
        label: '测试价格',
        clearable: true,
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入测试价格'
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
        permitTag: ['price:testCost:modify'],
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
        permitTag: ['price:testCost:delete'],
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
      title: '新增测试成本',
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
        status: '',
        testWay: ''
      },
      searchData,
      columns,
      copyContent,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      commonContent,
      type: 'add',
      visible: false,
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
    this.getOption()
  },
  mounted() {},
  methods: {
    // 获取搜索栏下拉数据
    async setSearchSelect() {
      const res = (await getSearchSelect()).data || []
      this.searchData.forEach((ele, i) => {
        if (ele.prop && ele.valueType === 'object') {
          this.$set(this.searchData[i], 'dataSource', res[ele.prop] || [])
        }
      })
    },
    // 公行证下拉选项
    async getNotaryIndustryList(data = {}) {
      const id = this.popOptions.formDatas.notaryIndustry ? this.popOptions.formDatas.notaryIndustry.value : ''
      const select = this.popOptions.content[1].dataSource
      const bool = id && !select.find(item => item.value === id)
      // 当下拉选为空 或 编辑时当前值不在下拉列表中
      if (!select.length || bool) {
        const res = await notaryIndustryList(data, { id, data: [], type: this.type })
        this.$set(this.popOptions.content[1], 'dataSource', res)
      }
    },
    // 获取下拉数据(新建)
    async getOption(data = {}) {
      // 品牌商
      const brandRes = await brandList(data)
      this.$set(this.commonContent[0], 'dataSource', this.filterOption(brandRes.data || []))
    },
    filterOption(data, id = 'id', name = 'name') {
      const list = data.map(item => {
        return { value: String(item.id), label: item[name] }
      })
      return list
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新增测试成本')
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        this.getNotaryIndustryList()
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
            await testCostAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/testCost/add'), params, JSON.stringify({ beforeText: `在'价格中心-测试成本,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'brand', 'notaryIndustry', 'testWay', 'colorCount', 'testPrice']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await testCostModify(obj)
            const item = this.dataSource.find(ele => ele.id === obj.id)
            const { beforeCode, afterCode } = this.compareData(item, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/testCost/modify'), obj, JSON.stringify({ beforeText: `在'价格中心-测试成本,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
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
      const res = await testCostPage({ ...this.formDatas, ...data })
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
      const res = await testCostDetail(data)
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
        this.PopDialogHandle('编辑测试成本')
      }, 0)
    },
    // 删除
    async deleteData(id) {
      const res = await testCostDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.formDatas = {}
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/testCost/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-测试成本'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await testCostEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/testCost/status'), data, JSON.stringify({ beforeText: `在'价格中心-测试成本'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    }
  }
}
</script>
<style lang='scss' scoped>
.paymentPage {
  padding: 20px;
  padding-bottom: 0px;
}
.search-box{
    /deep/ .el-form-item{
      width: 17%;
    }
  }
</style>
<style lang="scss">
.paymentPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
</style>
