<template>
  <div style="width: 30%;">
    <el-form-item
      style="margin-right: 0;margin-left: 20px;"
      label="产品编号"
      :rules="ruleRequire"
      prop="value"
    >
      <el-input :value="value" placeholder="请选择检测产品" @input="inputChange($event)" />
    </el-form-item>
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
    const ruleRequire = [{ trigger: 'blur' }]
    return {
      ruleRequire,
      value: ''
    }
  },

  created() {

  },
  mounted() {
    console.log(this.scope)
  },
  methods: {
    prop(key) {
      return 'elementRatio'
    },
    inputChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .quote-text{
    border: 1px solid #0986FF;
    border-radius: 4px;
    font-size: 14px;
    margin-left: 15px;
    height: 28px;
    line-height: 28px;
    padding: 0 15px;
    color: #0986ff;
  }
</style>
