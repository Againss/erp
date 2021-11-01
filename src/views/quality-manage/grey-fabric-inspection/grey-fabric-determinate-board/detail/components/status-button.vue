/**
 * @Description: 按钮状态扭转
 * @author Roman
 * @date 2021-04-26 11:22:17
 * @edit 2021-04-26 11:22:17
*/
<template>
  <div>
    <el-button v-if="modify_isShow" type="primary" @click="setEdit">编辑</el-button>
    <el-button v-if="submit_isShow" :type="getSubmitPrimary" @click="orderDataSubmit">提交</el-button>
    <el-button v-if="audit_isShow" type="primary" @click="ToExamine">审核</el-button>
    <el-button v-if="withdraw_isShow" @click="orderDataWithdraw">撤回</el-button>
    <el-button v-if="change_isShow" type="primary" @click="setEdit">变更</el-button>
    <el-button v-if="finish_isShow" @click="ClickFinish">完结</el-button>
    <el-button v-if="removeHold_isShow" type="primary" @click="solveHold">解Hold</el-button>
    <el-button v-if="copy_isShow" :type="getCopyPrimary" @click="copyPrint">复制</el-button>
    <el-button v-if="hold_isShow" @click="ClickHold">Hold单</el-button>
    <el-button v-if="delete_isShow" @click="deleteClick">删除</el-button>
    <el-button v-if="save_isShow" type="primary" @click="orderDataAdd">保存</el-button>
    <el-button v-if="cancel_isShow" @click="cancelClick">取消</el-button>
    <el-button v-if="back_isShow" @click="GoBackOrder">返回</el-button>
    <!-- <approve
      v-if="config.visible"
      :config="config"
      @close="config.visible = false"
    />
    <upinformation
      v-if="upconfig.visible"
      :upconfig="upconfig"
      @close="upconfig.visible = false"
      @okCallback="okCallback"
      @Cancelcallback="CancelText"
    /> -->
  </div>
</template>

<script>
// import { fetchOrderDataAdd, fetchOrderDataSubmit, fetchOrderDataChange, fetchOrderDataDelete, fetchOrderDataWithdraw, fetchOrderDataCancel, fetchOrderDataFinish, fetchOrderDataHold, fetchOrderDataRemoveHold, fetchOrderDataModify } from './api'

// import approve from '@/components/approve/index'
// import { isArray } from '@/utils/validate'
// import upinformation from './pups'
export default {
  components: {
    // approve,
    // upinformation
  },
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    // clothingForm: {
    //   type: Object
    // },
    setActiveName: {
      type: Function
    },
    getDetailData: {
      type: Function
    },
    isCopy: {
      type: Boolean
    }
  },
  data() {
    return {
      orderData: {},
      statusEdit: false,
      orderIndexData: {},
      cancelReason: '',
      upconfig: {
        visible: false,
        workflowId: '',
        pass: (res) => {
          console.log('pass', res)
        },
        refuse: (res) => {
          console.log('refuse', res)
        },
        back: (res) => {
          console.log('回退回调')
        }
      },
      dataExamine: [ // 列表状态值
        { id: '0', text: '草稿' },
        { id: '1', text: '新单待审' },
        { id: '2', text: '已审核' },
        { id: '3', text: '已废弃' },
        { id: '4', text: '已驳回' },
        { id: '5', text: '取消待审' },
        { id: '6', text: '取消会签中' },
        { id: '7', text: '已取消' },
        { id: '8', text: '变更审核中' },
        { id: '9', text: '变更会签中' },
        { id: '10', text: 'Hold单审核中' },
        { id: '11', text: 'Hold单会签中' },
        { id: '12', text: 'Hold单' },
        { id: '13', text: '已完结' }
      ],
      Picrelease: false,
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
      }
    }
  },
  computed: {
    // getSubmitPrimary() {
    //   return ['2'].includes(this.status) ? 'primary' : ''
    // },
    // getCopyPrimary() {
    //   return ['7', '13'].includes(this.status) ? 'primary' : ''
    // },
    // status() {
    //   return this.baseInfo.status || '0'
    // },
    // baseInfo() {
    //   return this.orderData.baseInfo || {}
    // },
    // modify_isShow() { // 编辑
    //   return !this.isEdit && ['0', '4'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:modify'])
    // },
    // submit_isShow() { // 提交
    //   if (this.isEdit) {
    //     return ['2', '4'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:submit'])
    //   } else {
    //     return ['0'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:submit'])
    //   }
    // },
    audit_isShow() { // 审核
      return !this.isEdit && ['1', '10', '5', '8'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:audit'])
    },
    withdraw_isShow() { // 撤回
      return !this.isEdit && ['1'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:withdraw'])
    },
    change_isShow() { // 变更
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:change'])
    },
    finish_isShow() { // 完结
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:finish'])
    },
    hold_isShow() { // Hold单
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:hold'])
    },
    removeHold_isShow() { // 解Hold
      return !this.isEdit && ['12'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:removeHold'])
    },
    copy_isShow() { // 复制
      return !this.isEdit && !['3'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:copy'])
    },
    delete_isShow() { // 删除
      return !this.isEdit && ['0'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:delete'])
    },
    cancel_isShow() { // 取消
      return this.isEdit || ['1', '2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:cancel'])
    },
    save_isShow() { // 保存
      return this.isEdit && !['2', '4'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:modify', 'customerOrder:greyOrder:add'])
    },
    back_isShow() { // 返回
      return !this.isEdit && !['3'].includes(this.status)
    }
  },
  watch: {
    // data: {
    //   handler(val, oldVal) {
    //     console.log(val)
    //     this.orderDataCompare = this.$utils.deepClone(val)
    //     this.orderData = this.$utils.deepClone(val)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {

  },
  mounted() {
  },
  methods: {
  }
}

