<template>
  <el-form-item :label="options.label" :rules="options.rules" :style="options.itemStyle" :label-width="options.labelWidth">
    <template>
      <el-form-item
        v-for="(item,index) in getValue"
        :key="index"
        class="item-form-custom"
        :rules="ruleRequire"
        :prop="prop"
        :show-message="options.showMessage"
        :style="{width: 'calc(25% - 8px)',display:'inline-block',marginBottom:'0px',marginRight: index===getValue.length-1?'0':'10px'}"
      >
        <el-input :value="item" @input="inputChange(index,$event)" />
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
      if (value === undefined) {
        if (!this.options.rules || this.options.rules.length === 0) {
          callback()
          return
        } else {
          callback('此项不能为空')
          return
        }
      }
      const reg = /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{0,2})?$/
      const newValue = value
      let error = ''
      let text = ''
      newValue.find(item => {
        if (item) {
          text = item
          if (item > 0) {
            if (!reg.test(item * 1)) {
              error = '请输入0.01-99.99'
              console.log(item)
            }
          } else {
            error = '请输入0.01-99.99'
          }
        }
      })
      if (!text) {
        return callback(new Error('至少填写一项'))
      }
      if (error) {
        return callback(new Error(error))
      } else {
        this.form.clearValidate(rule.fullField)
        this.options.change && this.options.change()
        callback()
      }
    }
    const ruleRequire = [{ validator, trigger: 'blur' }]
    return {
      ruleRequire: ruleRequire.concat(this.options.rules || [])
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
      if (Object.prototype.toString.call(value) === '[object String]') {
        value = value.split('/')
      }
      return value || ['']
    }
  },
  watch: {
  },
  mounted() {

  },
  methods: {
    getErrShow(index) {
      console.log(this.options, this.value)
      const key = `${this.options.prop}`
      return !!this.errors[key]
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
      // console.log(222)
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

<style lang="scss">
.item-form-custom > .el-form-item__content {
  display: block;
}
</style>
