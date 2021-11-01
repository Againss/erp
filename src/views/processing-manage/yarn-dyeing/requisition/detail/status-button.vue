<!--
 * @Author: xj
 * @Description: 原纱调拨通知单底部 按钮状态扭转
 * @Date: 2021-06-02 19:49:57
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-28 11:15:27
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\requisition\detail\status-button.vue
-->
<template>
  <div>
    <el-button v-if="submit_isShow" :type="getSubmitPrimary" @click="orderDataSubmit">提交</el-button>
    <el-button v-if="cancel_isShow" @click="cancelClick">取消</el-button>
  </div>
</template>
<script>
import { orderSubmit } from '../api/index'
export default {
  components: {
  },
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
    getDetailData: {
      type: Function
    },
    isCopy: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  data() {
    return {
      orderData: {},
      orderDataCompare: {},
      orderIndexData: {},
      Picrelease: false
    }
  },
  computed: {
    getSubmitPrimary() {
      return 'primary'
    },
    submit_isShow() { //
      // WAIT("W", "待提交"),
      // SUBMIT("S", "已提交"),
      // RECALL("R", "撤回"),
      // CANCEL("C", "取消"),
      // FINISH("F", "完工"),
      return this.isEdit && ['W', 'R'].includes(this.status)
    },
    cancel_isShow() { // 取消
      return this.isEdit && ['W', 'R'].includes(this.status)
    }
  },
  watch: {
    clothingForm: {
      handler(val, oldVal) {
        this.orderDataCompare = this.$utils.deepClone(val)
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 提交
    async orderDataSubmit() {
      if (['W', 'R'].includes(this.status)) {
        this.SubmitRequired()
      } else {
        console.log('woY')
      }
    },
    async SubmitRequired() { // 测试先 注释全部必填校验
      if (!this.SubmitForVerification()) { return false }
      const { beforeCode, afterCode } = this.$utils.compareData(this.orderDataCompare, {}, 'id')
      let description = {}
      let opratorType = ``
      const api = '/processingMgr/pdDyeingAllotNotify/submit'
      const parem = this.$utils.deepClone(this.orderDataCompare)

      console.log('ommmok', parem)
      // 内容需要提取
      const res = await orderSubmit(parem)
      if (res.code !== 200) { return false }
      this.$emit('JumpSubmitted')
      description = {
        beforeText: `在'加工管理-原纱调拨通知单'将${JSON.stringify({ 'id': parem.orderId })}`,
        afterText: '修改为',
        ...{ beforeCode, afterCode }
      }
      opratorType = `UPDATE`
      const pcdata = this.orderDataCompare
      this.$store.dispatch('app/fetchParamsLog', { pcdata, opratorType, api, description, appId: 'process' })
      // this.getDetailData()
    },
    SubmitForVerification() {
      const pu = []
      const com = this.orderDataCompare.details
      const om = this.verificationData(com)
      if (om.length) { pu.push(om[0]) }
      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        return false
      } else {
        return true
      }
    },
    verificationData(data = []) {
      const pu = []
      console.log('xiao', data)
      const max9999Reg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/
      data.forEach((ITM) => {
        ITM.allotNotifyDetails && ITM.allotNotifyDetails.forEach(it => {
          if (!it.allotSum) {
            pu.push('调拨量不能为空')
          }
          if (!max9999Reg.test(it.allotSum)) {
            pu.push('请输入0~99999999.99')
          }
          if (!it.planDelivery) {
            pu.push('计划送纱期不能为空')
          }
        })
      })
      return pu
    },
    // 取消
    cancelClick() {
      this.getDetailData()
    }
  }
}

</script>

<style lang="scss">
</style>

