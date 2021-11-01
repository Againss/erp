<template>
  <div>
    <el-button v-if="modify_isShow" size="small" type="primary" @click="setEdit">编辑</el-button>
    <el-button v-if="submit_isShow" size="small" type="primary" @click="physicalSubmit">提交</el-button>
    <el-button v-if="audit_isShow" size="small" type="primary" @click="toExamine">审核</el-button>
    <el-button v-if="copy_isShow" size="small" type="primary" @click="copyPrint">重检</el-button>
    <el-button v-if="save_isShow" size="small" type="primary" @click="saveFn">保存</el-button>
    <el-button v-if="submit_isShow" size="small" @click="print">打印预览</el-button>
    <el-button v-if="cancel_isShow" size="small" @click="cancelClick">取消</el-button>
    <el-button v-if="back_isShow" size="small" @click="goBack">返回</el-button>

  </div>
</template>

<script>
// import * as api from '../api/index.js'
export default {
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    status: {
      type: String
    },
    getDetailData: {
      type: Function
    }
  },
  data() {
    return {

    }
  },
  computed: {
    // 0：待处理 ,1：处理中，2：审核中,3：已处理
    modify_isShow() { // 编辑
      return !this.isEdit && ['0', '1'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:modify'])
    },
    submit_isShow() { // 提交
      return ['1'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:submit'])
    },
    audit_isShow() { // 审核
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:audit'])
    },
    copy_isShow() { // 重检
      return !this.isEdit && ['3'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:audit'])
    },
    cancel_isShow() { // 取消
      return this.isEdit || ['1', '2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:cancel'])
    },
    save_isShow() { // 保存
      return this.isEdit && this.$filterPermission(['customerOrder:greyOrder:modify', 'customerOrder:greyOrder:add'])
    },
    back_isShow() { // 返回
      return !this.isEdit
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        console.log(val)
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  methods: {
    // 打印预览
    print() {
      this.$router.push(`/quality-manage/finished-product-testing/finished-cloth-pring/${222}/${2333}`)
    },
    // 取消
    cancelClick() {
      this.$emit('btnHandleClick', '取消')
      // this.$router.push({ path: `/quality-manage/finished-product-testing/finished-cloth` })
    },
    // 返回
    goBack() {
      this.$emit('btnHandleClick', '返回')
    },
    // 编辑
    setEdit() {
      console.log('编辑')
      this.$emit('btnHandleClick', '编辑')
    },
    // 复制重检
    async copyPrint() {
      this.$router.push({ path: `/customer-order/preform-preparation-orders/create`, query: { id: this.$route.params.id }})
    },
    // 提交
    physicalSubmit() {
      this.$emit('btnHandleClick', '提交')
      console.log('00')
    },
    // 审核
    toExamine() {

    },
    // 保存
    async saveFn(params) {
      this.$emit('btnHandleClick', '保存')

      // if (!this.Picrelease) { return false }
      // const { beforeCode, afterCode } = this.$utils.compareData(this.data, params, 'id')
      // let description = {}
      // let opratorType = ``
      // let apis = ``
      // if (this.$route.params.id) {
      //   const res = await api.physicalModify(params)
      //   if (res.code !== 200) { return false }
      //   this.$message({ type: 'success', message: '修改成功!' })
      //   await this.getDetailData(this.$route.params.id)
      //   description = {
      //     beforeText: `在'客户订单-备坯单'将${JSON.stringify({ 'id': this.$route.params.id })}`,
      //     afterText: '修改为',
      //     ...{ beforeCode, afterCode }
      //   }
      //   opratorType = `UPDATE`
      //   apis = `/customerOrder/coGreyOrder/modify`
      //   this.$router.push({ path: `/customer-order/preform-preparation-orders/${this.$route.params.id}`, query: {}})
      // }
      // this.$store.dispatch('app/fetchParamsLog', { params, opratorType, apis, description, appId: 'customerOrder' })
    },
    // 纯数据展示
    setFromValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    }
  }
}

</script>

<style lang="scss">

</style>
