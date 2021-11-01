/**
 * @Description:自定义表单配置项
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-form-item :label="options.label" :rules="options.rules" :style="options.itemStyle" :label-width="options.labelWidth">
    <template>
      <el-form-item
        v-for="(item,index) in getValue"
        :key="index"
        :rules="ruleRequire"
        :prop="prop"
        :show-message="options.showMessage"
        :style="{marginRight:'0px',width:'33.33%',display:'inline-block',marginBottom:'0px'}"
      >
        <el-popover
          :value="getErrShow(index)"
          :popper-class="getErrPopClass"
          :placement="popoverOptions.placement||'top'"
          :title="popoverOptions.title"
          :width="popoverOptions.width"
          :trigger="popoverOptions.trigger||'manual'"
          @hide="hide"
        >
          <div :style="getErrPopStyle" :class="popoverOptions.class" v-html="getErrHtml(getErrMsg)" />
          <el-input slot="reference" :disabled="options.disabled" :readonly="getValue.length === 1" :value="item" @input="inputChange(index,$event)" />
        </el-popover>
      </el-form-item>
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'FormCustom',
  inheritAttrs: false,
  props: {
    componentsOptions: {
      type: Object
    },
    options: {
      type: Object
    },
    errors: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: [String, Object, Array]
    }
  },
  data() {
    const validator = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      let newValue = value
      if (Object.prototype.toString.call(newValue) === '[object String]') {
        newValue = newValue.split('/')
      }
      if (Object.prototype.toString.call(newValue) === '[object Object]') {
        newValue = Object.values(newValue)
      }
      const total = this.$utils.getFloat(newValue.reduce((a, b) => a * 1 + b * 1), 2)
      let error = ''
      newValue.find(item => {
        if (!item) {
          error = '每项都为必填'
        } else if (parseInt(item) === 0 || !reg.test(item)) {
          error = '0~99.99'
        }
      })
      if (error) {
        return callback(new Error(error))
      }
      if (total !== 100.00) {
        callback(new Error('计算总和100'))
      } else {
        this.form.clearValidate(rule.fullField)
        callback()
      }
    }
    const ruleRequire = [{ validator, trigger: 'blur' }]
    return {
      ruleRequire
    }
  },
  computed: {
    getColumInfo() {
      let value = this.value
      if (Object.prototype.toString.call(value) === '[object Object]') {
        value = Object.values(value).join('/')
      } else if (Object.prototype.toString.call(value) === '[object Array]') {
        value = value.join('/')
      }
      return value
    },
    prop() {
      const key = `${this.options.prop}`
      return key
    },
    getErrMsg() {
      const key = `${this.options.prop}`
      return this.errors[key]
    },
    getErrPopClass() {
      return this.popoverOptions.popperClass ? this.popoverOptions.popperClass + ' defaultPopperErrClass' : 'defaultPopperErrClass'
    },
    getErrPopStyle() {
      if (this.popoverOptions.errorStyle) {
        return { color: '#FE4949', ...this.popoverOptions.errorStyle }
      }
      return { color: '#FE4949' }
    },
    popoverOptions() {
      return this.options.popoverOptions || {}
    },
    getValue() {
      let value = this.value
      console.log(value)
      if (Object.prototype.toString.call(value) === '[object String]') {
        value = value.split('/')
      }
      return value
    }
  },
  watch: {

  },
  created() {
    console.log('value', this.value)
  },
  mounted() {
  },
  methods: {
    getErrShow(index) {
      // console.log(this.options, this.value)
      // const key = `${this.options.prop}`
      // return !!this.errors[key]
      return false
    },
    getErrHtml(errmsg) {
      if (this.popoverOptions.formater) {
        return this.popoverOptions.formater(errmsg)
      }
      return errmsg
    },
    hide() {
      this.popoverOptions.hide && this.popoverOptions.hide()
    },
    inputChange(index, $event) {
      let value = this.$utils.deepClone(this.getValue)
      value[index] = $event
      if (Object.prototype.toString.call(this.value) === '[object String]') {
        value = value.join('/')
      }
      this.setFormDatas({ [this.options.prop]: value })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

