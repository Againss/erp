<!--
 * @Author: xj
 * @Description: 染纱需求底部 按钮状态扭转
 * @Date: 2021-06-02 19:49:57
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-28 11:11:24
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
import { setOrderFun } from '../../public/mou'
import { WaitingPlantSubmit, Modifycharged } from '../api/index'
export default {
  components: {},
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
    // ,
    // indexArray: {
    //   type: Array
    // }
  },
  data() {
    return {
      orderData: {},
      orderIndexData: {},
      Picrelease: false,
      orderDataCompare: {},
      confirm: false
    }
  },
  computed: {
    status() {
      return this.baseInfo.status || '0'
    },
    getSubmitPrimary() {
      return 'primary'
    },
    submit_isShow() {
      // 提交 YES("Y", "已排厂"),NO("N", "未排厂"),需求的状态
      return this.isEdit && ['1', '2'].includes(this.setActiveName)
    },
    cancel_isShow() {
      // 取消
      return this.isEdit && ['1', '2'].includes(this.setActiveName) && this.setActiveName === '2'
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    clothingForm: {
      handler(val, oldVal) {
        this.orderDataCompare = this.$utils.deepClone(val)
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 提交
    async orderDataSubmit() {
      if (['1', '2'].includes(this.setActiveName)) {
        this.SubmitRequired()
      }
    },
    // 取消
    cancelClick() {
      this.$emit('cancelClick', true)
    },
    async SubmitRequired(Routing = '0') {
      // 测试先 注释全部必填校验
      if (!this.SubmitForVerification()) {
        return false
      }
      let res = ''
      const { beforeCode, afterCode } = this.$utils.compareData(
        this.orderDataCompare,
        {},
        'id'
      )
      let description = {}
      let opratorType = ``
      let api = ''
      const parem = this.$utils.deepClone(this.orderDataCompare)
      if (this.setActiveName === '1') {
        api = '/processingMgr/pdDyeingDemand/submit'
        res = await WaitingPlantSubmit(parem)
      } else {
        api = '/processingMgr/pdDyeingDemand/modify'
        parem.confirm = this.confirm
        const res0 = await Modifycharged({ ...parem })
        res = res0.data
      }
      if (this.setActiveName === '1') {
        // 待排厂
        if (res.code !== 200) {
          return false
        }
        this.$emit('okCallback', { type: '1', Routing })
      } else if (this.setActiveName === '2') {
        if (res.code === 200) {
          // 正常提交
          this.confirm = false
          this.$emit('okCallback', { type: '2', Routing })
        } else if (res.code === 10000301) {
          //  (10000301, "变更后排厂量小于已调拨量"),
          this.$confirm(
            '变更后的排厂量所需原料小于已调拨的原料总量，请确认？',
            '提示',
            {
              type: 'warning',
              confirmButtonText: '修改调拨单',
              customClass: 'WeavingOrder_pups__btns',
              cancelButtonText: '重新调拨'
            }
          )
            .then(() => {
              // this.data.orderId
              this.$router.push({
                path: `/processing/yarn-dyeing/requisition`,
                query: { noticeNo: this.data.orderId }
              })
            }) // 将跳转到原料调拨通知单页面  test
            .catch(() => {
              this.confirm = true
              this.HopRouting()
              this.$message({ type: 'info', message: '已重新调拨' })
            }) // 重新调拨
        } else if (res.code === 10000302) {
          // (10000302, "更换工厂"),
          this.$confirm(
            '是否确认变更加工厂，确认后，原有的原料调拨通知将被取消，请确认？',
            '提示',
            {
              type: 'warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }
          )
            .then(() => {
              this.confirm = true
              this.HopRouting('3')
            })
            .catch(() => {
              this.confirm = false
              this.$message({ type: 'info', message: '已取消' })
            })
        }
      }
      description = {
        beforeText: `在'加工管理-染纱需求'将${JSON.stringify({
          id: parem.taskNo
        })}`,
        afterText: '修改为',
        ...{ beforeCode, afterCode }
      }
      opratorType = `UPDATE`
      const pcdata = this.orderDataCompare
      this.confirm = false
      this.$store.dispatch('app/fetchParamsLog', {
        pcdata,
        opratorType,
        api,
        description,
        appId: 'process'
      })
    },
    HopRouting(type = '1') {
      this.SubmitRequired(type)
    },
    SubmitForVerification() {
      // 提交验证 !this.indexArray.length ||
      const pu = []
      const Tim = this.orderDataCompare
      if (!Tim.supplier || !this.setInfoValue(Tim.supplier)) {
        pu.push('染纱厂不能为空')
      } else if (!Tim.pmUser || !this.setInfoValue(Tim.pmUser)) {
        pu.push('跟单人员不能为空')
      } else if (
        !Tim.demandDetailSubmitRequests ||
        !Tim.demandDetailSubmitRequests.length
      ) {
        pu.push('请先选择一条分录')
      } else {
        const om = this.VerifyEntry(Tim.demandDetailSubmitRequests)
        // const cm = this.VerifyEntry(this.indexArray)
        // if (cm.length) { pu.push(cm[0]) }
        if (om.length) {
          pu.push(om[0])
        }
      }
      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        return false
      } else {
        return true
      }
    },
    VerifyEntry(data = []) {
      // 验证分录  xj
      const op = []
      if (data.length) {
        data.forEach((im) => {
          const fa = im.factoryNum
          const no = im.notQty
          const faCopy = im.factoryNumCopy
          const imc =
            this.$utils.getFloat(faCopy, 2) * 1 +
            this.$utils.getFloat(no, 2) * 1
          if (!im.dyeingDelivery) {
            op.push('染纱交期不能为空')
          }
          if (!fa) {
            op.push('排厂量不能为空')
          }
          if (Number(fa) > Number(imc)) {
            op.push('排厂量不能大于未排总量')
          }
        })
      }
      return op
    }
  }
}
</script>

<style lang="scss">
.WeavingOrder_pups__btns {
  .el-message-box__btns {
    button {
      width: 90px;
    }
  }
}
</style>

