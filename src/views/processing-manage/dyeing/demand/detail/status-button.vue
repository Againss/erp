<!--
 * @Author: hzq
 * @Description: 染整需求底部按钮模块
 * @Date: 2021-06-02 19:49:57
 * @LastEditors: lishili
 * @LastEditTime: 2021-07-02 14:40:26
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\demand\detail\status-button.vue
-->
<template>
  <div class="dye_demand_status_button">
    <el-button
      v-if="submit_isShow"
      type="primary"
      @click="orderDataSubmit"
    >提交</el-button>

    <el-button
      v-if="cancel_isShow"
      @click="cancelClick"
    >取消</el-button>
  </div>
</template>

<script>
import { setOrderFun } from '../../public/mou'
import { saveWaitInfo, savePlanInfo, savePlanInfoChecked } from '../api/index'
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
    indexRow: {
      type: Object
    },
    oldSupplier: {
      type: Object
    },
    setActiveName: {
      type: String
    },
    indexCode: {
      type: String
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
    // status() {
    //   return this.baseInfo.status || '0'
    // },
    // 提交按钮是否显示
    submit_isShow() {
      return this.isEdit && ['N', 'O'].includes(this.setActiveName) && this.$filterPermission(['customerOrder:greyOrder:submit'])
    },
    // 取消按钮是否显示
    cancel_isShow() {
      return this.isEdit && ['O'].includes(this.setActiveName) && this.$filterPermission(['customerOrder:greyOrder:cancel'])
    }
  },
  watch: {
    // 监听allOrderIndexData数据
    data: {
      handler(val, oldVal) {
        console.log(val)
      },
      deep: true,
      immediate: true
    },
    // 监听同步客样分析编号模块数据
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
  created() {},
  mounted() {
  },
  methods: {
    // 取消
    cancelClick() {
      this.$emit('cancelClick')
    },
    // 判断染厂/跟单人员是否选择
    SubmitForVerification() {
      const pu = []
      const Tim = this.orderDataCompare
      if (!Tim.supplier || !this.setInfoValue(Tim.supplier)) {
        pu.push('染厂不能为空')
      } else if (!Tim.pmUser || !this.setInfoValue(Tim.pmUser)) {
        pu.push('跟单人员不能为空')
      } else if (!this.chechedArray.length) {
        pu.push('请先选择至少一条数据')
      } else {
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
    // 详情列表填写字段规则校验
    VerifyEntry(data = [], type = 'N') {
      const op = []
      if (data.length) {
        data.forEach((im) => {
          const no = im.planQty - im.arrangeFactoryQty
          const noplan = im.qty - im.arrangeFactoryQty
          const firstNum = im.firstNum

          if (!im.dyeDelivery) {
            op.push('染整交期不能为空')
          }
          if (!im.qty) {
            op.push('排厂量不能为空')
          }
          if (type === 'N' && (Number(im.qty) > Number(no))) {
            op.push('排厂量不能大于未排总量')
          }
          if (type === 'O') {
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
      if (this.setActiveName === 'N') {
        const parem = this.$utils.deepClone(this.orderDataCompare)
        parem.demandDetailSubmitRequests = this.chechedArray || null
        const obj = {}
        const arr = []
        parem.demandDetailSubmitRequests.forEach((val, index) => {
          arr.push({
            demandDetailUuid: val.uuid, // 染整单销售单分录ID
            dyeDelivery: val.dyeDelivery, // 染整交期
            qty: val.qty // 数量
          })
        })
        obj.taskNo = parem.taskNo
        obj.supplier = parem.supplier
        obj.pmUser = parem.pmUser
        obj.pdDyeDemandFactoryDetailDetailReqs = arr
        res = await saveWaitInfo(obj)
        if (res.code === 200) {
          this.$store.dispatch('app/fetchParamsLog', {
            opratorType: 'INSERT',
            api: '/processingMgr/pdDyeDemand/factory/save',
            description: {
              beforeText: `在'加工管理-染整-染整需求-待排厂中'新增一条排厂信息`,
              beforeCode: parem
            },
            appId: 'processingMgr'
          })
        }
      } else if (this.setActiveName === 'O') {
        const parem = this.$utils.deepClone(this.orderDataCompare)
        parem.orderDetailInfoResponses = this.chechedArray || null
        delete parem.pdDyeDemandDetailInfoRespList
        // 已排厂提交变更
        const obj = {}
        const arr = []
        parem.orderDetailInfoResponses.forEach((val, index) => {
          arr.push({
            demandDetailUuid: val.demandDetailUuid, // 染整单销售单分录ID
            dyeDelivery: val.dyeDelivery, // 染整交期
            qty: val.planQty // 数量
          })
        })
        obj.taskNo = parem.taskNo
        obj.uuid = parem.uuid
        obj.supplier = parem.supplier
        obj.pmUser = parem.pmUser
        obj.pdDyeOrderFactoryDetailUpdateReqs = arr
        // 如果染整厂和跟单人员有改变，则走变更排厂的接口，没有改变则走新的接口
        if (parem.supplier.value.toString() === this.oldSupplier.value.toString()) {
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
                this.$router.push({ path: `/processing/dyeing/requisition`, query: { noticeNo: this.data.dyeNo }})
              }) // 将跳转到原料调拨通知单页面  test
              .catch(async(action) => {
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
            res = await savePlanInfo({ ...obj })
            if (res.code === 200) {
              this.$emit('okCallback', { type: '2', Routing })
            }
          }
        } else {
          // 变更工厂
          this.$confirm(
            '是否确认变更加工厂，确认后，原有的原料调拨通知将被取消，请确认？', '提示',
            { type: 'warning', confirmButtonText: '确认', cancelButtonText: '取消' }
          )
            .then(async() => {
              res = await savePlanInfo({ ...obj })
              if (res.code === 200) {
                this.$emit('okCallback', { type: '2', Routing })
              }
            })
        }
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeDemand/factory/modify',
          description: {
            beforeText: `在'加工管理-染整-染整需求-排厂中'变更
            任务单号:${parem.taskNo} 的排厂信息`,
            beforeCode: { uuid: parem.uuid,
              supplier: parem.supplier,
              pmUser: parem.pmUser,
              pdDyeOrderFactoryDetailUpdateReqs: arr }
          },
          appId: 'processingMgr'
        })
      }
      if (this.setActiveName === 'N') { // 待排厂
        if (res.code !== 200) { return false }
        this.$emit('okCallback', { type: '1', Routing })
      }
    }
  }
}

</script>

<style lang="scss">
  .el-message-box .el-message-box__btns {
    .printDemand {
      width: auto;
    }
  }
</style>

