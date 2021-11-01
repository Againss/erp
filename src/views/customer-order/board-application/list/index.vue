<!--
 * @Descripttion: 剪样申请列表_v2.0.1_新增
 * @Author: xj
 * @Date: 2021-03-04 14:01:19
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-05 19:31:24
-->
<template>
  <div class="sample-orders">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- tab页签切换 -->
    <div class="tabchange">
      <div class="tabchange_he">
        <el-tabs v-model="activeName" class="puactive_class" @tab-click="handleClick">
          <el-tab-pane name="-1">
            <span slot="label" class="labelIndex" tabindex="-1">{{ `全部 (${totalNum.all||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="0">
            <span slot="label" class="labelIndex" tabindex="0">{{ `待提交(${totalNum.waitSubmit||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label" class="labelIndex" tabindex="1">{{ `待审核(${totalNum.waitAudit||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="labelIndex" tabindex="2">{{ `进行中(${totalNum.processing||0})` }} </span>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label" class="labelIndex" tabindex="3">{{ `已完结(${totalNum.finished||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label" class="labelIndex" tabindex="4">{{ `已取消(${totalNum.cancelled||0})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 新建 -->
        <div class="createbutton">
          <div class="createbutton_btn">
            <div class="cr_btn_left">
              <el-button
                v-permission="['customerOrder:cutSampleApply:add']"
                size="small"
                type="primary"
                @click="addHandler"
              >新建</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        ref="filterTable"
        tooltip-effect="light"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        @filter-change="filterChange"
      />
    </div>
  </div>
</template>

<script>
import { list, orderStatusNum } from '../api/index'
import { setOrderFun } from '@/views/customer-order/board-application/api/com'
export default {
  name: 'BoardApplication',
  mixins: [setOrderFun],
  props: {},
  data() {
    const searchData = {
      _sourceNumber: {
        prop: 'sourceNumber',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '来源单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.sourceNumber = ''
        },
        clearable: true
      },
      _cylinderNumber: {
        prop: 'cylinderNumber',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '缸号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.cylinderNumber = ''
        },
        clearable: true
      },
      _productCode: {
        prop: 'productCode',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '产品编码',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.productCode = ''
        },
        clearable: true
      },
      _createdName: {
        prop: 'createdName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '创建人',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.createdName = ''
        },
        clearable: true
      },
      _receiverCompanyName: {
        prop: 'receiverCompanyName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '收件公司',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.receiverCompanyName = ''
        },
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const newData = JSON.parse(JSON.stringify(params))
          this.searchFormDatas = newData
          this.list(newData)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 待提交状态选项
    const submitStatus = [{ text: '草稿', value: '0' }, { text: '已驳回', value: '2' }]
    // 待审核状态选项
    const reviewStatus = [{ text: '新单待审', value: '1' }, { text: '进行中', value: '3' }]
    // 已完结  已取消
    const finished = [{ text: '已完结 ', value: '5' }, { text: '已取消', value: '4' }]
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        fixed: true
      },
      _code: {
        prop: 'code',
        label: '申请单号',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.code || '-',
        handle: (scope) => {
          this.$router.push(
            `/customer-order/board-application/detail/${scope.row.uuid}/show`
          )
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _thingType: {
        prop: 'thingType',
        label: '内部/外部件',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.thingType ? (scope.row.thingType === 1 ? '内部件' : '外部件') : '-'
        }
      },
      _createdName: {
        prop: 'createdName',
        label: '创建人',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.createdName || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _addressee: {
        prop: 'addressee',
        itemType: 'input',
        minWidth: '150',
        label: '收件人',
        clearable: true,
        formater: scope => scope.row.addressee || '-'
      },
      _receiverCompanyName: {
        prop: 'receiverCompanyName',
        label: '收件公司',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.receiverCompanyName || '-'
      },
      _tagLanguage: {
        prop: 'tagLanguage',
        label: '标签语言',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.tagLanguage ? (scope.row.tagLanguage === 1 ? '中文' : '英文') : '-'
        }
      }
    }
    // 列表操作栏按钮
    const popOperates = null
    const pagination = {
      currentChange: val => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        const op = JSON.parse(JSON.stringify(this.activeName))
        this.list(com, false, this.isArrayData || [], !!this.isArrayData.length, op)
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        const op = JSON.parse(JSON.stringify(this.activeName))
        this.list(com, false, this.isArrayData || [], !!this.isArrayData.length, op)
      }
    }
    return {
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      },
      activeName: '0',
      searchData,
      dataSource: [],
      columns,
      row: {},
      popOperates,
      pagination,
      type: 'add',
      sellTeamData: [],
      totalNum: {},
      submitStatus,
      reviewStatus,
      finished,
      isArrayData: []
    }
  },
  watch: {
  },
  created() {
    this.list({}, false)
  },
  mounted() { },
  methods: {
    // tab页签切换
    handleClick(tabsObj) {
      this.isArrayData = []
      const tabIndex = tabsObj.name
      this.$refs.filterTable.$refs.table.clearFilter()
      if (this.activeName === '1') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._status
        this.columns = omCom
      } else if (this.activeName === '0') {
        const omCom = this.$utils.deepClone(this.columns)
        omCom._status = {
          prop: 'status',
          label: '状态',
          minWidth: '110',
          columnKey: 'status',
          filters: this.submitStatus,
          formater: (scope) => {
            return this.getStatusFun(scope.row.status)
          }
        }
        this.columns = omCom
      } else if (this.activeName === '-1') {
        const omCom = this.$utils.deepClone(this.columns)
        omCom._status = {
          prop: 'status',
          label: '状态',
          minWidth: '110',
          columnKey: 'status',
          filters: [...this.submitStatus, ...this.reviewStatus, ...this.finished],
          formater: (scope) => {
            return this.getStatusFun(scope.row.status)
          }
        }
        this.columns = omCom
      } else if (this.activeName === '3') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._status
        this.columns = omCom
      } else if (this.activeName === '4') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._status
        this.columns = omCom
        console.log('omc', this.columns)
      } else {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._status
        this.columns = omCom
      }
      this.list({}, false, [], false, tabIndex)
    },
    addHandler() {
      this.$router.push(`/customer-order/board-application/create`)
    },
    // 获取列表数据
    async list(data = {}, fresh, isStstus = [], tup = false, tabIndex = '-1') {
      let obj = { status: [] }
      if (isStstus.length) {
        const omCom = this.$utils.deepClone(isStstus)
        const map1 = omCom.map(x => x * 1)
        obj = { status: map1 }
      } else {
        if (this.activeName === '2' || fresh) {
          obj = { status: [3] }
        } else if (this.activeName === '-1') {
          obj = { status: [] }
        } else if (this.activeName === '0') {
          obj = { status: [0, 2] }
        } else if (this.activeName === '1') {
          obj = { status: [1] }
        } else if (this.activeName === '3') {
          obj = { status: [5] }
        } else {
          obj = { status: [4] }
        }
      }
      const res = await list({ ...data, ...obj, ...this.searchFormDatas })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      this.totalNum = {}
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      let dataObj = { ...data, ...this.searchFormDatas }
      if (tup) {
        dataObj = { ...data, ...obj, ...this.searchFormDatas }
      }
      const amountRes = await orderStatusNum(dataObj)
      if (fresh) {
        this.activeName = '0'
      }
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
    },
    filterChange(row) {
      const op = JSON.parse(JSON.stringify(this.activeName))
      this.isArrayData = row.status
      this.list({}, false, this.isArrayData || [], true, op)
    }
  }
}
</script>

<style lang="scss" scoped>
.sample-orders {
  padding: 20px;
  padding-bottom: 0;
  .el-table_1_column_1 span {
    color: #0000ff;
  }
  .tabchange {
    display: flex;
    position: relative;
    padding-bottom: 0;
    background-color: #fff;
    border-bottom: 1px solid #dfe6ec;
    .tabchange_he {
      display: flex;
      width: 100%;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #3c4043;
      text-align: center;
      /deep/ .el-tabs__header {
        margin-bottom: 0px;
      }
      /deep/ .el-tabs__nav-wrap::after {
        height: 0px !important;
      }
      /deep/ .el-tabs__item {
        height: 60px;
        line-height: 60px;
        padding: 0 26px;
      }
    }
    .createbutton {
      line-height: 60px;
      margin-right: 5px;
    }
    .puactive_class {
      flex: 1;
    }
  }
  /deep/  .labelIndex{
    padding: 0 15px;
    border: 0 none;
    outline: none;
  }
}
.createbutton_btn {
  display: flex;
  .cr_btn_left {
    margin-right: 15px;
  }
  .cr_btn_right {
    position: relative;
    .cr_btn_cm {
      position: absolute;
      right: -20px;
      top: 59px;
      z-index: 1000;
    }
  }
}
.page-table /deep/ .el-table--medium th {
  height: 44px;
  padding: 0 !important;
}
</style>
