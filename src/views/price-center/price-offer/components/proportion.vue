<template>
  <div class="proportion">
    <!-- <el-form-item :rules="rules"> -->
    <el-input
      v-model="scope.row[componentsOptions.type]"
      placeholder="请输入"
      maxlength="6"
    >
      <span slot="suffix" style="line-height: 28px;">%</span>
    </el-input>
    <!-- </el-form-item> -->

  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      rules: [commonBlurReg]
    }
  }
}
</script>

<style lang="scss">
.proportion {
    .el-input--medium .el-input__inner {
      height: 28px;
    }
}
</style>
