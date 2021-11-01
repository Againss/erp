<!--
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-05-08 10:30:07
 * @LastEditors: Againss
 * @LastEditTime: 2021-06-18 11:07:58
-->
<template>
  <div class="proportion">
    <!-- <el-form-item :rules="rules"> -->
    <el-input
      :value="scope.row[componentsOptions.type]"
      placeholder="请输入"
      :maxlength="12"
      @input="change"
      @blur="blur"
    />
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
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      // rules: [commonBlurReg]
    }
  },
  methods: {
    change(value) {
      this.componentsOptions.change && this.componentsOptions.change(value, this.scope)
      this.$forceUpdate()
    },
    blur(e) {
      this.componentsOptions.blur && this.componentsOptions.blur(e, this.scope)
      this.$forceUpdate()
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
