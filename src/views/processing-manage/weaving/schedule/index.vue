
<template>
  <div id="WeavingSchedule" class="list WeavingSchedule">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div class="button spe">
        <el-button
          v-if="$permission(['pd:knitProductionSchedule:download'])"
          size="small"
          @click="exportExcel"
        >导出</el-button>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label"> {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          :key="activeName"
          :table-scrollx="true"
          :columns="columns"
          :data-source="dataSource"
          :span-method="spanMethod"
          :highlight-current-row="false"
          :pagination="pagination"
        />
      </div>
    </div>
    <!-- 总计栏 -->
    <div class="bottom-content">
      <tableSummation
        :config="sumConfig"
        :sumtext-is-hidden="true"
        custom-class="yarn-dyeing-bottom"
      />
    </div>
    <!--  详情弹窗 -->
    <cs-custom-pop
      v-if="detailsOptions.visible"
      ref="pop"
      :options="detailsOptions"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import Details from './components/details.vue'
import * as api from './api/index.js'
import tableSummation from '@/components/table-summation/index.vue'
import { fetchLog } from '@/views/capacity-center/common/fetchLog'

export default {
  name: 'WeavingSchedule',
  components: { tableSummation },
  mixins: [fetchLog],
  data() {
    const itemStyle = { width: '33%' }

    const searchData = {
      _knitOrderNo: {
        prop: 'knitOrderNo',
        itemType: 'input',
        label: '织订单号',
        placeholder: '请输入织订单号',
        clearable: true,
        itemStyle
      },
      _supplerName: {
        prop: 'supplerName',
        itemType: 'input',
        label: '织厂',
        placeholder: '请输入织厂',
        clearable: true,
        itemStyle
      },
      _clothType: {
        prop: 'clothType',
        itemType: 'input',
        label: '布类',
        placeholder: '请输入布类',
        clearable: true,
        itemStyle
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'input',
        label: '跟单员',
        placeholder: '请输入跟单员',
        clearable: true,
        itemStyle
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售组织',
        placeholder: '请输入销售组织',
        clearable: true,
        itemStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
        clearable: true,
        itemStyle
      },
      _skuId: {
        prop: 'skuId',
        itemType: 'input',
        label: '坯布编码',
        placeholder: '请输入坯布编码',
        clearable: true,
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const p = deepClone(params)
          this.searchParams = { ...p }
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.getList()
          this.getCount()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const tabs = {
      _ALL: { label: '全部', value: 'A', count: 0 },
      _HANDING: { label: '进行中', value: 'N', count: 0 },
      _FINISH: { label: '已完成', value: 'Y', count: 0 }
    }
    const columns = {
      _index: {
        type: 'index',
        label: '序号',
        width: 50,
        showOverflowTooltip: true,
        fixed: 'left',
        formater: (scope) => {
          if (scope.row.overCheck) {
            return `<span style="color:#FF4444">${
              (this.pagination.currentPage - 1) * this.pagination.pageSize +
              (scope.row.index)
            }</span>`
          }
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.row.index)
          )
        }
      },
      _knitOrderNo: {
        prop: 'knitOrderNo',
        label: '织订单号',
        showOverflowTooltip: true,
        fixed: 'left',
        minWidth: '160',
        style: {
          'white-space': 'nowrap'
        },
        formater: (scope) => {
          if (scope.row.overCheck) {
            return `<span style="color:#FF4444">${scope.row.knitOrderNo}</span>`
          }
          return scope.row.knitOrderNo
        }
      },
      _supplerName: {
        prop: 'supplerName',
        showOverflowTooltip: true,
        label: '织厂',
        minWidth: '150'
        // showOverflowTooltip: true
      },
      _skuId: {
        prop: 'skuId',
        label: '坯布编码',
        showOverflowTooltip: true,
        minWidth: '150'
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _widthNameAndWeightName: {
        prop: 'widthNameAndWeightName',
        label: '成品规格',
        showOverflowTooltip: true,
        minWidth: '140',
        formater: (scope) => {
          return `${scope.row.widthName} - ${scope.row.weightName}`
        }

      },
      _gaugeAndDiameter: {
        prop: 'gaugeAndDiameter',
        showOverflowTooltip: true,
        label: '针寸数',
        minWidth: '100',
        formater: (scope) => {
          return `${scope.row.gauge} - ${scope.row.diameter}`
        }
      },
      _yarnId: {
        prop: 'yarnId',
        label: '纱线编码',
        showOverflowTooltip: true,
        minWidth: '140'
      },
      _yarnName: {
        prop: 'yarnName',
        showOverflowTooltip: true,
        label: '纱名',
        minWidth: '100'
      },
      _yarnNeedQty: {
        prop: 'yarnNeedQty',
        label: '纱需求量(KG)',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '110'
      },
      _receiveQty: {
        prop: 'receiveQty',
        label: '已到纱数(KG)',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: '110'
      },
      _inTransitQty: {
        prop: 'inTransitQty',
        label: '在途纱数(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: '110'
      },
      _notifySendQty: {
        prop: 'notifySendQty',
        label: '通知送纱量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 130
      },
      _yarnReceiveQty: {
        prop: 'yarnReceiveQty',
        label: '收纱总数(KG)',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 120
      },
      _limitKnitQty: {
        prop: 'limitKnitQty',
        label: '可织坯数(KG)',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 120
      },
      _machineMayOn: {
        prop: 'machineMayOn',
        label: '可上机日期',
        showOverflowTooltip: true,
        minWidth: '100',
        formater: (scope) => {
          return scope.row.machineMayOn ? this.$utils.parseTime(scope.row.machineMayOn, '{y}-{m}-{d}') : ''
        }
      },
      _dailyQty: {
        prop: 'dailyQty',
        label: '当日产量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _machineCount: {
        prop: 'machineCount',
        label: '实际开台数',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _knitMachineNo: {
        prop: 'knitMachineNo',
        label: '织机号',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _yarnUsedQty: {
        prop: 'yarnUsedQty',
        label: '已用纱数量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 130
      },
      _knitQty: {
        prop: 'knitQty',
        label: '坯布数量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _stockQty: {
        prop: 'stockQty',
        label: '存厂总量(KG)',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 120
      },
      _allotProductQty: {
        prop: 'allotProductQty	',
        label: '出货总量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 120
      },
      _planQty: {
        prop: 'planQty',
        label: '订单数量',
        showOverflowTooltip: true,
        align: 'right',
        minWidth: 120
      },
      _knitDelivery: {
        prop: 'knitDelivery',
        label: '织单交期',
        showOverflowTooltip: true,
        minWidth: '100',
        formater: (scope) => {
          return scope.row.knitDelivery ? this.$utils.parseTime(scope.row.knitDelivery, '{y}-{m}-{d}') : ''
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        showOverflowTooltip: true,
        label: '计划交期',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.planDelivery ? this.$utils.parseTime(scope.row.planDelivery, '{y}-{m}-{d}') : ''
        }
      },
      _process: {
        prop: 'process',
        label: '完成进度',
        align: 'right',
        minWidth: '100'
      }
    }
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getList()
        this.getCount()
        // this.uuid = undefined
        // this.showMore = false
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList()
        this.getCount()
        // this.uuid = undefined
        // this.showMore = false
      }
    }
    const detailsOptions = {
      itemType: 'dialog',
      visible: false,
      title: '详情',
      width: '1300px',
      okHidden: true,
      cancelHidden: true,
      close: () => {
        this.$set(this.detailsOptions, 'visible', false)
      },
      components: { Details },
      componentsOptions: {
        id: ''
      }
    }
    const sumConfig = {
      _KNIT_PKG: {
        title: '坯布总卷数:',
        num: 0
      },
      _KNIT_QTY: {
        title: '坯布总数量(KG):',
        num: 0
      },
      _YARN_USED_PKG: {
        title: '已用纱总件数:',
        num: 0
      },
      _YARN_USED_QTY: {
        title: '已用纱总数量(KG):',
        num: 0
      },
      _text: {
        textStyle: {
          'font-size': '12px',
          color: '#666666'
        },
        style: {
          position: 'fixed',
          right: 0
        },
        title: ''
      }
    }
    return {
      sumConfig,
      searchData,
      searchParams: {},
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {},
      activeName: 'N',
      tabs,
      columns,
      dataSource: [],
      pagination,
      detailsOptions,
      mergingRows: [],
      mergingPos: 0

    }
  },
  mounted() {
    this.getList()
    this.getCount()
  },
  methods: {
    // 导出数据
    async exportExcel() {
      const args = {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      }
      const res = await api.exportSchedule(args)
      this.$utils.downloadStream(res)
      this.fetchLog(this.getLogMessages('EXPORT', '/processingMgr/knitProductionSchedule/exportSchedule'), args, JSON.stringify({ beforeText: `在'加工管理-织生产进度'导出成功`, beforeCode: {}}))
    },
    // 请求数据拆分
    initDayData(datas) {
      const comArray = [] // 数组依次显示的id
      if (datas && datas.length > 0) {
        datas.forEach((item, index) => {
          item.allotDetails && item.allotDetails.length && item.allotDetails.forEach((ita, ixa) => {
            const tempObjs = {
              index: index + 1,
              uuid: item.uuid,
              ...item,
              ...ita
            }
            comArray.push(tempObjs)
          })
        })
      }
      return comArray
    },
    // 获取表格数据
    async getList() {
      const args = {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      }
      const res = await api.list(args)
      if (res.code === 200) {
        const { list = [] } = res.data
        this.dataSource = this.initDayData(list) // 合并单元格
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
        this.dataPretreatment(this.dataSource)
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    // 获取 tab数据
    async getCount() {
      const args = {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      }
      const res = await api.count(args)
      if (res.code === 200) {
        if (res.code === 200) {
          for (var i in res.data) {
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = res.data[i]) : ''
            this.sumConfig[`_${i}`] ? (this.sumConfig[`_${i}`].num = res.data[i]) : ''
          }
          const { rateLimit, distanceDeliveryDay } = res.data
          const text = `<div><span  style="color:#FF4444">* 红色字体</span> 为距离交期剩余时间小于为【${distanceDeliveryDay}】天，进度小于为【${rateLimit}%】的进度记录。</div>`
          // eslint-disable-next-line
          if (rateLimit != undefined && distanceDeliveryDay != undefined) {
            this.sumConfig._text.title = text
          } else {
            this.sumConfig._text.title = ''
          }
        }
      }
    },
    tabChange() {
      this.pagination.pageNum = 1
      this.getCount()
      this.getList()
    },
    dataPretreatment(data) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      this.mergingRows = []
      this.mergingPos = 0
      for (let i = 0; i < data.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          this.mergingRows.push(1)
          this.mergingPos = 0
        } else {
          if (data[i].uuid && data[i - 1].uuid) {
            // 哪些数据是要合并的 合并的条件是什么
            if (data[i].uuid === data[i - 1].uuid) {
              this.mergingRows[this.mergingPos] += 1
              this.mergingRows.push(0)
            } else {
              this.mergingRows.push(1)
              this.mergingPos = i
            }
          } else {
            this.mergingRows.push(1)
            this.mergingPos = i
          }
        }
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 除去纱线编码 到 在途纱数KG 其余全部合并
      const mergingKey = ['yarnId', 'yarnName', 'yarnNeedQty', 'receiveQty', 'inTransitQty', 'notifySendQty']
      if (!mergingKey.includes(column.property)) {
        const _row = this.mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#WeavingSchedule.WeavingSchedule {
  .weaving-order-pagination {
    margin-top: 20px;
    .TableSummation .total {
      margin: 0 0 0 10px;
    }
  }
  .el-pagination--small.pagination {
    margin-top: 0;
    text-align: left;
    margin-left: 5px;
  }
  .weaving-requisition-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      border-right: 1px solid #eeeff0;
    }
    .el-table {
      width: 100%;
      overflow: auto;
    }
  }
  .weaving-requisition-detail-form {
    background: #fff;
    // width: 100%;
    padding-top: 20px;
    > div:not(.WeavingSchedule-DetailBranch) {
      padding-left: 40px;
      .el-form-item__content {
        line-height: 32px;
      }
    }
    .el-form-item__label {
      color: #888e9e;
    }
    .el-form-item__content {
      color: #474747;
    }
    .el-form-item__label-wrap {
      margin-left: 0 !important;
      width: 88px;
      text-align: right;
    }
  }
  .detail {
    .el-table td {
      border-bottom: 1px solid #dfe6ec;
      height: 50px;
    }
    .el-table th.is-leaf {
      background: #f5f7fa;
      height: 44px;
    }
  }
  .yarn-dyeing-bottom.TableSummation .total {
    margin: 0 0 0 20px;
    width: 100%;
  }
}

</style>
<style lang="scss" scoped>
#WeavingSchedule.WeavingSchedule {
  position: relative;
  height: 100%;
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      // border-left: 1px solid #e9eff2   ;
      .title {
        background: #fff;
        font-size: 18px;
        color: #15112b;
        height: 65px;
        line-height: 65px;
        padding-left: 20px;
        border-bottom: 1px solid #e9eff2;
      }
    }
  }
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  .bottom-content {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    margin-left: -20px;
    height: 64px;
    line-height: 64px;
    background: #fff;
    border-top: 1px solid #E9EFF2;
  }
  .page-table{
    margin-bottom: 80px;
  }
  /deep/.el-table__fixed {
    height: auto !important;
     bottom: 9px;
  }
}

/deep/.highlightColor .cell {
  color: #FF4444;
}
/deep/.page-table .table tr {
  background-color: #fff;
}
/deep/.page-table .table tr>td {
  border-bottom: 1px solid #dfe6ec;
}
/deep/ .el-table__header th {
  background-color: #F5F7FA;
}
/deep/.page-table .table tr:hover>td {
  background-color: #fff
}
/deep/.total .content:nth-child(6){
    color: #FF4444;
    margin-right: -2px;
}
/deep/.el-table__body tr.hover-row td {
    background: transparent;
  }
 /deep/.page-table .table {
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #f5f5f5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #c8c8c8;
    &:hover {
      background-color: #888;
    }
  }
 }
</style>

