<template>
  <div id="ApprovedDetail">
    <!-- <el-button @click="config.visible = true">弹框</el-button>
    <approve
      v-if="config.visible"
      :config="config"
      @close="config.visible = false"
    /> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix header">
        <span style="vertical-align: middle;">{{ base.person }}发起的{{ base.businessName }}审批单</span>
        <span v-if="base.state||base.state===0" class="status">{{
          base.state | filterStatus
        }}</span>
      </div>
      <div class="content">
        <div>
          <div>审批编号：</div>
          <div>{{ base.approvalNumber }}</div>
        </div>
        <div>
          <div>业务对象：</div>
          <div>{{ base.businessName }}</div>
        </div>
        <div>
          <div>来源单号：</div>
          <div style="cursor: pointer; color: #1890ff;" @click="goDetail">{{ base.showNumber || base.orderNumber }}</div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card card2">
      <div slot="header" class="clearfix header">审批单详情</div>
      <approveContent :form-datas="formDatas" />
    </el-card>
  </div>
</template>

<script>
import * as api from '@/components/approve/api/index.js'
// import approve from '@/components/approve/index.vue'
import approveContent from '@/components/approve/components/approveContent.vue'
export default {
  name: 'ApprovedDetail',
  components: { /* approve,*/ approveContent },
  filters: {
    filterStatus(val) {
      // 是否完成 0审核中 1完成  2驳回(审核拒绝) 3撤销(外界直接处理)
      const arr = ['审核中', '完成', '驳回', '撤销']
      return arr[val]
    }
  },
  data() {
    return {
      formDatas: {
        _approve: []
      },
      base: {}
      // 跳转逻辑
      // redirectInfo: {
      //   urls: {
      //     1: '/customer-order/sample-orders/detail/:id/show', // 样板表单
      //     2: '/customer-order/goods-orders/detail/:id/show' // 大货表单
      //   }
      // }
      // config: {
      //   visible: false,
      //   workflowId: '1376743886285926400',
      //   procInstId: '175234',
      //   formDatas: {
      //     _approve: []
      //   },
      //   // start: (getInfo) => {
      //   //   console.log(getInfo.data, 'arr')
      //   //   this.$set(this.config.formDatas, '_approve', getInfo.data)
      //   // },
      //   pass: (res) => {
      //   },
      //   refuse: () => {
      //   },
      //   content: {
      //     _remark: {
      //       label: '备注11',
      //       maxlength: 2,
      //       showWordLimit: true
      //     }
      //   }
      // }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const res = await api.getWorkflowInfo({ /* orderNumber: '1382156368101945344',*/ procInstId: this.$route.params.id })
      if (this.$pub.responseValidate(res)) {
        this.$set(this.formDatas, '_approve', res.data || [])
      }
      const resBase = await api.getWorkflowBaseInfo({
        procInstId: this.$route.params.id /* orderNumber: '1382156368101945344'*/
      })
      if (this.$pub.responseValidate(resBase)) {
        this.base = resBase.data || {}
      }
      this.base.person = res.data && res.data.length ? res.data[0].auditName : ''
      // this.base.orderNumber = this.$route.query.code || this.base.orderNumber
    },
    goDetail() {
      console.log('redirectUrl', this.$route.query.redirectUrl)
      if (this.$route.query.redirectUrl) {
        this.$router.push(this.$route.query.redirectUrl)
      }
      // if (this.redirectInfo.urls.hasOwnProperty(parseInt(this.base.businessId))) {
      //   this.$router.push(this.redirectInfo.urls[this.base.businessId].replace(':id', this.base.orderNumber))
      // }
    }
  }
}
</script>

<style lang="scss" >
#ApprovedDetail {
  .el-card__header {
    padding: 0;
    padding-left: 20px;
  }
  .card2 .el-card__body {
    padding: 30px 80px;
  }
}
</style>
<style lang="scss" scoped>
#ApprovedDetail {
  padding: 20px;
  .box-card {
    margin-bottom: 15px;
    .el-card__header .header {
      font-size: 16px;
      color: #15112b;
      line-height: 65px;
      font-weight: bold;
    }
    .content {
      > div {
        display: flex;
        font-size: 14px;
        :first-child {
          color: #888e9e;
          line-height: 24px;
        }
        :last-child {
          flex: 70px;
          color: #666666;
          line-height: 24px;
          margin-left: 1%;
        }
      }
    }
  }
  .box-card.el-card.is-always-shadow {
    box-shadow: none;
    border: none;
  }
  .status {
    display: inline-block;
    padding: 3px 8px;
    color: 12px;
    line-height: 14px;
    color: #00bcc5;
    border: 1px solid #00bcc5;
    border-radius: 11.25px;
    font-weight: 400;
    margin-left: 20px;
    font-size: 12px;
  }
  // 未审核 #ff9214
  // 已审核 #00bcc5
  // 待审核 #ff9214
  // 已取消 #888e9e
  // 已拒绝 #ff4444
}
</style>
