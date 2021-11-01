/**
 * @Description:提交重置单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div :class="getClass" :style="options.itemStyle">
    <el-button v-if="!options.submitHidden" :style="options.style" type="primary" native-type="submit" @click="submitForm">{{ options.submitText||'提交' }}</el-button>
    <el-button v-if="!options.resetHidden" :style="options.style" @click="resetForm">{{ options.resetText||'重置' }}</el-button>
    <el-button v-if="layout" class="layoutBtn" :icon="getIcon" :style="options.style" @click="shrink">{{ getShrinkText }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'InputItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    layout: {
      type: Boolean
    },
    shrinkHandle: {
      type: Function
    },
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: String
    },
    change: {
      type: Function
    }
  },
  data() {
    return {

    }
  },
  computed: {
    getShrinkText() {
      const isflag = this.injectData.flag
      if (isflag) {
        return this.options.shrinkText || '展开'
      } else {
        return this.options.unshrinkText || '收起'
      }
    },
    getClass() {
      let className = 'operate'
      if (this.options.fixed) {
        className = 'operate fixed'
      }
      return className
    },
    getIcon() {
      let icon = 'el-icon-arrow-down'
      if (!this.injectData.flag) {
        icon = 'el-icon-arrow-up'
      }
      return icon
    }
  },
  watch: {
  },
  mounted() {

  },
  inject: ['injectData'],
  methods: {
    submitForm() {
      this.form.validate((valid) => {
        if (valid) {
          this.options.submitHandle && this.options.submitHandle(this.formDatas)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    offsetTop(element) {
      let parent = element.parentNode
      while (parent !== null && Array.from(parent.classList).indexOf('custom-form') !== 0) {
        parent = parent.parentNode
      }
      return parent.offsetHeight - element.offsetHeight
    },
    shrink() {
      this.shrinkHandle && this.shrinkHandle()
      this.options.shrinkHandle && this.options.shrinkHandle(this.injectData.flag)
    },
    resetForm() {
      this.form.resetFields()
      this.options.resetHandle && this.options.resetHandle()
    }
  }
}
</script>

<style lang="scss" scoped>
.operate.fixed{
    position: fixed;
    bottom: 0px;
    right: 0px;
    text-align: center;
    width: 100%;
    padding: 10px 0px;
    background: #fff;
    border-top: 1px solid #dfe6ec;
    z-index: 99999;
}
    .layoutBtn{
        border: none;
        width: 70px;
        text-align: left;
        padding-left: 10px;
    }
    .layoutBtn.el-button:hover, .layoutBtn.el-button:focus {
      background-color: #fff;
    }
</style>
