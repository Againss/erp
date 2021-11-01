<!--
 * @Author: xj
 * @Description: 染纱需求底部 按钮状态扭转
 * @Date: 2021-06-02 19:49:57
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-02 17:06:23
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\demand\detail\status-button.vue
-->
<template>
  <div>
    <el-button
      v-if="submit_isShow"
      :type="getSubmitPrimary"
      @click="orderDataSubmit"
    >提交</el-button>
    <el-button v-if="cancel_isShow" @click="cancelClick">取消</el-button>
  </div>
</template>

<script>
import { saveWaitInfo, savePlanInfo, savePlanInfoChecked } from '../api/index'
import { setOrderFun } from '../../public/mou'
export default {
  components: {
  },
  mixins: [setOrderFun],
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    clothingForm: {
      type: Object
    },
    setActiveName: {
      type: String
    },
    indexCode: {
      type: String
    },
    uuidClose: {
      type: String
    },
    oldSupplier: {
      type: Object
    },
    getDetailData: {
      type: Function
    },
    isCopy: {
      type: Boolean
    },
    chechedArray: {
      type: Array
    }
  },
  data() {
    return {
      orderData: {},
      orderIndexData: {},
      Picrelease: false,
      orderDataCompare: {}
    }
  },
  computed: {
    status() {
      return this.baseInfo.status || '0'
    },
    getSubmitPrimary() {
      return 'primary'
    },
    submit_isShow() { // 提交 YES("Y", "已排厂"),NO("N", "未排厂"),需求的状态
      return this.isEdit && ['1', '2'].includes(this.setActiveName) && this.$filterPermission(['customerOrder:greyOrder:submit'])
    },
    cancel_isShow() { // 取消
      return this.isEdit && ['2'].includes(this.setActiveName) && this.$filterPermission(['customerOrder:greyOrder:cancel'])
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        console.log(val)
      },
      deep: true,
      immediate: true
    },
    clothingForm: {
      handler(val, oldVal) {
        this.orderDataCompare = this.$utils.deepClone(val)
        this.orderDataCompare.taskNo = this.indexCode
      },
      deep: true,
      immediate: true
    },
    chechedArray: {
      handler(val, oldVal) {
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 取消
    cancelClick() {
      this.getDetailData(this.uuidClose, 1)
    },
    SubmitForVerification() { // 提交验证
      const pu = []
      const Tim = this.orderDataCompare
      if (!Tim.supplier || !this.setInfoValue(Tim.supplier)) {
        pu.push('印花厂不能为空')
      } else if (!Tim.pmUser || !this.setInfoValue(Tim.pmUser)) {
        pu.push('跟单人员不能为空')
        //  else if (this.setActiveName === '1' && !Tim.orderDetailInfoResponses.length) {
        //   pu.push('分录不能为空')
        // }
      } else if (!this.chechedArray.length) {
        pu.push('请先选择至少一条数据')
      } else {
        // const om = this.setActiveName === '1' ? this.VerifyEntry(Tim.demandDetailSubmitRequests, this.setActiveName) : this.VerifyEntry(Tim.pdPrintOrderDetailInfoRespList, this.setActiveName)
        const om = this.VerifyEntry(this.chechedArray, this.setActiveName)
        if (om.length) { pu.push(om[0]) }
      }
      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        return false
      } else {
        return true
      }
    },
    VerifyEntry(data = [], type) { // 验证分录
      const op = []
      if (data.length) {
        data.forEach((im) => {
          const no = im.planQty - im.arrangeFactoryQty
          const noplan = im.qty - im.arrangeFactoryQty
          const firstNum = im.firstNum
          if (!im.printDelivery) {
            op.push('印花交期不能为空')
          }
          if (!im.qty) {
            op.push('排厂量不能为空')
          }
          if (type === '1' && (Number(im.qty) > Number(no))) {
            op.push('排厂量不能大于未排总量')
          }
          if (type === '2') {
            const iv = this.$utils.getFloat(firstNum, 2) * 1 + this.$utils.getFloat(noplan, 2) * 1
            const ip = this.$utils.getFloat(im.planQty, 2) * 1
            if (ip > iv) { op.push('排厂量不能大于当前订单排厂量+未排总量') }
          }
        })
      }
      return op
    },
    // 提交
    async orderDataSubmit(Routing = '0') {
      if (!this.SubmitForVerification()) { return false }
      let res = ''
      if (this.setActiveName === '1') {
        const parem = this.$utils.deepClone(this.orderDataCompare)
        parem.demandDetailSubmitRequests = this.chechedArray || null
        const obj = {}
        const arr = []
        parem.demandDetailSubmitRequests.forEach((val, index) => {
          arr.push({
            demandDetailUuid: val.uuid, // 印花单uuid
            printDelivery: val.printDelivery, // 印花交期
            qty: val.qty // 数量
          })
        })
        obj.taskNo = parem.taskNo
        obj.supplier = parem.supplier
        obj.pmUser = parem.pmUser
        obj.pdPrintDemandFactoryDetailDetailReqs = arr
        res = await saveWaitInfo(obj)
        if (res.code === 200) {
          this.$store.dispatch('app/fetchParamsLog', {
            opratorType: 'INSERT',
            api: '/processingMgr/pdPrintDemand/factory/save',
            description: {
              beforeText: `在'加工管理-印花-印花需求-待排厂中'新增一条排厂信息`,
              beforeCode: parem
            },
            appId: 'processingMgr'
          })
        }
      } else if (this.setActiveName === '2') {
        const parem = this.$utils.deepClone(this.orderDataCompare)
        parem.orderDetailInfoResponses = this.chechedArray || null
        delete parem.pdPrintDemandDetailInfoRespList
        // 已排厂提交变更
        const obj = {}
        const arr = []
        parem.orderDetailInfoResponses.forEach((val, index) => {
          arr.push({
            demandDetailUuid: val.demandDetailUuid,
            printDelivery: val.printDelivery, // 印花交期
            qty: val.planQty // 数量
          })
        })
        obj.uuid = parem.uuid
        obj.supplier = parem.supplier
        obj.pmUser = parem.pmUser
        obj.pdPrintOrderFactoryDetailUpdateReqs = arr
        // 如果印花厂有改变，则走变更排厂的接口，没有改变则走校验调拨数量接口
        if (Number(parem.supplier.value) === Number(this.oldSupplier.value)) {
          // 变更后排厂量小于已调拨量
          res = await savePlanInfoChecked({ ...obj })
          if (res.code === 200 && res.data === true) {
            this.$confirm(
              '变更后的排厂量对应的原料需求量小于已调拨的总量，请确认!', '提示',
              { type: 'warning', confirmBtn: '修改调拨单', cancelBtn: '重新调拨', confirmButtonText: '修改调拨单',
                cancelButtonText: '重新调拨', cancelButtonClass: 'printDemand', confirmButtonClass: 'printDemand',
                distinguishCancelAndClose: true }
            )
              .then(() => {
                this.$router.push({ path: `/processing/printing/requisition`, query: { noticeNo: this.data.printNo }})
              }) // 将跳转到原料调拨通知单页面  test
              .catch(async(action) => {
                // 重新调拨
                if (action === 'cancel') {
                  obj.isDeletedAllot = 1
                  res = await savePlanInfo({ ...obj })
                  if (res.code === 200) {
                    this.$emit('okCallback', { type: '3', Routing })
                  }
                }
              })
          } else {
            // 返回false，正常提交
            obj.isDeletedAllot = 0
            res = await savePlanInfo({ ...obj })
            if (res.code === 200) {
              this.$emit('okCallback', { type: '2', Routing })
            }
          }
        } else {
          // 变更工厂
          this.$confirm(
            '是否确认变更加工厂，确认后，原有的原料调拨通知将被取消，请确认？', '提示',
            { type: 'warning', confirmBtn: '确认', cancelBtn: '取消' }
          )
            .then(async() => {
              obj.isDeletedAllot = 0
              res = await savePlanInfo({ ...obj })
              if (res.code === 200) {
                this.$emit('okCallback', { type: '2', Routing })
              }
            })
        }
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdPrintDemand/factory/modify',
          description: {
            beforeText: `在'加工管理-印花-印花需求-排厂中'变更
            任务单号:${parem.taskNo} 的排厂信息`,
            beforeCode: { uuid: parem.uuid,
              supplier: parem.supplier,
              pmUser: parem.pmUser,
              pdPrintOrderFactoryDetailUpdateReqs: arr }
          },
          appId: 'processingMgr'
        })
      }
      if (this.setActiveName === '1') { // 待排厂
        if (res.code !== 200) { return false }
        this.$emit('okCallback', { type: '1', Routing })
      }
    }

  }
}

</script>

<style lang="scss">
@import "@/styles/base.scss";
.el-message-box .el-message-box__btns {
  .printDemand {
    width: auto;
  }
}
</style>

