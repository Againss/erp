<!--
 * @Author: xj
 * @Description: 染纱订单 按钮状态扭转
 * @Date: 2021-06-02 19:49:57
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-28 11:11:43
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\order\detail\status-button.vue
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
import { orderSubmit } from '../api/index'
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
    submit_isShow() {
      // WAIT("W", "待提交"),
      // SUBMIT("S", "已提交"),
      // RECALL("R", "撤回"),
      // CANCEL("C", "取消"),
      // FINISH("F", "完工"),
      return this.isEdit && ['W'].includes(this.status)
    },
    cancel_isShow() { // 取消
      return this.isEdit && ['W'].includes(this.status)
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
      if (['N', 'W'].includes(this.status)) {
        this.SubmitRequired()
      } else {
        console.log('woY')
      }
    },
    async SubmitRequired() { // 测试先 注释全部必填校验
      const { beforeCode, afterCode } = this.$utils.compareData(this.orderDataCompare, {}, 'id')
      let description = {}
      let opratorType = ``
      const api = '/processingMgr/pdDyeingOrder/submit'
      const parem = this.$utils.deepClone(this.orderDataCompare)
      parem.attachmentPath = this.setUploadFile(parem.attachmentPath)
      const res = await orderSubmit(parem)
      if (res.code !== 200) { return false }
      this.$emit('JumpSubmitted')
      description = {
        beforeText: `在'加工管理-染纱订单'将${JSON.stringify({ 'id': parem.orderId })}`,
        afterText: '修改为',
        ...{ beforeCode, afterCode }
      }
      opratorType = `UPDATE`
      const pcdata = this.orderDataCompare
      this.$store.dispatch('app/fetchParamsLog', { pcdata, opratorType, api, description, appId: 'process' })
      // this.getDetailData()
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

