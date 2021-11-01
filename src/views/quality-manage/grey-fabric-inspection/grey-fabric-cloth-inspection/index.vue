<template>
  <div class="grey-fabric-cloth-inspection">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- tab切换 -->
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in statusArr"
          :key="i"
          :name="item.value"
          lazy
        >
          <span slot="label" :tabIndex="item.value">{{ `${item.label}(${item.count || '0'})` }}</span>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-button v-if="activeName === '0'" class="right-button" type="primary" size="small" style="margin-left: auto;" @click="publishTask">发布任务</el-button> -->
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="showPopOperates"
        :pagination="pagination"
        edit-type="pop"
        @selection-change="handleSelectionChange"
      />
    </div>
    <!-- 发布任务pop弹出框 -->
    <!-- <div class="pop">
      <cs-custom-pop ref="popOptions" :options="popOptions" />
    </div> -->
  </div>
</template>

<script>
import { clothInspectionPage } from './components/index.js'
export default {
  mixins: [clothInspectionPage],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 查询
    const searchData = [
      {
        prop: 'knitOrderNo',
        itemType: 'input',
        label: '织订单',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'fabricType',
        itemType: 'input',
        label: '布类',
        clearable: true,
        placeholder: '请输入内容'

      },
      {
        prop: 'factoryName',
        itemType: 'input',
        label: '织厂',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.qaGreyFabricTaskPage()
          this.getListCount()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          // this.formDatas = {}
          // this.formDatas.sorts = []// 自定义表格内排序
          // this.formDatas.status = this.activeName// 自定义表格内排序
          // this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    // 表格表头
    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
        }
      },
      '_taskNo': {
        prop: 'taskNo',
        label: '任务编码',
        minWidth: '125',
        // isShow: scope => {
        //   return this.activeName !== '0'
        // },
        handle: scope => {
          console.log('scope', scope)
          this.$router.push({ name: 'grey-fabric-cloth-inspection-detail', query: { id: scope.row.id, type: 'detail' }})
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        },
        showOverflowTooltip: true
      },
      '_knitOrderNo': {
        prop: 'knitOrderNo',
        label: '织订单',
        minWidth: '165',
        showOverflowTooltip: true
      },
      '_factoryName': {
        prop: 'factoryName',
        label: '织厂',
        minWidth: '140',
        showOverflowTooltip: true
        // formater: scope => {
        //   return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.factoryName || '-' : '-'
        // }
      },
      '_machineNo': {
        prop: 'machineNo',
        label: '织机号',
        minWidth: '140',
        showOverflowTooltip: true
        // formater: scope => {
        //   return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.machineNo || '-' : '-'
        // }
      },
      '_greigeNumber': {
        prop: 'greigeNumber',
        label: '匹号',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          const tempStr = scope.row.qaGreigeFabricTestInformationList ? scope.row.qaGreigeFabricTestInformationList.map(item => item.greigeNumber).join(';') : '-'
          return tempStr
        }

      },
      '_fabricType': {
        prop: 'fabricType',
        label: '布类',
        minWidth: '140',
        formater: (scope) => {
          return scope.row.qaGreigeInspectionInfoResponse ? scope.row.qaGreigeInspectionInfoResponse.fabricType || '-' : '-'
        },
        showOverflowTooltip: true
      },
      '_greigeUuid': {
        prop: 'greigeUuid',
        label: '坯布编码',
        minWidth: '120',
        // formater: (scope) => {
        //   return scope.row.ingredientsProportion
        // },
        showOverflowTooltip: true
      },
      '_opearationUserName': {
        prop: 'opearationUserName',
        label: '质检员',
        minWidth: '70',
        // formater: (scope) => {
        //   return scope.row.ingredientsProportion
        // },
        showOverflowTooltip: true
      },
      '_createdTime': {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        // isShow: scope => {
        //   return ['1', '2', '3', '5'].includes(this.activeName)
        // },
        showOverflowTooltip: true
      },
      '_opearationTime': {
        prop: 'opearationTime',
        label: '验布时间',
        minWidth: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return this.activeName !== '0'
        },
        showOverflowTooltip: true
      },
      '_blemishDescription': {
        prop: 'blemishDescription',
        label: '疵点描述',
        minWidth: '160',
        isShow: scope => {
          return this.activeName !== '0'
        },
        formater: scope => {
          const tempStr = scope.row.qaGreigeFabricTestInformationList ? scope.row.qaGreigeFabricTestInformationList.map(item => item.blemishDescription).join(';') : '-'
          return tempStr
        },
        showOverflowTooltip: true
      },
      '_reviewUserName': {
        prop: 'reviewUserName',
        label: '审核人',
        minWidth: '70',
        isShow: scope => {
          return ['2', '3', '5'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_reviewTime': {
        prop: 'reviewTime',
        label: '审核时间',
        minWidth: '125',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return ['2', '3', '5'].includes(this.activeName)
        },
        showOverflowTooltip: true
      },
      '_remark': {
        prop: 'remark',
        label: '审批意见',
        minWidth: '160',
        isShow: scope => {
          return ['2', '3', '5'].includes(this.activeName)
        },
        formater: (scope) => {
          const tempArr = scope.row.qaGreigeFabricTestInformationList || []
          let str = ''
          if (tempArr.length) {
            str = tempArr.map(item => item.remark).join(',')
          }
          return str
        },
        showOverflowTooltip: true
      },
      '_cancelUserName': {
        prop: 'cancelUserName',
        label: '取消人',
        minWidth: '70',
        isShow: scope => {
          return this.activeName === '4'
        },
        showOverflowTooltip: true
      },
      '_cancelTime': {
        prop: 'cancelTime',
        label: '取消时间',
        minWidth: '160',
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        },
        isShow: scope => {
          return this.activeName === '4'
        },
        showOverflowTooltip: true
      },
      '_cancelReason': {
        prop: 'cancelReason',
        label: '取消原因',
        minWidth: '80',
        isShow: scope => {
          return this.activeName === '4'
        },
        // formater: (scope) => {
        //   return scope.row.ingredientsProportion
        // },
        showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        label: '状态',
        minWidth: '70',
        fixed: 'right',
        formater: scope => {
          const oneObj = this.statusArr.filter(item => +item.value === +scope.row[scope.column.property])[0]
          return `<span style="color:${oneObj.color}">${oneObj.label}</span>`
        },
        // isShow: scope => {
        //   return this.activeName !== '0'
        // },
        showOverflowTooltip: true
      }
    }
    // 分页
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.qaGreyFabricTaskPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.qaGreyFabricTaskPage({ pageNum: 1, pageSize: val })
      }
    }

    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      searchFormDatas: {},
      activeName: '2',
      statusArr: [
        { value: '5', label: '全部', color: '#888E9E', count: 0 },
        { value: '0', label: '待处理', color: '#FF9214', count: 0 },
        { value: '1', label: '处理中', color: '#FF9214', count: 0 },
        { value: '2', label: '待审核', color: '#FF9214', count: 0 },
        { value: '3', label: '已处理', color: '#00BCC5', count: 0 },
        { value: '4', label: '已取消', color: '#888E9E', count: 0 }
      ],

      columns,
      dataSource: [],
      // popOperates,
      showPopOperates: null,
      pagination,

      purchaseRequireIds: [],

      ordersList: []
    }
  },
  watch: {
    $route: {
      async handler(v) {
        if (v.query.status) {
          this.activeName = v.query.status + ''
        }
        this.qaGreyFabricTaskPage()
        this.getListCount()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.qaGreyFabricTaskPage()
    // this.getListCount()
  },
  methods: {
    // tab切换事件
    handleClick() {
      console.log(this.activeName)
      if (['1', '2'].includes(this.activeName)) {
        this.showPopOperates = this.popOperates
      } else {
        this.showPopOperates = null
      }
      this.qaGreyFabricTaskPage()
      this.getListCount()
    },
    // 发布任务点击事件
    publishTask() {
      // console.log('发布任务')
      const purchaseRequireIds = this.purchaseRequireIds
      if (purchaseRequireIds.length === 0) this.$message.warning('请选择任务')
      else {
        console.log('选择了任务')
        const factoryId = purchaseRequireIds[0].id
        const factoryName = purchaseRequireIds[0].name
        const idFlag = purchaseRequireIds.some(item => {
          return factoryId !== item.id
        })
        if (idFlag) {
          this.$message.warning('请选择相同的织厂')
          return
        }
        const knitOrders = purchaseRequireIds.map(item => {
          return {
            knitOrderNo: item.knitOrderNo
          }
        })

        this.popOptions.visible = true

        this.taskPreparePublish({ knitOrders, factoryId, factoryName })
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      if (val && val.length) {
        this.purchaseRequireIds = val.map(item => {
          return {
            name: item.factoryName,
            id: item.factoryId,
            knitOrderNo: item.knitOrderNo
          }
        })
      } else {
        this.purchaseRequireIds = []
      }
    }

    // handleOrderChange(orderColumn, orderState) {
    //   const result = this.ordersList.find(e => e.orderColumn === orderColumn)
    //   if (result) {
    //     // result.orderState = orderState
    //     const index = this.ordersList.findIndex(n => n.orderColumn === result.orderColumn)
    //     this.ordersList[index].orderState = orderState
    //   } else { // 第一次没有找到，push点击的字段和排序到orderList
    //     this.ordersList.push({
    //       orderColumn: orderColumn,
    //       orderState: orderState
    //     })
    //   }
    //   console.log(this.ordersList)
    //   this.searchFormDatas.asc = this.ordersList.filter(n => n.orderState === 'ascending').map(n => n.orderColumn === 'orders' ? '1' : '2').join() || '' // 升序
    //   this.searchFormDatas.desc = this.ordersList.filter(n => n.orderState === 'descending').map(n => n.orderColumn === 'orders' ? '1' : '2').join() || '' // 降序
    //   // 调接口查询，在传参的时候把ordersList进行处理成后端想要的格式
    //   // this.load()
    //   // if (this.activeName === '2') {
    //   //   this.physicalSurveyItemsPage()
    //   // }
    // },
    // handleHeaderClass({ column }) {
    //   console.log(column)
    //   column.order = column.multiOrder
    // },
    /**
     * 排序点击事件
     */
    // sortChange({ column, prop, order }) {
    //   console.log('--changeSort--')
    //   console.log(column, prop, order)
    //   // 有些列不需要排序，提前返回
    //   if (column.sortable !== 'custom') {
    //     return
    //   }
    //   if (!column.multiOrder) {
    //     column.multiOrder = 'descending'
    //   } else if (column.multiOrder === 'descending') {
    //     column.multiOrder = 'ascending'
    //   } else {
    //     column.multiOrder = ''
    //   }
    //   this.handleOrderChange(column.property, column.multiOrder)
    // }
  }
}
</script>

<style lang='scss'>
  .grey-fabric-cloth-inspection {
    padding: 20px;

    .tab-group {
      position: relative;
      // padding-bottom: 1px;

      .right-button {
        position: absolute;
        right: 20px;
        top: 13px;
      }
    }
    .commonTabs {
      background-color: #fff;
      padding: 20px 0 1px;
      .el-tabs__nav-scroll {
        padding: 0 20px;
      }
      .el-tabs__item {
        line-height: 20px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
    }

    .border-frame {
      border: 1px solid #EEEFF0;
      border-bottom: 0px;
    }
  }
</style>
