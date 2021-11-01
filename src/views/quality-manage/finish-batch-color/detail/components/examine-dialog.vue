<template>
  <cs-custom-pop :options="options" />
</template>
<script>
import { review } from '../api/index'
import logMethods from '@/views/product-center/mixin/log-methods'

export default {
  mixins: [logMethods],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      options: {
        itemType: 'dialog',
        visible: false,
        title: '审核',
        okText: '确定',
        ok: params => {
          this.doExamine(params)
        },
        beforeClose: (form, formDatas) => {
          this.options.visible = false // 关闭弹框
        },
        cancel: (params) => {
          this.options.visible = false // 关闭弹框
        },
        formDatas: {},
        formOptions: {},
        content: {
          _reviewComments: { itemType: 'input', type: 'textarea', prop: 'reviewComments', label: '', labelWidth: '0', maxlength: 200, rows: 5, disabled: false, clearable: true, rules: [commonBlurReg], placeholder: '请输入审核意见(1-200字)' }
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 审核
    async doExamine(params) {
      const { code = 0 } = await review({ id: this.data.id, reviewComments: params.reviewComments })
      if (code === 200) {
        this.$message.success('审核成功')
        this.$router.go(-1)
        this.fetchLog(
          this.getLogMessages('UPDATE', '/qa/qaFinishBatchColor/review', 'qa'),
          { id: this.data.id },
          JSON.stringify({
            beforeText: `在"质量管理-成品检测-成品批色"审核成功一条记录`,
            beforeCode: { id: this.data.id }
          })
        )
      }
    },
    // 初始化
    init() {
      this.options.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
