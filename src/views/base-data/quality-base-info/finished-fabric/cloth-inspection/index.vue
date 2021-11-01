<template>
  <div class="product-inspection">
    <div class="tab-wrap">

      <!-- 新增菜单按钮 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-if="$permission(['baseData:qa:finishedFabricPointsDeductedItems:page'])" name="deduct">
          <span slot="label" tabindex="1" class="labelIndex">扣分项目（单匹）</span>
        </el-tab-pane>
        <el-tab-pane v-if="$permission(['baseData:qa:finishedFabricOtherProjects:page'])" name="other">
          <span slot="label" tabindex="2" class="labelIndex">其他项目</span>
        </el-tab-pane>
        <el-tab-pane v-if="$permission(['baseData:qa:finishedFabricProblemType:page'])" name="problem">
          <span slot="label" tabindex="3" class="labelIndex">问题类型</span>
        </el-tab-pane>
      </el-tabs>
      <!-- 搜索页面 -->
      <div class="search">
        <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      </div>
      <!-- 新增菜单按钮 -->
      <div class="add-btn">
        <el-button v-if="this.$permission([permitAdd])" type="primary" size="small" @click="addList">新增</el-button>
      </div>
    </div>
    <!-- 列表 ）-->
    <div class="page-table">
      <cs-custom-table
        ref="tableList"
        table-scrollx
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperate"
        :pagination="pagination"
        edit-type="pop"
        @sort-change="changeSort"
      />
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import * as api from './api/index.js'
import { tabColumns } from './common/tabColumns.js'// 所有表格配置项
import { popOptions } from './common/popOptions.js'// 所有弹框配置
export default {
  mixins: [tabColumns, popOptions],
  data() {
    const popOptions = {}
    return {
      popOptions,
      popOperate: {},
      activeName: 'deduct',
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      dataSource: [],
      typeObj: {
        deduct: '扣分项目（单匹）',
        other: '其它项目',
        problem: '问题类型'
      },
      row: {},
      copyRow: {}
    }
  },

  mounted() {
    this.getPageData()
    this.popOperate = this.popOperates
  },

  methods: {
    // 排序点击事件
    changeSort(e) {
      this.formDatas.ordersOrder = e.order === 'ascending' ? 0 : 1
      this.getPageData()
    },
    // 点击tab
    handleClick(e) {
      this.activeName = e.name
      this.dataSource = []
      this.formDatas = {}
      this.popOperate = this.popOperates
      if (e.name === 'deduct') {
        // 扣分项目（单匹）
        this.columns = this.deductPointsColumns
        this.popOptions.content = this.deductPop
        this.$set(this.searchData[1], 'isShow', true)
      } else if (e.name === 'other') {
        // 其他项目
        this.columns = this.otherProjectColumns
        this.popOptions.content = this.otherPop
        this.$set(this.searchData[1], 'isShow', true)
      } else {
        // 问题类型
        this.columns = this.problemColumns
        this.popOptions.content = this.problemPop
        this.$set(this.searchData[1], 'isShow', false)
      }
      this.getPageData()
    },
    // 弹框排序获最大值
    async ordersMax() {
      if (this.type === 'add') {
        const res = await api[this.activeName + 'OrdersMax']()
        const data = res.data ? res.data + 1 : 1
        this.$set(this.popOptions.formDatas, 'orders', data)
      }
    },
    // 获取品牌下拉
    async getBrandSelet() {
      const res = await api.brandSelet({ enabled: 'Y' })
      if (res.data) {
        this.$set(this.popOptions.content._factoryName, 'dataSource', res.data.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      }
    },
    // 订单类型下拉接口
    async getOptionConfig(params = { fieldName: '成衣类型', pageName: '大货订单' }) {
      const res = await api.optionConfigSelect(params)
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: '' + item.fieldValueId, label: item.fieldValue }))
        }
      }
      this.$set(this.popOptions.content._swatchesUsers, 'dataSource', formaterList)
    },
    // 获取详情
    async getInfo(data = {}) {
      const res = await api[this.activeName + 'Info'](data)
      if (res.code !== 200) {
        return false
      }
      this.row = res.data
      this.copyRow = this.$utils.deepClone(res.data || {})
      this.setFormDatas({ ...res.data })
    },
    // 获取列表
    async getPageData(data = {}) {
      const res = await api[this.activeName + 'PageData']({ ...this.formDatas, ...data })
      const listData = res.data && res.data.list ? res.data.list : []
      listData.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
    },
    // 删除操作
    async deleteData(params) {
      const res = await api[this.activeName + 'DeleteData']({ 'id': params.id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getPageData()
      const apis = {
        deduct: '/baseData/qa/finishedFabricPointsDeductedItems/delete',
        other: '/baseData/qa/finishedFabricOtherProjects/delete',
        problem: '/baseData/qa/finishedFabricProblemType/delete'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]}删除一条的记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'DEL', api: apis[this.activeName], description, appId: 'id' })
    },
    // 新增或者编辑
    addOrEdit(data) {
      if (this.type === 'add') {
        this.addData(data)
      } else if (this.type === 'edit') {
        this.modifyData(data)
      }
    },
    // 新增
    async addData(params) {
      const res = await api[this.activeName + 'AddData']({ ...params })
      if (res.code !== 200) {
        return false
      }
      this.PopDialogHandle()
      this.$message.success('添加成功')
      this.formDatas = {}
      this.$refs.tableList.$refs.table.clearSort()
      this.getPageData()

      const apis = {
        deduct: '/baseData/qa/finishedFabricPointsDeductedItems/add',
        other: '/baseData/qa/finishedFabricOtherProjects/add',
        problem: '/baseData/qa/finishedFabricProblemType/add'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]}新增一条的记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'INSERT', api: apis[this.activeName], description, appId: 'id' })
    },
    // 修改提交操作
    async modifyData(data) {
      const params = this.$utils.deepClone(data || {})
      const res = await api[this.activeName + 'ModifyData'](params)
      if (res.code !== 200) {
        return false
      }
      this.PopDialogHandle()
      this.$message.success('修改成功')
      this.formDatas = {}
      this.$refs.tableList.$refs.table.clearSort()
      this.getPageData()
      const { beforeCode, afterCode } = this.$utils.compareData(this.copyRow, params, 'id')
      const apis = {
        deduct: '/baseData/qa/finishedFabricPointsDeductedItems/modify',
        other: '/baseData/qa/finishedFabricOtherProjects/modify',
        problem: '/baseData/qa/finishedFabricProblemType/modify'
      }
      const description = {
        beforeText: `在质量基础数据-${this.typeObj[this.activeName]}将${JSON.stringify({ 'id': params.id })}`,
        afterText: '修改为',
        ...{ beforeCode, afterCode }
      }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'UPDATE', api: apis[this.activeName], description, appId: 'id' })
    },

    // 启用/禁用事件
    async statusChange(data = {}, scope) {
      const params = this.$utils.deepClone(data || {})
      await api[this.activeName + 'StatusChange'](params)
      this.$message.success(params.isEnabled === 1 ? '启用状态成功' : '禁用状态成功')
      this.getPageData()

      const apis = {
        deduct: '/baseData/qa/finishedFabricPointsDeductedItems/isEnabled',
        other: '/baseData/qa/finishedFabricOtherProjects/isEnabled',
        problem: '/baseData/qa/finishedFabricPointsDeductedItems/isEnabled'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]} ${params.isEnabled ? '启用' : '禁用'}一条记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'UPDATE', api: apis[this.activeName], description, appId: 'id' })
    },

    // 审核事件
    async checkStatus(params = {}) {
      const res = await api[this.activeName + 'CheckStatus']({ id: params.id, status: 'Y' })
      if (res.code !== 200) {
        return false
      }

      this.$message.success('审核成功')
      this.getPageData({ type: this.activeName })
      const apis = {
        deduct: '/baseData/qa/finishedFabricPointsDeductedItems/check',
        other: '/baseData/qa/finishedFabricOtherProjects/check',
        problem: '/baseData/qa/finishedFabricPointsDeductedItems/check'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]}审核一条记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'UPDATE', api: apis[this.activeName], description, appId: 'id' })
    },
    addList() {
      this.addHandle()
    },
    // 编辑按钮事件
    editHandle(params) {
      this.PopDialogHandle('修改' + this.typeObj[this.activeName])
      this.type = 'edit'
      this.getInfo({ 'id': params.row.id })
    },
    // 新增按钮事件
    addHandle() {
      this.ordersMax()
      this.PopDialogHandle('新增' + this.typeObj[this.activeName])
      this.type = 'add'
      this.popOptions.formDatas = {}
      this.$set(this.popOptions.content._name, 'disabled', false)
    },
    // 设置表单数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 设置弹窗标题及显示隐藏
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    }
  }
}

</script>

<style scoped lang="scss">
.product-inspection {
  padding: 20px;
  padding-bottom: 0;
  .labelIndex{
    padding: 0 10px;
    border: 0 none;
    outline: none;
  }
  .tab-wrap {
    position: relative;
    .add-btn{
      position: absolute;
      right: 20px;
      top: 13px;
      z-index: 2;
    }
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
}

</style>
