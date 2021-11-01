<template>
  <div class="grey-cloth-detail">
    <div class="title">订单号：{{ detailInfo.orderNo }}</div>
    <div class="card">
      <div class="card-title">订单信息<span class="orderNum"><label>订单数量(KG)：</label>{{ detailInfo.orderNum }}</span></div>
      <cs-custom-form
        :data-source="baseDataSource"
        :options="baseOptions"
        :form-datas="baseDatas"
      />
      <div class="card billetInfo">
        <div class="card-title billet-container">抽坯信息</div>
        <div class="billet-info yarn-disable">
          <div class="billet-table">
            <cs-custom-form
              :data-source="billetContent"
              :options="billetOptions"
              :form-datas="billetDatas"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="card">
      <div class="card-title billet-container">抽坯信息</div>
      <div class="billet-info yarn-disable">
        <div class="billet-table">
          <cs-custom-form
            :data-source="billetContent"
            :options="billetOptions"
            :form-datas="billetDatas"
          />
        </div>
      </div>
    </div> -->

    <div class="card">
      <div class="card-title billet-container">
        抽坯列表
        <el-button
          v-if="isShow && !editStatus"
          v-permission="['aps:grayclothreduce:save']"
          type="primary"
          size="small"
          style="margin-left: auto;"
          @click="billetDrawer"
        >抽坯布</el-button>
        <el-button
          v-if="isShow && !editStatus && detailInfo.distributionStatus==='0'"
          v-permission="['aps:grayclothreduce:update']"
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
    <div class="card billet-list">
      <div class="card-title billet-container">需织坯量</div>
      <div class="billet-info yarn-disable">
        <div class="billet-table">
          <cs-custom-form
            :data-source="resContent"
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
          v-if=" isShow"
          v-permission="['aps:grayclothreduce:complete:save']"
          size="small"
          type="primary"
          @click="completeGray"
        >
          完成抽坯
        </el-button>
        <!-- <el-button v-if="isShow" size="small" class="btn-cancel">
          重新抽坯
        </el-button> -->
      </div>
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="coGreyNoPopOptions" />
    </div>
    <billetStorePop ref="storePop" :detail-info="detailInfo" @searchData="getDetail" />
  </div>
</template>

<script>
import {
  grayclothDetail,
  grayclothComplete,
  grayclothUpdate,
  grayclothreduceHold
} from './api/index.js'
// import { dataComparision } from '@/views/basic-data/common/index'
import cusGreyInput from './components/cusGreyInput'
import billetStorePop from './components/billetStorePop.vue'
export default {
  components: {
    billetStorePop
  },
  data() {
    const itemStyle = { width: '33%' }
    // 基本信息
    const baseDataSource = {
      _greyClothCode: {
        prop: 'greyClothCode', //
        itemType: 'itemview',
        label: '坯布编码：',
        itemStyle: { width: '25%' }
      },
      _clothType: {
        prop: 'clothType',
        itemType: 'itemview',
        label: '布类：',
        itemStyle: { width: '25%' }
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'itemview',
        label: '客户：',
        itemStyle: { width: '25%' }
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'itemview',
        label: '销售团队：',
        itemStyle: { width: '25%' }
      },
      _produceProcess: {
        prop: 'produceProcess',
        itemType: 'itemview',
        label: '生产流程：',
        itemStyle: { width: '25%' }
      },
      // _orderNum: {
      //   prop: 'orderNum',
      //   itemType: 'itemview',
      //   label: '订单数量(KG)：',
      //   itemStyle: { width: '25%' }
      // },
      _suggestWidth: {
        prop: 'suggestWidth',
        itemType: 'itemview',
        label: '规格：',
        itemStyle: { width: '25%' }
      },
      _garmentPartName: {
        prop: 'garmentPartName',
        itemType: 'itemview',
        label: '成衣部位：',
        itemStyle: { width: '25%' }
      },
      _delivery: {
        prop: 'delivery',
        itemType: 'itemview',
        label: '订单交期：',
        itemStyle: { width: '25%' }
      },
      _orderType: {
        prop: 'orderType',
        itemType: 'itemview',
        label: '订单类型：',
        itemStyle: { width: '25%' }
      }
    }
    //
    const columns = {
      _code: {
        prop: 'code',
        label: '序号'
      },
      _coGreyNo: {
        prop: 'coGreyNo',
        label: '备坯单号',
        handle: (scope) => {
          // if (this.$permission(['aps-center:generalYarn:check:store'])) {
          this.getCoGreyNoDetail(scope)
          // }
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注'
      },
      // _reduceNum: {
      //   prop: 'reduceNum',
      //   label: '抽用数量(KG)',
      //   align: 'right',
      //   formater: (scope) => {
      //     if (!scope.row.reduceNum && scope.row.reduceNum !== 0) {
      //       return '-'
      //     } else {
      //       return !isNaN(scope.row.reduceNum) ? Number(scope.row.reduceNum).toFixed(2) : ''
      //     }
      //   }
      // },
      _status: {
        prop: 'status',
        label: '备坯单状态',
        formater: scope => {
          return scope.row.status === '1'
            ? `<span style="color: #FF9214;">${'进行中'}</span>`
            : `<span style="color: #00BCC5;">${'已完成'}</span>`
        }
      }
    }
    const resColumns = {
      _greyClothNum: {
        prop: 'greyClothNum',
        label: '坯布数量(KG)',
        align: 'right',
        formater: (scope) => {
          if (!scope.row.greyClothNum && scope.row.greyClothNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.greyClothNum) ? Number(scope.row.greyClothNum).toFixed(2) : ''
          }
        }
      },
      _reduceNum: {
        prop: 'reduceNum',
        label: '已抽坯量(KG)',
        align: 'right',
        formater: (scope) => {
          if (!scope.row.reduceNum && scope.row.reduceNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.reduceNum) ? Number(scope.row.reduceNum).toFixed(2) : ''
          }
        }
      },
      _neddWeavingNum: {
        prop: 'neddWeavingNum',
        label: '需织坯量',
        align: 'right',
        formater: (scope) => {
          if (!scope.row.neddWeavingNum && scope.row.neddWeavingNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.neddWeavingNum) ? Number(scope.row.neddWeavingNum).toFixed(2) : ''
          }
        }
      }
    }
    // 抽坯信息
    const billetContent = {
      _tableFormV: {
        prop: 'tableFormV',
        itemStyle: { marginBottom: 0 },
        itemType: 'table-form',
        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px' },
        className: 'pop-table',
        dataSource: [],
        columns: columns
      }
    }
    // 需织坯量
    const resContent = {
      _tableFormV: {
        prop: 'tableFormV',
        itemStyle: { marginBottom: 0 },
        itemType: 'table-form',

        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px' },
        className: 'pop-table',
        dataSource: [],
        columns: resColumns
      }
    }

    // 抽坯列表
    const billetColumns = [
      {
        prop: 'id',
        type: 'selection',
        fixed: 'left',
        isShow: scope => {
          return this.editStatus
        }
        // selectable: (scope) => {
        //   return !scope.dialogDisabled
        // }
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
        prop: 'storehouse',
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
          return !isNaN(scope.row.storeNum) ? (scope.row.storeNum).toFixed(2) : '-'
        }
      },

      {
        prop: 'lockNum',
        label: '划扣重量(KG)',
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
            ? `<span style="color: #FF9214;">${'未划扣'}</span>`
            : `<span style="color: #00BCC5;">${'已划扣'}</span>`
        }

      }

    ]
    // 抽坯列表
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

    // 备坯单抽用弹框信息
    const coGreyNoPopOptions = {
      itemType: 'dialog',
      visible: false,
      okHidden: true,
      title: '备坯单抽用情况',
      className: 'coGreyNoPop',
      width: '900px',
      cancelText: '关闭',
      close: () => {
        this.coGreyNoPopOptions.visible = false
      },
      cancel: (params) => {
        this.coGreyNoPopOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        // size: 'small',
        // layout: true,
        className: 'msg-content',
        inline: true
      },
      content: {
        _coGreyNo: {
          prop: 'coGreyNo',
          itemType: 'itemview',
          label: '备坯单号：',
          itemStyle
        },
        _billNum: {
          prop: 'billNum',
          itemType: 'itemview',
          label: '备坯单数量(KG)：',
          itemStyle
        },
        _realNum: {
          prop: 'realNum',
          itemType: 'itemview',
          label: '库存可用量(KG)：',
          itemStyle
        },
        _holdNum: {
          prop: 'holdNum',
          itemType: 'itemview',
          label: '预占数量(KG)：',
          itemStyle
        },
        _useNum: {
          prop: 'useNum',
          itemType: 'itemview',
          label: '预占已使用(KG)：',
          itemStyle
        },
        _unUseNum: {
          prop: 'unUseNum',
          itemType: 'itemview',
          label: '预占未使用(KG)：',
          itemStyle
        },
        _noteDialogTable: {
          headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px', 'padding': '0' },
          className: 'pop-table',
          itemType: 'table-form',
          rowStyle: { 'background-color': '#fff' },
          layout: true,
          height: '300px',
          prop: 'noteDialogTable',
          columns: {
            _index: {
              prop: 'index',
              label: '序号',
              formater: (scope) => {
                return scope.$index + 1
              },
              minWidth: '50'
            },

            _holdNo: {
              prop: 'holdNo',
              itemType: 'itemview',
              label: '预占单据'
            },
            _holdNum: {
              prop: 'holdNum',
              itemType: 'itemview',
              align: 'right',
              label: '预占数量(KG)'
            },
            _useNum: {
              prop: 'useNum',
              itemType: 'itemview',
              align: 'right',
              label: '预占已使用(KG)'
            },
            _unUseNum: {
              prop: 'unUseNum',
              itemType: 'itemview',
              align: 'right',
              label: '预占未使用(KG)'
            }
          },
          dataSource: [],
          itemStyle: {
            width: '100%'
          }
        }
      }
    }
    return {
      baseOptions: {
        inline: true,
        className: 'msg-content'
      },
      baseDataSource,
      baseDatas: {},
      billetContent,
      billetDatas: {},
      billetOptions: {},
      resContent,
      resFormDatas: {},
      resOptions: {},
      // copyContent,
      billetColumns,

      editStatus: false,

      greyContent,
      billletDataSource: [], // 抽坯列表数据
      selectBilletData: [], // 抽坯列表勾选数据
      copyBillletData: [],
      // popOptions,
      coGreyNoPopOptions,
      detailInfo: {} // 详情数据
    }
  },
  computed: {
    isShow() {
      return this.$route.query.showType === 'edit'
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 获取详情信息
    async getDetail() {
      const params = {
        id: this.$route.query.id
      }
      const res = await grayclothDetail(params)
      this.detailInfo = res.data || {}
      // 订单数据
      this.baseDatas = {
        greyClothCode: res.data.greyClothCode,
        clothType: res.data.clothType,
        customerName: res.data.customerName,
        salesTeamName: res.data.salesTeamName,
        produceProcess: res.data.produceProcess,
        orderNum: res.data.orderNum,
        suggestWidth: `${res.data.suggestWidth}${res.data.suggestWidthUnit}-${
          res.data.suggestWeight
        }${res.data.suggestWeightUnit}`, // 规格
        garmentPartName: res.data.garmentPartName,
        delivery: res.data.delivery
          ? this.$filters.parseTime(res.data.delivery, '{y}-{m}-{d}')
          : '-',
        orderType: res.data.orderType === '1' ? '样板' : (res.data.orderType === '2' ? '大货' : '备坯')
      }

      //  抽坯信息
      const tempInformations = res.data.apsGrayClothReduceSourceInfoResp || []
      tempInformations.forEach((item, index) => {
        item.code = index + 1
      })
      this.$set(this.billetContent._tableFormV, 'dataSource', tempInformations)

      // 需织坯量
      const neddWeavingInfo = [
        {
          greyClothNum: res.data.greyClothNum,
          reduceNum: res.data.reduceNum,
          neddWeavingNum: res.data.neddWeavingNum
        }
      ]
      this.$set(this.resContent._tableFormV, 'dataSource', neddWeavingInfo)

      // 抽坯列表数据
      const tempInfo = res.data.apsGrayclothReduceRecordInfoResp || []

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
          storehouse: tempInfo[i].storehouse,
          storeNum: tempInfo[i].storeNum,
          storeStatus: tempInfo[i].storeStatus,
          lockNum: tempInfo[i].lockNum,
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
    // 抽坯列表-编辑勾选
    selectBillet(val) {
      this.selectBilletData = val
      this.billletDataSource.forEach(item => {
        item.checked = false
      })
      if (this.selectBilletData.length > 0) {
        this.billletDataSource.map((item) => { if (val.includes(item)) { item.checked = true } })
      }
    },
    // 抽坯列表-划扣重量编辑
    async handleSave() {
      const reduceRecord = this.selectBilletData.map((item) => { return { id: item.id, lockNum: item.lockNum, storeNum: item.storeNum } })
      if (reduceRecord.length === 0) {
        this.$message.warning('请勾选记录')
        return
      }

      let reguFlag = false
      let lockNumFlag = false
      const reg = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/
      for (let i = 0; i < reduceRecord.length; i++) {
        if (reduceRecord[i].lockNum === '') {
          reguFlag = true
        }
        if (!reg.test(reduceRecord[i].lockNum)) {
          lockNumFlag = true
        }
      }
      if (reguFlag) {
        this.$message.warning('请输入划扣重量')
        return
      }
      if (lockNumFlag) {
        this.$message.warning('请输入9位正数，最多两位小数')
        return
      }

      // 判断 抽坯列表中 划扣重量不可大于保存编辑前的划扣重量
      const arr = reduceRecord.filter((item1) => {
        return this.copyBillletData.findIndex((item2) => {
          return item1.id === item2.id && item1.lockNum > item2.lockNum
        }) !== -1
      })

      if (arr.length > 0) {
        this.$message.warning('划扣重量不可大于保存编辑前的划扣重量')
        return
      }
      const params = {
        id: this.detailInfo.id,
        reduceRecord: reduceRecord
      }
      const res = await grayclothUpdate(params)
      if (!res || res.code !== 200) {
        return
      }
      this.$message.success('保存成功')
      this.editStatus = false
      this.getDetail()
    },
    // 取消
    handleCancel() {
      this.editStatus = false
      this.getDetail()
    },
    // 抽坯布
    billetDrawer() {
      this.oldForm = this.$refs.storePop.copyContent.formDatas || {}
      this.PopDialogHandle('坯布库存')
      // this.getGrayclothreduceList()
    },
    // 备坯单抽用情况查询
    async getCoGreyNoDetail(scope) {
      this.$set(this.coGreyNoPopOptions, 'visible', true)
      const params = {
        greyClothCode: this.detailInfo.greyClothCode,
        coGreyNo: scope.row.coGreyNo
      }
      const res = await grayclothreduceHold(params)
      const data = res.data || []
      const coGreyNoInfo = data[0] || {}
      this.$set(
        this.coGreyNoPopOptions,
        'formDatas',
        coGreyNoInfo
      )
      this.$set(
        this.coGreyNoPopOptions.content._noteDialogTable,
        'dataSource',
        coGreyNoInfo.details || []
      )
    },
    // 编辑按钮操作
    handleEdit() {
      if (this.detailInfo.distributionStatus === '0') {
        this.editStatus = true
      } else {
        this.$message.warning('已产生下游单据不可编辑')
      }
    },

    // 完成抽坯
    async completeGray() {
      if (this.billletDataSource.length === 0) {
        const diog = await this.$uiUtils.confirmMsg({ message: '未进行抽坯操作，是否仍完成抽坯', cancelMessage: '已取消操作' })
        if (diog) {
          this.complete()
        } else {
          console.log('已取消')
        }
      } else {
        this.complete()
      }
    },

    async complete() {
      const params = {
        id: this.detailInfo.id
      }
      const res = await grayclothComplete(params)
      if (!res || res.code !== 200) {
        return false
      }
      this.$message.success('提交成功')
      this.getDetail()
      this.$router.push(`/plan-manage/grey-cloth/index`)
    },
    PopDialogHandle(val) {
      this.$set(this.$refs.storePop.popOptions, 'visible', !this.$refs.storePop.popOptions.visible)
      if (val) { this.$set(this.$refs.storePop.popOptions, 'title', val) }
    }

  }
}
</script>

<style lang="scss" scoped>
.grey-cloth-detail {
  .title {
    line-height: 25px;
    padding: 20px 20px 0 20px;
    font-size: 18px;
    color: #151222;
  }
  .billetInfo{
    margin: 0 !important;
    padding-bottom: 0 !important;
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
    padding-bottom: 20px;
    background-color: #fff;
    /deep/.custom-form {
      .msg-content {
        background: #fff;
        // padding: 0 20px 0;
        margin: 20px 20px 0 20px;
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
