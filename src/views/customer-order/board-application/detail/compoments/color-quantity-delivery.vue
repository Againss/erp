<!--
 * @name: panmr
 * @description: 剪样要求
 * @author: panmr
 * @time: 2021-05-21 16:40:56
-->
<template>
  <div class="yarnPreparation-color">
    <div class="color-header color-header-colors">
      <div class="left">
        <span>剪样要求</span>
      </div>
      <div class="right">
        <el-button v-if="data.baseInfo.status === 5 && (data.baseInfo.thingType + '') === '2'" v-permission="['customerOrder:cutSampleApply:modifyExpressNumber']" type="primary" size="mini" @click="addExpressNumber">添加快递单号</el-button>
        <el-button v-if="data.baseInfo.status === 5 && (data.baseInfo.thingType + '') === '2'" v-permission="['customerOrder:cutSampleApply:modifyComment']" type="primary" size="mini" @click="addComment">添加评语</el-button>
        <el-button v-if="isEdit" type="primary" size="mini" @click="addAllInfo">新增</el-button>
      </div>
    </div>
    <div class="page-tables page-table-border page-table">
      <cs-custom-table ref="allColumnslData" :header-cell-style="headerCellStyle" highlight-current-row :columns="columns" :data-source="cutSampleRequirements" :operates="allOperates" edit-type="pop" @row-click="rowClick" />
    </div>
    <!-- 剪样要求弹出层 -->
    <cutSampleRequirementsPop ref="cutSampleRequirementsPop" @save="saveCallback" />
    <!-- 添加/修改快递单号 -->
    <cs-custom-pop ref="expressNumberPop" :options="expressNumberPopOptions" />
    <!-- 添加/修改评语 -->
    <cs-custom-pop ref="comment" :options="commentPopOptions" />
  </div>
</template>

<script>
import { getDetail, modifyExpressNumber, modifyComment } from '../api/index'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
import expressNumberProcess from './expressNumberProcess'
import LABEL from './label'
import cutSampleRequirementsPop from './cutSampleRequirements-pop'

export default {
  name: 'YansQuantityDeliver',
  components: { cutSampleRequirementsPop },
  mixins: [PublicCustomer, setOrderFun],
  props: {
    status: {
      type: String
    },
    rowIndex: {
      type: Number
    },
    isEdit: {
      type: Boolean
    },
    data: {
      type: Object
    },
    maxMater: {
      type: String
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '编辑', isShow: true, handle: scope => this.$nextTick(() => this.$refs['cutSampleRequirementsPop'].init(scope.row, this.cutSampleRequirements)) },
      { label: '删除', style: { 'color': '#FE4949' }, isShow: true, handle: scope => this.doDelete(scope.row) }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const progressColumns3 = [ // 状态为3进行中显示的
      { prop: 'code', label: LABEL.code, minWidth: '50', showOverflowTooltip: true, formater: scope => {
        return scope.$index + 1
      } },
      { prop: 'sourceNumber', label: LABEL.sourceNumber, minWidth: '140', showOverflowTooltip: true },
      { prop: 'sellerTeam', label: LABEL.sellerTeam, minWidth: '120', showOverflowTooltip: true, formater: scope => {
        return scope.row.sellerTeam ? scope.row.sellerTeam.label : '-'
      } },
      { prop: 'cylinderNumber', label: LABEL.cylinderNumber, minWidth: '120', showOverflowTooltip: true },
      { prop: 'productCode', label: LABEL.productCode, minWidth: '150', showOverflowTooltip: true },
      { prop: 'yarnInfo', label: LABEL.yarnInfo, minWidth: '200', showOverflowTooltip: true },
      { prop: 'productInfo', label: LABEL.productInfo, minWidth: '210', showOverflowTooltip: true },
      { prop: 'barcode', label: LABEL.barcode, minWidth: '150', showOverflowTooltip: true },
      { prop: 'storageLocation', label: LABEL.storageLocation, minWidth: '120', showOverflowTooltip: true },
      { prop: 'cutClothQuantity', label: LABEL.cutClothQuantity, minWidth: '120', showOverflowTooltip: true, formater: scope => {
        return scope.row.unit ? (scope.row.cutClothQuantity || '') + ' ' + scope.row.unit.label : scope.row.cutClothQuantity || '-'
      } },
      { prop: 'auxiliaryQuantity', label: LABEL.auxiliaryQuantity, minWidth: '120', showOverflowTooltip: true },
      { prop: 'cutSampleRequirements', label: LABEL.cutSampleRequirements, minWidth: '180', showOverflowTooltip: true },
      { prop: 'status', label: '状态', minWidth: '80', showOverflowTooltip: true,
        formater: scope => {
          // 状态integer（-1=空，0=待剪布，1=剪布中，2=已剪布，3=剪板中，4=已剪板）
          const statusTexts = ['待剪布', '剪布中', '已剪布', '剪板中', '已剪板']
          const status = statusTexts[scope.row[scope.column.property]] || '-'
          return `<span>${status}</span>`
        }
      }
    ]
    const progressColumns51 = [ // 状态为5已完结 内部件显示的 不显示状态栏 快递单号 评语
      { prop: 'code', label: LABEL.code, minWidth: '50', showOverflowTooltip: true, formater: scope => {
        return scope.$index + 1
      } },
      { prop: 'sourceNumber', label: LABEL.sourceNumber, minWidth: '140', showOverflowTooltip: true },
      { prop: 'sellerTeam', label: LABEL.sellerTeam, minWidth: '120', showOverflowTooltip: true, formater: scope => {
        return scope.row.sellerTeam ? scope.row.sellerTeam.label : '-'
      } },
      { prop: 'cylinderNumber', label: LABEL.cylinderNumber, minWidth: '120', showOverflowTooltip: true },
      { prop: 'productCode', label: LABEL.productCode, minWidth: '150', showOverflowTooltip: true },
      { prop: 'yarnInfo', label: LABEL.yarnInfo, minWidth: '200', showOverflowTooltip: true },
      { prop: 'productInfo', label: LABEL.productInfo, minWidth: '210', showOverflowTooltip: true },
      { prop: 'barcode', label: LABEL.barcode, minWidth: '150', showOverflowTooltip: true },
      { prop: 'storageLocation', label: LABEL.storageLocation, minWidth: '120', showOverflowTooltip: true },
      { prop: 'cutClothQuantity', label: LABEL.cutClothQuantity, minWidth: '120', showOverflowTooltip: true, formater: scope => {
        return scope.row.unit ? (scope.row.cutClothQuantity || '') + ' ' + scope.row.unit.label : scope.row.cutClothQuantity || '-'
      } },
      { prop: 'auxiliaryQuantity', label: LABEL.auxiliaryQuantity, minWidth: '120', showOverflowTooltip: true },
      { prop: 'cutSampleRequirements', label: LABEL.cutSampleRequirements, minWidth: '180', showOverflowTooltip: true }
    ]
    const progressColumns52 = [ // 状态为5已完结 外部件显示的 显示状态栏 快递单号 评语
      { prop: 'code', label: LABEL.code, minWidth: '50', showOverflowTooltip: true, formater: scope => {
        return scope.$index + 1
      } },
      { prop: 'sourceNumber', label: LABEL.sourceNumber, minWidth: '140', showOverflowTooltip: true },
      { prop: 'sellerTeam', label: LABEL.sellerTeam, minWidth: '120', showOverflowTooltip: true, formater: scope => {
        return scope.row.sellerTeam ? scope.row.sellerTeam.label : '-'
      } },
      { prop: 'cylinderNumber', label: LABEL.cylinderNumber, minWidth: '120', showOverflowTooltip: true },
      { prop: 'productCode', label: LABEL.productCode, minWidth: '150', showOverflowTooltip: true },
      { prop: 'yarnInfo', label: LABEL.yarnInfo, minWidth: '200', showOverflowTooltip: true },
      { prop: 'productInfo', label: LABEL.productInfo, minWidth: '210', showOverflowTooltip: true },
      { prop: 'barcode', label: LABEL.barcode, minWidth: '150', showOverflowTooltip: true },
      { prop: 'storageLocation', label: LABEL.storageLocation, minWidth: '120', showOverflowTooltip: true },
      { prop: 'cutClothQuantity', label: LABEL.cutClothQuantity, minWidth: '120', showOverflowTooltip: true, formater: scope => {
        return scope.row.unit ? (scope.row.cutClothQuantity || '') + ' ' + scope.row.unit.label : scope.row.cutClothQuantity || '-'
      } },
      { prop: 'auxiliaryQuantity', label: LABEL.auxiliaryQuantity, minWidth: '120', showOverflowTooltip: true },
      { prop: 'cutSampleRequirements', label: LABEL.cutSampleRequirements, minWidth: '180', showOverflowTooltip: true },
      { prop: 'expressNumber', label: LABEL.expressNumber, minWidth: '100', showOverflowTooltip: true,
        components: { expressNumberProcess },
        componentsOptions: {
          getBaseInfo: () => this.data.baseInfo || {},
          // permitTag: 'baseData:lossSetting:basePrintBasic:status',
          changeStatus: (scope) => {
            // this.enableStatus({ id: scope.row.id, status: scope.row.status }, scope)
          }
        }
      },
      { prop: 'comment', label: LABEL.comment, minWidth: '100', showOverflowTooltip: true, formater: scope => scope.row.comment || '-' }
    ]
    const commonBlurRegEn_num = this.$getRules({ type: 'en_num', trigger: ['change'] })
    return {
      headerCellStyle: { // table表头颜色
        'background': '#F5F7FA'
      },
      columns: [
        { prop: 'code', label: LABEL.code, minWidth: '50', showOverflowTooltip: true, formater: scope => {
          return scope.$index + 1
        } },
        { prop: 'sourceNumber', label: LABEL.sourceNumber, minWidth: '140', showOverflowTooltip: true },
        { prop: 'sellerTeam', label: LABEL.sellerTeam, minWidth: '120', showOverflowTooltip: true, formater: scope => {
          return scope.row.sellerTeam ? scope.row.sellerTeam.label : '-'
        } },
        { prop: 'cylinderNumber', label: LABEL.cylinderNumber, minWidth: '120', showOverflowTooltip: true },
        { prop: 'productCode', label: LABEL.productCode, minWidth: '150', showOverflowTooltip: true },
        { prop: 'yarnInfo', label: LABEL.yarnInfo, minWidth: '200', showOverflowTooltip: true },
        { prop: 'productInfo', label: LABEL.productInfo, minWidth: '210', showOverflowTooltip: true },
        { prop: 'barcode', label: LABEL.barcode, minWidth: '150', showOverflowTooltip: true },
        { prop: 'storageLocation', label: LABEL.storageLocation, minWidth: '120', showOverflowTooltip: true },
        { prop: 'cutClothQuantity', label: LABEL.cutClothQuantity, minWidth: '120', showOverflowTooltip: true, formater: scope => {
          return scope.row.unit ? (scope.row.cutClothQuantity || '') + ' ' + scope.row.unit.label : scope.row.cutClothQuantity || '-'
        } },
        { prop: 'auxiliaryQuantity', label: LABEL.auxiliaryQuantity, minWidth: '120', showOverflowTooltip: true },
        { prop: 'cutSampleRequirements', label: LABEL.cutSampleRequirements, minWidth: '180', showOverflowTooltip: true }
      ], // 表头
      progressColumns: [
        { prop: 'code', label: LABEL.code, minWidth: '50', showOverflowTooltip: true, formater: scope => {
          return scope.$index + 1
        } },
        { prop: 'sourceNumber', label: LABEL.sourceNumber, minWidth: '140', showOverflowTooltip: true },
        { prop: 'sellerTeam', label: LABEL.sellerTeam, minWidth: '120', showOverflowTooltip: true, formater: scope => {
          return scope.row.sellerTeam ? scope.row.sellerTeam.label : '-'
        } },
        { prop: 'cylinderNumber', label: LABEL.cylinderNumber, minWidth: '120', showOverflowTooltip: true },
        { prop: 'productCode', label: LABEL.productCode, minWidth: '150', showOverflowTooltip: true },
        { prop: 'yarnInfo', label: LABEL.yarnInfo, minWidth: '200', showOverflowTooltip: true },
        { prop: 'productInfo', label: LABEL.productInfo, minWidth: '210', showOverflowTooltip: true },
        { prop: 'barcode', label: LABEL.barcode, minWidth: '150', showOverflowTooltip: true },
        { prop: 'storageLocation', label: LABEL.storageLocation, minWidth: '120', showOverflowTooltip: true },
        { prop: 'cutClothQuantity', label: LABEL.cutClothQuantity, minWidth: '120', showOverflowTooltip: true, formater: scope => {
          return scope.row.unit ? (scope.row.cutClothQuantity || '') + ' ' + scope.row.unit.label : scope.row.cutClothQuantity || '-'
        } },
        { prop: 'auxiliaryQuantity', label: LABEL.auxiliaryQuantity, minWidth: '120', showOverflowTooltip: true },
        { prop: 'cutSampleRequirements', label: LABEL.cutSampleRequirements, minWidth: '180', showOverflowTooltip: true }
      ],
      progressColumns3, // 状态为进行中显示的表头
      progressColumns51,
      progressColumns52,
      popOperatesDataSource: popOperatesDataSource,
      cutSampleRequirements: [], // 表格数据源
      allOperates: { label: '操作', width: '160', fixed: 'right', dataSource: popOperatesDataSource },
      expressNumberPopOptions: { // 添加快递单号弹框配置
        itemType: 'dialog',
        visible: false,
        title: '添加快递单号',
        width: '770px',
        okText: '确定',
        cancelText: '取消',
        close: () => {
          this.expressNumberPopOptions.formDatas = {}
          this.expressNumberPopOptions.visible = false
        },
        ok: (params) => {
          // 请求 添加快递单号 接口
          if (!params.expressNumber) {
            this.$message({ message: '快递单号不能为空', type: 'warning' })
            return
          }
          modifyExpressNumber({ id: this.currentRow.id, expressNumber: params.expressNumber }).then(res => {
            if (res.code === 200) {
              this.expressNumberPopOptions.visible = false
              this.$message({ message: '添加快递单号成功', type: 'success' })
              this.getDetail(this.data.baseInfo.uuid)
            }
          })
        },
        cancel: (params) => {
          this.expressNumberPopOptions.formDatas = {}
          this.expressNumberPopOptions.visible = false
        },
        formDatas: {},
        content: [
          { label: '', itemType: 'input', prop: 'expressNumber', maxlength: 30, rows: 5, rules: [commonBlurRegEn_num, { min: 1, max: 30, message: '长度在1 到 30 个字符', trigger: 'blur' }], type: 'textarea' }
        ]
      },
      commentPopOptions: { // 添加评语弹框配置
        itemType: 'dialog',
        visible: false,
        title: '添加评语',
        width: '770px',
        okText: '确定',
        cancelText: '取消',
        close: () => {
          this.commentPopOptions.formDatas = {}
          this.commentPopOptions.visible = false
        },
        ok: (params) => {
          // 请求 添加评语 接口
          if (!params.comment) {
            this.$message({ message: '评语不能为空', type: 'warning' })
            return
          }
          modifyComment({ id: this.currentRow.id, comment: params.comment }).then(res => {
            if (res.code === 200) {
              this.commentPopOptions.visible = false
              this.$message({ message: '添加评语成功', type: 'success' })
              this.getDetail(this.data.baseInfo.uuid)
            }
          })
        },
        cancel: (params) => {
          this.commentPopOptions.formDatas = {}
          this.commentPopOptions.visible = false
        },
        formDatas: {},
        content: [
          { label: '', itemType: 'input', prop: 'comment', maxlength: 100, rows: 5, rules: [{ min: 1, max: 100, message: '长度在1 到 100 个字符', trigger: 'blur' }], type: 'textarea' }
        ]
      },
      config: { // 审核流程
        visible: false,
        workflowId: '',
        procinstid: '',
        pass: (res) => {
          this.GoBackOrder()
        },
        refuse: (res) => {
          this.GoBackOrder()
        },
        back: (res) => {
          this.GoBackOrder()
        }
      },
      currentRow: {} // 当前单击行
    }
  },
  computed: {
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        this.changeStatus(val)
      },
      deep: true,
      immediate: true
    },
    data: { // xj
      handler(val, oldVal) {
        const orderData = this.$utils.deepClone(val)
        if (orderData.baseInfo.status === 5) { // 状态为已完结
          if (orderData.baseInfo.thingType + '' === '1') { // 内部件 不显示快递单号 评语字段
            this.columns = this.progressColumns51
            this.allOperates = null
          }
          if (orderData.baseInfo.thingType + '' === '2') { // 外部件 显示快递单号 评语字段
            this.columns = this.progressColumns52
            this.allOperates = null
          }
        } else if (orderData.baseInfo.status === 3) { // 状态为进行中 显示状态栏
          this.columns = this.progressColumns3
          this.allOperates = null
        } else {
          this.columns = this.progressColumns
        }
        this.cutSampleRequirements = orderData.cutSampleRequirements && orderData.cutSampleRequirements || []
      },
      deep: true,
      immediate: true
    },
    cutSampleRequirements: {
      handler(val, oldVal) {
        this.syncMoudleDataHandle('cutSampleRequirements', val || [])
      },
      deep: true,
      immediate: true
    },
    materialData: {// xj
      handler(val) {
        console.log('Sssssonm', val)
        this.$nextTick(() => {
          // this.setYarnTotal()
          this.syncMoudleDataHandle('cutSampleRequirements', val || [])
        })
      },
      deep: true,
      immediate: true
    },
    comTotal: {// xjw
      handler(val) {
        this.setParentDataHandle('totalQuantity', val)
      },
      deep: true
    },
    rule: {
      handler(v) {
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    GoBackOrder() {
      this.$router.push('/customer-order/board-application')
    },
    // 改变状态
    changeStatus(val) {
      if (val) {
        this.allOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          isShow: true,
          dataSource: this.popOperatesDataSource
        }
      } else {
        this.allOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          isShow: false,
          dataSource: this.popOperatesDataSource
        }
      }
    },
    getDetail(uuid) {
      getDetail({ uuid: uuid }).then(response => {
        if (response.code === 200) {
          this.currentRow = {} // 清空选中的行
          this.cutSampleRequirements = response.data && response.data.cutSampleRequirements && response.data.cutSampleRequirements || []
        }
      })
    },
    // 添加快递单号按钮事件
    addExpressNumber() {
      if (this.currentRow && !this.currentRow.orderId) {
        this.$message({ message: '请选择一条分录', type: 'warning' })
        return
      }
      this.expressNumberPopOptions.visible = true
    },
    // 添加评语事件
    addComment() {
      if (this.currentRow && !this.currentRow.orderId) {
        this.$message({ message: '请选择一条分录', type: 'warning' })
        return
      }
      if (this.currentRow && !this.currentRow.expressNumber) {
        this.$message({ message: '请先添加快递单号', type: 'warning' })
        return
      }
      this.commentPopOptions.visible = true
    },
    // 新增剪样要求
    addAllInfo() {
      this.$nextTick(() => this.$refs['cutSampleRequirementsPop'].init({}, this.cutSampleRequirements))
    },
    // 表格行点击
    rowClick(row, column, event) {
      this.currentRow = Object.assign({}, row)
    },
    // 删除剪样要求
    doDelete(row) {
      if (row.id) {
        const index = this.cutSampleRequirements.findIndex(n => n.id === row.id) // 找下标，下标从0开始 id后端生成
        this.cutSampleRequirements.splice(index, 1) // 通过下标删除指定元素
        return
      }
      if (row.index) {
        const index = this.cutSampleRequirements.findIndex(n => n.index === row.index) // 找下标，下标从0开始 index前端生成
        this.cutSampleRequirements.splice(index, 1) // 通过下标删除指定元素
      }
    },
    // 剪样要求保存回调
    saveCallback(row = {}) {
      if (!this.cutSampleRequirements.length) { // 第一次新增
        this.cutSampleRequirements.push({ ...row, cutClothQuantity: Number(row.cutClothQuantity), auxiliaryQuantity: Number(row.auxiliaryQuantity) || 0, index: Date.now() }) // 以时间戳为id cutClothQuantity转换为number类型
        return
      }
      if (row.id) { // 说明是编辑
        for (const key in this.cutSampleRequirements) {
          if (this.cutSampleRequirements[key].id === row.id) { // 修改 以orderId(后端生成)判断  或index(前端生成)判断
            this.$set(this.cutSampleRequirements, key, { ...row, cutClothQuantity: Number(row.cutClothQuantity), auxiliaryQuantity: Number(row.auxiliaryQuantity) || 0 }) // cutClothQuantity转换为number类型
            return
          }
        }
      } else {
        if (row.index) { // 说明是编辑 index是前端生成的
          for (const key in this.cutSampleRequirements) {
            if (this.cutSampleRequirements[key].index === row.index) { // 修改 以orderId(后端生成)判断  或index(前端生成)判断
              this.$set(this.cutSampleRequirements, key, { ...row, cutClothQuantity: Number(row.cutClothQuantity), auxiliaryQuantity: Number(row.auxiliaryQuantity) || 0 }) // cutClothQuantity转换为number类型
              return
            }
          }
        } else { // 新增
          this.cutSampleRequirements.push({ ...row, cutClothQuantity: Number(row.cutClothQuantity), auxiliaryQuantity: Number(row.auxiliaryQuantity) || 0, index: Date.now() }) // 以时间戳为id cutClothQuantity转换为number类型
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.yarnPreparation-color {
  width: 100%;
  background: #ffffff;
  .color-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;
    span {
      font-size: 16px;
    }
    .el-button {
      span {
        font-size: 14px;
        font-weight: normal;
      }
    }
    .left {
      display: flex;
      align-items: center;
      .title {
        margin-right: 40px;
      }
      .date-title {
        position: relative;
        .item-title::before {
          display: block;
          content: '*';
          position: absolute;
          left: -8px;
          color: #ff4444;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .total {
        margin: 0 20px;
      }
    }
  }
  .page-table-border{
    padding: 0 10px;
    /deep/tbody .el-table__row td{
      border-bottom-width: 1px!important;
      // padding: 0 !important;
    }
  }
}
</style>

<style lang="scss">
.yarnPreparation-color {
  .cursorHandel {
    input {
      cursor: pointer;
    }
  }
  .printColorDesign {
    width: 36px;
    height: 36px;
  }
  .lihe-23px{
    line-height: 23px;
    margin: 3px 0;
  }
}
</style>
