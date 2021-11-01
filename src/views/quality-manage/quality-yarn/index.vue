<template>
  <div class="quality-yarn-list">
    <!-- 搜索页面 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="wrap-tabs">
      <!-- <el-scrollbar
        ref="tabsScrollContainer"
        class="scroll-container"
        @wheel.native.prevent="handleScroll"
      > -->
      <div class="tabs">
        <!-- @tab-click="" -->
        <el-tabs
          v-model="activeIdx"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item, i) in statusArr"
            :key="i"
            :label="`${item.label}(${item.count})`"
            :name="item.value"
          />
        </el-tabs>
      </div>

      <!-- 新增按钮 -->
      <div class="wrap-btns">
        <div class="button">

          <el-button
            v-permission="['qa:qaYarnInspectionPhysical:add']"
            type="primary"
            size="small"
            @click="handleAdd"
          >新建</el-button>
        </div>
      </div>
    </div>
    <div class="page-table">
      <cs-custom-table
        ref="tableList"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        @sort-change="changeSort"
      />
    </div>

  </div>
</template>

<script>
import { fetchLog } from '@/views/system-settings/common/fetchLog'
import { getSelectData } from '@/views/quality-manage/common/basisApi.js'
import * as api from './api/index.js'
export default {
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const searchData = {

      _yarnUuid: {
        prop: 'yarnUuid',
        itemType: 'input',
        className: 'commonRemoteSearch',
        label: '检测编号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入检测编号',
        // filterable: true,
        // remote: true,
        // remoteMethod: this.remoteSearch,
        dataSource: []
      },
      _yarnName: {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名:',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱名',
        dataSource: []
      },
      // _spinningMethodName: {
      //   prop: 'spinningMethodName',
      //   itemType: 'input',
      //   label: '纺纱方法:',
      //   itemStyle: { width: '25%' },
      //   placeholder: '请输入纺纱方法',
      //   dataSource: []
      // },
      _yarnBatch: {
        prop: 'yarnBatch',
        itemType: 'input',
        label: '纱牌/纱批:',
        placeholder: '请输入纱牌/纱批',
        itemStyle: { width: '25%' },
        dataSource: []
      },
      _skuId: {
        prop: 'skuId',
        itemType: 'input',
        label: '产品编号:',
        placeholder: '请输入产品编号',
        itemStyle: { width: '25%' },
        dataSource: []
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '供应商:',
        placeholder: '请输入供应商',
        itemStyle: { width: '25%' },
        dataSource: []
      },
      _yarnGrade: {
        prop: 'yarnGrade',
        itemType: 'select',
        clearable: true,
        label: '纱线等级:',
        placeholder: '请选择纱线等级',
        itemStyle: { width: '25%' },
        dataSource: [
          {
            label: 'A',
            value: 'A'
          },
          {
            label: 'B',
            value: 'B'
          },
          {
            label: 'C',
            value: 'C'
          },
          {
            label: 'D',
            value: 'D'
          },
          {
            label: 'E',
            value: 'E'
          }
        ]
      },

      _status: {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        itemStyle: { width: '25%' },
        dataSource: [
          {
            label: '待提交',
            value: '0'
          },
          {
            label: '待处理',
            value: '1'
          },
          {
            label: '处理中',
            value: '2'
          },
          {
            label: '已处理',
            value: '3'
          }
        ]
      },
      _p9: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = params
          this.getRulePage()
        },
        resetHandle: () => {
          // console.log('重置')
          this.$refs.tableList.$refs.table.clearSort()
        }
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code1',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'yarnUuid',
        label: '检测编号',
        minWidth: '130',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          this.$router.push(`./quality-yarn-edit/${scope.row.yarnUuid}`)
        }
      },
      {
        prop: 'id',
        label: '纱名',
        minWidth: '300',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.inspection ? scope.row.inspection.yarnCountName + ' ' +
          scope.row.inspection.ingredientsName +
          scope.row.inspection.proportion + ' ' +
          scope.row.inspection.yarnTypeName + ' ' +
          scope.row.inspection.cardingMethodName + ' ' +
          scope.row.inspection.spinningMethodName : ''
        }
      },
      // {
      //   prop: 'spinningMethodName',
      //   label: '纺纱方法',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'cardingMethodName',
      //   label: '梳棉方法',
      //   minWidth: '90',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'yarnBatch',
        label: '纱牌/纱批',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'skuName',
        label: '产品编号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'reportTypeName',
        label: '报告类型',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          let str = ''
          if (scope.row.reportTypeId === '1') {
            str = '内部报告'
          } else if (scope.row.reportTypeId === '2') {
            str = '供应商报告'
          } else {
            str = ''
          }
          return str
        }

      },
      {
        prop: 'internalGrade',
        label: '纱线等级',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          let str = ''
          if (scope.row.reportTypeId === '1') {
            str = scope.row.internalGrade
          } else if (scope.row.reportTypeId === '2') {
            str = scope.row.supplierGrade
          } else {
            str = ''
          }
          return str
        }
      },
      {
        prop: 'applyByName',
        label: '申请人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'applyTime',
        label: '申请时间',
        sortable: 'custom',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'processedByName',
        label: '处理人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'processedTime',
        label: '处理时间',
        sortable: 'custom',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'status',
        label: '状态',
        width: '100',
        fixed: 'right',
        formater: (scope) => {
          return this.getStatus(scope.row)
        }
      }
    ]
    // let popOperatesDataSource = []
    // popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    // const popOperates = {
    //   label: '操作',
    //   width: '200',
    //   fixed: 'right',
    //   dataSource: popOperatesDataSource
    // }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      // 状态 0：待提交，1：待处理，2：处理中，3：已处理
      status: {
        '-1': {
          value: '-1',
          label: '全部',
          count: 0
        },
        '0': {
          value: '0',
          label: '待提交',
          color: '#FF9214',
          count: 0
        },
        '1': {
          value: '1',
          label: '待处理',
          color: '#FF9214',
          count: 0
        },
        '2': {
          value: '2',
          label: '处理中',
          color: '#FF4444',
          count: 0
        },
        '3': {
          value: '3',
          label: '已处理',
          color: '#00BCC5',
          count: 0
        }
      },
      activeIdx: '-1',
      searchData,
      formOtions: {
        inline: true,
        size: 'small',
        layout: true
      },
      formDatas: {},
      columns,
      dataSource: [],
      pagination,
      popOperates: {}
    }
  },
  computed: {
    statusArr() {
      const res = []
      for (const key in this.status) {
        res.push(this.status[key])
      }
      return res.sort((a, b) => { return a.value - b.value })
    }
  },
  mounted() {
    this.getYarnTypeSelect()
    this.getRulePage()
  },
  created() {
  },
  methods: {
    async getRulePage(data = {}) {
      const params = { ...this.formDatas, ...data }
      this.getAllCountsGroupByStatus(params)
      if (this.activeIdx !== '-1') params.status = this.activeIdx
      let res = await api.qaYarnInspectionPhysicalPage(params)
      res = res.data || {}
      res.list && res.list.map((item, index) => { item.code1 = (res.pageNum - 1) * res.pageSize + index + 1 })

      this.dataSource = res.list || []
      this.dataSource.map((item) => {
        return Object.assign(item, item.inspection)
      })
      this.pagination = {
        ...this.pagination,
        dataTotal: (res && res.total) || 0,
        ...data,
        currentPage: (res && res.pageNum) || 1,
        pageSize: (res && res.pageSize) || 20
      }
      // console.log('getlist', this.dataSource)
    },
    changeSort(e) {
      delete this.formDatas.applyTimeOrder
      delete this.formDatas.processedTimeOrder
      if (e.prop === 'applyTime') {
        // 申请时间
        // 0:升序 1：倒序
        if (e.order === 'ascending') {
          this.formDatas.applyTimeOrder = 0
        } else if (e.order === 'descending') {
          this.formDatas.applyTimeOrder = 1
        }
      } else if (e.prop === 'processedTime') {
        // 处理时间
        if (e.order === 'ascending') {
          this.formDatas.processedTimeOrder = 0
        } else if (e.order === 'descending') {
          this.formDatas.processedTimeOrder = 1
        }
      }
      this.getRulePage()
    },
    // 每个分组对应的流程数量
    async getAllCountsGroupByStatus(params) {
      const res = await api.allCountsGroupByStatus(params)
      const countList = res.data || []
      let sum = 0
      for (const i in this.status) {
        this.status[i].count = 0
        for (let j = 0; j < countList.length; j++) {
          if (countList[j].status === parseInt(this.status[i].value)) {
            this.status[i].count = countList[j].num
            sum += countList[j].num
          }
        }
      }
      this.status['-1'].count = sum
    },
    // 新建
    handleAdd() {
      this.$router.push(`./quality-yarn-add`)
    },
    getStatus(row) {
      let color = ''
      let label = row.status
      for (const key in this.status) {
        if (this.status[key].value === row.status + '') {
          color = this.status[key].color
          label = this.status[key].label
          break
        }
      }
      return `<span style="color:${color};">${label}</span>`
    },
    handleClick(e) {
      this.getRulePage()
    },
    // 获取纱线等级
    async getYarnTypeSelect() {
      const resList = await getSelectData({ categoryId: 23, enabled: 'Y' })
      this.searchData._yarnGrade.dataSource = resList
        .map(item => {
          return {
            label: item.label,
            value: item.label
          }
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.quality-yarn-list {
  padding: 20px;
  padding-bottom: 0px;
  .wrap-btns {
    display: flex;
    .button {
      margin-right: 20px;
      margin-bottom: 0;
    }
  }

  .wrap-tabs {
    display: flex;
    align-items: center;
    position: relative;
    padding-bottom: 0;
    min-height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #dfe6ec;
    .tabs {
      display: flex;
      // width: 100%;
      flex: 2;
      overflow-x: auto;
      overflow-y: hidden;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #3c4043;
      text-align: center;
      padding-bottom: 1px;
      /deep/ .el-tabs__header {
        margin-bottom: 0px;
      }
      /deep/ .el-tabs__nav-wrap::after {
        height: 0px !important;
      }
      /deep/ .el-tabs__item {
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
      }
    }
    .dropdown-operate {
      padding-right: 20px;
    }
  }
}
</style>
