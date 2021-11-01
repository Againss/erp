<template>
  <div id="Approve">
    <!--
    通产配置以下四个回调
    start 返回初始化详情数据
    refuse  驳回回调
    pass 通过回调
    back 回退回调
    submitParams //额外提交参数
    workflowId// 业务ｉｄ
    procInstId
    -->
    <!-- 外层配置 -->
    <!-- <el-button @click="config.visible=true">弹框</el-button> -->
    <!-- <approve v-if="config.visible" :config="config" @close="config.visible=false" /> -->
    <!-- ----------------------------------------------------------------------------- -->
    <cs-custom-pop ref="pop" :options="popOptions" v-bind="$attrs" />
  </div>
</template>
<script>
import approveContent from './components/approveContent.vue'
import * as api from '@/components/approve/api/index.js'
export default {
  name: 'Approve',
  props: {
    config: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    // 发起审批
    const popOptions = {
      itemType: 'dialog',
      title: '审批流程',
      width: '770px',
      okText: '通过',
      cancelText: '回退',
      appendToBody: true,
      saveAndaddText: '驳回',
      okHidden: true,
      cancelHidden: true,
      close: () => {
        this.$set(this.popOptions, 'visible', false)
        this.$emit('close')
      },
      saveAndadd: null,
      ok: (params) => this.submit({ type: 'pass', auditResult: 1 }, params),
      cancel: (params) =>
        this.submit({ type: 'refuse', auditResult: 3 }, params),
      formDatas: {
        _approve: []
      },
      content: {
        _approve: { components: { approveContent }, prop: 'approve' },
        _remark: {
          isShow: () => {
            return (this.isAuthority === 2 || this.isAuthority === 1)
          },
          label: '备注',
          itemType: 'input',
          prop: 'remark',
          rows: 5,
          maxlength: 255,
          type: 'textarea'
        }
      }
    }
    return {
      popOptions,
      isAuthority: 0
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userInfo.userId
    }
  },
  created() {
    // 覆盖合并基本配置
    this.popOptions = this.deepObjectMerge(this.popOptions, this.config)
    this.init()
  },
  methods: {
    deepObjectMerge(FirstOBJ, SecondOBJ) {
      for (var key in SecondOBJ) {
        FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
          ? this.deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key]
      }
      return FirstOBJ
    },
    async init() {
      try {
        // 判断是否在该节点内是否显示审核按钮
        const isShow = await api.getAuthority({
          procInstId: this.popOptions.procInstId,
          userId: this.userId
        })
        if (this.$pub.responseValidate(isShow)) {
          this.isAuthority = isShow.data
          // 0 无权限 1审核权限 2查看权限
          //  1:通过 2:驳回 3: 回退
          // 审核按钮权限  0：查看 1：通过 驳回 回退 2：通过 驳回
          if (this.isAuthority === 2) { // 最新的
            console.log('ssssssom', this.isAuthority)
            this.$set(this.popOptions, 'okHidden', false)
            this.$set(this.popOptions, 'cancelHidden', true)
            this.$set(this.popOptions, 'saveAndadd', (params) =>
              this.submit({ type: 'back', auditResult: 2 }, params))
          } else if (this.isAuthority === 1) {
            this.$set(this.popOptions, 'okHidden', false)
            // 需求变更 暂时隐藏回退按钮
            this.$set(this.popOptions, 'cancelHidden', true)
            this.$set(this.popOptions, 'saveAndadd', (params) =>
              this.submit({ type: 'back', auditResult: 2 }, params))
          } else if (this.isAuthority === 0) {
            this.$set(this.popOptions, 'okHidden', true)
            this.$set(this.popOptions, 'cancelHidden', true)
            this.$set(this.popOptions, 'saveAndadd', null)
          }
        }
        // 流程详情
        const getInfo = await api.getWorkflowInfo({
          orderNumber: this.popOptions.workflowId
        })
        console.log('sss3333', getInfo)
        if (this.$pub.responseValidate(getInfo)) {
          // 需要处理详情数据
          if (this.popOptions.start) {
            this.popOptions.start(getInfo)
          } else {
            // 无需处理直接渲染
            this.$set(this.popOptions.formDatas, '_approve', getInfo.data || [])
            // 第一个审批者无法回退
            // if (getInfo.data.length === 1) {
            //    console.log("sss3333858",getInfo)
            //   this.$set(this.popOptions, 'cancelHidden', true)
            // }
          }
        }
      } catch (err) {
        console.log(err, 'caterr')
        // 若其中一个接口报错则都无法操作审核
        this.isAuthority = 0
        this.$set(this.popOptions, 'okHidden', true)
        this.$set(this.popOptions, 'cancelHidden', true)
        this.$set(this.popOptions, 'saveAndadd', null)
      }
    },
    async submit(params, subParams) {
      const { type, auditResult } = params
      try {
        const params0 = {
          auditResult: auditResult,
          userId: this.userId,
          remark: subParams.remark,
          orderNumber: this.popOptions.workflowId
        }
        // submitParams除基本参数外的业务参数
        const res = await api.submitWorkflow({
          ...this.popOptions.submitParams,
          ...params0
        }) // res为接口返回数据
        if (this.popOptions[type]) {
          this.popOptions[type](res)
        }
        if (this.$pub.responseValidate(res)) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
        this.$set(this.popOptions, 'visible', false)
        this.$emit('close')
      } catch (error) {
        console.log(error, 'passError')
        this.$set(this.popOptions, 'visible', false)
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" >
#Approve {
  .el-dialog__body {
    padding: 30px;
  }
  .el-form {
    :last-child.el-form-item {
      margin-top: 30px;
    }
  }
}
</style>
