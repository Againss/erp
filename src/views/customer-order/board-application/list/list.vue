<!--
 * @Descripttion: 寄板列表已经打印
 * @Author: admin
 * @Date: 2021-03-04 14:01:19
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-05 19:32:14
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
          <el-tab-pane name="1">
            <span slot="label" class="labelIndex" tabindex="1">{{ `剪板中(${totalNum.shearing||0})` }}</span>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="labelIndex" tabindex="2">{{ `已剪板(${totalNum.sheared||0})` }} </span>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label" class="labelIndex" tabindex="3">{{ `已取消(${totalNum.cancel||0})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 新建 -->
        <div class="createbutton">
          <div v-if="activeName !== '3'" class="createbutton_btn">
            <div class="cr_btn_left">
              <el-button
                v-permission="['customerOrder:cutSampleRecords:print']"
                size="small"
                @click="printLabel('1')"
              >打印标签</el-button>
            </div>
            <div v-if="activeName === '1'" class="cr_btn_left">
              <el-button
                v-permission="['customerOrder:cutSampleRecords:add']"
                size="small"
                type="primary"
                @click="SampleReceiving"
              >布样接收</el-button>
            </div>
            <div v-if="activeName !== '1'" class="cr_btn_left">
              <el-button
                v-permission="['customerOrder:cutSampleRecords:finished']"
                size="small"
                type="primary"
                @click="SampleReceiving"
              >完成剪板</el-button>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- 列表          -->
    <div class="page-table">
      <cs-custom-table
        ref="filterTable"
        tooltip-effect="light"
        :columns="columns"
        :table-scrollx="true"
        :highlight-current-row="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        @row-click="rowClickIndex"
        @filter-change="filterChange"
      />
    </div>
    <!-- 纱线编码弹窗 -->
    <codePop
      ref="codePop"
      :tab="activeName"
      :set-parent-data-handle="setParentHandle"
    />
  </div>
</template>

<script>
import { listArray, orderStatusNumArray } from '../api/index'
import moreShow from '@/views/customer-order/public/components/moreShow'
import { setOrderFun } from '@/views/customer-order/board-application/api/com'
import codePop from './codePop'
export default {
  name: 'BoardApplicationLis',
  components: {
    codePop
  },
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
      _proposerName: {
        prop: 'proposerName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '申请人',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.proposerName = ''
        },
        clearable: true
      },
      _applyCode: {
        prop: 'applyCode',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '申请单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.applyCode = ''
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
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        fixed: true
      },
      _receiveCode: {
        prop: 'receiveCode',
        label: '收布条码',
        minWidth: '150',
        fixed: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.receiveCode || '-'
      },
      _sourceNumber: {
        prop: 'sourceNumber',
        label: '来源单号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.sourceNumber || '-'
      },
      _productInfo: {
        prop: 'productInfo',
        label: '产品信息',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'productInfo'
        }
      },
      _cutClothQuantity: {
        prop: 'cutClothQuantity',
        label: '剪布数量/单位',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.cutClothQuantity + ' ' + scope.row.unitName) || '-'
        }
      },
      _cutSampleRequirements: {
        prop: 'cutSampleRequirements',
        label: '剪板要求',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.cutSampleRequirements || '-'
      },
      _applyCode: {
        prop: 'applyCode',
        label: '申请单号',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.applyCode || '-'
      },
      _proposerName: {
        prop: 'proposerName',
        label: '申请人',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.proposerName || '-'
      },
      _deliveryTime: {
        prop: 'deliveryTime',
        label: '要求寄出时间',
        isShow: (scope) => {
          return this.activeName !== '3'
        },
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.deliveryTime ? this.$filters.parseTime(scope.row.deliveryTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _isPrint: {
        prop: 'isPrint',
        label: '标签是否打印',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.isPrint === 0 ? '否' : '是'
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
      activeName: '1',
      searchData,
      dataSource: [],
      columns,
      row: {},
      popOperates,
      pagination,
      type: 'add',
      sellTeamData: [],
      totalNum: {},
      isArrayData: [],
      indexRow: {}// 点击选择每一行
    }
  },
  computed: {
    getRowType() {
      return !!(this.indexRow && Object.keys(this.indexRow).length)
    }
  },
  watch: {},
  created() {
    this.list({}, true)
  },
  mounted() { },
  methods: {
    // tab页签切换
    handleClick(tabsObj) {
      this.isArrayData = []
      const tabIndex = tabsObj.name
      if (this.activeName === '1') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._finishTime
        omCom._isPrint = {
          prop: 'demandCode5',
          label: '标签是否打印',
          minWidth: '150',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.isPrint === 0 ? '否' : '-'
          }
        }
        this.columns = omCom
      } else if (this.activeName === '2') {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._isPrint
        omCom._finishTime = {
          prop: 'finishTime',
          label: '剪板完成时间',
          minWidth: '150',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.finishTime ? this.$filters.parseTime(scope.row.finishTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
          }
        }
        this.columns = omCom
      } else {
        const omCom = this.$utils.deepClone(this.columns)
        delete omCom._isPrint
        omCom._finishTime = {
          prop: 'finishTime',
          label: '剪板完成时间',
          minWidth: '150',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.finishTime ? this.$filters.parseTime(scope.row.finishTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
          }
        }
        this.columns = omCom
      }
      this.list({}, false, [], false, tabIndex)
    },
    // 获取列表数据
    async list(data = {}, fresh, isStstus = [], tup = false, tabIndex = '-1') {
      let obj = { status: '' }
      if (isStstus.length) {
        obj = { status: isStstus }
      } else {
        if (this.activeName === '1' || fresh) {
          obj = { status: 1 }
        } else if (this.activeName === '2') {
          obj = { status: 2 }
        } else {
          obj = { status: 3 }
        }
      }
      const res = await listArray({ ...data, ...obj, ...this.searchFormDatas })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
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
      const amountRes = await orderStatusNumArray(dataObj)
      if (fresh) {
        this.activeName = '1'
      }
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
      this.indexRow = {}
    },
    filterChange(row) {
      const op = JSON.parse(JSON.stringify(this.activeName))
      this.isArrayData = row.status
      this.list({}, false, this.isArrayData || [], true, op)
    },
    rowClickIndex(row) {
      this.indexRow = row
    },
    async printLabel(type = '1', data = []) { // 打印标签 type:1 打印一条标签   type:2  打印多条标签
      if (type === '1') {
        if (!this.getRowType) {
          this.$message({
            message: '请先选择一条数据',
            type: 'warning'
          })
          return false
        } else {
          this.$router.push({ path: '/customer-order/board-application-labelPrint', query: { receiveCodes: this.indexRow.receiveCode }})
        }
      }
      if (type === '2') {
        this.$router.push({ path: '/customer-order/board-application-labelPrint', query: { receiveCodes: data.map(n => n.receiveCode).join() }})
      }
    },
    SampleReceiving() { // 布样接收
      // if (!this.getRowType) {
      //   this.$message({
      //     message: '请先选择一条数据',
      //     type: 'warning'
      //   })
      //   return false
      // } else {
      //   this.$refs.codePop.popHandle(this.activeName)
      // }
      this.$refs.codePop.popHandle(this.activeName)
    },
    setParentHandle(key, data) { // 同步右侧各个模块的部分字段数据
      // console.log('Ssssssxiao', key, data)
      if (data.type === '1') { // 确认
        this.list()
      } else { // 确认并打印
        this.list()
        this.printLabel(data.type, data.cutSampleRecords)
      }
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
        padding: 0 10px;
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
    padding: 0 10px;
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
