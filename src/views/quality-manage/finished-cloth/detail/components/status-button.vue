<template>
  <div>
    <el-button v-if="modify_isShow" size="small" type="primary" @click="setEdit">编辑</el-button>
    <el-button v-if="submit_isShow" size="small" type="primary" @click="physicalSubmit('submit')">提交</el-button>
    <el-button v-if="audit_isShow" size="small" type="primary" @click="toExamine">审核</el-button>
    <el-button v-if="copy_isShow" size="small" type="primary" @click="copyPrint">重检</el-button>
    <el-button v-if="save_isShow" size="small" type="primary" @click="physicalSubmit('save')">{{ status === '3' ? '提交' : '保存' }}</el-button>
    <el-button v-if="print_isShow" size="small" @click="print">打印预览</el-button>
    <el-button v-if="cancel_isShow" size="small" @click="cancelClick">取消</el-button>
    <el-button v-if="back_isShow" size="small" @click="goBack">返回</el-button>
    <upinformation
      v-if="upconfig.visible"
      :upconfig="upconfig"
      @close="upconfig.visible = false"
      @okCallback="okCallback"
      @Cancelcallback="CancelText"
    />
  </div>
</template>

<script>
import * as api from '../api/index.js'
import upinformation from './pups'
// import fetchLog from '../../../common/fetchLog.js'
export default {
  components: { upinformation },
  mixins: {},
  props: {
    detailData: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    isCopy: {
      type: Boolean
    },
    status: {
      type: String
    },
    getDetailData: {
      type: Function
    },
    clothingForm: {
      type: Object
    },
    isMaxVersion: {
      type: Boolean
    }
  },
  data() {
    return {
      upconfig: {
        visible: false,
        workflowId: '',
        title: '审批',
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
      copyData: {}
    }
  },
  computed: {
    // 0：待处理 ,1：处理中，2：审核中,3：已处理
    modify_isShow() { // 编辑 this.$permission(['qa:qaFinishFabricPhysical:modify'])
      return !this.isEdit && ['0', '1'].includes(this.status) && this.$permission(['qa:qaFinishFabricPhysical:modify'])
    },
    submit_isShow() { // 提交
      return ['1'].includes(this.status) && this.$permission(['qa:qaFinishFabricPhysical:exchange'])
    },
    audit_isShow() { // 审核
      return !this.isEdit && ['2'].includes(this.status) && this.$permission(['qa:qaFinishFabricPhysical:review'])
    },
    copy_isShow() { // 重检
      // console.log(this.isEdit)
      return !this.isEdit && this.isMaxVersion && !this.isCopy && ['3'].includes(this.status) && this.$permission(['qa:qaFinishFabricPhysical:repeat'])
    },
    cancel_isShow() { // 取消
      // return this.isEdit || ['1', '2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:cancel'])
      return this.isEdit
    },
    save_isShow() { // 保存
      return this.isEdit || this.isCopy && this.$permission(['qa:qaFinishFabricPhysical:modify'])
    },
    print_isShow() { // 打印预览
      return !this.isEdit && ['0', '1', '2', '3'].includes(this.status)
    },
    back_isShow() { // 返回
      return !this.isEdit
    }

  },
  watch: {
    detailData: {
      handler(val, oldVal) {
        this.copyData = this.$utils.deepClone(val)
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
      this.$router.push(`/quality-manage/finished-product-testing/finished-cloth-pring/${this.$route.params.id}/${this.detailData.status}`)
    },
    // 取消
    cancelClick() {
      this.getDetailData()
      this.$emit('changeBtn', false, 'cancel')
    },
    // 返回
    goBack() {
      this.$router.push({ path: `/quality-manage/finished-product-testing/finished-cloth` })
    },
    // 编辑
    setEdit() {
      this.$emit('changeBtn', true, 'edit')
    },
    // 复制重检
    async copyPrint() {
      this.$emit('changeBtn', true, 'copy')
    },
    // 提交
    async physicalSubmit(type) {
      const datas = this.clothingForm.model.tableForm || []
      // 校验表单最少有一条已填写数据才可提交
      let result = false
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].result && datas[i].singleJudgment) {
          result = true
          break
        }
      }
      if (!result) {
        return this.$message.error('提交记录至少填写一项结果和判定!')
      }

      // 拷贝上传数据，后台需要json串，展示为数组
      const fileList = this.$utils.deepClone(this.detailData.attachmentList || [])
      let attachmentName = ''
      fileList.forEach(v => {
        attachmentName += (v.id || v.response && v.response.data && v.response.data.id) + ','
      })
      if (attachmentName) {
        attachmentName = attachmentName.substring(0, attachmentName.length - 1)
      }
      const params = {
        physicalTaskNo: this.detailData.physicalTaskNo,
        id: this.detailData.id,
        qaGreigeInspectionInfoResponse: {},
        qaCustomerOrderInfoResponse: {},
        physicalInformation: {
          result: this.detailData.physicalInformation.result,
          attachmentId: attachmentName, // 附件id
          items: datas
        }
      }
      if (!params.physicalInformation.result || params.physicalInformation.result === 3) {
        return this.$message.error('物测结果不可为空或 / ')
      }

      let isCheck = null
      let check = false
      datas.forEach(v => {
        if (v.isCheck) {
          if (this.status === '3') {
            check = true
          }
          if (!v.result || !v.singleJudgment) {
            isCheck = v
          } else {
            check = true
          }
        }
      })
      // Fail 状态到待审核(保存接口)
      // 点击提交（先调完保存接口再调改变状态接口） 状态 0：待处理 ,1：处理中，2：审核中,3：已处理
      let modifyRes = null
      if (this.status === '0' || this.status === '1') {
        if (this.detailData.physicalInformation && this.detailData.physicalInformation.versionInfoList.length > 1) {
          if (isCheck) {
            if (!isCheck.result || !isCheck.singleJudgment) {
              return this.$message.error('送检勾选项需填入 结果和单项判定')
            }
          } else {
            if (!check) {
              return this.$message.error('送检必填一项并填写该选项的 结果和单项判定')
            }
          }
        }
        if (this.status === '0') {
          await api.physicalModify(params)
        } else {
          modifyRes = await api.modifyNoAuth(params)
        }

        const { beforeCode, afterCode } = this.$utils.compareData(this.copyData, params, 'id')
        const description = {
          beforeText: `在质量管理-成品物测将${JSON.stringify({ 'id': this.detailData.id })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        }
        this.$store.dispatch('app/fetchParamsLog', { params, opratorType: 'UPDATE', api: '/qa/qaFinishFabricPhysical/modify', description, appId: 'qa' })
        // debugger
        if (modifyRes && modifyRes.code === 200 && this.status === '1' && type === 'submit') {
          // 改变状态接口
          await api.physicalExchange({
            physicalTaskNo: this.$route.params.id,
            id: this.detailData.id,
            commitStatus: '0',
            physicalResult: this.detailData.physicalInformation && this.detailData.physicalInformation.result
          })
          const apis = `/qa/qaFinishFabricPhysical/exchange`
          const opratorType = `UPDATE`
          const description = { beforeText: `在'质量管理-成品检测-成品物测'改变一条任务`, beforeCode: params }
          const appId = 'qa'
          this.$store.dispatch('app/fetchParamsLog', { params, opratorType, apis, description, appId })
        }
      } else if (this.status === '3') {
        // 重检接口
        if (!this.detailData.remarks) return this.$message.error('重检时备注必填项')
        if (!check) {
          return this.$message.error('重检时送检必填一项并填写该选项的 结果和单项判定')
        }
        const repeatParams = {
          physicalTaskNo: this.$route.params.id,
          id: this.detailData.id,
          items: datas,
          attachmentId: attachmentName, // 附件id
          result: this.detailData.physicalInformation.result,
          remarks: this.detailData.remarks
        }
        await api.physicalRepeat(repeatParams)
      }
      this.getDetailData()
      this.cancelClick()
      this.$message.success('保存成功')
    },
    // 审核
    toExamine() {
      this.upconfig.visible = true
    },
    // 保存
    async saveFn(params) {
      this.$emit('btnHandleClick', '保存')
    },
    // 审核接口
    async okCallback(val) {
      if (val) {
        const data = {
          id: this.detailData.id,
          reviewComments: val.text.remark
        }
        await api.physicalReview(data)
        const apis = `/qa/qaFinishFabricPhysical/review`
        const opratorType = `UPDATE`
        const description = { beforeText: `在'质量管理-成品检测-成品物测'改变一条任务`, beforeCode: data }
        const appId = 'qa'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, apis, description, appId })
        this.$message.success('审核成功')
        this.CancelText()
        this.getDetailData()
      }
    },
    // 关闭弹框
    CancelText(val) {
      this.upconfig.visible = false
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
