<template>
  <div>
    <el-button @click="popOptions.visible=true">弹框</el-button>
    <cs-custom-pop :options="popOptions" />
  </div>
</template>
<script>
import approveTip from './components/approveTip.vue'
export default {
  data() {
    // 发起审批
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '发起审批',
      width: '770px',
      // okHidden: true,
      okText: '通过',
      cancelText: '不通过',
      // cancelHidden: true,
      ok: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      content: [{ components: { approveTip }}]
    }
    return {
      popOptions
    }
  }
}
</script>
