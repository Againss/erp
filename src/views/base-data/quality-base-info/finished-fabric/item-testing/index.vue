<template>
  <div class="product-inspection item-testing-wrpa">
    <div class="tab-wrap">
      <!-- 新增菜单按钮 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-if="$permission(['baseData:qa:finishedFabricPhysicalBrandStandard:page'])" name="brand">
          <span slot="label" tabindex="1" class="labelIndex">品牌标准</span>
        </el-tab-pane>
        <el-tab-pane v-if="$permission(['baseData:qa:finishedFabricPhysicalTestItems:page'])" name="checkAgencies">
          <span slot="label" tabindex="2" class="labelIndex">检测项目</span>
        </el-tab-pane>
        <el-tab-pane v-if="$permission(['baseData:qa:finishedFabricPhysicalOrganization:page'])" name="testItems">
          <span slot="label" tabindex="3" class="labelIndex">检测机构</span>
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
      <div>
        <cs-custom-table
          ref="tableList"
          tooltip-effect="dark"
          row-key="id"
          :tree-props="{children: 'secondList'}"
          :columns="columns"
          :data-source="dataSource"
          :operates="popOperates"
          :pagination="pagination"
          edit-type="pop"
          :table-scrollx="true"
          @sort-change="changeSort"
        />
      </div>

    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <!-- 品牌标准弹框 -->
    <div class="bran-pop">
      <cs-custom-pop ref="branPop" :options="brandPopOptions" />
    </div>
    <!-- 品牌标准-新增项目弹框 -->
    <div class="bran-add-pop">
      <cs-custom-pop ref="branAddPop" :options="popOptionsAdd" />
    </div>
  </div>
</template>

<script>
import * as api from './api/index.js'
import { tabColumns } from './common/tabColumns.js'// 所有表格配置项
import { popOptions } from './common/popOptions.js'// 【检测项目】【检测机构】弹框配置
import { brandPopOptions } from './common/brandPopOptions.js'// 品牌标准弹框配置
import { brandStandardsAdd } from './common/brandStandardsAdd.js'// 品牌标新增项目弹框
export default {
  mixins: [tabColumns, popOptions, brandPopOptions, brandStandardsAdd],
  data() {
    const commonChangeReg = this.$getRules({})
    return {
      commonChangeReg,
      activeName: 'brand',
      formOtions: {
        size: 'small',
        inline: true
      },
      dataSource: [],
      typeObj: {
        brand: '品牌标准',
        checkAgencies: '检测项目',
        testItems: '检测机构'
      },
      formDatas: {
        ordersOrder: 1
      },
      brandPageList: [],
      isEdit: false,
      copyRow: {}
    }
  },
  mounted() {
    this.getPageData()// 列表page
  },
  methods: {
    async getBAllList() {
      const res = await api.getBAllList()
      // 表格数据组装
      const itemsList = res.data || []
      for (let i = 0; i < itemsList.length; i++) {
        itemsList[i].edit = this.isEdit
      }
      this.$set(this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList, 'dataSource', itemsList)
      console.log(res)
    },
    // 排序
    sortFn(a, b) {
      if (a.firstOrders === b.firstOrders) {
        return a.secondardOrders - b.secondardOrders
      } else if (b.firstOrders > a.firstOrders) {
        return a.firstOrders - b.firstOrders
      } else if (b.firstOrders < a.firstOrders) {
        return a.firstOrders - b.firstOrders
      }
    },
    // 排序点击事件
    changeSort(e) {
      this.formDatas.ordersOrder = e.order === 'ascending' ? 0 : 1
      this.getPageData()
    },
    // 点击tab
    handleClick(e) {
      this.dataSource = []
      this.activeName = e.name
      this.formDatas = {}
      // this.formDatas = { ordersOrder: 0 }
      if (e.name === 'brand') {
        // 品牌标准
        this.columns = this.brandColumns
        this.$set(this.columns._operatorTime, 'sortable', false)
      } else if (e.name === 'checkAgencies') {
        // 检测项目
        this.columns = this.checkAgenciesColumns
        this.$set(this.columns._operatorTime, 'sortable', false)
        this.popOptions.content = this.checkAgenciesPop
      } else {
        // 检测机构
        this.popOptions.content._operatorTime = this.checkAgenciesPop
        this.columns = this.testItemsColumns
        this.$set(this.columns._operatorTime, 'sortable', true)
        this.popOptions.content = this.testItemsPop
      }
      this.getPageData()
    },
    async physicalTestItemsLsit(params, type) {
      this.$set(this.popOptionsAdd, 'visible', true)
      const res = await api.physicalTestItemsLsit({
        parentId: params.parentId,
        isEnabled: 1,
        status: 'Y'
      })
      // 初始化弹框二级内容
      const datas = res && res.data && res.data.map(v => {
        return {
          label: v.name,
          value: v.id,
          ...v
        }
      })

      if (type === 0) {
        this.popOptionsAdd.content._firstItem.dataSource = datas
        this.popOptionsAdd.content._secondItem.dataSource = []
        this.$set(this.popOptionsAdd.content._secondItem, 'rules', [])
      } else {
        this.popOptionsAdd.content._secondItem.dataSource = datas || []
        // 如果下二级下拉有值必选
        if (datas.length) {
          this.$set(this.popOptionsAdd.content._secondItem, 'rules', [this.commonChangeReg])
        } else {
          this.$set(this.popOptionsAdd.content._secondItem, 'rules', [])
        }
      }
    },
    // 处理表格的合并的数据，找到要合并的数组
    getSpanArr(data) {
      var spanArr = []
      var pos = 0
      data.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          pos = 0
        } else {
          if (data[index].firstItemsId === data[index - 1].firstItemsId) {
            spanArr[pos] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            pos = index
          }
        }
      })
      return spanArr
    },
    async brandPageDataPage() {
      const res = await api.brandPageDataPage()
      const datas = res.data
      if (datas) {
        this.$set(this.brandPopOptions.content._referenceStandard, 'dataSource', datas.map(v => {
          return {
            ...v,
            label: v.brand.label + '/' + v.clothType.label,
            value: v.id
          }
        }))
      }
    },
    // 检测项目弹框排序获最大值
    async ordersMax(parentId, form = {}) {
      parentId = parentId || 0
      if (this.type === 'add') {
        const res = await api[this.activeName + 'OrdersMax']({ parentId })
        const data = res.data ? res.data + 1 : 1
        this.$set(this.popOptions, 'formDatas', { orders: data })
      }
    },
    // 获取品牌下拉
    async getBrandSelet() {
      const res = await api.brandSelet({ enabled: 'Y' })
      const datas = res.data || []
      if (datas) {
        this.$set(this.brandPopOptions.content._brand, 'dataSource', datas.map(v => {
          return {
            label: v.name,
            value: v.id
          }
        }))
      }
    },
    // 订单类型下拉接口
    async getOptionConfig(params = { fieldName: '成衣类型', pageName: '大货订单' }) {
      const res = await api.optionConfigSelect(params)
      if (this.$pub.responseValidate(res)) {
        const datas = res.data
        if (datas && datas.length > 0) {
          this.$set(this.brandPopOptions.content._clothType, 'dataSource', datas.map(v => {
            return {
              label: v.fieldValue,
              value: v.fieldValueId
            }
          }))
        }
      }
    },
    // 获取所属下拉数据
    async checkAgenciesList(data = {}) {
      const res = await api.checkAgenciesList(data)
      const list = res.data && res.data.map(v => {
        return {
          value: v.parentName,
          label: v.parentName
        }
      })
      this.$set(this.popOptions.content._parent, 'dataSource', list)
    },
    // 获取详情
    async getInfo(data = {}, reference) {
      const res = await api[this.activeName + 'Info'](data)
      if (res.code !== 200) {
        return false
      }

      this.row = res.data
      this.copyRow = this.$utils.deepClone(res.data || {})
      this.setFormDatas({ ...res.data }, reference)
    },
    // 设置表单数据
    setFormDatas(params, reference) {
      setTimeout(() => {
        if (reference) {
          // 引用只赋值表格数据
          // 表格数据组装
          const itemsList = params.qaFinishedFabricPhysicalBrandStandardItemsList || []
          for (let i = 0; i < itemsList.length; i++) {
            itemsList[i].edit = this.isEdit
          }
          this.$set(this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList, 'dataSource', itemsList)
        } else {
          this.$set(this.checkAgenciesPop._parent, 'dataSource', [
            { value: params.name, label: params.parent }
          ])
          // 品牌数据
          if (this.activeName === 'brand') {
            this.$set(this.brandPopOptions.content._brand, 'dataSource', [params.brand])
            this.$set(this.brandPopOptions.content._clothType, 'dataSource', [params.clothType])
            // 表格数据组装
            const itemsList = params.qaFinishedFabricPhysicalBrandStandardItemsList || []
            for (let i = 0; i < itemsList.length; i++) {
              itemsList[i].edit = this.isEdit
            }
            this.$set(this.brandPopOptions, 'formDatas', params)
            this.$set(this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList, 'dataSource', itemsList)
          } else {
            this.$set(this.popOptions, 'formDatas', params)
          }
          // 检测项目
          if (this.activeName === 'checkAgencies') {
            if (params.grade !== 0) {
              this.$set(this.popOptions.content._parent, 'dataSource', [{
                value: params.parentId || '',
                label: params.parentName || ''
              }])
              params.parent = {
                value: params.parentId || '',
                label: params.parentName || ''
              }
            }

            this.checkGrade(params.grade, true)
            this.$set(this.popOptions, 'formDatas', params)
          }
        }
      }, 0)
    },
    // 获取列表
    async getPageData(data = {}) {
      const params = { ...this.formDatas, ...data }
      if (this.activeName === 'brand') {
        params.brandName = params.name
        delete params.name
        delete params.ordersOrder
      } else if (this.activeName === 'testItems') {
        params.nameQuery = params.name
        delete params.name
      }

      const res = await api[this.activeName + 'PageData'](params)
      const listData = res.data && res.data.list ? res.data.list : []
      // debugger
      listData.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      this.$nextTick(() => {
        this.dataSource = listData || []
      })
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
        checkAgencies: '/baseData/qa/finishedFabricPhysicalTestItems/delete',
        testItems: '/baseData/qa/finishedFabricPhysicalOrganization/delete'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]}删除一条的记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'DEL', api: apis[this.activeName], description, appId: 'id' })
    },
    // 新增或者编辑
    addOrEdit(data) {
      const datas = this.$utils.deepClone(data || {})
      if (this.activeName === 'checkAgencies') { // 检测项目
        if (datas.grade === 0) {
          datas.parentId = datas.grade
          datas.parentName = ''
        } else {
          datas.parentId = datas.parent.value
          datas.parentName = datas.parent.label
        }
        delete datas.parent
      }
      if (this.type === 'add') {
        this.addData(datas)
      } else if (this.type === 'edit') {
        this.modifyData(datas)
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
      if (this.activeName === 'brand') {
        this.brandPopOptions.formDatas = {}
      }
      this.$refs.tableList.$refs.table.clearSort()
      this.getPageData()
      const apis = {
        brand: '/baseData/qa/finishedFabricPhysicalBrandStandard/modify',
        checkAgencies: '/baseData/qa/finishedFabricPhysicalTestItems/modify',
        testItems: '/baseData/qa/finishedFabricPhysicalOrganization/modify'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]}新增一条的记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'INSERT', api: apis[this.activeName], description, appId: 'id' })
    },
    // 点击查看品牌
    viewDetails(scope) {
      this.$set(this.brandPopOptions, 'okText', '编辑')
      this.getInfo({ id: scope.row.id })
      this.PopDialogHandle('查看' + this.typeObj[this.activeName])
    },
    brandModify() {
      this.isEdit = true
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
        brand: '/baseData/qa/finishedFabricPhysicalBrandStandard/modify',
        checkAgencies: '/baseData/qa/finishedFabricPhysicalTestItems/modify',
        testItems: '/baseData/qa/finishedFabricPhysicalOrganization/modify'
      }
      const description = {
        beforeText: `在质量基础数据-${this.typeObj[this.activeName]}将${JSON.stringify({ 'id': params.id })}`,
        afterText: '修改为',
        ...{ beforeCode, afterCode }
      }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'UPDATE', api: apis[this.activeName], description, appId: 'id' })
    },

    // 启用/禁用事件
    async statusChange(params = {}) {
      const res = await api[this.activeName + 'StatusChange'](params)
      if (res.code !== 200) {
        return false
      }
      this.$message.success(params.isEnabled === 1 ? '启用状态成功' : '禁用状态成功')
      this.getPageData()
      const apis = {
        brand: '/baseData/qa/finishedFabricPhysicalBrandStandard/isEnabled',
        checkAgencies: '/baseData/qa/finishedFabricPhysicalTestItems/isEnabled',
        testItems: '/baseData/qa/finishedFabricPhysicalOrganization/isEnabled'
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
        checkAgencies: '/baseData/qa/finishedFabricPhysicalTestItems/check',
        testItems: '/baseData/qa/finishedFabricPhysicalOrganization/check'
      }
      const description = { beforeText: `在质量基础数据-${this.typeObj[this.activeName]}审核一条记录`, beforeCode: params }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'UPDATE', api: apis[this.activeName], description, appId: 'id' })
    },
    addList() {
      this.isEdit = true
      this.$set(this.brandPopOptions, 'okText', '保存')
      this.addHandle()
    },
    // 编辑按钮事件
    editHandle(scope) {
      if (this.activeName === 'brand') {
        this.brandPageDataPage()// 品牌列表list
      }
      this.getInfo({ 'id': scope.row.id })
      this.PopDialogHandle('修改' + this.typeObj[this.activeName])
      this.type = 'edit'
      if (this.activeName === 'checkAgencies') {
        this.checkAgenciesList()
        this.$set(this.popOptions.content._grade, 'disabled', true)
      }
    },
    // 新增按钮事件
    addHandle() {
      if (this.activeName === 'checkAgencies') {
        this.ordersMax()// 获取顺序最大值
      }
      this.type = 'add'
      if (this.activeName === 'checkAgencies') {
        this.checkAgenciesList()
        this.checkGrade(0)
        this.$set(this.popOptions.content._grade, 'disabled', false)
        this.$set(this.popOptions.content._parent, 'disabled', false)
      }
      if (this.activeName === 'brand') {
        this.getBAllList()
        // this.$set(this.brandPopOptions, 'visible', !this.brandPopOptions.visible)
        this.PopDialogHandle('新增' + this.typeObj[this.activeName])
        // this.$set(this.brandPopOptions.content._qaFinishedFabricPhysicalBrandStandardItemsList, 'dataSource', [])
        this.brandPageDataPage()// 品牌列表list
      } else {
        this.PopDialogHandle('新增' + this.typeObj[this.activeName])
        this.$set(this.popOptions.content._name, 'disabled', false)
      }
      this.popOptions.formDatas = { grade: 0 }
    },

    // 设置弹窗标题及显示隐藏
    PopDialogHandle(val) {
      if (this.activeName === 'brand') {
        this.$set(this.brandPopOptions, 'visible', !this.brandPopOptions.visible)
        if (val) {
          this.$set(this.brandPopOptions, 'title', val)
        }
      } else {
        this.$set(this.popOptions, 'visible', !this.popOptions.visible)
        if (val) {
          this.$set(this.popOptions, 'title', val)
        }
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
.brand-standards-pop-table{
  /deep/ .el-form-item.el-form-item--small {
    margin: 0 !important;
  }

}

</style>
<style lang="scss">
  .product-inspection{
    .brand-standards-add{
      display: flex;
      align-items: center;
      font-size: 12px;
      justify-content: flex-end;
      background: rgb(24, 144, 255);
      border-color: rgb(24, 144, 255);
      color: rgb(255, 255, 255);
      height: 32px;
      border-radius: 4px;
      padding: 0px 15px;
      margin-bottom: 15px;
      margin-left: auto;
      margin-right: 12px;
      cursor: pointer;
    }
    .brand-standards-pop-table{
      .el-form-item.el-form-item--small{
        margin: 0 !important;
      }
      .has-gutter{
        .rules-class-name{
          position: relative;
          &::before{
            content: "*";
            position: absolute;
            left: 3px;
            top: 10px;
            color: #ff4949;
          }
        }
      }
    }
    .secondItemTag{
      .el-select__tags-text{
        display: inline-block;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-tag__close{
        top: -6px;
        right:-6px;
      }
    }
  }

</style>
