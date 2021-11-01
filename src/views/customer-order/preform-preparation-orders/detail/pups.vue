/**
 * @Description: 变更弹窗
 * @author Roman
 * @date 2021-05-06 15:19:43
 * @edit 2021-05-06 15:19:43
*/
<template>
  <div id="Approveis">
    <cs-custom-pop ref="pop" :options="popOptions" v-bind="$attrs" />
  </div>
</template>
<script>
export default {
  name: 'Approves',
  props: {
    upconfig: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 发起审批
    const popOptions = {
      itemType: 'dialog',
      appendToBody: true,
      title: '',
      width: '770px',
      okText: '提交',
      cancelText: '取消',
      close: () => {
        this.$set(this.popOptions, 'visible', false)
        this.$emit('close')
      },
      ok: (params) => {
        this.$emit('okCallback', { type: '1', text: params, title: this.popOptions.title })
      },
      cancel: (params) => {
        this.$emit('Cancelcallback', { type: '0', text: params, title: this.popOptions.title })
      },
      formDatas: {
        approve: []
      },
      content: [
        {
          label: '备注',
          itemType: 'input',
          prop: 'remark',
          maxlength: 50,
          rows: 5,
          rules: [commonBlurReg, { min: 1, max: 50, message: '长度在1 到50 个字符', trigger: 'blur' }],
          type: 'textarea'
        }
      ]
    }
    return {
      popOptions
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userInfo.userId
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      try {
        this.popOptions = Object.assign({}, this.popOptions, this.upconfig)
      } catch (error) {
        // this.$set(this.popOptions.formDatas, 'approve', this.config.start())
        console.log(error, 'error')
      }
    }
  }
}
</script>

<style lang="scss" >
#Approveis {
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
