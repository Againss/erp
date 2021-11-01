
<template>
  <div class="gray-fabric-debit-details">

    <!-- 搜索页面 -->
    <div class="card">
      <div class="search islayoutForm">
        <cs-custom-form
          ref="searchForm"
          :data-source="searchData"
          :options="formOtions"
        />
      </div>
    </div>
    <div class="card debitInfo">
      <div class="billet-info yarn-disable">
        <div class="search-table">
          <cs-custom-form
            :data-source="billetContent"
            :options="billetOptions"
            :form-datas="billetDatas"
          />
        </div>
      </div>
    </div>

    <div class="card debitInfo">
      <div class="card-title billet-container">
        借调列表
        <el-button
          v-if="!editStatus"
          v-permission="['aps:grayClothLoan:add']"
          type="primary"
          size="small"
          style="margin-left: auto;"
          @click="billetDrawer"
        >坯布借调</el-button>
        <el-button
          v-if=" !editStatus "
          v-permission="['aps:grayClothLoan:update']"
          size="small"
          style="margin-left: auto;"
          @click="handleEdit"
        >编辑</el-button>

        <el-button
          v-if=" editStatus"
          type="primary"
          size="small"
          style="margin-left: auto;"
          @click="handleSave"
        >保存</el-button>
        <el-button
          v-if=" editStatus"
          size="small"
          style="margin-left: auto;"
          @click="handleCancel"
        >取消</el-button>
      </div>
      <div class="billet-info yarn-disable">
        <div class="billet-table">
          <cs-custom-form
            :data-source="greyContent"
            :options="resOptions"
            :form-datas="resFormDatas"
          />
        </div>
      </div>
    </div>

    <!-- 按钮部分 -->
    <div class="delivery-button">
      <div class="btn-all">
        <el-button
          size="small"
          type="primary"
          @click="completeGray"
        >
          完成借调
        </el-button>
      </div>
    </div>
    <billetStorePop ref="storePop" :select-order-row="selectOrderRow" @searchData="initData({},'init')" />
  </div>
</template>

<script>
import {
  grayclothList,
  grayclothUpdate
} from './api/index.js'
import cusGreyInput from './components/cusGreyInput'
import billetStorePop from './components/billetStorePop.vue'
export default {
  components: {
    billetStorePop
  },
  data() {
    const searchData = [
      {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入订单号',
        clearable: true
      },
      {
        prop: 'greyClothCode',
        itemType: 'input',
        label: '坯布编码:',
        placeholder: '请输入坯布编码',
        itemStyle: { width: '25%' },
        clearable: true
      },

      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.formDatas = params
          this.initData(this.formDatas)
        },
        resetHandle: () => {
          // console.log('重置')
          this.formDatas = {}
          // this.formDatas.sorts = [] // 自定义表格内排序
          // this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    //
    const columns = {
      _code: {
        prop: 'code',
        label: '序号'
      },
      _orderNo: {
        prop: 'orderNo',
        minWidth: '160',
        label: '订单号'
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _clothType: {
        prop: 'clothType',
        minWidth: '150',
        label: '布类',
        showOverflowTooltip: true
      },

      _greyClothNum: {
        prop: 'greyClothNum',
        label: '数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return !isNaN(scope.row.greyClothNum) ? (scope.row.greyClothNum).toFixed(2) : '-'
        }
      },
      _delivery: {
        prop: 'delivery',
        minWidth: '150',
        label: '交期',
        formater: scope => {
          return this.$filters.parseTime(
            scope.row.delivery || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      _customerName: {
        prop: 'customerName',
        minWidth: '150',
        label: '客户'
      },
      _customerColor: {
        prop: 'customerColor',
        minWidth: '150',
        label: '客户颜色'
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        minWidth: '150',
        label: '销售团队'
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '120',
        showOverflowTooltip: true
      }

    }

    // 损耗订单列表
    const billetContent = {
      _tableFormV: {
        prop: 'tableFormV',
        highlightCurrentRow: true,
        currentChange: (val) => {
          if (val) {
            this.selectOrder(val)
          }
        },
        rowClassName: (scope) => {
          return scope.rowIndex === this.currentIndex ? 'current-row' : ''
        },
        itemStyle: { marginBottom: 0 },
        itemType: 'table-form',
        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px' },
        className: 'pop-table',
        maxHeight: 400,
        dataSource: [],
        columns: columns
      }
    }

    // 借调列表
    const billetColumns = [
      {
        prop: 'id',
        type: 'selection',
        fixed: 'left',
        isShow: scope => {
          return this.editStatus
        },
        selectable: (scope) => {
          return scope.status === '0'
        }
      },
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'sourceOrderNo',
        label: '来源订单号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'sourceBill',
        label: '来源单据',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'billStatus',
        label: '单据状态',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.billStatus === '1'
            ? `<span style="color: #00BCC5;">${'已完成'}</span>`
            : `<span style="color: #FF9214;">${'进行中'}</span>`
        }
      },
      {
        prop: 'warehouse',
        label: '仓库',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'storeNum',
        label: '可用库存(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.storeNum ? (scope.row.storeNum).toFixed(2) : '-'
        }
      },

      {
        prop: 'loanNum',
        label: '借调重量(KG)',
        minWidth: '120',
        align: 'right',
        components: {
          cusGreyInput
        },
        componentsOptions: {
          type: 'billet',
          update: scope => {
            // this.lockNumChange(scope)
          }
        }
      },
      {
        prop: 'clothType',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'specifications',
        label: '规格',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '140'
      },
      {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'storeStatus',
        label: '库存状态',
        minWidth: '80',
        fixed: 'right',
        formater: scope => {
          return scope.row.storeStatus === '0'
            ? `<span style="color: #FF9214;">${'未借调'}</span>`
            : `<span style="color: #00BCC5;">${'已借调'}</span>`
        }

      }

    ]
    // 借调列表
    const greyContent = {
      _tableFormV: {
        prop: 'tableFormV',
        itemStyle: { marginBottom: 0 },
        itemType: 'table-form',

        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px' },
        className: 'pop-table',
        dataSource: [],
        selectionChange: val => {
          this.selectBillet(val)
        },
        columns: billetColumns
      }
    }

    return {
      formOtions: {
        inline: true,
        size: 'small'
      },
      formDatas: {
      },
      searchData,
      billetContent,
      billetDatas: {},
      billetOptions: {},
      resFormDatas: {},
      resOptions: {},
      // copyContent,
      billetColumns,
      editStatus: false,

      greyContent,
      billletDataSource: [], // 借调列表数据
      selectBilletData: [], // 借调列表勾选数据
      copyBillletData: [],
      currentIndex: Number,
      dataSource: [],
      selectOrderRow: null // 勾选订单记录
      // popOptions,

    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 获取损耗订单信息
    async initData(data = {}, type) {
      const params = { ...this.searchFormDatas, ...data }
      if (!params.orderNo) {
        this.$message.warning('请输入订单号')
        return
      }
      const res = await grayclothList(params)
      res.data.map((item, index) => {
        item.code = index + 1
      })
      const listData = res.data || []
      this.dataSource = listData
      this.$set(this.billetContent._tableFormV, 'dataSource', listData)
      this.$set(this.greyContent._tableFormV, 'dataSource', [])
      if (type === 'init') {
        this.selectOrder(listData[this.currentIndex])
      } else {
        this.currentIndex = ''
        this.selectOrderRow = null
      }
    },
    // 选中订单记录
    selectOrder(val) {
      this.editStatus = false
      this.selectOrderRow = val
      console.log(val)
      this.currentIndex = this.dataSource.findIndex((item) => { return val.apsLossDetailId === item.apsLossDetailId })
      const tempInfo = val.details || []
      // 借调列表数据
      this.billletDataSource = []
      for (let i = 0; i < tempInfo.length; i++) {
        this.billletDataSource.push({
          code: i + 1,
          id: tempInfo[i].id,
          clothId: tempInfo[i].clothId,
          greyClothCode: tempInfo[i].greyClothCode,
          sourceOrderNo: tempInfo[i].sourceOrderNo,
          sourceBill: tempInfo[i].sourceBill,
          billStatus: tempInfo[i].billStatus,
          status: tempInfo[i].status,
          warehouse: tempInfo[i].warehouse,
          storeNum: tempInfo[i].storeNum,
          storeStatus: tempInfo[i].storeStatus,
          loanNum: tempInfo[i].loanNum,
          clothType: tempInfo[i].clothType,
          specifications: `${tempInfo[i].suggestWidth}${
            tempInfo[i].suggestWidthUnit
          }-${tempInfo[i].suggestWeight}${tempInfo[i].suggestWeightUnit}`, // 规格
          yarnName: tempInfo[i].yarnName,
          yarnAttr: tempInfo[i].yarnAttr,
          updatedTime: tempInfo[i].updatedTime ? this.$filters.parseTime(tempInfo[i].updatedTime, '{y}-{m}-{d} {h}:{i}') : '-',
          updatedBy: tempInfo[i].updatedBy
        })
      }
      this.copyBillletData = this.$utils.deepClone(this.billletDataSource)
      this.$set(
        this.greyContent._tableFormV,
        'dataSource',
        this.billletDataSource
      )
    },

    // 借调列表-编辑勾选
    selectBillet(val) {
      this.selectBilletData = val
      this.billletDataSource.forEach(item => {
        item.checked = false
      })
      if (this.selectBilletData.length > 0) {
        this.billletDataSource.map((item) => { if (val.includes(item)) { item.checked = true } })
      }
    },
    // 借调列表-借调重量编辑
    async handleSave() {
      const reduceRecord = this.selectBilletData.map((item) => { return { id: item.id, loanNum: item.loanNum } })
      if (reduceRecord.length === 0) {
        this.$message.warning('请勾选记录')
        return
      }

      let reguFlag = false
      let loanNumFlag = false
      const reg = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/
      for (let i = 0; i < reduceRecord.length; i++) {
        if (reduceRecord[i].loanNum === '') {
          reguFlag = true
        }
        if (!reg.test(reduceRecord[i].loanNum)) {
          loanNumFlag = true
        }
      }
      if (reguFlag) {
        this.$message.warning('请输入借调重量')
        return
      }
      if (loanNumFlag) {
        this.$message.warning('请输入9位正数，最多两位小数')
        return
      }

      // 判断 借调列表中 借调重量不可大于保存编辑前的借调重量
      const arr = reduceRecord.filter((item1) => {
        return this.copyBillletData.findIndex((item2) => {
          return item1.id === item2.id && item1.loanNum > item2.loanNum
        }) !== -1
      })

      if (arr.length > 0) {
        this.$message.warning('借调重量不可大于保存编辑前的借调重量')
        return
      }
      const params = {
        id: this.selectOrderRow.id,
        details: reduceRecord
      }
      const res = await grayclothUpdate(params)
      if (!res || res.code !== 200) {
        return
      }
      this.$message.success('保存成功')
      this.editStatus = false
      this.initData({}, 'init')
    },
    // 取消
    handleCancel() {
      this.editStatus = false
      this.initData({}, 'init')
    },
    // 坯布借调
    billetDrawer() {
      if (!this.selectOrderRow) {
        this.$message.warning('请选择记录')
        return
      }
      this.oldForm = this.$refs.storePop.copyContent.formDatas || {}
      this.PopDialogHandle('坯布库存')
      // this.getGrayclothreduceList()
    },

    // 编辑按钮操作
    handleEdit() {
      if (!this.selectOrderRow) {
        this.$message.warning('请选择记录')
        return
      }
      this.editStatus = true
      // if (this.selectOrderRow.status === '0') {
      //   this.editStatus = true
      // } else {
      //   this.$message.warning('已归还记录不可编辑')
      // }
    },

    // 完成借调
    async completeGray() {
      if (this.billletDataSource.length === 0) {
        this.$message.warning('没有借调记录请操作借调记录')
      } else {
        this.$router.push(`/plan-manage/gray-fabric-debit/index`)
      }
    },

    PopDialogHandle(val) {
      this.$set(this.$refs.storePop.popOptions, 'visible', !this.$refs.storePop.popOptions.visible)
      if (val) { this.$set(this.$refs.storePop.popOptions, 'title', val) }
    }

  }
}
</script>

<style lang="scss" scoped>
.gray-fabric-debit-details {
    margin-bottom: 50px;
  .debitInfo{
    padding: 5px 0;
  }
  .coGreyNoPop{
    /deep/.pop-table{
      margin-top: 20px;
    }
  /deep/.custom-form {
      .msg-content {
        .el-form-item {
          margin-bottom: 0px;
          .el-form-item__content{
            color:#474747;
          }
        }
        .el-form-item__label {
          color: #888e9e;
          padding: 0;
        }
        .el-form-item {
          margin-right: 0;
        }
      }
    }
  }
   .card {

     margin: 15px;
    // padding-bottom: 20px;
    background-color: #fff;

    .table-detail {
      padding: 0 10px;
    }
    .card-title {
      border-bottom: 1px solid #e9eff2;
      font-size: 16px;
      color: #151222;
      line-height: 22px;
      padding: 20px 10px 20px 20px;
      .orderNum{
        float: right;
        margin-right: 20px;
        font-size: 16px;
        color: #FF9B02;
        label{
          color: #666;
          font-size: 14px;
          font-weight: normal;
        }
      }
    }
    .billet-container {
      border-bottom: none;
      button {
        float: right;
        margin: -5px 10px 0 0;
        border-radius: 4px;
      }
    }
    .billet-info {
      .search-table{
        padding: 0 5px;
      }
      // padding: 5px 0;
      .billet-table {
        padding: 0 20px;
      }
      .table {
        padding: 0 10px;
      }
    }
  }
  .billet-list {
    margin-bottom: 68px;
  }
  // 按钮位置
  .delivery-button {
    display: flex;
  }
  .delivery-button {
    bottom: 0;
    z-index: 1000;
    padding: 10px;
    width: 100%;
    background: #fff;
    position: fixed;
    border-top: 1px solid #ecf0f3;

    .btn-all {
      position: relative;
      left: 40%;
    }
  }
}
</style>
